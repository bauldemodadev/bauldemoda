/**
 * API Route: Mis Cursos Online del Usuario
 * GET /api/courses/my-courses
 * 
 * Retorna todos los cursos online en los que el usuario está inscrito
 */

import { NextResponse } from 'next/server';
import { getCustomerByEmail } from '@/lib/firestore/customers';
import { getOnlineCourseByIdFromFirestore } from '@/lib/firestore/onlineCourses';
import { getOrdersByCustomerIdOrEmail } from '@/lib/firestore/orders';
import { Timestamp } from 'firebase-admin/firestore';
import type { OnlineCourse } from '@/types/firestore/onlineCourse';

const USE_FIRESTORE = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Convierte Timestamps a objetos serializables
 */
function serializeCourse(course: any): any {
  const serialized = { ...course };
  
  if (serialized.createdAt instanceof Timestamp) {
    serialized.createdAt = serialized.createdAt.toDate().toISOString();
  }
  if (serialized.updatedAt instanceof Timestamp) {
    serialized.updatedAt = serialized.updatedAt.toDate().toISOString();
  }
  
  return serialized;
}

export async function GET(request: Request) {
  try {
    if (!USE_FIRESTORE) {
      return NextResponse.json(
        { error: 'Firestore no está habilitado' },
        { status: 400 }
      );
    }

    // Obtener el email del usuario desde los query params
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email del usuario requerido' },
        { status: 400 }
      );
    }

    // Normalizar email
    const normalizedEmail = email.toLowerCase().trim();
    
    // Buscar el cliente por email
    const customer = await getCustomerByEmail(normalizedEmail);
    
    // Obtener todos los cursos en los que está inscrito
    const enrolledCourses: OnlineCourse[] = [];
    const courseIdsSeen = new Set<string>();
    
    // 1. Obtener cursos desde enrolledCourses del cliente (si existe)
    if (customer?.enrolledCourses && customer.enrolledCourses.length > 0) {
      // Verificar que cada curso aún tenga acceso válido
      const now = new Date();
      
      for (const enrollment of customer.enrolledCourses) {
        // Verificar si el acceso aún es válido
        const accessFrom = enrollment.accessFrom instanceof Timestamp 
          ? enrollment.accessFrom.toDate() 
          : new Date(enrollment.accessFrom);
        
        const accessTo = enrollment.accessTo 
          ? (enrollment.accessTo instanceof Timestamp 
              ? enrollment.accessTo.toDate() 
              : new Date(enrollment.accessTo))
          : null;
        
        // Si no hay fecha de expiración o aún no ha expirado
        if (!accessTo || accessTo > now) {
          // Obtener el curso completo
          try {
            const course = await getOnlineCourseByIdFromFirestore(enrollment.courseId);
            if (course && course.status === 'publish' && !courseIdsSeen.has(course.id)) {
              enrolledCourses.push(course);
              courseIdsSeen.add(course.id);
            }
          } catch (error) {
            console.error(`Error obteniendo curso ${enrollment.courseId}:`, error);
            // Continuar con el siguiente curso
          }
        }
      }
    }
    
    // 2. Obtener cursos desde órdenes aprobadas/pagadas (backup)
    // Esto asegura que encontremos cursos incluso si no están en enrolledCourses
    try {
      const orders = await getOrdersByCustomerIdOrEmail(
        customer?.id,
        normalizedEmail
      );
      
      // Filtrar solo órdenes aprobadas y pagadas
      const paidOrders = orders.filter(
        order => order.status === 'approved' && order.paymentStatus === 'paid'
      );
      
      for (const order of paidOrders) {
        for (const item of order.items) {
          // Si es un curso online y no lo hemos agregado ya
          if (item.type === 'onlineCourse' && item.courseId && !courseIdsSeen.has(item.courseId)) {
            try {
              const course = await getOnlineCourseByIdFromFirestore(item.courseId);
              if (course && course.status === 'publish') {
                enrolledCourses.push(course);
                courseIdsSeen.add(course.id);
              }
            } catch (error) {
              console.error(`Error obteniendo curso ${item.courseId} desde orden:`, error);
            }
          }
        }
      }
      
      console.log(`📚 Cursos encontrados para ${normalizedEmail}:`, {
        customerFound: !!customer,
        fromEnrolledCourses: customer?.enrolledCourses?.length || 0,
        fromOrders: paidOrders.length,
        totalCourses: enrolledCourses.length,
        courseIds: enrolledCourses.map(c => c.id)
      });
    } catch (error) {
      console.error('Error obteniendo cursos desde órdenes:', error);
      // Continuar con los cursos encontrados desde enrolledCourses
    }

    // Serializar los cursos
    const serializedCourses = enrolledCourses.map(serializeCourse);

    return NextResponse.json(serializedCourses);
  } catch (error) {
    console.error('Error obteniendo cursos del usuario:', error);
    return NextResponse.json(
      {
        error: 'Error al obtener los cursos',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}


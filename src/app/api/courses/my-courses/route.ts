/**
 * API Route: Mis Cursos Online del Usuario
 * GET /api/courses/my-courses
 * 
 * Retorna todos los cursos online en los que el usuario está inscrito
 */

import { NextResponse } from 'next/server';
import { getCustomerByEmail } from '@/lib/firestore/customers';
import { getOnlineCourseByIdFromFirestore } from '@/lib/firestore/onlineCourses';
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

    // Buscar el cliente por email
    const customer = await getCustomerByEmail(email);
    
    if (!customer) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    // Obtener todos los cursos en los que está inscrito
    const enrolledCourses: OnlineCourse[] = [];
    
    if (customer.enrolledCourses && customer.enrolledCourses.length > 0) {
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
            if (course && course.status === 'publish') {
              enrolledCourses.push(course);
            }
          } catch (error) {
            console.error(`Error obteniendo curso ${enrollment.courseId}:`, error);
            // Continuar con el siguiente curso
          }
        }
      }
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


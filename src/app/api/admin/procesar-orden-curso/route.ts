/**
 * API Route: Procesar Orden con Curso Online
 * POST /api/admin/procesar-orden-curso
 * 
 * Procesa una orden existente que tiene un producto con relatedCourseId
 * y agrega el curso al enrolledCourses del customer
 */

import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { getOrderById } from '@/lib/firestore/orders';
import { getProductByIdFromFirestore } from '@/lib/firestore/products';
import { getOnlineCourseByIdFromFirestore } from '@/lib/firestore/onlineCourses';
import { enrollCustomerInCourse } from '@/lib/firestore/customers';
import { Timestamp } from 'firebase-admin/firestore';
import type { CustomerCourseEnrollment } from '@/types/firestore/customer';

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'orderId es requerido' },
        { status: 400 }
      );
    }

    // 1. Obtener la orden
    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      );
    }

    // 2. Verificar que la orden esté aprobada y pagada
    if (order.status !== 'approved' || order.paymentStatus !== 'paid') {
      return NextResponse.json(
        { 
          error: 'La orden debe estar aprobada y pagada',
          status: order.status,
          paymentStatus: order.paymentStatus,
        },
        { status: 400 }
      );
    }

    const resultados: {
      item: any;
      producto?: any;
      curso?: any;
      procesado: boolean;
      error?: string;
    }[] = [];

    // 3. Procesar cada item de la orden
    for (const item of order.items) {
      const resultado: any = {
        item,
        procesado: false,
      };

      // Si ya es de tipo onlineCourse, verificar si está en enrolledCourses
      if (item.type === 'onlineCourse' && item.courseId) {
        const curso = await getOnlineCourseByIdFromFirestore(item.courseId);
        resultado.curso = curso ? { id: curso.id, title: curso.title } : null;
        resultado.procesado = true; // Ya está procesado
        resultados.push(resultado);
        continue;
      }

      // Si es de tipo product, verificar si tiene relatedCourseId
      if (item.type === 'product' && item.productId) {
        const producto = await getProductByIdFromFirestore(item.productId);
        resultado.producto = producto ? { id: producto.id, name: producto.name } : null;

        const relatedCourseId = (producto as any)?.relatedCourseId;
        
        if (relatedCourseId) {
          const curso = await getOnlineCourseByIdFromFirestore(relatedCourseId);
          resultado.curso = curso ? { id: curso.id, title: curso.title } : null;

          if (curso) {
            // Crear enrollment
            const enrollment: CustomerCourseEnrollment = {
              courseId: relatedCourseId,
              productId: item.productId,
              orderId: order.id,
              accessFrom: Timestamp.now(),
              accessTo: null, // Acceso ilimitado
            };

            // Agregar al customer
            await enrollCustomerInCourse(order.customerId, enrollment);
            resultado.procesado = true;
          } else {
            resultado.error = 'Curso no encontrado';
          }
        } else {
          resultado.error = 'Producto no tiene relatedCourseId';
        }
      } else {
        resultado.error = 'Item no es producto ni curso online';
      }

      resultados.push(resultado);
    }

    // 4. Resumen
    const procesados = resultados.filter(r => r.procesado).length;
    const errores = resultados.filter(r => !r.procesado && r.error).length;

    return NextResponse.json({
      success: true,
      orderId: order.id,
      customerId: order.customerId,
      resumen: {
        totalItems: order.items.length,
        procesados,
        errores,
      },
      resultados,
    });
  } catch (error) {
    console.error('Error procesando orden:', error);
    return NextResponse.json(
      {
        error: 'Error al procesar la orden',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}


/**
 * API: Registro de Curso Gratuito
 * 
 * Crea una orden gratuita en Firestore para cursos sin costo
 */

import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';

export async function POST(request: Request) {
  try {
    const { courseId, courseName, customer } = await request.json();

    // Validar datos requeridos
    if (!courseId || !courseName || !customer?.email || !customer?.name) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    const db = getAdminDb();

    // Crear orden en Firestore
    const orderData = {
      // Cliente
      customerId: customer.email, // Usar email como ID temporal
      customerSnapshot: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
      },

      // Items (curso gratuito)
      items: [
        {
          type: 'onlineCourse',
          productId: courseId,
          name: courseName,
          quantity: 1,
          unitPrice: 0,
          total: 0,
        },
      ],

      // Montos
      totalAmount: 0,
      currency: 'ARS',

      // Estados
      status: 'approved', // Aprobado automáticamente
      paymentStatus: 'paid', // Marcado como pagado (gratis)
      paymentMethod: 'other', // Método especial para gratis
      
      // Metadata
      metadata: {
        isFree: true,
        courseType: 'online',
        registrationSource: 'web',
      },

      // Fechas
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Guardar en Firestore
    const orderRef = await db.collection('orders').add(orderData);
    const orderId = orderRef.id;

    // TODO: Enviar email con acceso al curso
    // await sendCourseAccessEmail(customer.email, courseName, courseId);

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Registro exitoso',
    });
  } catch (error) {
    console.error('Error registrando curso gratuito:', error);
    return NextResponse.json(
      {
        error: 'Error al procesar el registro',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}


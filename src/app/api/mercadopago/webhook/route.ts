/**
 * API Route: Webhook de Mercado Pago
 * POST /api/mercadopago/webhook
 * 
 * Recibe notificaciones de Mercado Pago y actualiza las órdenes en Firestore.
 * Según FASE 7: actualiza Order, Customer y enrollments de cursos online.
 */

import { NextResponse } from 'next/server';
import { getPaymentById } from '@/lib/payments/mercadopago';
import { getOrderByExternalReference, updateOrder } from '@/lib/firestore/orders';
import { upsertCustomer, updateCustomerStats, enrollCustomerInCourse } from '@/lib/firestore/customers';
import { Timestamp } from 'firebase-admin/firestore';
import type { OrderStatus, PaymentStatus } from '@/types/firestore/order';
import type { CustomerCourseEnrollment } from '@/types/firestore/customer';

const USE_FIRESTORE = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';

/**
 * Convierte el estado de pago de MP al estado de la orden
 */
function mapPaymentStatusToOrderStatus(mpStatus: string): {
  status: OrderStatus;
  paymentStatus: PaymentStatus;
} {
  switch (mpStatus) {
    case 'approved':
      return { status: 'approved', paymentStatus: 'paid' };
    case 'rejected':
      return { status: 'rejected', paymentStatus: 'pending' };
    case 'cancelled':
      return { status: 'cancelled', paymentStatus: 'pending' };
    case 'refunded':
      return { status: 'refunded', paymentStatus: 'refunded' };
    default:
      return { status: 'pending', paymentStatus: 'pending' };
  }
}

/**
 * Procesa el enrollment de cursos online cuando una orden se paga
 */
async function processCourseEnrollments(orderId: string, customerId: string) {
  try {
    const { getOrderById } = await import('@/lib/firestore/orders');
    const order = await getOrderById(orderId);

    if (!order) {
      console.warn(`Orden ${orderId} no encontrada para procesar enrollments`);
      return;
    }

    const now = Timestamp.now();

    // Procesar items que sean cursos online
    for (const item of order.items) {
      if (item.type === 'onlineCourse' && item.courseId) {
        const enrollment: CustomerCourseEnrollment = {
          courseId: item.courseId,
          productId: item.productId,
          orderId: order.id,
          accessFrom: now,
          accessTo: null, // Acceso ilimitado por defecto
        };

        await enrollCustomerInCourse(customerId, enrollment);
        console.log(`✅ Cliente ${customerId} inscrito en curso ${item.courseId}`);
      }
    }
  } catch (error) {
    console.error(`Error procesando enrollments para orden ${orderId}:`, error);
    // No lanzar error para no bloquear el webhook
  }
}

export async function POST(request: Request) {
  try {
    if (!USE_FIRESTORE) {
      return NextResponse.json(
        { error: 'Firestore no está habilitado' },
        { status: 400 }
      );
    }

    const data = await request.json();

    // Mercado Pago envía notificaciones en formato:
    // { type: "payment", data: { id: "123456789" } }
    const { type, data: notificationData } = data;

    if (type !== 'payment' || !notificationData?.id) {
      return NextResponse.json(
        { message: 'Tipo de notificación no manejado o datos incompletos' },
        { status: 200 }
      );
    }

    const paymentId = notificationData.id;

    // Obtener detalles del pago desde Mercado Pago
    const paymentData = await getPaymentById(paymentId);

    if (!paymentData) {
      return NextResponse.json(
        { error: 'No se pudo obtener información del pago' },
        { status: 400 }
      );
    }

    // Obtener orderId desde external_reference o metadata
    const orderId =
      paymentData.external_reference ||
      paymentData.metadata?.orderId;

    if (!orderId) {
      console.error('No se encontró orderId en el pago de MP:', paymentData);
      return NextResponse.json(
        { error: 'ID de pedido no encontrado' },
        { status: 400 }
      );
    }

    // Buscar la orden en Firestore
    const order = await getOrderByExternalReference(orderId);

    if (!order) {
      console.error(`Orden ${orderId} no encontrada en Firestore`);
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      );
    }

    // Mapear estado de MP al estado de la orden
    const { status, paymentStatus } = mapPaymentStatusToOrderStatus(
      paymentData.status
    );

    // Actualizar orden
    await updateOrder(order.id, {
      mpPaymentId: String(paymentId),
      status,
      paymentStatus,
    });

    // Si el pago fue aprobado, actualizar cliente y procesar enrollments
    if (paymentStatus === 'paid' && status === 'approved') {
      // Actualizar estadísticas del cliente
      await updateCustomerStats(order.customerId, order.totalAmount);

      // Procesar enrollments de cursos online
      await processCourseEnrollments(order.id, order.customerId);
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error('Error en webhook de Mercado Pago:', error);
    return NextResponse.json(
      {
        error: 'Error procesando la notificación',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

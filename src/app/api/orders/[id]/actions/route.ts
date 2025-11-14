/**
 * API Route: Acciones sobre Órdenes
 * PATCH /api/orders/[id]/actions
 * 
 * Permite actualizar el estado de una orden (marcar como pagado, cancelar, etc.)
 */

import { NextResponse } from 'next/server';
import { getOrderById, updateOrder } from '@/lib/firestore/orders';
import { updateCustomerStats } from '@/lib/firestore/customers';
import type { OrderStatus, PaymentStatus } from '@/types/firestore/order';

const USE_FIRESTORE = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';

export const dynamic = 'force-dynamic';

interface ActionRequest {
  action: 'mark_as_paid' | 'mark_as_cancelled' | 'mark_as_refunded' | 'update_status';
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  notes?: string;
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!USE_FIRESTORE) {
      return NextResponse.json(
        { error: 'Firestore no está habilitado' },
        { status: 400 }
      );
    }

    const orderId = params.id;
    const body: ActionRequest = await request.json();

    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      );
    }

    let updates: Partial<{ status: OrderStatus; paymentStatus: PaymentStatus }> = {};

    switch (body.action) {
      case 'mark_as_paid':
        updates = {
          status: 'approved',
          paymentStatus: 'paid',
        };
        // Si se marca como pagado, actualizar estadísticas del cliente
        await updateCustomerStats(order.customerId, order.totalAmount);
        break;

      case 'mark_as_cancelled':
        updates = {
          status: 'cancelled',
          paymentStatus: order.paymentStatus === 'paid' ? 'refunded' : order.paymentStatus,
        };
        break;

      case 'mark_as_refunded':
        updates = {
          status: 'refunded',
          paymentStatus: 'refunded',
        };
        break;

      case 'update_status':
        if (body.status) updates.status = body.status;
        if (body.paymentStatus) updates.paymentStatus = body.paymentStatus;
        break;

      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        );
    }

    await updateOrder(orderId, updates);

    return NextResponse.json({
      success: true,
      message: 'Orden actualizada correctamente',
      order: await getOrderById(orderId),
    });
  } catch (error) {
    console.error(`Error ejecutando acción en orden ${params.id}:`, error);
    return NextResponse.json(
      {
        error: 'Error al ejecutar la acción',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}


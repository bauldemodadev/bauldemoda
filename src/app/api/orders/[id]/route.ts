/**
 * API Route: Detalle de Orden
 * GET /api/orders/[id]
 * 
 * Retorna el detalle completo de una orden
 */

import { NextResponse } from 'next/server';
import { getOrderById } from '@/lib/firestore/orders';
import { Timestamp } from 'firebase-admin/firestore';

const USE_FIRESTORE = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';

// OPTIMIZADO: Cache corto (1 minuto) para órdenes que pueden cambiar
export const revalidate = 60;

/**
 * Convierte Timestamps a objetos serializables
 */
function serializeOrder(order: any): any {
  const serialized = { ...order };
  
  if (serialized.createdAt instanceof Timestamp) {
    serialized.createdAt = serialized.createdAt.toDate().toISOString();
  }
  if (serialized.updatedAt instanceof Timestamp) {
    serialized.updatedAt = serialized.updatedAt.toDate().toISOString();
  }
  
  return serialized;
}

export async function GET(
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
    const order = await getOrderById(orderId);

    if (!order) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(serializeOrder(order));
  } catch (error) {
    console.error(`Error obteniendo orden ${params.id}:`, error);
    return NextResponse.json(
      {
        error: 'Error al obtener la orden',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * API Route: Listado de Órdenes
 * GET /api/orders
 * 
 * Retorna listado de órdenes con filtros opcionales
 */

import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';
import type { Order, OrderStatus, PaymentStatus, PaymentMethod } from '@/types/firestore/order';

const USE_FIRESTORE = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

export async function GET(request: Request) {
  try {
    if (!USE_FIRESTORE) {
      return NextResponse.json(
        { error: 'Firestore no está habilitado' },
        { status: 400 }
      );
    }

    const url = new URL(request.url);
    const status = url.searchParams.get('status') as OrderStatus | null;
    const paymentStatus = url.searchParams.get('paymentStatus') as PaymentStatus | null;
    const paymentMethod = url.searchParams.get('paymentMethod') as PaymentMethod | null;
    const customerId = url.searchParams.get('customerId');
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    const db = getAdminDb();
    let query = db.collection('orders').orderBy('createdAt', 'desc');

    // Aplicar filtros
    if (status) {
      query = query.where('status', '==', status);
    }
    if (paymentStatus) {
      query = query.where('paymentStatus', '==', paymentStatus);
    }
    if (paymentMethod) {
      query = query.where('paymentMethod', '==', paymentMethod);
    }
    if (customerId) {
      query = query.where('customerId', '==', customerId);
    }

    // Paginación
    const snapshot = await query.limit(limit).offset(offset).get();

    const orders: Order[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as Omit<Order, 'id'>;
      orders.push({
        id: doc.id,
        ...serializeOrder(data),
      });
    });

    // Obtener total para paginación (aproximado)
    // Nota: Firestore Admin SDK no tiene count() directo, hacemos una query separada
    const totalSnapshot = await query.get();
    const total = totalSnapshot.size;

    return NextResponse.json({
      orders,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + orders.length < total,
      },
    });
  } catch (error) {
    console.error('Error obteniendo órdenes:', error);
    return NextResponse.json(
      {
        error: 'Error al obtener órdenes',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}


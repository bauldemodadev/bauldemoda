/**
 * API Route: Mis Pedidos del Usuario
 * GET /api/orders/my-orders
 * 
 * Retorna todas las órdenes del usuario autenticado
 */

import { NextResponse } from 'next/server';
import { getOrdersByCustomerIdOrEmail } from '@/lib/firestore/orders';
import { getCustomerByEmail } from '@/lib/firestore/customers';
import { Timestamp } from 'firebase-admin/firestore';

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

    // Obtener el email del usuario desde los headers o query params
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
    
    // Obtener todas las órdenes del cliente
    // Usar búsqueda combinada: por customerId (si existe) y por email (siempre)
    // Esto asegura que encontremos órdenes incluso si el cliente no existe en la colección customers
    const orders = await getOrdersByCustomerIdOrEmail(
      customer?.id,
      normalizedEmail
    );
    
    console.log(`📦 Órdenes encontradas para ${normalizedEmail}:`, {
      customerFound: !!customer,
      customerId: customer?.id,
      ordersCount: orders.length,
      orderIds: orders.map(o => o.id)
    });

    // Serializar las órdenes
    const serializedOrders = orders.map(serializeOrder);

    return NextResponse.json(serializedOrders);
  } catch (error) {
    console.error('Error obteniendo órdenes del usuario:', error);
    return NextResponse.json(
      {
        error: 'Error al obtener las órdenes',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}


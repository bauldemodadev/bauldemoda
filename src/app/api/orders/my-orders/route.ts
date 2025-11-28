/**
 * API Route: Mis Pedidos del Usuario
 * GET /api/orders/my-orders
 * 
 * Retorna todas las órdenes del usuario autenticado
 */

import { NextResponse } from 'next/server';
import { getOrdersByCustomerId } from '@/lib/firestore/orders';
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

    // Buscar el cliente por email
    const customer = await getCustomerByEmail(email);
    
    if (!customer) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    // Obtener todas las órdenes del cliente
    const orders = await getOrdersByCustomerId(customer.id);

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


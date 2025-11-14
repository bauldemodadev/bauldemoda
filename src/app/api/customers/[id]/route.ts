/**
 * API Route: Detalle de Cliente
 * GET /api/customers/[id]
 */

import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';
import type { Customer } from '@/types/firestore/customer';

const USE_FIRESTORE = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function serializeCustomer(customer: any): any {
  const serialized = { ...customer };
  
  if (serialized.createdAt instanceof Timestamp) {
    serialized.createdAt = serialized.createdAt.toDate().toISOString();
  }
  if (serialized.lastOrderAt instanceof Timestamp) {
    serialized.lastOrderAt = serialized.lastOrderAt.toDate().toISOString();
  }
  if (serialized.enrolledCourses) {
    serialized.enrolledCourses = serialized.enrolledCourses.map((enrollment: any) => {
      if (enrollment.accessFrom instanceof Timestamp) {
        enrollment.accessFrom = enrollment.accessFrom.toDate().toISOString();
      }
      if (enrollment.accessTo instanceof Timestamp) {
        enrollment.accessTo = enrollment.accessTo.toDate().toISOString();
      }
      return enrollment;
    });
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

    const customerId = params.id;
    const db = getAdminDb();
    const doc = await db.collection('customers').doc(customerId).get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    const data = doc.data() as Omit<Customer, 'id'>;
    const customer: Customer = {
      id: doc.id,
      ...data,
    };

    // Obtener órdenes del cliente
    const ordersSnapshot = await db
      .collection('orders')
      .where('customerId', '==', customerId)
      .orderBy('createdAt', 'desc')
      .get();

    const orders = ordersSnapshot.docs.map((orderDoc) => {
      const orderData = orderDoc.data();
      return {
        id: orderDoc.id,
        ...orderData,
        createdAt: orderData.createdAt instanceof Timestamp
          ? orderData.createdAt.toDate().toISOString()
          : orderData.createdAt,
        updatedAt: orderData.updatedAt instanceof Timestamp
          ? orderData.updatedAt.toDate().toISOString()
          : orderData.updatedAt,
      };
    });

    return NextResponse.json({
      customer: serializeCustomer(customer),
      orders,
    });
  } catch (error) {
    console.error(`Error obteniendo cliente ${params.id}:`, error);
    return NextResponse.json(
      {
        error: 'Error al obtener el cliente',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}


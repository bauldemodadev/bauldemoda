/**
 * API Route: Obtener Cliente por Email
 * GET /api/customers/by-email/[email]
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
  { params }: { params: { email: string } }
) {
  try {
    if (!USE_FIRESTORE) {
      return NextResponse.json(
        { error: 'Firestore no está habilitado' },
        { status: 400 }
      );
    }

    const email = decodeURIComponent(params.email);
    const db = getAdminDb();
    
    // Buscar cliente por email
    const snapshot = await db
      .collection('customers')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { success: false, data: null },
        { status: 200 }
      );
    }

    const doc = snapshot.docs[0];
    const data = doc.data() as Omit<Customer, 'id'>;
    const customer: Customer = {
      id: doc.id,
      ...data,
    };

    return NextResponse.json({
      success: true,
      data: serializeCustomer(customer),
    });
  } catch (error) {
    console.error(`Error obteniendo cliente por email ${params.email}:`, error);
    return NextResponse.json(
      {
        error: 'Error al obtener el cliente',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}


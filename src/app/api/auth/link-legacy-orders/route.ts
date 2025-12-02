/**
 * API: Vincular Órdenes Antiguas
 * 
 * POST /api/auth/link-legacy-orders
 * Vincula automáticamente órdenes antiguas (migradas) con el usuario recién registrado/logueado
 * usando el email como identificador.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  try {
    const { uid, email } = await request.json();

    if (!uid || !email) {
      return NextResponse.json(
        { error: 'UID y email son requeridos' },
        { status: 400 }
      );
    }

    const db = getAdminDb();

    // Buscar órdenes que tengan el email del usuario pero customerId diferente
    // Estas son órdenes antiguas migradas que usaban el email como customerId
    const ordersSnapshot = await db.collection('orders')
      .where('customerSnapshot.email', '==', email)
      .get();

    let linkedCount = 0;
    const batch = db.batch();

    ordersSnapshot.forEach((doc) => {
      const orderData = doc.data();
      
      // Solo actualizar si el customerId es diferente al nuevo UID
      // Esto preserva las órdenes ya vinculadas correctamente
      if (orderData.customerId !== uid) {
        batch.update(doc.ref, {
          customerId: uid,
          metadata: {
            ...orderData.metadata,
            linkedToNewAccount: true,
            linkedAt: new Date().toISOString(),
            previousCustomerId: orderData.customerId,
          }
        });
        linkedCount++;
      }
    });

    if (linkedCount > 0) {
      await batch.commit();
    }

    return NextResponse.json({
      success: true,
      linkedCount,
      message: linkedCount > 0 
        ? `${linkedCount} órdenes antiguas vinculadas exitosamente`
        : 'No se encontraron órdenes antiguas para vincular'
    });

  } catch (error) {
    console.error('Error vinculando órdenes antiguas:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}


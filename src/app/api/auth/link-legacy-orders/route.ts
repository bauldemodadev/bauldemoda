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
    
    // Normalizar email a minúsculas (Firebase Auth lo hace automáticamente)
    const normalizedEmail = email.toLowerCase().trim();

    // IMPORTANTE: Buscar órdenes comparando emails en minúsculas
    // Firestore no tiene búsqueda case-insensitive nativa, así que:
    // 1. Buscamos con el email normalizado
    // 2. También buscamos variaciones comunes
    const ordersSnapshot = await db.collection('orders')
      .where('customerSnapshot.email', '==', normalizedEmail)
      .get();
    
    // También buscar con la primera letra en mayúscula (caso común)
    const capitalizedEmail = normalizedEmail.charAt(0).toUpperCase() + normalizedEmail.slice(1);
    const ordersSnapshotCapitalized = await db.collection('orders')
      .where('customerSnapshot.email', '==', capitalizedEmail)
      .get();
    
    // Combinar resultados
    const allOrders = [...ordersSnapshot.docs, ...ordersSnapshotCapitalized.docs];

    let linkedCount = 0;
    const batch = db.batch();
    
    // Usar Set para evitar duplicados (si una orden aparece en ambas búsquedas)
    const processedOrderIds = new Set<string>();

    allOrders.forEach((doc) => {
      // Evitar procesar la misma orden dos veces
      if (processedOrderIds.has(doc.id)) {
        return;
      }
      processedOrderIds.add(doc.id);
      
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
    
    console.log(`Vinculación completada para ${normalizedEmail}: ${linkedCount} órdenes vinculadas`);

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


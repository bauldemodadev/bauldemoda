/**
 * API Route: Corregir estadísticas de clientes
 * POST /api/customers/fix-stats
 * 
 * Actualiza los clientes que no tienen totalOrders y totalSpent inicializados
 */

import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { verifyAdminAuth } from '@/lib/admin/auth';

const USE_FIRESTORE = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';

export async function POST(request: Request) {
  try {
    if (!USE_FIRESTORE) {
      return NextResponse.json(
        { error: 'Firestore no está habilitado' },
        { status: 400 }
      );
    }

    // Verificar autenticación admin
    const email = await verifyAdminAuth();
    if (!email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const db = getAdminDb();
    const customersRef = db.collection('customers');
    
    // Obtener todos los clientes
    const snapshot = await customersRef.get();
    
    let updatedCount = 0;
    let errorCount = 0;
    const batch = db.batch();
    let batchCount = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      // Verificar si necesita actualización
      const needsUpdate = 
        data.totalOrders === undefined || 
        data.totalSpent === undefined ||
        data.enrolledCourses === undefined ||
        data.tags === undefined;

      if (needsUpdate) {
        const updates: any = {};
        
        if (data.totalOrders === undefined) updates.totalOrders = 0;
        if (data.totalSpent === undefined) updates.totalSpent = 0;
        if (data.enrolledCourses === undefined) updates.enrolledCourses = [];
        if (data.tags === undefined) updates.tags = [];

        batch.update(doc.ref, updates);
        batchCount++;
        updatedCount++;

        // Firestore tiene un límite de 500 operaciones por batch
        if (batchCount >= 500) {
          await batch.commit();
          batchCount = 0;
        }
      }
    }

    // Commit final si quedan operaciones
    if (batchCount > 0) {
      await batch.commit();
    }

    return NextResponse.json({
      success: true,
      message: `Estadísticas corregidas para ${updatedCount} clientes`,
      stats: {
        total: snapshot.size,
        updated: updatedCount,
        errors: errorCount,
      },
    });
  } catch (error) {
    console.error('Error corrigiendo estadísticas de clientes:', error);
    return NextResponse.json(
      {
        error: 'Error al corregir estadísticas',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}


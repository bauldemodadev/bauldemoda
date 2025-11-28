/**
 * API Route: Detalle de Tip
 * GET /api/tips/[slug]
 * 
 * Retorna el detalle de un tip por slug o ID
 */

import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';
import type { Tip } from '@/types/firestore/tip';

const USE_FIRESTORE = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Convierte Timestamps a objetos serializables
 */
function serializeTip(tip: any): any {
  const serialized = { ...tip };
  
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
  { params }: { params: { slug: string } }
) {
  try {
    if (!USE_FIRESTORE) {
      return NextResponse.json(
        { error: 'Firestore no está habilitado' },
        { status: 400 }
      );
    }

    const slugOrId = params.slug;
    const db = getAdminDb();

    let tip: Tip | null = null;

    // Intentar buscar por ID primero (si parece un ID de Firestore)
    if (slugOrId.length === 20) {
      try {
        const doc = await db.collection('tips').doc(slugOrId).get();
        if (doc.exists) {
          const data = doc.data() as Omit<Tip, 'id'>;
          tip = {
            id: doc.id,
            ...data,
          };
        }
      } catch (error) {
        // Si falla, continuar con búsqueda por slug
      }
    }

    // Si no se encontró por ID, buscar por slug
    if (!tip) {
      const snapshot = await db
        .collection('tips')
        .where('slug', '==', slugOrId)
        .where('status', '==', 'publish')
        .limit(1)
        .get();

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data() as Omit<Tip, 'id'>;
        tip = {
          id: doc.id,
          ...data,
        };
      }
    }

    if (!tip) {
      return NextResponse.json(
        { error: 'Tip no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(serializeTip(tip));
  } catch (error) {
    console.error(`Error obteniendo tip ${params.slug}:`, error);
    return NextResponse.json(
      {
        error: 'Error al obtener el tip',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}


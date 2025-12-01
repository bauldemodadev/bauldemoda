/**
 * Funciones helper para leer tips desde Firestore
 */

import { getAdminDb } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';
import type { Tip } from '@/types/firestore';

/**
 * Convierte Timestamps a objetos serializables para JSON
 */
function convertTimestampsToISO(data: any): any {
  if (!data) return data;
  
  const converted = { ...data };
  
  if (converted.createdAt instanceof Timestamp) {
    converted.createdAt = converted.createdAt.toDate().toISOString();
  }
  if (converted.updatedAt instanceof Timestamp) {
    converted.updatedAt = converted.updatedAt.toDate().toISOString();
  }
  
  return converted;
}

/**
 * Obtiene tips con paginación (OPTIMIZADO: limit y cursor)
 * @param limit - Número máximo de tips a retornar (default: 15)
 * @param cursor - ID del último documento para paginación
 */
export async function getTipsPage(options: {
  limit?: number;
  cursor?: string;
} = {}): Promise<{ tips: Tip[]; nextCursor?: string; hasMore: boolean }> {
  try {
    const { limit = 15, cursor } = options;
    const db = getAdminDb();
    
    let query = db
      .collection('tips')
      .where('status', '==', 'publish')
      .orderBy('createdAt', 'desc')
      .limit(limit + 1); // +1 para saber si hay más
    
    if (cursor) {
      const cursorDoc = await db.collection('tips').doc(cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc) as any;
      }
    }
    
    const snapshot = await query.get();
    const docs = snapshot.docs;
    const hasMore = docs.length > limit;
    const tipsToReturn = hasMore ? docs.slice(0, limit) : docs;
    
    const tips: Tip[] = [];
    tipsToReturn.forEach((doc) => {
      try {
        const data = doc.data() as Tip;
        const converted = convertTimestampsToISO(data);
        tips.push({ ...converted, id: doc.id });
      } catch (error) {
        console.error(`Error transformando tip ${doc.id}:`, error);
      }
    });
    
    return {
      tips,
      nextCursor: hasMore ? tipsToReturn[tipsToReturn.length - 1].id : undefined,
      hasMore,
    };
  } catch (error) {
    console.error('Error en getTipsPage:', error);
    throw error;
  }
}

/**
 * Obtiene todos los tips activos (status === 'publish') desde Firestore
 * ⚠️ DEPRECATED: Usar getTipsPage con limit para evitar lecturas masivas
 */
export async function getAllTipsFromFirestore(): Promise<Tip[]> {
  try {
    const db = getAdminDb();
    const snapshot = await db
      .collection('tips')
      .where('status', '==', 'publish')
      .get();

    const tips: Tip[] = [];
    snapshot.forEach((doc) => {
      try {
        const data = doc.data() as Tip;
        const converted = convertTimestampsToISO(data);
        tips.push({ ...converted, id: doc.id });
      } catch (error) {
        console.error(`Error transformando tip ${doc.id}:`, error);
      }
    });

    return tips;
  } catch (error) {
    console.error('Error en getAllTipsFromFirestore:', error);
    throw error;
  }
}

/**
 * Obtiene un tip por ID desde Firestore
 */
export async function getTipByIdFromFirestore(id: string): Promise<Tip | null> {
  try {
    const db = getAdminDb();
    const doc = await db.collection('tips').doc(id).get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data() as Tip;
    const converted = convertTimestampsToISO(data);
    return { ...converted, id: doc.id };
  } catch (error) {
    console.error(`Error en getTipByIdFromFirestore para ${id}:`, error);
    throw error;
  }
}


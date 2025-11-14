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
 * Obtiene todos los tips activos (status === 'publish') desde Firestore
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
        // Continuar con el siguiente tip
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


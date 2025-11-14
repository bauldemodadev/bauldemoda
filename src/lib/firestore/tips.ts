/**
 * Funciones helper para leer tips desde Firestore
 */

import { getAdminDb } from '@/lib/firebase/admin';
import type { Tip } from '@/types/firestore';

/**
 * Obtiene todos los tips activos (status === 'publish') desde Firestore
 */
export async function getAllTipsFromFirestore(): Promise<Tip[]> {
  const db = getAdminDb();
  const snapshot = await db
    .collection('tips')
    .where('status', '==', 'publish')
    .get();

  const tips: Tip[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data() as Tip;
    tips.push({ ...data, id: doc.id });
  });

  return tips;
}

/**
 * Obtiene un tip por ID desde Firestore
 */
export async function getTipByIdFromFirestore(id: string): Promise<Tip | null> {
  const db = getAdminDb();
  const doc = await db.collection('tips').doc(id).get();

  if (!doc.exists) {
    return null;
  }

  const data = doc.data() as Tip;
  return { ...data, id: doc.id };
}


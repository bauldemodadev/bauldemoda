/**
 * Funciones helper para leer productos desde Firestore
 */

import { getAdminDb } from '@/lib/firebase/admin';
import { firestoreProductToProduct } from './transform';
import type { Product } from '@/types/product';
import type { FirestoreProduct } from '@/types/firestore';

/**
 * Obtiene todos los productos activos (status === 'publish') desde Firestore
 */
export async function getAllProductsFromFirestore(): Promise<Product[]> {
  const db = getAdminDb();
  const snapshot = await db
    .collection('products')
    .where('status', '==', 'publish')
    .get();

  const products: Product[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data() as FirestoreProduct;
    const product = firestoreProductToProduct({ ...data, id: doc.id });
    products.push(product);
  });

  return products;
}

/**
 * Obtiene productos por IDs desde Firestore
 */
export async function getProductsByIdsFromFirestore(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];

  const db = getAdminDb();
  
  // Firestore Admin SDK: usar getAll() para obtener múltiples documentos por ID
  // Dividimos en chunks de 10 (límite de getAll)
  const chunks: string[][] = [];
  for (let i = 0; i < ids.length; i += 10) {
    chunks.push(ids.slice(i, i + 10));
  }

  const allProducts: Product[] = [];

  for (const chunk of chunks) {
    const docRefs = chunk.map(id => db.collection('products').doc(id));
    const docs = await db.getAll(...docRefs);

    docs.forEach((doc) => {
      if (doc.exists) {
        const data = doc.data() as FirestoreProduct;
        const product = firestoreProductToProduct({ ...data, id: doc.id });
        allProducts.push(product);
      }
    });
  }

  // Mantener el orden de los IDs solicitados
  const productMap = new Map(allProducts.map(p => [p.id, p]));
  return ids
    .map(id => productMap.get(id))
    .filter((p): p is Product => p !== undefined);
}

/**
 * Obtiene un producto por ID desde Firestore
 */
export async function getProductByIdFromFirestore(id: string): Promise<Product | null> {
  const db = getAdminDb();
  const doc = await db.collection('products').doc(id).get();

  if (!doc.exists) {
    return null;
  }

  const data = doc.data() as FirestoreProduct;
  return firestoreProductToProduct({ ...data, id: doc.id });
}


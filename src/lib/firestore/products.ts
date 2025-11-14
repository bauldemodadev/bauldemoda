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
  try {
    const db = getAdminDb();
    const snapshot = await db
      .collection('products')
      .where('status', '==', 'publish')
      .get();

    const products: Product[] = [];
    snapshot.forEach((doc) => {
      try {
        const data = doc.data() as FirestoreProduct;
        const product = firestoreProductToProduct({ ...data, id: doc.id });
        products.push(product);
      } catch (error) {
        console.error(`Error transformando producto ${doc.id}:`, error);
        // Continuar con el siguiente producto
      }
    });

    return products;
  } catch (error) {
    console.error('Error en getAllProductsFromFirestore:', error);
    throw error;
  }
}

/**
 * Obtiene productos por IDs desde Firestore
 */
export async function getProductsByIdsFromFirestore(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];

  try {
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
          try {
            const data = doc.data() as FirestoreProduct;
            const product = firestoreProductToProduct({ ...data, id: doc.id });
            allProducts.push(product);
          } catch (error) {
            console.error(`Error transformando producto ${doc.id}:`, error);
            // Continuar con el siguiente producto
          }
        }
      });
    }

    // Mantener el orden de los IDs solicitados
    const productMap = new Map(allProducts.map(p => [p.id, p]));
    return ids
      .map(id => productMap.get(id))
      .filter((p): p is Product => p !== undefined);
  } catch (error) {
    console.error('Error en getProductsByIdsFromFirestore:', error);
    throw error;
  }
}

/**
 * Obtiene un producto por ID desde Firestore
 */
export async function getProductByIdFromFirestore(id: string): Promise<Product | null> {
  try {
    const db = getAdminDb();
    const doc = await db.collection('products').doc(id).get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data() as FirestoreProduct;
    return firestoreProductToProduct({ ...data, id: doc.id });
  } catch (error) {
    console.error(`Error en getProductByIdFromFirestore para ${id}:`, error);
    throw error;
  }
}


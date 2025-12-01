/**
 * Funciones helper para leer productos desde Firestore
 * OPTIMIZADO: Queries con limit y filtros para evitar lecturas masivas
 */

import { getAdminDb } from '@/lib/firebase/admin';
import { firestoreProductToProduct } from './transform';
import type { Product } from '@/types/product';
import type { FirestoreProduct } from '@/types/firestore';

/**
 * Obtiene productos con paginación y filtros
 * @param limit - Número máximo de productos a retornar (default: 50)
 * @param cursor - ID del último documento para paginación
 * @param sede - Filtrar por sede ('almagro' | 'ciudad-jardin' | 'online')
 * @param category - Filtrar por categoría
 */
export async function getProductsPage(options: {
  limit?: number;
  cursor?: string;
  sede?: 'almagro' | 'ciudad-jardin' | 'online';
  category?: string;
} = {}): Promise<{ products: Product[]; nextCursor?: string; hasMore: boolean }> {
  try {
    const { limit = 50, cursor, sede, category } = options;
    const db = getAdminDb();
    
    let query = db
      .collection('products')
      .where('status', '==', 'publish')
      .orderBy('createdAt', 'desc')
      .limit(limit + 1); // +1 para saber si hay más
    
    if (sede) {
      query = query.where('sede', '==', sede) as any;
    }
    
    if (cursor) {
      const cursorDoc = await db.collection('products').doc(cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc) as any;
      }
    }
    
    const snapshot = await query.get();
    const docs = snapshot.docs;
    const hasMore = docs.length > limit;
    const productsToReturn = hasMore ? docs.slice(0, limit) : docs;
    
    const products: Product[] = [];
    productsToReturn.forEach((doc) => {
      try {
        const data = doc.data() as FirestoreProduct;
        const product = firestoreProductToProduct({ ...data, id: doc.id });
        
        // Filtrar por categoría en memoria si es necesario (Firestore no soporta múltiples where complejos)
        if (!category || product.category === category) {
          products.push(product);
        }
      } catch (error) {
        console.error(`❌ Error transformando producto ${doc.id}:`, error);
      }
    });
    
    return {
      products,
      nextCursor: hasMore ? productsToReturn[productsToReturn.length - 1].id : undefined,
      hasMore,
    };
  } catch (error) {
    console.error('❌ Error en getProductsPage:', error);
    throw error;
  }
}

/**
 * Obtiene todos los productos activos (status === 'publish') desde Firestore
 * ⚠️ DEPRECATED: Usar getProductsPage con limit para evitar lecturas masivas
 * Mantenido para compatibilidad, pero debería evitarse en producción
 */
export async function getAllProductsFromFirestore(): Promise<Product[]> {
  try {
    console.log('⚠️ getAllProductsFromFirestore: Considerar usar getProductsPage con limit');
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
        console.error(`❌ Error transformando producto ${doc.id}:`, error);
      }
    });

    return products;
  } catch (error) {
    console.error('❌ Error en getAllProductsFromFirestore:', error);
    throw error;
  }
}

/**
 * Obtiene productos por IDs desde Firestore
 */
export async function getProductsByIdsFromFirestore(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];

  try {
    console.log(`🔍 Buscando ${ids.length} productos por IDs:`, ids.slice(0, 5), '...');
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


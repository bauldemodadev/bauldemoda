/**
 * Funciones helper para manejar órdenes en Firestore
 */

import { getAdminDb } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';
import type { Order, OrderItem, OrderStatus, PaymentStatus, PaymentMethod } from '@/types/firestore/order';

/**
 * Crea una nueva orden en Firestore
 */
export async function createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const db = getAdminDb();
    const now = Timestamp.now();

    const orderRef = db.collection('orders').doc();
    
    const order: Omit<Order, 'id'> = {
      ...orderData,
      createdAt: now,
      updatedAt: now,
    };

    await orderRef.set(order);

    return orderRef.id;
  } catch (error) {
    console.error('Error creando orden en Firestore:', error);
    throw error;
  }
}

/**
 * Obtiene una orden por ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const db = getAdminDb();
    const doc = await db.collection('orders').doc(orderId).get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data() as Omit<Order, 'id'>;
    return {
      id: doc.id,
      ...data,
    };
  } catch (error) {
    console.error(`Error obteniendo orden ${orderId}:`, error);
    throw error;
  }
}

/**
 * Actualiza una orden existente
 */
export async function updateOrder(
  orderId: string,
  updates: Partial<Omit<Order, 'id' | 'createdAt'>>
): Promise<void> {
  try {
    const db = getAdminDb();
    const now = Timestamp.now();

    await db.collection('orders').doc(orderId).update({
      ...updates,
      updatedAt: now,
    });
  } catch (error) {
    console.error(`Error actualizando orden ${orderId}:`, error);
    throw error;
  }
}

/**
 * Busca una orden por externalReference (usado para webhooks de MP)
 */
export async function getOrderByExternalReference(
  externalReference: string
): Promise<Order | null> {
  try {
    const db = getAdminDb();
    const snapshot = await db
      .collection('orders')
      .where('externalReference', '==', externalReference)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data() as Omit<Order, 'id'>;
    return {
      id: doc.id,
      ...data,
    };
  } catch (error) {
    console.error(`Error buscando orden por externalReference ${externalReference}:`, error);
    throw error;
  }
}

/**
 * Obtiene todas las órdenes de un cliente por customerId
 */
export async function getOrdersByCustomerId(
  customerId: string
): Promise<Order[]> {
  try {
    const db = getAdminDb();
    const snapshot = await db
      .collection('orders')
      .where('customerId', '==', customerId)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => {
      const data = doc.data() as Omit<Order, 'id'>;
      return {
        id: doc.id,
        ...data,
      };
    });
  } catch (error) {
    console.error(`Error obteniendo órdenes del cliente ${customerId}:`, error);
    throw error;
  }
}

/**
 * Obtiene todas las órdenes de un cliente por email (búsqueda alternativa)
 * Busca en customerSnapshot.email para casos donde el cliente no existe en la colección customers
 */
export async function getOrdersByEmail(
  email: string
): Promise<Order[]> {
  try {
    const db = getAdminDb();
    // Normalizar email: lowercase y trim
    const normalizedEmail = email.toLowerCase().trim();
    
    let snapshot;
    try {
      // Intentar con orderBy primero (requiere índice)
      snapshot = await db
        .collection('orders')
        .where('customerSnapshot.email', '==', normalizedEmail)
        .orderBy('createdAt', 'desc')
        .get();
    } catch (error: any) {
      // Si falla por falta de índice, intentar sin orderBy
      if (error?.code === 9 || error?.message?.includes('index')) {
        console.warn('Índice no encontrado para customerSnapshot.email + createdAt, buscando sin orderBy');
        snapshot = await db
          .collection('orders')
          .where('customerSnapshot.email', '==', normalizedEmail)
          .get();
      } else {
        throw error;
      }
    }

    const orders = snapshot.docs.map(doc => {
      const data = doc.data() as Omit<Order, 'id'>;
      return {
        id: doc.id,
        ...data,
      };
    });

    // Ordenar en memoria si no se ordenó en la consulta
    return orders.sort((a, b) => {
      const dateA = a.createdAt instanceof Timestamp 
        ? a.createdAt.toMillis() 
        : new Date(a.createdAt as any).getTime();
      const dateB = b.createdAt instanceof Timestamp 
        ? b.createdAt.toMillis() 
        : new Date(b.createdAt as any).getTime();
      return dateB - dateA; // Más reciente primero
    });
  } catch (error) {
    console.error(`Error obteniendo órdenes por email ${email}:`, error);
    throw error;
  }
}

/**
 * Obtiene todas las órdenes de un cliente (intenta por customerId primero, luego por email)
 */
export async function getOrdersByCustomerIdOrEmail(
  customerId?: string,
  email?: string
): Promise<Order[]> {
  try {
    const orders: Order[] = [];
    const seenOrderIds = new Set<string>();

    // Primero intentar por customerId si está disponible
    if (customerId) {
      try {
        const ordersById = await getOrdersByCustomerId(customerId);
        ordersById.forEach(order => {
          if (!seenOrderIds.has(order.id)) {
            orders.push(order);
            seenOrderIds.add(order.id);
          }
        });
      } catch (error) {
        console.warn(`No se pudieron obtener órdenes por customerId ${customerId}:`, error);
      }
    }

    // Luego buscar por email si está disponible
    if (email) {
      try {
        const ordersByEmail = await getOrdersByEmail(email);
        ordersByEmail.forEach(order => {
          if (!seenOrderIds.has(order.id)) {
            orders.push(order);
            seenOrderIds.add(order.id);
          }
        });
      } catch (error) {
        console.warn(`No se pudieron obtener órdenes por email ${email}:`, error);
      }
    }

    // Ordenar por fecha de creación (más reciente primero)
    return orders.sort((a, b) => {
      const dateA = a.createdAt instanceof Timestamp 
        ? a.createdAt.toMillis() 
        : new Date(a.createdAt as any).getTime();
      const dateB = b.createdAt instanceof Timestamp 
        ? b.createdAt.toMillis() 
        : new Date(b.createdAt as any).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.error(`Error obteniendo órdenes por customerId o email:`, error);
    throw error;
  }
}


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


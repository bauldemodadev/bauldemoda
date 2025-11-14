/**
 * Funciones helper para manejar clientes en Firestore
 */

import { getAdminDb } from '@/lib/firebase/admin';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';
import type { Customer, CustomerCourseEnrollment } from '@/types/firestore/customer';

/**
 * Crea o actualiza un cliente
 * Si el cliente existe (por email o uid), lo actualiza; sino, lo crea
 */
export async function upsertCustomer(
  customerData: Partial<Customer> & { email: string; name: string }
): Promise<Customer> {
  try {
    const db = getAdminDb();
    const now = Timestamp.now();

    // Buscar cliente existente por email o uid
    let existingCustomer: Customer | null = null;
    let customerId: string;

    if (customerData.uid) {
      const doc = await db.collection('customers').doc(customerData.uid).get();
      if (doc.exists) {
        existingCustomer = { id: doc.id, ...doc.data() } as Customer;
        customerId = doc.id;
      }
    }

    if (!existingCustomer) {
      // Buscar por email
      const snapshot = await db
        .collection('customers')
        .where('email', '==', customerData.email)
        .limit(1)
        .get();

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        existingCustomer = { id: doc.id, ...doc.data() } as Customer;
        customerId = doc.id;
      }
    }

    if (existingCustomer) {
      // Actualizar cliente existente
      const updates: Partial<Customer> = {
        ...customerData,
        updatedAt: now,
      };

      // No sobrescribir campos que no deben cambiar
      delete (updates as any).id;
      delete (updates as any).createdAt;
      delete (updates as any).totalOrders;
      delete (updates as any).totalSpent;

      await db.collection('customers').doc(customerId).update(updates);

      return {
        ...existingCustomer,
        ...updates,
      } as Customer;
    } else {
      // Crear nuevo cliente
      const newCustomer: Omit<Customer, 'id'> = {
        uid: customerData.uid,
        email: customerData.email,
        name: customerData.name,
        phone: customerData.phone,
        createdAt: now,
        lastOrderAt: undefined,
        totalOrders: 0,
        totalSpent: 0,
        tags: customerData.tags || [],
        enrolledCourses: customerData.enrolledCourses || [],
      };

      // Usar uid como docId si está disponible, sino generar uno
      customerId = customerData.uid || db.collection('customers').doc().id;
      await db.collection('customers').doc(customerId).set(newCustomer);

      return {
        id: customerId,
        ...newCustomer,
      };
    }
  } catch (error) {
    console.error('Error upserting cliente:', error);
    throw error;
  }
}

/**
 * Actualiza las estadísticas de un cliente después de una orden pagada
 */
export async function updateCustomerStats(
  customerId: string,
  orderAmount: number
): Promise<void> {
  try {
    const db = getAdminDb();
    const now = Timestamp.now();
    const customerRef = db.collection('customers').doc(customerId);

    await customerRef.update({
      totalOrders: FieldValue.increment(1),
      totalSpent: FieldValue.increment(orderAmount),
      lastOrderAt: now,
    });
  } catch (error) {
    console.error(`Error actualizando estadísticas del cliente ${customerId}:`, error);
    throw error;
  }
}

/**
 * Agrega un curso online al cliente (enrollment)
 */
export async function enrollCustomerInCourse(
  customerId: string,
  enrollment: CustomerCourseEnrollment
): Promise<void> {
  try {
    const db = getAdminDb();
    const customerRef = db.collection('customers').doc(customerId);

    await customerRef.update({
      enrolledCourses: FieldValue.arrayUnion(enrollment),
    });
  } catch (error) {
    console.error(`Error inscribiendo cliente ${customerId} en curso:`, error);
    throw error;
  }
}


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

    // Validar datos requeridos
    if (!customerData.email || !customerData.name) {
      throw new Error('Email y nombre son requeridos para crear/actualizar un cliente');
    }

    // Buscar cliente existente por email o uid
    let existingCustomer: Customer | null = null;
    let customerId: string | null = null;

    if (customerData.uid) {
      try {
        const doc = await db.collection('customers').doc(customerData.uid).get();
        if (doc.exists) {
          existingCustomer = { id: doc.id, ...doc.data() } as Customer;
          customerId = doc.id;
        }
      } catch (error) {
        console.warn('Error buscando cliente por uid:', error);
      }
    }

    if (!existingCustomer) {
      // Buscar por email
      try {
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
      } catch (error) {
        console.warn('Error buscando cliente por email:', error);
      }
    }

    if (existingCustomer && customerId) {
      // Actualizar cliente existente
      const updates: Record<string, any> = {};

      // Solo actualizar campos que vienen en customerData y no son undefined
      if (customerData.name !== undefined) updates.name = customerData.name;
      if (customerData.email !== undefined) updates.email = customerData.email;
      if (customerData.phone !== undefined && customerData.phone !== null) updates.phone = customerData.phone;
      if (customerData.dni !== undefined && customerData.dni !== null) updates.dni = customerData.dni;
      if (customerData.uid !== undefined && customerData.uid !== null) updates.uid = customerData.uid;

      // No actualizar campos protegidos
      // (id, createdAt, totalOrders, totalSpent no se incluyen)

      // Solo actualizar si hay cambios
      if (Object.keys(updates).length > 0) {
        await db.collection('customers').doc(customerId).update(updates);
      }

      // Retornar cliente actualizado
      return {
        ...existingCustomer,
        ...updates,
      } as Customer;
    } else {
      // Crear nuevo cliente - construir objeto sin undefined ni null
      const newCustomerData: Record<string, any> = {
        email: customerData.email,
        name: customerData.name,
        createdAt: now,
        totalOrders: 0,
        totalSpent: 0,
        tags: customerData.tags || [],
        enrolledCourses: customerData.enrolledCourses || [],
      };

      // Agregar campos opcionales solo si tienen valor (no undefined ni null)
      if (customerData.uid !== undefined && customerData.uid !== null) {
        newCustomerData.uid = customerData.uid;
      }
      if (customerData.phone !== undefined && customerData.phone !== null && customerData.phone !== '') {
        newCustomerData.phone = customerData.phone;
      }
      if (customerData.dni !== undefined && customerData.dni !== null && customerData.dni !== '') {
        newCustomerData.dni = customerData.dni;
      }

      // Usar uid como docId si está disponible, sino generar uno
      const newCustomerId = customerData.uid || db.collection('customers').doc().id;
      
      console.log('📝 Creando nuevo cliente con ID:', newCustomerId);
      console.log('📝 Datos del cliente:', JSON.stringify(newCustomerData, null, 2));
      
      await db.collection('customers').doc(newCustomerId).set(newCustomerData);

      const createdCustomer: Customer = {
        id: newCustomerId,
        email: newCustomerData.email,
        name: newCustomerData.name,
        createdAt: newCustomerData.createdAt,
        totalOrders: newCustomerData.totalOrders,
        totalSpent: newCustomerData.totalSpent,
        tags: newCustomerData.tags,
        enrolledCourses: newCustomerData.enrolledCourses,
      };

      if (newCustomerData.uid) createdCustomer.uid = newCustomerData.uid;
      if (newCustomerData.phone) createdCustomer.phone = newCustomerData.phone;
      if (newCustomerData.dni) createdCustomer.dni = newCustomerData.dni;

      return createdCustomer;
    }
  } catch (error) {
    console.error('❌ Error upserting cliente:', error);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('❌ Customer data recibido:', JSON.stringify(customerData, null, 2));
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

/**
 * Obtiene un cliente por email
 */
export async function getCustomerByEmail(email: string): Promise<Customer | null> {
  try {
    const db = getAdminDb();
    const snapshot = await db
      .collection('customers')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data() as Omit<Customer, 'id'>;
    return {
      id: doc.id,
      ...data,
    };
  } catch (error) {
    console.error(`Error obteniendo cliente por email ${email}:`, error);
    throw error;
  }
}


/**
 * Utilidades para serializar datos de Firestore para componentes del cliente
 */

import { Timestamp } from 'firebase-admin/firestore';

/**
 * Convierte todos los Timestamps en un objeto a strings ISO serializables
 */
export function serializeFirestoreData(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  // Si es un Timestamp, convertirlo a ISO string
  if (data instanceof Timestamp) {
    return data.toDate().toISOString();
  }

  // Si es un Date, convertirlo a ISO string
  if (data instanceof Date) {
    return data.toISOString();
  }

  // Si es un array, procesar cada elemento
  if (Array.isArray(data)) {
    return data.map(item => serializeFirestoreData(item));
  }

  // Si es un objeto, procesar cada propiedad
  if (typeof data === 'object' && data.constructor === Object) {
    const serialized: any = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        serialized[key] = serializeFirestoreData(data[key]);
      }
    }
    return serialized;
  }

  // Para otros tipos (string, number, boolean, etc.), retornar tal cual
  return data;
}


/**
 * Tipos Firestore para la colección 'customers'
 */

import { Timestamp } from 'firebase-admin/firestore';

/**
 * Inscripción de un cliente a un curso online
 */
export interface CustomerCourseEnrollment {
  courseId: string;               // ref a onlineCourses
  productId?: string;              // ref a products si aplica
  orderId: string;                // ref a orders
  accessFrom: Timestamp;
  accessTo?: Timestamp | null;
}

/**
 * Cliente en Firestore
 */
export interface Customer {
  // Identificadores
  id: string;                     // docId (si tiene Firebase Auth, igual al uid)
  uid?: string;                   // Firebase Auth uid
  email: string;
  name: string;
  phone?: string;

  // Estadísticas
  totalOrders: number;
  totalSpent: number;
  tags: string[];                 // "online", "presencial", etc.

  // Inscripciones
  enrolledCourses: CustomerCourseEnrollment[];

  // Fechas
  createdAt: Timestamp;
  lastOrderAt?: Timestamp;
}


/**
 * Tipos Firestore para la colección 'orders'
 */

import { Timestamp } from 'firebase-admin/firestore';

/**
 * Estado de la orden
 */
export type OrderStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'refunded';

/**
 * Estado del pago
 */
export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'refunded';

/**
 * Método de pago
 */
export type PaymentMethod =
  | 'mp'        // Mercado Pago
  | 'transfer'  // Transferencia bancaria
  | 'cash'      // Efectivo
  | 'other';    // Otro

/**
 * Item de una orden
 */
export interface OrderItem {
  type: 'product' | 'onlineCourse';
  productId?: string;              // ref a products (si type === 'product')
  courseId?: string;               // ref a onlineCourses (si type === 'onlineCourse')
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  imageUrl?: string;               // URL de la imagen del producto/curso
}

/**
 * Snapshot de datos del cliente al momento de la orden
 * (para mantener histórico aunque el cliente cambie sus datos)
 */
export interface OrderCustomerSnapshot {
  name: string;
  email: string;
  phone?: string;
}

/**
 * Orden/Pedido en Firestore
 */
export interface Order {
  // Identificadores
  id: string;
  
  // Estado
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;

  // Integración Mercado Pago
  mpPaymentId?: string;
  mpPreferenceId?: string;
  externalReference?: string;

  // Cliente
  customerId: string;             // ref a customers
  customerSnapshot: OrderCustomerSnapshot;

  // Items y totales
  items: OrderItem[];
  totalAmount: number;
  currency: 'ARS';

  // Metadata adicional (para cursos presenciales, etc.)
  metadata?: {
    orderType?: 'curso_presencial';
    sede?: 'almagro' | 'ciudad-jardin';
    [key: string]: any;
  };

  // Fechas
  createdAt: Timestamp;
  updatedAt: Timestamp;
}


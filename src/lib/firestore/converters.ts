/**
 * Firestore Data Converters
 * 
 * Estos converters permiten transformar automáticamente los datos
 * entre Firestore y TypeScript al leer/escribir documentos.
 * 
 * Uso:
 *   const productsRef = collection(db, 'products').withConverter(productConverter);
 *   const product = await getDoc(productsRef);
 *   // product.data() ya es de tipo FirestoreProduct
 */

import { FirestoreDataConverter } from 'firebase-admin/firestore';
import type { 
  FirestoreProduct, 
  OnlineCourse, 
  Tip, 
  Customer, 
  Order 
} from '@/types/firestore';

/**
 * Converter para productos
 */
export const productConverter: FirestoreDataConverter<FirestoreProduct> = {
  toFirestore(product: FirestoreProduct): FirebaseFirestore.DocumentData {
    // Excluir el id del documento (Firestore lo maneja automáticamente)
    const { id, ...data } = product;
    return data as FirebaseFirestore.DocumentData;
  },
  fromFirestore(
    snapshot: FirebaseFirestore.QueryDocumentSnapshot
  ): FirestoreProduct {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      ...data,
    } as FirestoreProduct;
  },
};

/**
 * Converter para cursos online
 */
export const onlineCourseConverter: FirestoreDataConverter<OnlineCourse> = {
  toFirestore(course: OnlineCourse): FirebaseFirestore.DocumentData {
    const { id, ...data } = course;
    return data as FirebaseFirestore.DocumentData;
  },
  fromFirestore(
    snapshot: FirebaseFirestore.QueryDocumentSnapshot
  ): OnlineCourse {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      ...data,
    } as OnlineCourse;
  },
};

/**
 * Converter para tips
 */
export const tipConverter: FirestoreDataConverter<Tip> = {
  toFirestore(tip: Tip): FirebaseFirestore.DocumentData {
    const { id, ...data } = tip;
    return data as FirebaseFirestore.DocumentData;
  },
  fromFirestore(
    snapshot: FirebaseFirestore.QueryDocumentSnapshot
  ): Tip {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      ...data,
    } as Tip;
  },
};

/**
 * Converter para clientes
 */
export const customerConverter: FirestoreDataConverter<Customer> = {
  toFirestore(customer: Customer): FirebaseFirestore.DocumentData {
    const { id, ...data } = customer;
    return data as FirebaseFirestore.DocumentData;
  },
  fromFirestore(
    snapshot: FirebaseFirestore.QueryDocumentSnapshot
  ): Customer {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      ...data,
    } as Customer;
  },
};

/**
 * Converter para órdenes
 */
export const orderConverter: FirestoreDataConverter<Order> = {
  toFirestore(order: Order): FirebaseFirestore.DocumentData {
    const { id, ...data } = order;
    return data as FirebaseFirestore.DocumentData;
  },
  fromFirestore(
    snapshot: FirebaseFirestore.QueryDocumentSnapshot
  ): Order {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      ...data,
    } as Order;
  },
};


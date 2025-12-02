/**
 * API Route: Migración de Órdenes a Firestore
 * 
 * POST /api/migrate-orders
 * Body: { dryRun: boolean, source: 'almagro' | 'ciudad-jardin' | 'both' }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

interface OrderItem {
  type: 'product' | 'onlineCourse';
  productId?: string;
  courseId?: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  imageUrl?: string;
}

interface OrderJSON {
  id: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  customerId: string;
  customerSnapshot: {
    name: string;
    email: string;
    phone?: string;
  };
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  metadata?: Record<string, any>;
  externalReference?: string;
  mpPaymentId?: string;
  mpPreferenceId?: string;
  createdAt: string;
  updatedAt: string;
}

function parseISODate(isoString: string): Timestamp {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    throw new Error(`Fecha inválida: ${isoString}`);
  }
  return Timestamp.fromDate(date);
}

async function checkOrderExists(db: FirebaseFirestore.Firestore, orderId: string): Promise<boolean> {
  const doc = await db.collection('orders').doc(orderId).get();
  return doc.exists;
}

async function checkCustomerExists(db: FirebaseFirestore.Firestore, email: string): Promise<boolean> {
  const snapshot = await db.collection('customers')
    .where('email', '==', email)
    .limit(1)
    .get();
  return !snapshot.empty;
}

async function createCustomer(
  db: FirebaseFirestore.Firestore,
  customerData: { name: string; email: string; phone?: string }
): Promise<void> {
  const customerRef = db.collection('customers').doc();
  await customerRef.set({
    email: customerData.email,
    name: customerData.name,
    phone: customerData.phone || '',
    dni: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'AR',
    },
    enrolledCourses: [],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

async function insertOrder(
  db: FirebaseFirestore.Firestore,
  order: OrderJSON
): Promise<void> {
  const orderData = {
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    customerId: order.customerId,
    customerSnapshot: order.customerSnapshot,
    items: order.items,
    totalAmount: order.totalAmount,
    currency: order.currency,
    ...(order.metadata && { metadata: order.metadata }),
    ...(order.externalReference && { externalReference: order.externalReference }),
    ...(order.mpPaymentId && { mpPaymentId: order.mpPaymentId }),
    ...(order.mpPreferenceId && { mpPreferenceId: order.mpPreferenceId }),
    createdAt: parseISODate(order.createdAt),
    updatedAt: parseISODate(order.updatedAt),
  };

  await db.collection('orders').doc(order.id).set(orderData);
}

export async function POST(request: NextRequest) {
  try {
    const { dryRun = true, source = 'both', skipDuplicates = true } = await request.json();

    const db = getAdminDb();
    
    // Leer archivos JSON NORMALIZADOS desde public/
    // IMPORTANTE: Usar archivos con emails normalizados para evitar problemas de case-sensitivity
    const almagroPath = path.join(process.cwd(), 'public', 'firebase_orders_2025_almagro_v2_normalized.json');
    const ciudadJardinPath = path.join(process.cwd(), 'public', 'firebase_orders_2025_ciudad_jardin_v2_normalized.json');
    
    // Seleccionar órdenes a migrar
    let ordersToMigrate: OrderJSON[] = [];
    if (source === 'almagro' || source === 'both') {
      if (fs.existsSync(almagroPath)) {
        const almagroOrders = JSON.parse(fs.readFileSync(almagroPath, 'utf-8'));
        ordersToMigrate.push(...(almagroOrders as OrderJSON[]));
      }
    }
    if (source === 'ciudad-jardin' || source === 'both') {
      if (fs.existsSync(ciudadJardinPath)) {
        const ciudadJardinOrders = JSON.parse(fs.readFileSync(ciudadJardinPath, 'utf-8'));
        ordersToMigrate.push(...(ciudadJardinOrders as OrderJSON[]));
      }
    }

    const stats = {
      totalOrders: ordersToMigrate.length,
      successfulInserts: 0,
      skippedDuplicates: 0,
      errors: 0,
      customersCreated: 0,
      customersExisting: 0,
      errorDetails: [] as string[],
    };

    // Procesar órdenes
    for (const order of ordersToMigrate) {
      try {
        // Verificar duplicados
        if (skipDuplicates) {
          const exists = await checkOrderExists(db, order.id);
          if (exists) {
            stats.skippedDuplicates++;
            continue;
          }
        }

        // Verificar/crear customer
        const customerExists = await checkCustomerExists(db, order.customerSnapshot.email);
        if (!customerExists) {
          if (!dryRun) {
            await createCustomer(db, order.customerSnapshot);
          }
          stats.customersCreated++;
        } else {
          stats.customersExisting++;
        }

        // Insertar orden
        if (!dryRun) {
          await insertOrder(db, order);
        }

        stats.successfulInserts++;
      } catch (error) {
        stats.errors++;
        stats.errorDetails.push(`${order.id}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    }

    return NextResponse.json({
      success: true,
      dryRun,
      stats,
      message: dryRun 
        ? 'Dry-run completado exitosamente (no se escribió nada)'
        : 'Migración completada exitosamente'
    });

  } catch (error) {
    console.error('Error en migración:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}


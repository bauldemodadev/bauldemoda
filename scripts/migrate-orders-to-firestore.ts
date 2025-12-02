/**
 * Script de Migración de Órdenes a Firestore
 * 
 * Migra órdenes desde archivos JSON a la colección 'orders' en Firestore
 * - Valida estructura de datos
 * - Convierte fechas ISO a Timestamps
 * - Verifica/crea customers
 * - Manejo robusto de errores
 * - Modo dry-run para testing
 */

import * as fs from 'fs';
import * as path from 'path';
import { getAdminDb } from '../src/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const CONFIG = {
  DRY_RUN: process.argv.includes('--dry-run') || process.argv.includes('-d'),
  SKIP_DUPLICATES: true, // No insertar si el ID ya existe
  CREATE_CUSTOMERS: true, // Crear customers si no existen
  BATCH_SIZE: 10, // Tamaño de lote para inserciones
};

// ============================================================================
// TIPOS
// ============================================================================

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
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

interface MigrationStats {
  totalOrders: number;
  successfulInserts: number;
  skippedDuplicates: number;
  errors: number;
  customersCreated: number;
  customersExisting: number;
}

// ============================================================================
// UTILIDADES
// ============================================================================

function parseISODate(isoString: string): Timestamp {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    throw new Error(`Fecha inválida: ${isoString}`);
  }
  return Timestamp.fromDate(date);
}

function validateOrder(order: any): order is OrderJSON {
  if (!order.id || typeof order.id !== 'string') return false;
  if (!order.status || typeof order.status !== 'string') return false;
  if (!order.customerId || typeof order.customerId !== 'string') return false;
  if (!order.customerSnapshot?.email) return false;
  if (!Array.isArray(order.items) || order.items.length === 0) return false;
  if (typeof order.totalAmount !== 'number') return false;
  if (!order.createdAt || !order.updatedAt) return false;
  return true;
}

// ============================================================================
// FUNCIONES DE MIGRACIÓN
// ============================================================================

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

// ============================================================================
// MIGRACIÓN PRINCIPAL
// ============================================================================

async function migrateOrders(orders: OrderJSON[], stats: MigrationStats): Promise<void> {
  const db = getAdminDb();
  
  console.log(`\n📦 Procesando ${orders.length} órdenes...\n`);

  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    const progress = `[${i + 1}/${orders.length}]`;

    try {
      // 1. Validar estructura
      if (!validateOrder(order)) {
        console.error(`${progress} ❌ Orden inválida: ${(order as any)?.id || 'sin ID'}`);
        stats.errors++;
        continue;
      }

      // 2. Verificar si ya existe
      if (CONFIG.SKIP_DUPLICATES) {
        const exists = await checkOrderExists(db, order.id);
        if (exists) {
          console.log(`${progress} ⏭️  Ya existe: ${order.id}`);
          stats.skippedDuplicates++;
          continue;
        }
      }

      // 3. Verificar/crear customer
      if (CONFIG.CREATE_CUSTOMERS) {
        const customerExists = await checkCustomerExists(db, order.customerSnapshot.email);
        if (!customerExists) {
          if (!CONFIG.DRY_RUN) {
            await createCustomer(db, order.customerSnapshot);
          }
          console.log(`${progress} 👤 Cliente creado: ${order.customerSnapshot.email}`);
          stats.customersCreated++;
        } else {
          stats.customersExisting++;
        }
      }

      // 4. Insertar orden
      if (!CONFIG.DRY_RUN) {
        await insertOrder(db, order);
      }

      console.log(`${progress} ✅ ${CONFIG.DRY_RUN ? '[DRY-RUN]' : ''} Orden insertada: ${order.id} (${order.customerSnapshot.name})`);
      stats.successfulInserts++;

    } catch (error) {
      console.error(`${progress} ❌ Error procesando ${order.id}:`, error instanceof Error ? error.message : error);
      stats.errors++;
    }

    // Pequeña pausa cada N órdenes para no saturar
    if ((i + 1) % CONFIG.BATCH_SIZE === 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}

// ============================================================================
// FUNCIÓN PRINCIPAL
// ============================================================================

async function main() {
  console.log('🚀 MIGRACIÓN DE ÓRDENES A FIRESTORE\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Mostrar configuración
  console.log('⚙️  CONFIGURACIÓN:');
  console.log(`   - Modo: ${CONFIG.DRY_RUN ? '🧪 DRY-RUN (sin escribir)' : '✍️  ESCRITURA REAL'}`);
  console.log(`   - Saltar duplicados: ${CONFIG.SKIP_DUPLICATES ? '✅' : '❌'}`);
  console.log(`   - Crear customers: ${CONFIG.CREATE_CUSTOMERS ? '✅' : '❌'}`);
  console.log('');

  // Rutas de archivos
  const almagroPath = path.join(__dirname, '../public/firebase_orders_2025_almagro_v2.json');
  const ciudadJardinPath = path.join(__dirname, '../public/firebase_orders_2025_ciudad_jardin_v2.json');

  // Verificar archivos
  if (!fs.existsSync(almagroPath)) {
    console.error(`❌ Archivo no encontrado: ${almagroPath}`);
    process.exit(1);
  }
  if (!fs.existsSync(ciudadJardinPath)) {
    console.error(`❌ Archivo no encontrado: ${ciudadJardinPath}`);
    process.exit(1);
  }

  // Leer archivos
  console.log('📂 Leyendo archivos JSON...');
  const almagroOrders: OrderJSON[] = JSON.parse(fs.readFileSync(almagroPath, 'utf-8'));
  const ciudadJardinOrders: OrderJSON[] = JSON.parse(fs.readFileSync(ciudadJardinPath, 'utf-8'));

  console.log(`   ✅ Almagro: ${almagroOrders.length} órdenes`);
  console.log(`   ✅ Ciudad Jardín: ${ciudadJardinOrders.length} órdenes`);
  console.log(`   📊 Total: ${almagroOrders.length + ciudadJardinOrders.length} órdenes\n`);

  // Estadísticas
  const stats: MigrationStats = {
    totalOrders: almagroOrders.length + ciudadJardinOrders.length,
    successfulInserts: 0,
    skippedDuplicates: 0,
    errors: 0,
    customersCreated: 0,
    customersExisting: 0,
  };

  // Migrar órdenes de Almagro
  console.log('🏫 MIGRANDO ÓRDENES DE ALMAGRO');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  await migrateOrders(almagroOrders, stats);

  // Migrar órdenes de Ciudad Jardín
  console.log('\n🏫 MIGRANDO ÓRDENES DE CIUDAD JARDÍN');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  await migrateOrders(ciudadJardinOrders, stats);

  // Resumen final
  console.log('\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 RESUMEN DE LA MIGRACIÓN');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`   📦 Total de órdenes: ${stats.totalOrders}`);
  console.log(`   ✅ Insertadas exitosamente: ${stats.successfulInserts}`);
  console.log(`   ⏭️  Duplicadas (saltadas): ${stats.skippedDuplicates}`);
  console.log(`   ❌ Errores: ${stats.errors}`);
  console.log(`   👤 Clientes creados: ${stats.customersCreated}`);
  console.log(`   👥 Clientes existentes: ${stats.customersExisting}`);
  console.log('');

  if (CONFIG.DRY_RUN) {
    console.log('🧪 MODO DRY-RUN: No se escribió nada en Firestore');
    console.log('   Para ejecutar la migración real, ejecuta sin --dry-run\n');
  } else {
    console.log('✅ Migración completada!\n');
  }

  // Código de salida
  process.exit(stats.errors > 0 ? 1 : 0);
}

// ============================================================================
// EJECUTAR
// ============================================================================

main().catch(error => {
  console.error('\n❌ ERROR FATAL:', error);
  process.exit(1);
});


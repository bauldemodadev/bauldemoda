/**
 * Script para Normalizar Emails en Órdenes
 * 
 * Normaliza todos los emails a minúsculas en los archivos JSON
 * antes de migrarlos a Firestore.
 * 
 * Problema: Firebase Auth guarda emails en minúsculas, pero los datos
 * antiguos pueden tener mayúsculas mixtas (Abbichazarreta5@gmail.com)
 * 
 * Solución: Normalizar todos los emails a minúsculas antes de migrar
 */

import * as fs from 'fs';
import * as path from 'path';

interface OrderItem {
  type: string;
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

interface Stats {
  totalOrders: number;
  normalizedEmails: number;
  uniqueEmails: Set<string>;
  emailChanges: Array<{ from: string; to: string }>;
}

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

function normalizeOrdersFile(filePath: string, outputPath: string): Stats {
  console.log(`\n📂 Procesando: ${filePath}`);
  
  const stats: Stats = {
    totalOrders: 0,
    normalizedEmails: 0,
    uniqueEmails: new Set(),
    emailChanges: [],
  };

  // Leer archivo
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const orders: OrderJSON[] = JSON.parse(fileContent);
  
  stats.totalOrders = orders.length;

  // Normalizar emails en cada orden
  orders.forEach((order) => {
    const originalEmail = order.customerSnapshot.email;
    const normalizedEmail = normalizeEmail(originalEmail);
    
    // Registrar cambio si hubo normalización
    if (originalEmail !== normalizedEmail) {
      stats.normalizedEmails++;
      stats.emailChanges.push({
        from: originalEmail,
        to: normalizedEmail,
      });
    }

    // Actualizar email en customerSnapshot
    order.customerSnapshot.email = normalizedEmail;
    
    // También normalizar customerId si es un email
    if (order.customerId.includes('@')) {
      order.customerId = normalizeEmail(order.customerId);
    }

    stats.uniqueEmails.add(normalizedEmail);
  });

  // Guardar archivo normalizado
  fs.writeFileSync(outputPath, JSON.stringify(orders, null, 2), 'utf-8');

  return stats;
}

async function main() {
  console.log('🔄 NORMALIZACIÓN DE EMAILS EN ÓRDENES\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const almagroInput = path.join(__dirname, '../public/firebase_orders_2025_almagro_v2.json');
  const almagroOutput = path.join(__dirname, '../public/firebase_orders_2025_almagro_v2_normalized.json');
  
  const ciudadJardinInput = path.join(__dirname, '../public/firebase_orders_2025_ciudad_jardin_v2.json');
  const ciudadJardinOutput = path.join(__dirname, '../public/firebase_orders_2025_ciudad_jardin_v2_normalized.json');

  // Verificar archivos
  if (!fs.existsSync(almagroInput)) {
    console.error(`❌ No se encuentra: ${almagroInput}`);
    process.exit(1);
  }
  if (!fs.existsSync(ciudadJardinInput)) {
    console.error(`❌ No se encuentra: ${ciudadJardinInput}`);
    process.exit(1);
  }

  // Normalizar Almagro
  const almagroStats = normalizeOrdersFile(almagroInput, almagroOutput);
  
  // Normalizar Ciudad Jardín
  const ciudadJardinStats = normalizeOrdersFile(ciudadJardinInput, ciudadJardinOutput);

  // Resumen
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 RESUMEN DE NORMALIZACIÓN');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('📁 ALMAGRO:');
  console.log(`   Total órdenes: ${almagroStats.totalOrders}`);
  console.log(`   Emails normalizados: ${almagroStats.normalizedEmails}`);
  console.log(`   Emails únicos: ${almagroStats.uniqueEmails.size}`);
  console.log(`   Archivo guardado en: ${almagroOutput}\n`);

  console.log('📁 CIUDAD JARDÍN:');
  console.log(`   Total órdenes: ${ciudadJardinStats.totalOrders}`);
  console.log(`   Emails normalizados: ${ciudadJardinStats.normalizedEmails}`);
  console.log(`   Emails únicos: ${ciudadJardinStats.uniqueEmails.size}`);
  console.log(`   Archivo guardado en: ${ciudadJardinOutput}\n`);

  console.log('📊 TOTAL GENERAL:');
  console.log(`   Órdenes procesadas: ${almagroStats.totalOrders + ciudadJardinStats.totalOrders}`);
  console.log(`   Emails normalizados: ${almagroStats.normalizedEmails + ciudadJardinStats.normalizedEmails}`);
  
  // Calcular emails únicos combinados
  const combinedUniqueEmails = new Set<string>();
  Array.from(almagroStats.uniqueEmails).forEach(email => combinedUniqueEmails.add(email));
  Array.from(ciudadJardinStats.uniqueEmails).forEach(email => combinedUniqueEmails.add(email));
  console.log(`   Emails únicos totales: ${combinedUniqueEmails.size}\n`);

  // Mostrar algunos ejemplos de cambios
  if (almagroStats.emailChanges.length > 0 || ciudadJardinStats.emailChanges.length > 0) {
    console.log('📝 EJEMPLOS DE EMAILS NORMALIZADOS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const allChanges = [...almagroStats.emailChanges, ...ciudadJardinStats.emailChanges];
    const examples = allChanges.slice(0, 10); // Mostrar primeros 10
    
    examples.forEach((change, idx) => {
      console.log(`${idx + 1}. "${change.from}" → "${change.to}"`);
    });

    if (allChanges.length > 10) {
      console.log(`   ... y ${allChanges.length - 10} más\n`);
    }
  }

  console.log('\n✅ Normalización completada exitosamente!');
  console.log('\n⚠️  IMPORTANTE:');
  console.log('   Los archivos originales NO fueron modificados.');
  console.log('   Los archivos normalizados tienen sufijo "_normalized".');
  console.log('   Usa los archivos normalizados para la migración.\n');
}

main().catch(error => {
  console.error('\n❌ ERROR:', error);
  process.exit(1);
});


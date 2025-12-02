/**
 * Script: Corregir IDs Faltantes en Cursos Online
 * 
 * Problema: 24 items de "MasterClass para Vender Online" no tienen courseId
 * 
 * Solución:
 * 1. Busca el curso en products por nombre
 * 2. Obtiene el relatedCourseId
 * 3. Actualiza los items en los JSON
 * 4. Genera archivos corregidos
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
}

interface OrderJSON {
  id: string;
  items: OrderItem[];
  [key: string]: any;
}

// Mapeo manual de cursos conocidos sin IDs
const COURSE_ID_MAPPING: Record<string, string> = {
  'MasterClass para Vender Online': '5015',
  'MasterClass': '5015',
  // Agregar más si se encuentran otros casos
};

async function fixMissingCourseIds() {
  console.log('🔧 CORRECCIÓN DE IDs FALTANTES\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Rutas
  const almagroPath = path.join(__dirname, '../public/firebase_orders_2025_almagro_v2.json');
  const ciudadJardinPath = path.join(__dirname, '../public/firebase_orders_2025_ciudad_jardin_v2.json');

  const almagroOutputPath = path.join(__dirname, '../public/firebase_orders_2025_almagro_v2_fixed.json');
  const ciudadJardinOutputPath = path.join(__dirname, '../public/firebase_orders_2025_ciudad_jardin_v2_fixed.json');

  // Leer archivos
  const almagroOrders: OrderJSON[] = JSON.parse(fs.readFileSync(almagroPath, 'utf-8'));
  const ciudadJardinOrders: OrderJSON[] = JSON.parse(fs.readFileSync(ciudadJardinPath, 'utf-8'));

  console.log('📂 Archivos leídos');
  console.log(`   - Almagro: ${almagroOrders.length} órdenes`);
  console.log(`   - Ciudad Jardín: ${ciudadJardinOrders.length} órdenes\n`);

  // Buscar el courseId correcto para "MasterClass para Vender Online"
  console.log('🔍 Buscando courseId para "MasterClass para Vender Online"...\n');
  
  const masterclassId = await findCourseIdByName('MasterClass para Vender Online');
  
  if (!masterclassId) {
    console.error('❌ No se pudo encontrar el curso en Firestore');
    console.log('\n⚠️  Opciones:');
    console.log('   1. Verificar que el servidor esté corriendo (npm run dev)');
    console.log('   2. Verificar que el curso existe en products o onlineCourses');
    console.log('   3. Buscar manualmente el ID correcto\n');
    return;
  }

  console.log(`\n✅ Course ID encontrado: ${masterclassId}\n`);
  console.log('🔧 Corrigiendo órdenes...\n');

  let fixedCount = 0;

  // Función para corregir items
  const fixOrder = (order: OrderJSON): boolean => {
    let modified = false;
    
    order.items.forEach((item) => {
      if (item.type === 'onlineCourse' && !item.courseId && !item.productId) {
        if (item.name.toLowerCase().includes('masterclass') && 
            item.name.toLowerCase().includes('vender')) {
          item.courseId = masterclassId;
          modified = true;
          fixedCount++;
        }
      }
    });
    
    return modified;
  };

  // Corregir órdenes de Almagro
  almagroOrders.forEach(fixOrder);

  // Corregir órdenes de Ciudad Jardín
  ciudadJardinOrders.forEach(fixOrder);

  // Guardar archivos corregidos
  fs.writeFileSync(almagroOutputPath, JSON.stringify(almagroOrders, null, 2), 'utf-8');
  fs.writeFileSync(ciudadJardinOutputPath, JSON.stringify(ciudadJardinOrders, null, 2), 'utf-8');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ CORRECCIÓN COMPLETADA');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`   Items corregidos: ${fixedCount}`);
  console.log(`   Course ID asignado: ${masterclassId}\n`);
  console.log('📄 Archivos guardados:');
  console.log(`   - ${almagroOutputPath}`);
  console.log(`   - ${ciudadJardinOutputPath}\n`);
  console.log('⚠️  IMPORTANTE:');
  console.log('   Los archivos originales NO fueron modificados.');
  console.log('   Usa los archivos "_fixed" para la migración.\n');
}

fixMissingCourseIds().catch(error => {
  console.error('\n❌ ERROR:', error);
  process.exit(1);
});


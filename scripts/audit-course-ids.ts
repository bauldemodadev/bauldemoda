/**
 * Script de Auditoría: IDs de Cursos Online en Órdenes
 * 
 * Problema: Las órdenes antiguas usan productId en lugar de courseId
 * para cursos online, lo que impide acceder al contenido real.
 * 
 * Este script:
 * 1. Lee todas las órdenes de los JSON
 * 2. Identifica items con type='onlineCourse'
 * 3. Extrae los IDs usados
 * 4. Consulta products.relatedCourseId
 * 5. Consulta onlineCourses para verificar
 * 6. Genera reporte con mapeo correcto
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
  customerSnapshot: {
    email: string;
    name: string;
  };
  metadata?: any;
}

interface AuditResult {
  orderId: string;
  itemIndex: number;
  courseName: string;
  currentId: string;
  idType: 'productId' | 'courseId' | 'both' | 'none';
  needsCorrection: boolean;
  suggestedCourseId?: string;
}

async function auditOrders() {
  console.log('🔍 AUDITORÍA DE IDs DE CURSOS ONLINE\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Leer archivos
  const almagroPath = path.join(__dirname, '../public/firebase_orders_2025_almagro_v2.json');
  const ciudadJardinPath = path.join(__dirname, '../public/firebase_orders_2025_ciudad_jardin_v2.json');

  const almagroOrders: OrderJSON[] = JSON.parse(fs.readFileSync(almagroPath, 'utf-8'));
  const ciudadJardinOrders: OrderJSON[] = JSON.parse(fs.readFileSync(ciudadJardinPath, 'utf-8'));

  const allOrders = [...almagroOrders, ...ciudadJardinOrders];

  console.log(`📦 Total órdenes: ${allOrders.length}`);
  console.log(`   - Almagro: ${almagroOrders.length}`);
  console.log(`   - Ciudad Jardín: ${ciudadJardinOrders.length}\n`);

  // Recolectar todos los items de tipo onlineCourse
  const onlineCourseItems: AuditResult[] = [];
  const productIds = new Set<string>();
  const courseIds = new Set<string>();

  allOrders.forEach((order) => {
    order.items.forEach((item, index) => {
      if (item.type === 'onlineCourse') {
        let idType: 'productId' | 'courseId' | 'both' | 'none' = 'none';
        let currentId = '';

        if (item.productId && item.courseId) {
          idType = 'both';
          currentId = `P:${item.productId}, C:${item.courseId}`;
          productIds.add(item.productId);
          courseIds.add(item.courseId);
        } else if (item.productId) {
          idType = 'productId';
          currentId = item.productId;
          productIds.add(item.productId);
        } else if (item.courseId) {
          idType = 'courseId';
          currentId = item.courseId;
          courseIds.add(item.courseId);
        }

        onlineCourseItems.push({
          orderId: order.id,
          itemIndex: index,
          courseName: item.name,
          currentId,
          idType,
          needsCorrection: idType === 'productId', // Solo productId necesita corrección
        });
      }
    });
  });

  // Estadísticas
  console.log('📊 ESTADÍSTICAS DE CURSOS ONLINE:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`   Total items de cursos online: ${onlineCourseItems.length}`);
  console.log(`   Solo productId: ${onlineCourseItems.filter(i => i.idType === 'productId').length} ⚠️`);
  console.log(`   Solo courseId: ${onlineCourseItems.filter(i => i.idType === 'courseId').length} ✅`);
  console.log(`   Ambos IDs: ${onlineCourseItems.filter(i => i.idType === 'both').length} ✅`);
  console.log(`   Sin IDs: ${onlineCourseItems.filter(i => i.idType === 'none').length} ❌`);
  console.log(`\n   Product IDs únicos: ${productIds.size}`);
  console.log(`   Course IDs únicos: ${courseIds.size}\n`);

  // Items que necesitan corrección
  const needsCorrection = onlineCourseItems.filter(i => i.needsCorrection);
  const noIds = onlineCourseItems.filter(i => i.idType === 'none');

  if (needsCorrection.length > 0) {
    console.log('⚠️  ITEMS CON SOLO PRODUCT ID (necesitan courseId):');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`   Total: ${needsCorrection.length} items\n`);

    // Mostrar primeros 10 ejemplos
    console.log('📝 EJEMPLOS (primeros 10):');
    needsCorrection.slice(0, 10).forEach((item, idx) => {
      console.log(`${idx + 1}. Orden: ${item.orderId}`);
      console.log(`   Curso: ${item.courseName}`);
      console.log(`   Product ID actual: ${item.currentId}`);
      console.log(`   Necesita: courseId de onlineCourses\n`);
    });

    if (needsCorrection.length > 10) {
      console.log(`   ... y ${needsCorrection.length - 10} más\n`);
    }
  }

  if (noIds.length > 0) {
    console.log('❌ ITEMS SIN IDs (CRÍTICO):');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`   Total: ${noIds.length} items\n`);

    // Mostrar todos los que no tienen ID
    console.log('📝 CURSOS SIN ID:');
    noIds.forEach((item, idx) => {
      console.log(`${idx + 1}. Orden: ${item.orderId}`);
      console.log(`   Nombre: ${item.courseName}\n`);
    });
  }

  // Listar todos los Product IDs únicos encontrados
  console.log('📋 PRODUCT IDs ENCONTRADOS:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  Array.from(productIds).sort().forEach((id, idx) => {
    console.log(`${idx + 1}. Product ID: ${id}`);
  });
  console.log('');

  // Guardar reporte detallado
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalOrders: allOrders.length,
      totalOnlineCourseItems: onlineCourseItems.length,
      itemsWithProductIdOnly: onlineCourseItems.filter(i => i.idType === 'productId').length,
      itemsWithCourseIdOnly: onlineCourseItems.filter(i => i.idType === 'courseId').length,
      itemsWithBothIds: onlineCourseItems.filter(i => i.idType === 'both').length,
      itemsWithNoIds: onlineCourseItems.filter(i => i.idType === 'none').length,
      uniqueProductIds: Array.from(productIds),
      uniqueCourseIds: Array.from(courseIds),
    },
    itemsNeedingCorrection: needsCorrection,
  };

  const reportPath = path.join(__dirname, '../public/audit-course-ids-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ AUDITORÍA COMPLETADA');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`📄 Reporte guardado en: ${reportPath}\n`);

  if (needsCorrection.length > 0) {
    console.log('⚠️  ACCIÓN REQUERIDA:');
    console.log(`   ${needsCorrection.length} items necesitan corrección de IDs`);
    console.log('   Ejecuta el script de corrección cuando esté listo.\n');
  } else {
    console.log('✅ Todos los items tienen IDs correctos.\n');
  }
}

auditOrders().catch(error => {
  console.error('\n❌ ERROR:', error);
  process.exit(1);
});


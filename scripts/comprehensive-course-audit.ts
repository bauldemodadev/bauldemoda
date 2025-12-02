/**
 * Script: Auditoría Completa y Corrección de Course IDs
 * 
 * Proceso:
 * 1. Obtiene TODOS los cursos de Firestore (onlineCourses)
 * 2. Crea un mapeo: nombre del curso → courseId real
 * 3. Lee las órdenes de los JSON
 * 4. Compara nombres y corrige courseId incorrectos
 * 5. Genera archivos JSON corregidos
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
  items: OrderItem[];
  [key: string]: any;
}

interface CourseMapping {
  id: string;
  title: string;
  slug: string;
  normalizedTitle: string;
}

// Mapeo manual para casos especiales que no coinciden exactamente
const MANUAL_COURSE_MAPPING: Record<string, string> = {
  'intensivo indumentaria nivel i': '2790',
  'masterclass para vender online': '7050',
};

function normalizeCourseName(name: string): string {
  return name.toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n');
}

async function fetchFirestoreCourses(): Promise<CourseMapping[]> {
  try {
    console.log('📡 Consultando cursos en Firestore...\n');
    
    const response = await fetch('http://localhost:3000/api/audit/online-courses');
    
    if (!response.ok) {
      throw new Error('Error al consultar API');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error('API retornó error');
    }

    console.log(`✅ ${data.total} cursos encontrados en Firestore\n`);

    return data.courses.map((course: any) => ({
      id: course.id,
      title: course.title,
      slug: course.slug,
      normalizedTitle: normalizeCourseName(course.title),
    }));

  } catch (error) {
    console.error('❌ Error consultando Firestore:', error);
    throw error;
  }
}

function findCourseIdByName(courseName: string, coursesMap: CourseMapping[]): string | null {
  const normalized = normalizeCourseName(courseName);
  
  // 1. Primero verificar mapeo manual
  if (MANUAL_COURSE_MAPPING[normalized]) {
    return MANUAL_COURSE_MAPPING[normalized];
  }
  
  // 2. Búsqueda exacta
  let found = coursesMap.find(c => c.normalizedTitle === normalized);
  if (found) return found.id;
  
  // 3. Búsqueda parcial (contiene)
  found = coursesMap.find(c => 
    c.normalizedTitle.includes(normalized) || 
    normalized.includes(c.normalizedTitle)
  );
  if (found) return found.id;
  
  // 4. Búsqueda por palabras clave principales
  const keywords = normalized.split(' ').filter(w => w.length > 3);
  if (keywords.length > 0) {
    found = coursesMap.find(c => 
      keywords.every(keyword => c.normalizedTitle.includes(keyword))
    );
    if (found) return found.id;
  }
  
  return null;
}

async function comprehensiveAudit() {
  console.log('🔍 AUDITORÍA Y CORRECCIÓN COMPLETA DE COURSE IDs\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // 1. Obtener cursos de Firestore
  const firestoreCourses = await fetchFirestoreCourses();

  // 2. Leer órdenes de los JSON
  const almagroPath = path.join(__dirname, '../public/firebase_orders_2025_almagro_v2.json');
  const ciudadJardinPath = path.join(__dirname, '../public/firebase_orders_2025_ciudad_jardin_v2.json');

  console.log('📂 Leyendo órdenes...\n');
  const almagroOrders: OrderJSON[] = JSON.parse(fs.readFileSync(almagroPath, 'utf-8'));
  const ciudadJardinOrders: OrderJSON[] = JSON.parse(fs.readFileSync(ciudadJardinPath, 'utf-8'));

  console.log(`   Almagro: ${almagroOrders.length} órdenes`);
  console.log(`   Ciudad Jardín: ${ciudadJardinOrders.length} órdenes\n`);

  // 3. Analizar y corregir
  const stats = {
    totalOnlineCourseItems: 0,
    correctedIds: 0,
    addedIds: 0,
    alreadyCorrect: 0,
    notFound: 0,
    corrections: [] as Array<{ orderId: string; courseName: string; oldId: string; newId: string }>,
    notFoundCourses: [] as Array<{ orderId: string; courseName: string }>,
  };

  const processOrders = (orders: OrderJSON[]) => {
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.type === 'onlineCourse') {
          stats.totalOnlineCourseItems++;

          const correctCourseId = findCourseIdByName(item.name, firestoreCourses);

          if (!correctCourseId) {
            // No se encontró el curso
            stats.notFound++;
            stats.notFoundCourses.push({
              orderId: order.id,
              courseName: item.name,
            });
            return;
          }

          // Verificar si tiene courseId
          if (!item.courseId) {
            // Agregar courseId
            item.courseId = correctCourseId;
            stats.addedIds++;
            stats.corrections.push({
              orderId: order.id,
              courseName: item.name,
              oldId: 'NONE',
              newId: correctCourseId,
            });
          } else if (item.courseId !== correctCourseId) {
            // Corregir courseId incorrecto
            const oldId = item.courseId;
            item.courseId = correctCourseId;
            stats.correctedIds++;
            stats.corrections.push({
              orderId: order.id,
              courseName: item.name,
              oldId,
              newId: correctCourseId,
            });
          } else {
            // Ya está correcto
            stats.alreadyCorrect++;
          }
        }
      });
    });
  };

  console.log('🔧 Analizando y corrigiendo...\n');
  processOrders(almagroOrders);
  processOrders(ciudadJardinOrders);

  // 4. Guardar archivos corregidos
  const almagroOutputPath = path.join(__dirname, '../public/firebase_orders_2025_almagro_v2_corrected.json');
  const ciudadJardinOutputPath = path.join(__dirname, '../public/firebase_orders_2025_ciudad_jardin_v2_corrected.json');

  fs.writeFileSync(almagroOutputPath, JSON.stringify(almagroOrders, null, 2), 'utf-8');
  fs.writeFileSync(ciudadJardinOutputPath, JSON.stringify(ciudadJardinOrders, null, 2), 'utf-8');

  // 5. Reporte
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 RESULTADO DE LA AUDITORÍA');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`   Total items de cursos online: ${stats.totalOnlineCourseItems}`);
  console.log(`   ✅ Ya correctos: ${stats.alreadyCorrect}`);
  console.log(`   ➕ IDs agregados: ${stats.addedIds}`);
  console.log(`   🔧 IDs corregidos: ${stats.correctedIds}`);
  console.log(`   ❌ No encontrados: ${stats.notFound}\n`);

  if (stats.corrections.length > 0) {
    console.log('📝 CORRECCIONES REALIZADAS (primeras 20):\n');
    stats.corrections.slice(0, 20).forEach((corr, idx) => {
      console.log(`${idx + 1}. Orden: ${corr.orderId}`);
      console.log(`   Curso: ${corr.courseName}`);
      console.log(`   ${corr.oldId === 'NONE' ? 'Agregado' : 'Corregido'}: ${corr.oldId} → ${corr.newId}\n`);
    });
    if (stats.corrections.length > 20) {
      console.log(`   ... y ${stats.corrections.length - 20} más\n`);
    }
  }

  if (stats.notFoundCourses.length > 0) {
    console.log('⚠️  CURSOS NO ENCONTRADOS EN FIRESTORE:\n');
    stats.notFoundCourses.forEach((nf, idx) => {
      console.log(`${idx + 1}. Orden: ${nf.orderId}`);
      console.log(`   Nombre: ${nf.courseName}\n`);
    });
  }

  // Guardar reporte detallado
  const reportPath = path.join(__dirname, '../public/course-ids-correction-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    stats,
    firestoreCoursesTotal: firestoreCourses.length,
    firestoreCoursesIds: firestoreCourses.map(c => ({ id: c.id, title: c.title })),
  }, null, 2), 'utf-8');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ PROCESO COMPLETADO');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📄 Archivos guardados:');
  console.log(`   - ${almagroOutputPath}`);
  console.log(`   - ${ciudadJardinOutputPath}`);
  console.log(`   - ${reportPath}\n`);
  console.log('⚠️  IMPORTANTE:');
  console.log('   Los archivos originales NO fueron modificados.');
  console.log('   Usa los archivos "_corrected" para la migración.\n');
}

comprehensiveAudit().catch(error => {
  console.error('\n❌ ERROR:', error);
  process.exit(1);
});


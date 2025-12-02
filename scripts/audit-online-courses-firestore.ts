/**
 * Script de Auditoría: Cursos Online en Firestore
 * 
 * Consulta la colección 'onlineCourses' en Firestore y lista:
 * - ID de cada curso
 * - Título
 * - Slug
 * - Estado (draft/publish)
 * - Cantidad de lecciones
 * - relatedProductId (si existe)
 */

import { getAdminDb } from '../src/lib/firebase/admin';

interface OnlineCourse {
  id: string;
  wpId: number;
  slug: string;
  title: string;
  shortDescription: string;
  status: string;
  lessons: any[];
  relatedProductId?: string;
  relatedProductWpId?: number;
}

async function auditOnlineCoursesInFirestore() {
  console.log('🔍 AUDITORÍA DE CURSOS ONLINE EN FIRESTORE\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    const db = getAdminDb();
    
    console.log('📡 Consultando Firestore...\n');
    
    // Obtener todos los cursos online
    const snapshot = await db.collection('onlineCourses').get();
    
    console.log(`📦 Total cursos encontrados: ${snapshot.size}\n`);
    
    if (snapshot.empty) {
      console.log('⚠️  No se encontraron cursos en la colección onlineCourses\n');
      return;
    }

    const courses: OnlineCourse[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      courses.push({
        id: doc.id,
        wpId: data.wpId,
        slug: data.slug,
        title: data.title,
        shortDescription: data.shortDescription || '',
        status: data.status,
        lessons: data.lessons || [],
        relatedProductId: data.relatedProductId,
        relatedProductWpId: data.relatedProductWpId,
      });
    });

    // Ordenar por ID
    courses.sort((a, b) => {
      // Intentar ordenar numéricamente primero
      const numA = parseInt(a.id);
      const numB = parseInt(b.id);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      // Si no son números, ordenar alfabéticamente
      return a.id.localeCompare(b.id);
    });

    // Mostrar tabla
    console.log('📋 CURSOS ONLINE EN FIRESTORE:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    courses.forEach((course, idx) => {
      console.log(`${idx + 1}. ID: ${course.id}`);
      console.log(`   Título: ${course.title}`);
      console.log(`   Slug: ${course.slug}`);
      console.log(`   Estado: ${course.status}`);
      console.log(`   Lecciones: ${course.lessons.length}`);
      if (course.relatedProductId) {
        console.log(`   Related Product ID: ${course.relatedProductId}`);
      }
      if (course.relatedProductWpId) {
        console.log(`   Related Product WP ID: ${course.relatedProductWpId}`);
      }
      console.log('');
    });

    // Estadísticas
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 ESTADÍSTICAS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`   Total cursos: ${courses.length}`);
    console.log(`   Estado publish: ${courses.filter(c => c.status === 'publish').length}`);
    console.log(`   Estado draft: ${courses.filter(c => c.status === 'draft').length}`);
    console.log(`   Con lecciones: ${courses.filter(c => c.lessons.length > 0).length}`);
    console.log(`   Sin lecciones: ${courses.filter(c => c.lessons.length === 0).length}`);
    console.log(`   Con relatedProductId: ${courses.filter(c => c.relatedProductId).length}`);
    console.log('');

    // Guardar reporte
    const reportPath = path.join(__dirname, '../public/firestore-online-courses.json');
    fs.writeFileSync(reportPath, JSON.stringify(courses, null, 2), 'utf-8');
    
    console.log(`📄 Reporte completo guardado en: ${reportPath}\n`);

    // IDs disponibles (para referencia rápida)
    console.log('🔑 IDs DISPONIBLES:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    const idsOnly = courses.map(c => c.id).join(', ');
    console.log(`   ${idsOnly}\n`);

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

// Agregar imports necesarios
import * as fs from 'fs';
import * as path from 'path';

auditOnlineCoursesInFirestore().catch(error => {
  console.error('\n❌ ERROR FATAL:', error);
  process.exit(1);
});


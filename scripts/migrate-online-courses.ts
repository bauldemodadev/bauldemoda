/**
 * Script de migración: cursos_online.xml → Firestore onlineCourses
 * 
 * Uso: ts-node scripts/migrate-online-courses.ts
 */

// Cargar variables de entorno
import dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { getAdminDb } from '@/lib/firebase/admin';
import { parseWordPressXML, wpDateToTimestamp } from './utils/xml';
import { extractMeta, extractCategories, parseNumber } from './utils/wpMeta';
import { Timestamp } from 'firebase-admin/firestore';
import type { OnlineCourse, OnlineCourseLesson, OnlineCourseInfoBlock } from '@/types/firestore';

const XML_PATH = 'public/cursos_online.xml';
const COLLECTION_NAME = 'onlineCourses';
const BATCH_SIZE = 500;

/**
 * Extrae lecciones desde los metadatos
 */
function extractLessons(meta: Record<string, any>): OnlineCourseLesson[] {
  const lessons: OnlineCourseLesson[] = [];
  let index = 0;
  
  while (true) {
    const titleKey = `clases_${index}_titulo`;
    const contentKey = `clases_${index}_contenido`;
    const videoKey = `clases_${index}_link_video`;
    const passwordKey = `clases_${index}_contrasena_de_video`;
    const durationKey = `clases_${index}_duracion`;
    
    const title = meta[titleKey];
    if (!title) break; // No hay más lecciones
    
    lessons.push({
      index,
      title: title || '',
      descriptionHtml: meta[contentKey] || '',
      videoUrl: meta[videoKey] || '',
      videoPassword: meta[passwordKey] || undefined,
      duration: meta[durationKey] || undefined,
    });
    
    index++;
  }
  
  return lessons;
}

/**
 * Extrae bloques de información útil desde los metadatos
 */
function extractInfoBlocks(meta: Record<string, any>): OnlineCourseInfoBlock[] {
  const blocks: OnlineCourseInfoBlock[] = [];
  let index = 0;
  
  while (true) {
    const titleKey = `informacion_util_${index}_titulo`;
    const contentKey = `informacion_util_${index}_contenido`;
    
    const title = meta[titleKey];
    if (!title) break; // No hay más bloques
    
    blocks.push({
      index,
      title: title || '',
      contentHtml: meta[contentKey] || '',
    });
    
    index++;
  }
  
  return blocks;
}

async function migrateOnlineCourses() {
  console.log('🚀 Iniciando migración de cursos online...\n');
  
  try {
    // 1. Parsear XML
    console.log(`📖 Leyendo ${XML_PATH}...`);
    const items = parseWordPressXML(XML_PATH);
    console.log(`✅ Encontrados ${items.length} items en el XML\n`);
    
    // 2. Filtrar solo cursos online
    const courses = items.filter((item: any) => {
      const postType = item['wp:post_type'];
      return postType === 'curso-online' || postType === 'cursos_online';
    });
    
    console.log(`📚 Cursos online encontrados: ${courses.length}\n`);
    
    if (courses.length === 0) {
      console.log('⚠️ No se encontraron cursos online para migrar');
      return;
    }
    
    // 3. Obtener instancia de Firestore Admin
    const db = getAdminDb();
    
    let processed = 0;
    let created = 0;
    let updated = 0;
    let errors = 0;
    let batch = db.batch();
    let batchCount = 0;
    
    // 4. Procesar cada curso
    for (const item of courses) {
      try {
        // Extraer datos básicos
        const wpId = parseInt(item['wp:post_id'] || '0', 10);
        if (!wpId || isNaN(wpId)) {
          console.warn(`⚠️ Item sin wpId válido, saltando...`);
          continue;
        }
        
        const slug = item['wp:post_name'] || '';
        const status = item['wp:status'] === 'publish' ? 'publish' : 'draft';
        
        // Extraer metadatos
        const meta = extractMeta(item['wp:postmeta']);
        const title = item.title?.['#text'] || item.title || meta.titulo || 'Sin título';
        
        // Extraer lecciones e info blocks
        const lessons = extractLessons(meta);
        const infoBlocks = extractInfoBlocks(meta);
        
        // Construir objeto OnlineCourse
        const courseData: any = {
          wpId,
          slug,
          title: meta.titulo || title,
          shortDescription: meta.descripcion_corta || '',
          seoDescription: meta._yoast_wpseo_metadesc || '',
          thumbnailMediaId: parseNumber(meta.imagen_principal) || null,
          status,
          relatedProductId: null, // Se completará después si es necesario
          lessons,
          infoBlocks,
          createdAt: wpDateToTimestamp(item['wp:post_date']) || Timestamp.now(),
          updatedAt: wpDateToTimestamp(item['wp:post_modified']) || Timestamp.now(),
        };

        // Agregar relatedProductWpId solo si existe
        if (parseNumber(meta.producto_relacionado)) {
          courseData.relatedProductWpId = parseNumber(meta.producto_relacionado);
        }

        // Limpiar lecciones: eliminar campos undefined
        courseData.lessons = courseData.lessons.map((lesson: any) => {
          const cleanLesson: any = { ...lesson };
          if (cleanLesson.videoPassword === undefined) delete cleanLesson.videoPassword;
          if (cleanLesson.duration === undefined) delete cleanLesson.duration;
          return cleanLesson;
        });

        // Limpiar infoBlocks: eliminar campos undefined
        courseData.infoBlocks = courseData.infoBlocks.map((block: any) => {
          const cleanBlock: any = { ...block };
          return cleanBlock;
        });

        // Filtrar campos undefined antes de guardar
        const course: Omit<OnlineCourse, 'id'> = Object.fromEntries(
          Object.entries(courseData).filter(([_, value]) => value !== undefined)
        ) as Omit<OnlineCourse, 'id'>;
        
        // Usar wpId como docId
        const docRef = db.collection(COLLECTION_NAME).doc(String(wpId));
        
        // Verificar si existe
        const existing = await docRef.get();
        if (existing.exists) {
          batch.update(docRef, course);
          updated++;
        } else {
          batch.set(docRef, course);
          created++;
        }
        
        processed++;
        batchCount++;
        
        // Commit batch cada BATCH_SIZE documentos
        if (batchCount >= BATCH_SIZE) {
          await batch.commit();
          console.log(`✅ Procesados ${processed}/${courses.length} cursos...`);
          batch = db.batch(); // Crear nuevo batch
          batchCount = 0;
        }
      } catch (error) {
        errors++;
        console.error(`❌ Error procesando curso:`, error);
      }
    }
    
    // Commit batch final
    if (batchCount > 0) {
      await batch.commit();
    }
    
    // Resumen
    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMEN DE MIGRACIÓN');
    console.log('='.repeat(50));
    console.log(`✅ Total procesados: ${processed}`);
    console.log(`🆕 Creados: ${created}`);
    console.log(`🔄 Actualizados: ${updated}`);
    console.log(`❌ Errores: ${errors}`);
    console.log('='.repeat(50) + '\n');
    
  } catch (error) {
    console.error('❌ Error fatal en la migración:', error);
    process.exit(1);
  }
}

// Ejecutar migración
migrateOnlineCourses()
  .then(() => {
    console.log('✅ Migración completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });


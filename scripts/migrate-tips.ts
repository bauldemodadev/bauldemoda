/**
 * Script de migración: tips.xml → Firestore tips
 * 
 * Uso: ts-node scripts/migrate-tips.ts
 */

// Cargar variables de entorno
import dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { getAdminDb } from '@/lib/firebase/admin';
import { parseWordPressXML, wpDateToTimestamp } from './utils/xml';
import { extractMeta, extractCategories, parseNumber } from './utils/wpMeta';
import { Timestamp } from 'firebase-admin/firestore';
import type { Tip } from '@/types/firestore';

const XML_PATH = 'public/tips.xml';
const COLLECTION_NAME = 'tips';
const BATCH_SIZE = 500;

async function migrateTips() {
  console.log('🚀 Iniciando migración de tips...\n');
  
  try {
    // 1. Parsear XML
    console.log(`📖 Leyendo ${XML_PATH}...`);
    const items = parseWordPressXML(XML_PATH);
    console.log(`✅ Encontrados ${items.length} items en el XML\n`);
    
    // 2. Filtrar solo tips
    const tips = items.filter((item: any) => {
      const postType = item['wp:post_type'];
      return postType === 'tips';
    });
    
    console.log(`💡 Tips encontrados: ${tips.length}\n`);
    
    if (tips.length === 0) {
      console.log('⚠️ No se encontraron tips para migrar');
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
    
    // 4. Procesar cada tip
    for (const item of tips) {
      try {
        // Extraer datos básicos
        const wpId = parseInt(item['wp:post_id'] || '0', 10);
        if (!wpId || isNaN(wpId)) {
          console.warn(`⚠️ Item sin wpId válido, saltando...`);
          continue;
        }
        
        const slug = item['wp:post_name'] || '';
        const title = item.title?.['#text'] || item.title || 'Sin título';
        const status = item['wp:status'] === 'publish' ? 'publish' : 'draft';
        
        // Extraer contenido (puede estar en CDATA)
        const contentEncoded = item['content:encoded'] || '';
        const contentHtml = typeof contentEncoded === 'string' 
          ? contentEncoded 
          : contentEncoded['__cdata'] || contentEncoded['#text'] || '';
        
        // Extraer metadatos
        const meta = extractMeta(item['wp:postmeta']);
        
        // Extraer categorías
        const categories = extractCategories(item.category);
        const category = categories[0] || '';
        
        // Construir objeto Tip
        const tipData: any = {
          wpId,
          slug,
          title,
          shortDescription: meta.descripcion_corta || '',
          contentHtml,
          category,
          coverMediaId: parseNumber(meta.imagen_portada) || null,
          seoDescription: meta._yoast_wpseo_metadesc || '',
          status,
          createdAt: wpDateToTimestamp(item['wp:post_date']) || Timestamp.now(),
          updatedAt: wpDateToTimestamp(item['wp:post_modified']) || Timestamp.now(),
        };

        // Agregar downloadMediaId solo si existe
        if (parseNumber(meta.archivo_descargable)) {
          tipData.downloadMediaId = parseNumber(meta.archivo_descargable);
        }

        // Filtrar campos undefined antes de guardar
        const tip: Omit<Tip, 'id'> = Object.fromEntries(
          Object.entries(tipData).filter(([_, value]) => value !== undefined)
        ) as Omit<Tip, 'id'>;
        
        // Usar wpId como docId
        const docRef = db.collection(COLLECTION_NAME).doc(String(wpId));
        
        // Verificar si existe
        const existing = await docRef.get();
        if (existing.exists) {
          batch.update(docRef, tip);
          updated++;
        } else {
          batch.set(docRef, tip);
          created++;
        }
        
        processed++;
        batchCount++;
        
        // Commit batch cada BATCH_SIZE documentos
        if (batchCount >= BATCH_SIZE) {
          await batch.commit();
          console.log(`✅ Procesados ${processed}/${tips.length} tips...`);
          batch = db.batch(); // Crear nuevo batch
          batchCount = 0;
        }
      } catch (error) {
        errors++;
        console.error(`❌ Error procesando tip:`, error);
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
migrateTips()
  .then(() => {
    console.log('✅ Migración completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });


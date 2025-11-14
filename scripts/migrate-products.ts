/**
 * Script de migración: productos.xml → Firestore products
 * 
 * Uso: ts-node scripts/migrate-products.ts
 */

// Cargar variables de entorno
import dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { getAdminDb } from '@/lib/firebase/admin';
import { parseWordPressXML, wpDateToTimestamp } from './utils/xml';
import { extractMeta, extractCategories, parseNumber, parseIdArray } from './utils/wpMeta';
import { Timestamp } from 'firebase-admin/firestore';
import type { FirestoreProduct } from '@/types/firestore';

const XML_PATH = 'public/productos.xml';
const COLLECTION_NAME = 'products';
const BATCH_SIZE = 500; // Límite de Firestore

async function migrateProducts() {
  console.log('🚀 Iniciando migración de productos...\n');
  
  try {
    // 1. Parsear XML
    console.log(`📖 Leyendo ${XML_PATH}...`);
    const items = parseWordPressXML(XML_PATH);
    console.log(`✅ Encontrados ${items.length} items en el XML\n`);
    
    // 2. Filtrar solo productos
    const products = items.filter((item: any) => {
      const postType = item['wp:post_type'];
      return postType === 'product';
    });
    
    console.log(`📦 Productos encontrados: ${products.length}\n`);
    
    if (products.length === 0) {
      console.log('⚠️ No se encontraron productos para migrar');
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
    
    // 4. Procesar cada producto
    for (const item of products) {
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
        
        // Extraer metadatos
        const meta = extractMeta(item['wp:postmeta']);
        
        // Extraer categorías
        const categories = extractCategories(item.category);
        const category = categories[0] || '';
        const subcategory = categories.length > 1 ? categories[1] : null;
        
        // Determinar sede desde categorías o meta
        let sede: 'ciudad-jardin' | 'almagro' | 'online' | 'mixto' | null = null;
        const categoryLower = category.toLowerCase();
        if (categoryLower.includes('ciudad jardín') || categoryLower.includes('ciudad-jardin')) {
          sede = 'ciudad-jardin';
        } else if (categoryLower.includes('almagro')) {
          sede = 'almagro';
        } else if (categoryLower.includes('online')) {
          sede = 'online';
        } else if (categories.length > 0) {
          sede = 'mixto';
        }
        
        // Construir objeto FirestoreProduct
        const productData: any = {
          wpId,
          slug,
          sku: meta._sku || null,
          name: title,
          shortDescription: meta.descripcion_corta || '',
          description: item['content:encoded'] || meta.descripcion_corta || '',
          priceText: meta.precio || '',
          localPriceNumber: parseNumber(meta.precio_local) || parseNumber(meta.precio) || null,
          internacionalPriceNumber: parseNumber(meta.precio_internacional) || null,
          durationText: meta.duracion || '',
          locationText: meta.lugar || '',
          detailsHtml: meta.detalles_del_taller || '',
          thumbnailMediaId: parseNumber(meta.imagen_principal) || null,
          galleryMediaIds: parseIdArray(meta._product_image_gallery),
          category,
          subcategory: subcategory || null,
          sede,
          stockStatus: (meta._stock_status as any) || 'instock',
          status,
          relatedCourseId: null,
          createdAt: wpDateToTimestamp(item['wp:post_date']) || Timestamp.now(),
          updatedAt: wpDateToTimestamp(item['wp:post_modified']) || Timestamp.now(),
        };

        // Agregar tipoMadera solo si existe (evitar undefined)
        if (meta.tipo_madera) {
          productData.tipoMadera = meta.tipo_madera;
        }

        // Filtrar campos undefined antes de guardar
        const product: Omit<FirestoreProduct, 'id'> = Object.fromEntries(
          Object.entries(productData).filter(([_, value]) => value !== undefined)
        ) as Omit<FirestoreProduct, 'id'>;
        
        // Usar wpId como docId para tracabilidad
        const docRef = db.collection(COLLECTION_NAME).doc(String(wpId));
        
        // Verificar si existe
        const existing = await docRef.get();
        if (existing.exists) {
          batch.update(docRef, product);
          updated++;
        } else {
          batch.set(docRef, product);
          created++;
        }
        
        processed++;
        batchCount++;
        
        // Commit batch cada BATCH_SIZE documentos
        if (batchCount >= BATCH_SIZE) {
          await batch.commit();
          console.log(`✅ Procesados ${processed}/${products.length} productos...`);
          batch = db.batch(); // Crear nuevo batch
          batchCount = 0;
        }
      } catch (error) {
        errors++;
        console.error(`❌ Error procesando producto:`, error);
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
migrateProducts()
  .then(() => {
    console.log('✅ Migración completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });


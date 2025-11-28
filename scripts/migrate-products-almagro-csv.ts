/**
 * Script para migrar productos de Almagro desde CSV a Firestore
 * 
 * Este script:
 * 1. Lee el archivo productos_almagro.csv
 * 2. Filtra solo productos de Almagro (simple/variable, no variations)
 * 3. Verifica si ya existen en Firestore (por wpId)
 * 4. Migra solo los productos nuevos con sede: 'almagro'
 * 
 * Uso:
 *   npx ts-node -r tsconfig-paths/register --project tsconfig.scripts.json scripts/migrate-products-almagro-csv.ts [--dry-run]
 */

// Cargar variables de entorno
import dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { getAdminDb } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';
import type { FirestoreProduct } from '@/types/firestore';
import { readFileSync } from 'fs';
import { join } from 'path';

const CSV_PATH = 'public/productos_almagro.csv';
const COLLECTION_NAME = 'products';
const BATCH_SIZE = 500; // Límite de Firestore

interface CSVProduct {
  ID: string;
  Tipo: string;
  SKU: string;
  Nombre: string;
  Publicado: string;
  'Descripción corta': string;
  Descripción: string;
  'Precio normal': string;
  Categorías: string;
  Imágenes: string;
  [key: string]: string; // Para otros campos
}

/**
 * Parsea un archivo CSV simple (sin librerías externas)
 */
function parseCSV(filePath: string): CSVProduct[] {
  const absolutePath = join(process.cwd(), filePath);
  const content = readFileSync(absolutePath, 'utf-8');
  
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length < 2) {
    throw new Error('CSV vacío o sin encabezados');
  }
  
  // Parsear encabezados
  const headers = parseCSVLine(lines[0]);
  
  // Parsear filas
  const products: CSVProduct[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue;
    
    const product: any = {};
    headers.forEach((header, index) => {
      product[header] = values[index] || '';
    });
    products.push(product as CSVProduct);
  }
  
  return products;
}

/**
 * Parsea una línea CSV manejando comillas y valores con comas
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quotes
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add last field
  result.push(current.trim());
  
  return result;
}

/**
 * Extrae categorías del string de categorías del CSV
 * Formato: "Cursos Almagro, Cursos Almagro > Intensivos"
 */
function extractCategories(categoriesStr: string): { category: string; subcategory: string | null } {
  if (!categoriesStr || !categoriesStr.trim()) {
    return { category: 'Sin categoría', subcategory: null };
  }
  
  // Dividir por comas y tomar la primera categoría principal
  const parts = categoriesStr.split(',').map(p => p.trim()).filter(Boolean);
  
  if (parts.length === 0) {
    return { category: 'Sin categoría', subcategory: null };
  }
  
  // Buscar categoría principal de Almagro (sin >)
  let mainCategory = parts.find(p => 
    p.toLowerCase().includes('almagro') && 
    !p.includes('>')
  );
  
  // Si no hay categoría principal, buscar la primera sin >
  if (!mainCategory) {
    mainCategory = parts.find(p => !p.includes('>')) || parts[0];
  }
  
  // Buscar subcategoría (con >)
  const subcategoryPart = parts.find(p => p.includes('>'));
  let subcategory: string | null = null;
  
  if (subcategoryPart) {
    const subParts = subcategoryPart.split('>').map(p => p.trim());
    if (subParts.length > 1) {
      // Tomar todo después del primer >
      subcategory = subParts.slice(1).join(' > ');
    }
  }
  
  // Limpiar categoría principal
  let category = mainCategory.replace(/^Cursos\s+Almagro\s*>/gi, '').trim();
  if (!category || category.startsWith('>')) {
    // Si quedó vacío o empieza con >, usar el nombre completo
    category = mainCategory.replace(/>.*$/, '').trim();
  }
  
  // Si aún está vacío, usar un valor por defecto
  if (!category) {
    category = 'Cursos Almagro';
  }
  
  return { category, subcategory };
}

/**
 * Extrae URLs de imágenes del string del CSV
 */
function extractImageUrls(imagesStr: string): string[] {
  if (!imagesStr || !imagesStr.trim()) {
    return [];
  }
  
  return imagesStr
    .split(',')
    .map(url => url.trim())
    .filter(Boolean)
    .map(url => url.replace(/^https?:\/\//, '').replace(/^\/\//, '')); // Normalizar URLs
}

/**
 * Parsea un número desde un string
 */
function parseNumber(value: string | undefined | null): number | null {
  if (!value || value === '' || value === '-1') {
    return null;
  }
  
  // Remover caracteres no numéricos excepto punto y coma
  const cleaned = String(value).replace(/[^\d.,]/g, '');
  if (!cleaned) {
    return null;
  }
  
  // Reemplazar coma por punto para decimales
  const normalized = cleaned.replace(',', '.');
  const parsed = parseFloat(normalized);
  
  return isNaN(parsed) ? null : parsed;
}

/**
 * Genera un slug desde el nombre
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function migrateAlmagroProducts(dryRun: boolean = false) {
  console.log('🚀 Iniciando migración de productos de Almagro desde CSV...\n');
  
  if (dryRun) {
    console.log('⚠️  MODO DRY-RUN: No se realizarán cambios reales\n');
  }
  
  try {
    // 1. Leer y parsear CSV
    console.log(`📖 Leyendo ${CSV_PATH}...`);
    const csvProducts = parseCSV(CSV_PATH);
    console.log(`✅ Encontradas ${csvProducts.length} filas en el CSV\n`);
    
    // 2. Filtrar solo productos simple/variable (no variations)
    const almagroProducts = csvProducts.filter((product) => {
      const tipo = product.Tipo?.toLowerCase() || '';
      
      // Solo productos simple o variable (todos, sin filtrar por categoría)
      return tipo === 'simple' || tipo === 'variable';
    });
    
    console.log(`📦 Productos simple/variable encontrados: ${almagroProducts.length}\n`);
    
    if (almagroProducts.length === 0) {
      console.log('⚠️ No se encontraron productos de Almagro para migrar');
      return;
    }
    
    // 3. Obtener instancia de Firestore Admin
    const db = getAdminDb();
    
    // 4. Verificar qué productos ya existen
    console.log('🔍 Verificando productos existentes en Firestore...\n');
    const existingWpIds = new Set<string>();
    const snapshot = await db.collection(COLLECTION_NAME).get();
    snapshot.forEach((doc) => {
      const data = doc.data() as FirestoreProduct;
      if (data.wpId) {
        existingWpIds.add(String(data.wpId));
      }
    });
    
    console.log(`📊 Productos existentes en Firestore: ${existingWpIds.size}\n`);
    
    // 5. Filtrar productos: nuevos o existentes (vamos a actualizar todos)
    const productsToProcess = almagroProducts.filter((product) => {
      const wpId = product.ID;
      // Incluir todos, tanto nuevos como existentes (los actualizaremos)
      return true;
    });
    
    const newProducts = productsToProcess.filter((product) => {
      const wpId = product.ID;
      return !existingWpIds.has(wpId);
    });
    
    const existingProducts = productsToProcess.filter((product) => {
      const wpId = product.ID;
      return existingWpIds.has(wpId);
    });
    
    console.log(`✨ Productos nuevos a crear: ${newProducts.length}`);
    console.log(`🔄 Productos existentes a actualizar: ${existingProducts.length}`);
    console.log(`📦 Total a procesar: ${productsToProcess.length}\n`);
    
    if (productsToProcess.length === 0) {
      console.log('⚠️ No hay productos para procesar');
      return;
    }
    
    // 6. Mostrar resumen de productos a procesar
    console.log('📋 Productos que se procesarán:\n');
    productsToProcess.slice(0, 10).forEach((product, index) => {
      const { category, subcategory } = extractCategories(product.Categorías || '');
      const isNew = !existingWpIds.has(product.ID);
      console.log(`   ${index + 1}. ${product.Nombre} ${isNew ? '(NUEVO)' : '(ACTUALIZAR)'}`);
      console.log(`      ID: ${product.ID} | Tipo: ${product.Tipo} | Categoría: ${category}${subcategory ? ` / ${subcategory}` : ''}`);
    });
    if (productsToProcess.length > 10) {
      console.log(`   ... y ${productsToProcess.length - 10} más\n`);
    } else {
      console.log('');
    }
    
    if (dryRun) {
      console.log('⚠️  Este fue un DRY-RUN. Para aplicar los cambios, ejecuta sin --dry-run\n');
      return;
    }
    
    // 7. Migrar/Actualizar productos
    console.log('🔄 Migrando/Actualizando productos en Firestore...\n');
    
    let processed = 0;
    let created = 0;
    let updated = 0;
    let errors = 0;
    let batch = db.batch();
    let batchCount = 0;
    
    for (const csvProduct of productsToProcess) {
      try {
        const wpId = parseInt(csvProduct.ID, 10);
        if (!wpId || isNaN(wpId)) {
          console.warn(`⚠️ Producto sin ID válido, saltando: ${csvProduct.Nombre}`);
          continue;
        }
        
        const { category, subcategory } = extractCategories(csvProduct.Categorías || '');
        const imageUrls = extractImageUrls(csvProduct.Imágenes || '');
        const price = parseNumber(csvProduct['Precio normal']);
        const isPublished = csvProduct.Publicado === '1';
        
        // Construir objeto FirestoreProduct
        const productData: Omit<FirestoreProduct, 'id'> = {
          wpId,
          slug: generateSlug(csvProduct.Nombre),
          sku: csvProduct.SKU?.trim() || null,
          name: csvProduct.Nombre || 'Sin nombre',
          shortDescription: csvProduct['Descripción corta'] || '',
          description: csvProduct.Descripción || csvProduct['Descripción corta'] || '',
          priceText: price ? `$${price.toLocaleString('es-AR')}` : '',
          localPriceNumber: price,
          durationText: '',
          locationText: 'Almagro',
          detailsHtml: csvProduct.Descripción || '',
          thumbnailMediaId: imageUrls[0] || null,
          galleryMediaIds: imageUrls.length > 1 ? imageUrls.slice(1) : [],
          category,
          subcategory: subcategory || null,
          sede: 'almagro',
          stockStatus: 'instock',
          status: isPublished ? 'publish' : 'draft',
          relatedCourseId: null,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };
        
        // Usar wpId como docId para tracabilidad
        const docRef = db.collection(COLLECTION_NAME).doc(String(wpId));
        const exists = existingWpIds.has(String(wpId));
        
        if (exists) {
          batch.update(docRef, productData);
          updated++;
        } else {
          batch.set(docRef, productData);
          created++;
        }
        
        processed++;
        batchCount++;
        
        // Commit batch cada BATCH_SIZE documentos
        if (batchCount >= BATCH_SIZE) {
          await batch.commit();
          console.log(`✅ Procesados ${processed}/${newProducts.length} productos...`);
          batch = db.batch();
          batchCount = 0;
        }
      } catch (error) {
        console.error(`❌ Error procesando producto ${csvProduct.ID}:`, error);
        errors++;
      }
    }
    
    // Commit último batch
    if (batchCount > 0) {
      await batch.commit();
    }
    
    // 8. Resumen final
    console.log('\n' + '='.repeat(60));
    console.log('✅ MIGRACIÓN COMPLETADA');
    console.log('='.repeat(60));
    console.log(`\n📊 Resultados:`);
    console.log(`   ✅ Creados: ${created}`);
    console.log(`   🔄 Actualizados: ${updated}`);
    console.log(`   ❌ Errores: ${errors}`);
    console.log(`\n✅ Todos los productos del CSV han sido procesados con sede: 'almagro'\n`);
    
  } catch (error) {
    console.error('\n❌ Error ejecutando migración:', error);
    if (error instanceof Error) {
      console.error('Stack:', error.stack);
    }
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run') || args.includes('-d');
  
  await migrateAlmagroProducts(dryRun);
}

// Ejecutar script
if (require.main === module) {
  main().catch((error) => {
    console.error('Error fatal:', error);
    process.exit(1);
  });
}


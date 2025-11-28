/**
 * Script para actualizar productos a Ciudad Jardín
 * 
 * Este script:
 * 1. Lee todos los productos de Firestore (excluyendo cursos online)
 * 2. Muestra un resumen del estado actual
 * 3. Actualiza el campo 'sede' a 'ciudad-jardin' para todos los productos
 * 
 * Uso:
 *   # Modo dry-run (solo lectura, no hace cambios):
 *   npx ts-node -r tsconfig-paths/register --project tsconfig.scripts.json scripts/update-products-ciudad-jardin.ts --dry-run
 * 
 *   # Aplicar cambios reales:
 *   npx ts-node -r tsconfig-paths/register --project tsconfig.scripts.json scripts/update-products-ciudad-jardin.ts
 */

// Cargar variables de entorno
import dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { getAdminDb } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';
import type { FirestoreProduct } from '@/types/firestore';

const COLLECTION_NAME = 'products';
const BATCH_SIZE = 500; // Límite de Firestore

interface ProductSummary {
  id: string;
  name: string;
  sede: string | null | undefined;
  category: string;
  subcategory: string | null;
  status: string;
}

interface SummaryStats {
  total: number;
  bySede: Record<string, number>;
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
  products: ProductSummary[];
}

async function readAllProducts(): Promise<SummaryStats> {
  console.log('📖 Leyendo todos los productos de Firestore...\n');
  
  const db = getAdminDb();
  const snapshot = await db.collection(COLLECTION_NAME).get();
  
  console.log(`✅ Encontrados ${snapshot.size} productos en total\n`);
  
  const stats: SummaryStats = {
    total: snapshot.size,
    bySede: {},
    byCategory: {},
    byStatus: {},
    products: [],
  };
  
  snapshot.forEach((doc) => {
    const data = doc.data() as FirestoreProduct;
    
    const summary: ProductSummary = {
      id: doc.id,
      name: data.name || 'Sin nombre',
      sede: data.sede || null,
      category: data.category || 'Sin categoría',
      subcategory: data.subcategory || null,
      status: data.status || 'draft',
    };
    
    stats.products.push(summary);
    
    // Contar por sede
    const sedeKey = summary.sede || 'null';
    stats.bySede[sedeKey] = (stats.bySede[sedeKey] || 0) + 1;
    
    // Contar por categoría
    const categoryKey = summary.category;
    stats.byCategory[categoryKey] = (stats.byCategory[categoryKey] || 0) + 1;
    
    // Contar por status
    const statusKey = summary.status;
    stats.byStatus[statusKey] = (stats.byStatus[statusKey] || 0) + 1;
  });
  
  return stats;
}

function printSummary(stats: SummaryStats) {
  console.log('='.repeat(60));
  console.log('📊 RESUMEN DE PRODUCTOS EN FIRESTORE');
  console.log('='.repeat(60));
  console.log(`\n📦 Total de productos: ${stats.total}\n`);
  
  console.log('🏢 Distribución por Sede:');
  Object.entries(stats.bySede)
    .sort(([, a], [, b]) => b - a)
    .forEach(([sede, count]) => {
      const sedeLabel = sede === 'null' ? '(sin sede)' : sede;
      const percentage = ((count / stats.total) * 100).toFixed(1);
      console.log(`   ${sedeLabel.padEnd(20)}: ${count.toString().padStart(4)} (${percentage}%)`);
    });
  
  console.log('\n📁 Distribución por Categoría:');
  Object.entries(stats.byCategory)
    .sort(([, a], [, b]) => b - a)
    .forEach(([category, count]) => {
      const percentage = ((count / stats.total) * 100).toFixed(1);
      console.log(`   ${category.padEnd(30)}: ${count.toString().padStart(4)} (${percentage}%)`);
    });
  
  // Mostrar algunos ejemplos de productos
  console.log('\n📋 Ejemplos de productos (primeros 5):');
  stats.products.slice(0, 5).forEach((product, index) => {
    console.log(`   ${index + 1}. ${product.name}`);
    console.log(`      Sede actual: ${product.sede || '(sin sede)'}`);
    console.log(`      Categoría: ${product.category}${product.subcategory ? ` / ${product.subcategory}` : ''}`);
    console.log(`      Status: ${product.status}`);
  });
  
  console.log('\n📝 Distribución por Status:');
  Object.entries(stats.byStatus)
    .sort(([, a], [, b]) => b - a)
    .forEach(([status, count]) => {
      const percentage = ((count / stats.total) * 100).toFixed(1);
      console.log(`   ${status.padEnd(10)}: ${count.toString().padStart(4)} (${percentage}%)`);
    });
  
  console.log('\n' + '='.repeat(60));
}

async function updateProductsToCiudadJardin(dryRun: boolean = false): Promise<void> {
  console.log('\n🔄 Iniciando actualización de productos...\n');
  
  if (dryRun) {
    console.log('⚠️  MODO DRY-RUN: No se realizarán cambios reales\n');
  }
  
  const db = getAdminDb();
  const snapshot = await db.collection(COLLECTION_NAME).get();
  
  let updated = 0;
  let skipped = 0;
  let errors = 0;
  let batch = db.batch();
  let batchCount = 0;
  
  snapshot.forEach((doc) => {
    try {
      const data = doc.data() as FirestoreProduct;
      const currentSede = data.sede;
      
      // Si ya tiene sede 'ciudad-jardin', saltar
      if (currentSede === 'ciudad-jardin') {
        skipped++;
        return;
      }
      
      // Preparar actualización
      const updateData: Partial<FirestoreProduct> = {
        sede: 'ciudad-jardin',
        updatedAt: Timestamp.now(),
      };
      
      if (!dryRun) {
        const docRef = db.collection(COLLECTION_NAME).doc(doc.id);
        batch.update(docRef, updateData);
        batchCount++;
        
        // Si el batch está lleno, ejecutarlo
        if (batchCount >= BATCH_SIZE) {
          batch.commit();
          batch = db.batch();
          batchCount = 0;
        }
      }
      
      updated++;
      
      if (updated % 100 === 0) {
        console.log(`   Procesados ${updated} productos...`);
      }
    } catch (error) {
      console.error(`❌ Error procesando producto ${doc.id}:`, error);
      errors++;
    }
  });
  
  // Ejecutar el último batch si hay cambios pendientes
  if (!dryRun && batchCount > 0) {
    await batch.commit();
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ ACTUALIZACIÓN COMPLETADA');
  console.log('='.repeat(60));
  console.log(`\n📊 Resultados:`);
  console.log(`   ✅ Actualizados: ${updated}`);
  console.log(`   ⏭️  Omitidos (ya tienen ciudad-jardin): ${skipped}`);
  console.log(`   ❌ Errores: ${errors}`);
  
  if (dryRun) {
    console.log(`\n⚠️  Este fue un DRY-RUN. Para aplicar los cambios, ejecuta sin --dry-run`);
  } else {
    console.log(`\n✅ Todos los productos han sido actualizados a sede: 'ciudad-jardin'`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run') || args.includes('-d');
  
  try {
    // 1. Leer todos los productos
    const stats = await readAllProducts();
    
    // 2. Mostrar resumen
    printSummary(stats);
    
    // 3. Preguntar confirmación (solo si no es dry-run)
    if (!dryRun) {
      console.log('\n⚠️  ADVERTENCIA: Este script actualizará TODOS los productos a sede: "ciudad-jardin"');
      console.log('   Presiona Ctrl+C para cancelar, o espera 5 segundos para continuar...\n');
      
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    // 4. Actualizar productos
    await updateProductsToCiudadJardin(dryRun);
    
    // 5. Si no fue dry-run, mostrar resumen final
    if (!dryRun) {
      console.log('\n📖 Leyendo productos actualizados para verificar...\n');
      const finalStats = await readAllProducts();
      printSummary(finalStats);
    }
    
    console.log('\n✅ Script completado exitosamente\n');
  } catch (error) {
    console.error('\n❌ Error ejecutando script:', error);
    if (error instanceof Error) {
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }
}

// Ejecutar script
if (require.main === module) {
  main();
}


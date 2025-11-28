/**
 * Script para eliminar productos con sede "almagro" de Firestore
 * 
 * Uso:
 *   npx ts-node -r tsconfig-paths/register --project tsconfig.scripts.json scripts/delete-products-almagro.ts [--dry-run]
 */

import dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { getAdminDb } from '@/lib/firebase/admin';

const COLLECTION_NAME = 'products';
const BATCH_SIZE = 500;

async function deleteAlmagroProducts(dryRun: boolean = false) {
  console.log('🗑️  Iniciando eliminación de productos con sede "almagro"...\n');
  
  if (dryRun) {
    console.log('⚠️  MODO DRY-RUN: No se realizarán cambios reales\n');
  }
  
  const db = getAdminDb();
  const snapshot = await db.collection(COLLECTION_NAME)
    .where('sede', '==', 'almagro')
    .get();
  
  console.log(`📊 Encontrados ${snapshot.size} productos con sede "almagro"\n`);
  
  if (snapshot.size === 0) {
    console.log('✅ No hay productos con sede "almagro" para eliminar');
    return;
  }
  
  // Mostrar algunos productos que se eliminarán
  console.log('📋 Productos que se eliminarán:\n');
  snapshot.docs.slice(0, 10).forEach((doc, index) => {
    const data = doc.data();
    console.log(`   ${index + 1}. ${data.name} (ID: ${doc.id}, wpId: ${data.wpId})`);
  });
  if (snapshot.size > 10) {
    console.log(`   ... y ${snapshot.size - 10} más\n`);
  } else {
    console.log('');
  }
  
  if (dryRun) {
    console.log('⚠️  Este fue un DRY-RUN. Para aplicar los cambios, ejecuta sin --dry-run\n');
    return;
  }
  
  console.log('🔄 Eliminando productos...\n');
  
  let deleted = 0;
  let batch = db.batch();
  let batchCount = 0;
  
  snapshot.forEach((doc) => {
    batch.delete(doc.ref);
    deleted++;
    batchCount++;
    
    if (batchCount >= BATCH_SIZE) {
      batch.commit();
      console.log(`✅ Eliminados ${deleted}/${snapshot.size} productos...`);
      batch = db.batch();
      batchCount = 0;
    }
  });
  
  if (batchCount > 0) {
    await batch.commit();
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ ELIMINACIÓN COMPLETADA');
  console.log('='.repeat(60));
  console.log(`\n📊 Resultados:`);
  console.log(`   🗑️  Eliminados: ${deleted}\n`);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run') || args.includes('-d');
  
  await deleteAlmagroProducts(dryRun);
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Error fatal:', error);
    process.exit(1);
  });
}


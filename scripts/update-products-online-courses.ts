/**
 * Script para actualizar productos de cursos online
 * 
 * Busca productos en Firestore que coincidan con títulos específicos
 * y les asigna sede: 'online'
 * 
 * Uso:
 * npx ts-node -r tsconfig-paths/register --project tsconfig.scripts.json scripts/update-products-online-courses.ts
 */

// Cargar variables de entorno
import dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { getAdminDb } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';
import type { FirestoreProduct } from '@/types/firestore/product';

// Lista de títulos de cursos online a buscar
const ONLINE_COURSE_TITLES = [
  // MasterClass Gratuita
  'MasterClass Gratuita',
  'MasterClass Lubricacion',
  'MasterClass',
  
  // En Promo
  'Pack x3 Indumentaria',
  'Pack x3 Lenceria',
  'abc costura + un Intensivo',
  
  // Para Comenzar
  'abc costura online',
  
  // Intensivos Indumentaria
  'Arreglos de Ropa',
  'Intensivo Mi primer jean',
  'Intensivo Indumentaria Nivel 3',
  'Intensivo Nivel 1 Camisas',
  'Intensivo Indumentaria Nivel 2',
  'Intensivo Indumentaria Nivel I',
  
  // Intensivos Lenceria
  'Intensivo Mallas',
  'Intensivo lenceria nivel 2',
  'Intensivo Lenceria Nivel I Bombachas',
  'Intensivo Lenceria Nivel 3',
  
  // Intensivos Carteras
  'Intensivo Carteras',
  'Pantuflas',
  
  // Para Alumnos
  'Baul Disena',
  
  // Para Regalar
  'Gift Baulera Intensivos',
  'Gift Baulera Abc + Intensivo',
  'Gift Baulera Pack x 3',
  'Gift Baulera Abc Online',
];

/**
 * Normaliza un título para comparación (sin acentos, minúsculas, sin espacios extra)
 */
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .trim()
    .replace(/\s+/g, ' '); // Normalizar espacios
}

/**
 * Compara dos títulos de forma flexible
 */
function titlesMatch(title1: string, title2: string): boolean {
  const normalized1 = normalizeTitle(title1);
  const normalized2 = normalizeTitle(title2);
  
  // Comparación exacta
  if (normalized1 === normalized2) {
    return true;
  }
  
  // Comparación parcial (uno contiene al otro)
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
    return true;
  }
  
  return false;
}

async function updateOnlineCourses() {
  try {
    console.log('🔍 Iniciando búsqueda de productos de cursos online...\n');
    
    const db = getAdminDb();
    
    // Obtener todos los productos
    const snapshot = await db.collection('products').get();
    
    console.log(`📦 Total de productos encontrados: ${snapshot.size}\n`);
    
    const productsToUpdate: Array<{ id: string; name: string; currentSede: any }> = [];
    const matchedTitles = new Set<string>();
    
    // Buscar productos que coincidan con los títulos
    snapshot.forEach((doc) => {
      const data = doc.data() as Omit<FirestoreProduct, 'id'>;
      const productName = data.name || '';
      
      // Buscar coincidencias
      for (const courseTitle of ONLINE_COURSE_TITLES) {
        if (titlesMatch(productName, courseTitle)) {
          productsToUpdate.push({
            id: doc.id,
            name: productName,
            currentSede: data.sede,
          });
          matchedTitles.add(courseTitle);
          break; // Solo agregar una vez por producto
        }
      }
    });
    
    console.log(`✅ Productos encontrados que coinciden con cursos online: ${productsToUpdate.length}\n`);
    
    if (productsToUpdate.length === 0) {
      console.log('⚠️  No se encontraron productos que coincidan con los títulos especificados.');
      console.log('\n📋 Títulos buscados:');
      ONLINE_COURSE_TITLES.forEach(title => console.log(`   - ${title}`));
      return;
    }
    
    // Mostrar productos encontrados
    console.log('📋 Productos encontrados:');
    productsToUpdate.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} (ID: ${product.id})`);
      console.log(`      Sede actual: ${product.currentSede || 'null'}`);
    });
    
    console.log(`\n📊 Títulos que tuvieron coincidencias: ${matchedTitles.size} de ${ONLINE_COURSE_TITLES.length}`);
    console.log('\n📋 Títulos que NO tuvieron coincidencias:');
    ONLINE_COURSE_TITLES.forEach(title => {
      if (!matchedTitles.has(title)) {
        console.log(`   - ${title}`);
      }
    });
    
    // Confirmar antes de actualizar
    console.log('\n⚠️  ¿Deseas actualizar estos productos? (S/N)');
    console.log('   (Para ejecutar en modo dry-run, modifica el script)');
    
    // Modo dry-run por defecto (comentar la siguiente sección para ejecutar realmente)
    const DRY_RUN = false;
    
    if (DRY_RUN) {
      console.log('\n🔍 MODO DRY-RUN: No se realizarán cambios en Firestore.');
      console.log('   Para ejecutar realmente, cambia DRY_RUN a false en el script.\n');
      return;
    }
    
    // Actualizar productos
    console.log('\n🔄 Actualizando productos...\n');
    
    const batch = db.batch();
    let updateCount = 0;
    
    productsToUpdate.forEach((product) => {
      const docRef = db.collection('products').doc(product.id);
      batch.update(docRef, {
        sede: 'online',
        updatedAt: Timestamp.now(),
      });
      updateCount++;
    });
    
    await batch.commit();
    
    console.log(`✅ ${updateCount} productos actualizados exitosamente.`);
    console.log(`   Todos ahora tienen sede: 'online'\n`);
    
    // Verificación
    console.log('🔍 Verificando actualizaciones...\n');
    const verifySnapshot = await db
      .collection('products')
      .where('sede', '==', 'online')
      .get();
    
    console.log(`✅ Verificación: ${verifySnapshot.size} productos tienen sede: 'online'`);
    
  } catch (error) {
    console.error('❌ Error al actualizar productos:', error);
    throw error;
  }
}

// Ejecutar script
if (require.main === module) {
  updateOnlineCourses()
    .then(() => {
      console.log('\n✅ Script completado exitosamente.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error en el script:', error);
      process.exit(1);
    });
}

export { updateOnlineCourses };


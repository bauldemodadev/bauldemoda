/**
 * Script: Enlazar Productos con Cursos Online
 * 
 * Este script:
 * 1. Obtiene todos los productos de la página de cursos online
 * 2. Obtiene todos los cursos online de Firestore
 * 3. Busca coincidencias por slug, wpId, o nombre
 * 4. Actualiza productos con relatedCourseId
 * 5. Actualiza cursos online con relatedProductId
 * 
 * Ejecutar: npx tsx scripts/enlazar-productos-cursos-online.ts
 */

import { getAdminDb } from '../src/lib/firebase/admin';
import { getAllOnlineCoursesFromFirestore } from '../src/lib/firestore/onlineCourses';
import { getProductsByIdsFromFirestore } from '../src/lib/firestore/products';
import { Timestamp } from 'firebase-admin/firestore';

// IDs de productos en la página de cursos online
const PRODUCT_IDS_FROM_PAGE = {
  masterClassGratuita: ["6655", "5015"],
  enPromo: ["1155", "1159", "10483"],
  paraComenzar: ["0L5wz3t9FJXLPehXpVUk", "10483"],
  intensivosIndumentaria: ["9556", "1925", "1155", "992", "1217", "2073", "1783"],
  intensivosLenceria: ["2036", "1159", "986", "1794", "3316"],
  intensivosCarteras: ["1256", "1134"],
  paraAlumnos: ["11567", "1134"],
  paraRegalar: ["3833", "6361", "6360", "1492"],
};

// Obtener todos los IDs únicos
function getAllProductIds(): string[] {
  const allIds = new Set<string>();
  Object.values(PRODUCT_IDS_FROM_PAGE).forEach(ids => {
    ids.forEach(id => allIds.add(id));
  });
  return Array.from(allIds);
}

// Normalizar texto para comparación
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9]/g, '') // Solo letras y números
    .trim();
}

// Buscar coincidencia entre producto y curso
function encontrarCoincidencia(
  product: any,
  courses: any[]
): { course: any; metodo: string } | null {
  // 1. Buscar por relatedCourseId existente
  if (product.relatedCourseId) {
    const curso = courses.find(c => c.id === product.relatedCourseId);
    if (curso) {
      return { course: curso, metodo: 'relatedCourseId existente' };
    }
  }

  // 2. Buscar por slug (product.id === course.slug)
  const cursoPorSlug = courses.find(c => c.slug === product.id);
  if (cursoPorSlug) {
    return { course: cursoPorSlug, metodo: 'slug === product.id' };
  }

  // 3. Buscar por wpId (product.wpId === course.relatedProductWpId)
  if (product.wpId) {
    const cursoPorWpId = courses.find(c => c.relatedProductWpId === product.wpId);
    if (cursoPorWpId) {
      return { course: cursoPorWpId, metodo: 'relatedProductWpId === product.wpId' };
    }
  }

  // 4. Buscar por nombre (normalizado)
  const productNameNormalized = normalizeText(product.name);
  for (const course of courses) {
    const courseTitleNormalized = normalizeText(course.title);
    
    // Coincidencia exacta
    if (productNameNormalized === courseTitleNormalized) {
      return { course, metodo: 'nombre exacto' };
    }
    
    // Coincidencia parcial (producto contiene curso o viceversa)
    if (
      productNameNormalized.includes(courseTitleNormalized) ||
      courseTitleNormalized.includes(productNameNormalized)
    ) {
      // Verificar que la coincidencia sea significativa (más de 10 caracteres)
      if (Math.max(productNameNormalized.length, courseTitleNormalized.length) > 10) {
        return { course, metodo: 'nombre parcial' };
      }
    }
  }

  return null;
}

async function enlazarProductosCursosOnline() {
  console.log('🔗 Iniciando enlace de productos con cursos online...\n');

  try {
    const db = getAdminDb();
    const productIds = getAllProductIds();
    
    console.log(`📦 Productos en página: ${productIds.length} IDs únicos\n`);

    // 1. Obtener productos
    console.log('📥 Obteniendo productos desde Firestore...');
    const products = await getProductsByIdsFromFirestore(productIds);
    console.log(`✅ Productos encontrados: ${products.length}/${productIds.length}\n`);

    const foundProductIds = new Set(products.map(p => p.id));
    const notFoundProducts = productIds.filter(id => !foundProductIds.has(id));
    
    if (notFoundProducts.length > 0) {
      console.log('⚠️  Productos NO encontrados:');
      notFoundProducts.forEach(id => console.log(`  - ${id}`));
      console.log('');
    }

    // 2. Obtener cursos online
    console.log('📚 Obteniendo cursos online desde Firestore...');
    const onlineCourses = await getAllOnlineCoursesFromFirestore();
    console.log(`✅ Cursos online encontrados: ${onlineCourses.length}\n`);

    // 3. Buscar coincidencias
    console.log('🔍 Buscando coincidencias...\n');
    
    const coincidencias: {
      product: any;
      course: any;
      metodo: string;
      necesitaActualizacion: boolean;
    }[] = [];

    for (const product of products) {
      const coincidencia = encontrarCoincidencia(product, onlineCourses);
      
      if (coincidencia) {
        const necesitaActualizacion = 
          !(product as any).relatedCourseId || 
          (product as any).relatedCourseId !== coincidencia.course.id;
        
        coincidencias.push({
          product,
          course: coincidencia.course,
          metodo: coincidencia.metodo,
          necesitaActualizacion,
        });
      }
    }

    // 4. Mostrar resultados
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 RESULTADOS DE BÚSQUEDA');
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log(`✅ Coincidencias encontradas: ${coincidencias.length}`);
    console.log(`🔄 Necesitan actualización: ${coincidencias.filter(c => c.necesitaActualizacion).length}\n`);

    // Agrupar por método
    const porMetodo = new Map<string, typeof coincidencias>();
    coincidencias.forEach(c => {
      if (!porMetodo.has(c.metodo)) {
        porMetodo.set(c.metodo, []);
      }
      porMetodo.get(c.metodo)!.push(c);
    });

    console.log('📋 Coincidencias por método:');
    porMetodo.forEach((coincidencias, metodo) => {
      console.log(`  ${metodo}: ${coincidencias.length}`);
    });
    console.log('');

    // Detalle de coincidencias
    console.log('📋 DETALLE DE COINCIDENCIAS:\n');
    coincidencias.forEach((c, index) => {
      const estado = c.necesitaActualizacion ? '🔄' : '✅';
      console.log(`${estado} ${index + 1}. ${c.product.name} (ID: ${c.product.id})`);
      console.log(`   → ${c.course.title} (ID: ${c.course.id}, Slug: ${c.course.slug})`);
      console.log(`   Método: ${c.metodo}`);
      if (c.necesitaActualizacion) {
        console.log(`   ⚠️  Necesita actualizar relatedCourseId`);
      }
      console.log('');
    });

    // Productos sin coincidencia
    const productosConCoincidencia = new Set(coincidencias.map(c => c.product.id));
    const productosSinCoincidencia = products.filter(
      p => !productosConCoincidencia.has(p.id)
    );

    if (productosSinCoincidencia.length > 0) {
      console.log('❌ PRODUCTOS SIN COINCIDENCIA:\n');
      productosSinCoincidencia.forEach(p => {
        console.log(`  - ${p.name} (ID: ${p.id})`);
      });
      console.log('');
    }

    // 5. Actualizar productos y cursos
    const productosAActualizar = coincidencias.filter(c => c.necesitaActualizacion);
    
    if (productosAActualizar.length === 0) {
      console.log('✅ Todos los productos ya tienen relatedCourseId correcto.\n');
      return;
    }

    console.log('═══════════════════════════════════════════════════════════');
    console.log('🔄 ACTUALIZACIÓN DE RELACIONES');
    console.log('═══════════════════════════════════════════════════════════\n');

    // Modo dry-run por defecto
    const DRY_RUN = process.env.DRY_RUN !== 'false';
    
    if (DRY_RUN) {
      console.log('🔍 MODO DRY-RUN: No se realizarán cambios en Firestore.');
      console.log('   Para ejecutar realmente, establece DRY_RUN=false\n');
    } else {
      console.log('⚠️  MODO EJECUCIÓN: Se actualizarán los documentos en Firestore.\n');
    }

    // Actualizar productos
    console.log('📦 Actualizando productos...\n');
    const batchProducts = db.batch();
    let productosActualizados = 0;

    for (const coincidencia of productosAActualizar) {
      const productRef = db.collection('products').doc(coincidencia.product.id);
      batchProducts.update(productRef, {
        relatedCourseId: coincidencia.course.id,
        updatedAt: Timestamp.now(),
      });
      productosActualizados++;
      
      console.log(`  ✅ ${coincidencia.product.name} → ${coincidencia.course.title}`);
    }

    if (!DRY_RUN && productosActualizados > 0) {
      await batchProducts.commit();
      console.log(`\n✅ ${productosActualizados} productos actualizados.\n`);
    }

    // Actualizar cursos online
    console.log('📚 Actualizando cursos online...\n');
    const batchCourses = db.batch();
    let cursosActualizados = 0;
    const cursosAActualizar = new Map<string, { course: any; productId: string }>();

    // Agrupar por curso (un curso puede tener múltiples productos)
    for (const coincidencia of coincidencias) {
      const courseId = coincidencia.course.id;
      if (!cursosAActualizar.has(courseId)) {
        cursosAActualizar.set(courseId, {
          course: coincidencia.course,
          productId: coincidencia.product.id,
        });
      }
    }

    for (const [courseId, data] of Array.from(cursosAActualizar.entries())) {
      const courseRef = db.collection('onlineCourses').doc(courseId);
      const updateData: any = {
        updatedAt: Timestamp.now(),
      };

      // Solo actualizar relatedProductId si no existe o es diferente
      if (!data.course.relatedProductId || data.course.relatedProductId !== data.productId) {
        updateData.relatedProductId = data.productId;
        batchCourses.update(courseRef, updateData);
        cursosActualizados++;
        console.log(`  ✅ ${data.course.title} → ${data.productId}`);
      }
    }

    if (!DRY_RUN && cursosActualizados > 0) {
      await batchCourses.commit();
      console.log(`\n✅ ${cursosActualizados} cursos online actualizados.\n`);
    }

    // Resumen final
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 RESUMEN FINAL');
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log(`✅ Coincidencias encontradas: ${coincidencias.length}`);
    console.log(`🔄 Productos actualizados: ${DRY_RUN ? '0 (dry-run)' : productosActualizados}`);
    console.log(`🔄 Cursos actualizados: ${DRY_RUN ? '0 (dry-run)' : cursosActualizados}`);
    console.log(`❌ Productos sin coincidencia: ${productosSinCoincidencia.length}\n`);

    if (productosSinCoincidencia.length > 0) {
      console.log('💡 RECOMENDACIONES:');
      console.log('   - Revisar manualmente los productos sin coincidencia');
      console.log('   - Verificar si necesitan un curso online asociado');
      console.log('   - Crear cursos online si faltan\n');
    }

    console.log('✅ Proceso completado exitosamente.\n');

  } catch (error) {
    console.error('❌ Error durante el proceso:', error);
    throw error;
  }
}

// Ejecutar
if (require.main === module) {
  enlazarProductosCursosOnline()
    .then(() => {
      console.log('✅ Script finalizado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error fatal:', error);
      process.exit(1);
    });
}

export { enlazarProductosCursosOnline };


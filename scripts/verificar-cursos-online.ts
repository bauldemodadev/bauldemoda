/**
 * Script de verificación: Compara IDs de productos en página de cursos online
 * con slugs de cursos online en Firestore
 * 
 * Ejecutar: npx tsx scripts/verificar-cursos-online.ts
 */

import { getAdminDb } from '../src/lib/firebase/admin';
import { getAllOnlineCoursesFromFirestore } from '../src/lib/firestore/onlineCourses';
import { getProductsByIdsFromFirestore } from '../src/lib/firestore/products';

// IDs de productos en la página de cursos online
const PRODUCT_IDS_FROM_PAGE = {
  masterClassGratuita: ["6655", "5015"],
  enPromo: ["1155", "1159", "10483"],
  paraComenzar: ["0L5wz3t9FJXLPehXpVUk", "10483"], // Nota: hay un ID de Firestore aquí
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

async function verificarCursosOnline() {
  console.log('🔍 Iniciando verificación de cursos online...\n');

  try {
    // 1. Obtener todos los productos de la página
    const productIds = getAllProductIds();
    console.log(`📦 Productos en página: ${productIds.length} IDs únicos\n`);
    console.log('IDs de productos:');
    productIds.forEach(id => console.log(`  - ${id}`));
    console.log('');

    // 2. Obtener productos desde Firestore
    console.log('📥 Obteniendo productos desde Firestore...');
    const products = await getProductsByIdsFromFirestore(productIds);
    console.log(`✅ Productos encontrados: ${products.length}/${productIds.length}\n`);

    // Productos no encontrados
    const foundProductIds = new Set(products.map(p => p.id));
    const notFoundProducts = productIds.filter(id => !foundProductIds.has(id));
    
    if (notFoundProducts.length > 0) {
      console.log('⚠️  Productos NO encontrados en Firestore:');
      notFoundProducts.forEach(id => console.log(`  - ${id}`));
      console.log('');
    }

    // 3. Obtener todos los cursos online desde Firestore
    console.log('📚 Obteniendo cursos online desde Firestore...');
    const onlineCourses = await getAllOnlineCoursesFromFirestore();
    console.log(`✅ Cursos online encontrados: ${onlineCourses.length}\n`);

    // 4. Analizar relaciones
    console.log('🔗 Analizando relaciones Product → OnlineCourse...\n');

    const db = getAdminDb();
    const resultados: {
      producto: { id: string; name: string; relatedCourseId?: string | null };
      curso?: { id: string; slug: string; title: string };
      relacion: 'directa' | 'por-slug' | 'por-wpId' | 'sin-relacion';
      coincidencia?: string;
    }[] = [];

    for (const product of products) {
      const resultado: any = {
        producto: {
          id: product.id,
          name: product.name,
          relatedCourseId: (product as any).relatedCourseId || null,
        },
        relacion: 'sin-relacion' as const,
      };

      // Buscar por relatedCourseId
      if ((product as any).relatedCourseId) {
        const curso = onlineCourses.find(
          c => c.id === (product as any).relatedCourseId
        );
        if (curso) {
          resultado.curso = {
            id: curso.id,
            slug: curso.slug,
            title: curso.title,
          };
          resultado.relacion = 'directa';
          resultado.coincidencia = 'relatedCourseId';
        }
      }

      // Buscar por slug (si el ID del producto coincide con el slug del curso)
      if (!resultado.curso) {
        const cursoPorSlug = onlineCourses.find(c => c.slug === product.id);
        if (cursoPorSlug) {
          resultado.curso = {
            id: cursoPorSlug.id,
            slug: cursoPorSlug.slug,
            title: cursoPorSlug.title,
          };
          resultado.relacion = 'por-slug';
          resultado.coincidencia = 'slug === product.id';
        }
      }

      // Buscar por wpId (si el producto tiene wpId y el curso tiene relatedProductWpId)
      if (!resultado.curso && (product as any).wpId) {
        const cursoPorWpId = onlineCourses.find(
          c => c.relatedProductWpId === (product as any).wpId
        );
        if (cursoPorWpId) {
          resultado.curso = {
            id: cursoPorWpId.id,
            slug: cursoPorWpId.slug,
            title: cursoPorWpId.title,
          };
          resultado.relacion = 'por-wpId';
          resultado.coincidencia = 'relatedProductWpId === product.wpId';
        }
      }

      resultados.push(resultado);
    }

    // 5. Mostrar resultados
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 RESULTADOS DE VERIFICACIÓN');
    console.log('═══════════════════════════════════════════════════════════\n');

    // Agrupar por tipo de relación
    const conRelacionDirecta = resultados.filter(r => r.relacion === 'directa');
    const conRelacionPorSlug = resultados.filter(r => r.relacion === 'por-slug');
    const conRelacionPorWpId = resultados.filter(r => r.relacion === 'por-wpId');
    const sinRelacion = resultados.filter(r => r.relacion === 'sin-relacion');

    console.log(`✅ Con relación directa (relatedCourseId): ${conRelacionDirecta.length}`);
    console.log(`🔗 Con relación por slug: ${conRelacionPorSlug.length}`);
    console.log(`🔗 Con relación por wpId: ${conRelacionPorWpId.length}`);
    console.log(`❌ Sin relación encontrada: ${sinRelacion.length}\n`);

    // Detalle de productos con relación directa
    if (conRelacionDirecta.length > 0) {
      console.log('✅ PRODUCTOS CON RELACIÓN DIRECTA (relatedCourseId):');
      conRelacionDirecta.forEach(r => {
        console.log(`  📦 Producto: ${r.producto.name} (ID: ${r.producto.id})`);
        console.log(`     → Curso: ${r.curso?.title} (ID: ${r.curso?.id}, Slug: ${r.curso?.slug})`);
        console.log('');
      });
    }

    // Detalle de productos con relación por slug
    if (conRelacionPorSlug.length > 0) {
      console.log('🔗 PRODUCTOS CON RELACIÓN POR SLUG:');
      conRelacionPorSlug.forEach(r => {
        console.log(`  📦 Producto: ${r.producto.name} (ID: ${r.producto.id})`);
        console.log(`     → Curso: ${r.curso?.title} (ID: ${r.curso?.id}, Slug: ${r.curso?.slug})`);
        console.log(`     ⚠️  Coincidencia por slug, pero no hay relatedCourseId`);
        console.log('');
      });
    }

    // Detalle de productos con relación por wpId
    if (conRelacionPorWpId.length > 0) {
      console.log('🔗 PRODUCTOS CON RELACIÓN POR WPID:');
      conRelacionPorWpId.forEach(r => {
        console.log(`  📦 Producto: ${r.producto.name} (ID: ${r.producto.id}, wpId: ${(products.find(p => p.id === r.producto.id) as any)?.wpId})`);
        console.log(`     → Curso: ${r.curso?.title} (ID: ${r.curso?.id}, Slug: ${r.curso?.slug})`);
        console.log(`     ⚠️  Coincidencia por wpId, pero no hay relatedCourseId`);
        console.log('');
      });
    }

    // Detalle de productos sin relación
    if (sinRelacion.length > 0) {
      console.log('❌ PRODUCTOS SIN RELACIÓN ENCONTRADA:');
      sinRelacion.forEach(r => {
        console.log(`  📦 Producto: ${r.producto.name} (ID: ${r.producto.id})`);
        console.log(`     ⚠️  No se encontró curso online relacionado`);
        console.log('');
      });
    }

    // 6. Listar todos los cursos online disponibles
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📚 CURSOS ONLINE DISPONIBLES EN FIRESTORE');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    onlineCourses.forEach(course => {
      const relacionado = resultados.find(
        r => r.curso?.id === course.id
      );
      const estado = relacionado ? '✅ Relacionado' : '⚠️  Sin relación';
      console.log(`  ${estado} - ${course.title}`);
      console.log(`    ID: ${course.id}`);
      console.log(`    Slug: ${course.slug}`);
      console.log(`    wpId: ${course.wpId}`);
      if (course.relatedProductId) {
        console.log(`    relatedProductId: ${course.relatedProductId}`);
      }
      if (course.relatedProductWpId) {
        console.log(`    relatedProductWpId: ${course.relatedProductWpId}`);
      }
      console.log('');
    });

    // 7. Resumen y recomendaciones
    console.log('═══════════════════════════════════════════════════════════');
    console.log('💡 RECOMENDACIONES');
    console.log('═══════════════════════════════════════════════════════════\n');

    if (sinRelacion.length > 0) {
      console.log('⚠️  ACCIONES REQUERIDAS:');
      console.log('  1. Verificar si los productos sin relación deberían tener relatedCourseId');
      console.log('  2. Verificar si los cursos online deberían tener relatedProductId');
      console.log('  3. Actualizar las relaciones en Firestore\n');
    }

    if (conRelacionPorSlug.length > 0 || conRelacionPorWpId.length > 0) {
      console.log('💡 MEJORAS SUGERIDAS:');
      console.log('  1. Agregar relatedCourseId a los productos que coinciden por slug/wpId');
      console.log('  2. Esto mejorará la consistencia y rendimiento\n');
    }

    console.log('✅ Verificación completada\n');

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
    process.exit(1);
  }
}

// Ejecutar verificación
verificarCursosOnline()
  .then(() => {
    console.log('✅ Script finalizado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });


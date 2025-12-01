/**
 * API Route: Verificación de Cursos Online
 * GET /api/admin/verificar-cursos-online
 * 
 * Compara IDs de productos en página de cursos online
 * con slugs de cursos online en Firestore
 */

import { NextResponse } from 'next/server';
import { getAllOnlineCoursesFromFirestore } from '@/lib/firestore/onlineCourses';
import { getProductsByIdsFromFirestore } from '@/lib/firestore/products';

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

export async function GET() {
  try {
    const productIds = getAllProductIds();
    
    // 1. Obtener productos desde Firestore
    const products = await getProductsByIdsFromFirestore(productIds);
    const foundProductIds = new Set(products.map(p => p.id));
    const notFoundProducts = productIds.filter(id => !foundProductIds.has(id));

    // 2. Obtener todos los cursos online desde Firestore
    const onlineCourses = await getAllOnlineCoursesFromFirestore();

    // 3. Analizar relaciones
    const resultados: {
      producto: { id: string; name: string; relatedCourseId?: string | null; wpId?: number };
      curso?: { id: string; slug: string; title: string; wpId: number };
      relacion: 'directa' | 'por-slug' | 'por-wpId' | 'sin-relacion';
      coincidencia?: string;
    }[] = [];

    for (const product of products) {
      const resultado: any = {
        producto: {
          id: product.id,
          name: product.name,
          relatedCourseId: (product as any).relatedCourseId || null,
          wpId: (product as any).wpId || null,
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
            wpId: curso.wpId,
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
            wpId: cursoPorSlug.wpId,
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
            wpId: cursoPorWpId.wpId,
          };
          resultado.relacion = 'por-wpId';
          resultado.coincidencia = 'relatedProductWpId === product.wpId';
        }
      }

      resultados.push(resultado);
    }

    // Agrupar por tipo de relación
    const conRelacionDirecta = resultados.filter(r => r.relacion === 'directa');
    const conRelacionPorSlug = resultados.filter(r => r.relacion === 'por-slug');
    const conRelacionPorWpId = resultados.filter(r => r.relacion === 'por-wpId');
    const sinRelacion = resultados.filter(r => r.relacion === 'sin-relacion');

    // Cursos online sin relación con productos de la página
    const cursosRelacionados = new Set(
      resultados
        .filter(r => r.curso)
        .map(r => r.curso!.id)
    );
    const cursosSinRelacion = onlineCourses.filter(
      c => !cursosRelacionados.has(c.id)
    );

    return NextResponse.json({
      resumen: {
        totalProductosEnPagina: productIds.length,
        productosEncontrados: products.length,
        productosNoEncontrados: notFoundProducts.length,
        totalCursosOnline: onlineCourses.length,
        conRelacionDirecta: conRelacionDirecta.length,
        conRelacionPorSlug: conRelacionPorSlug.length,
        conRelacionPorWpId: conRelacionPorWpId.length,
        sinRelacion: sinRelacion.length,
        cursosSinRelacion: cursosSinRelacion.length,
      },
      productosNoEncontrados: notFoundProducts,
      relaciones: {
        directa: conRelacionDirecta,
        porSlug: conRelacionPorSlug,
        porWpId: conRelacionPorWpId,
        sinRelacion: sinRelacion,
      },
      cursosOnline: onlineCourses.map(c => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        wpId: c.wpId,
        relatedProductId: c.relatedProductId || null,
        relatedProductWpId: c.relatedProductWpId || null,
        status: c.status,
      })),
      cursosSinRelacion: cursosSinRelacion.map(c => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        wpId: c.wpId,
        relatedProductId: c.relatedProductId || null,
        relatedProductWpId: c.relatedProductWpId || null,
      })),
    });
  } catch (error) {
    console.error('Error en verificación de cursos online:', error);
    return NextResponse.json(
      {
        error: 'Error al verificar cursos online',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}


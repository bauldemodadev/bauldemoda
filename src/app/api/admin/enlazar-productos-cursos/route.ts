/**
 * API Route: Enlazar Productos con Cursos Online
 * POST /api/admin/enlazar-productos-cursos
 * 
 * Busca coincidencias entre productos de la página de cursos online
 * y cursos online en Firestore, y actualiza las relaciones.
 */

import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { getAllOnlineCoursesFromFirestore } from '@/lib/firestore/onlineCourses';
import { getProductsByIdsFromFirestore } from '@/lib/firestore/products';
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

function getAllProductIds(): string[] {
  const allIds = new Set<string>();
  Object.values(PRODUCT_IDS_FROM_PAGE).forEach(ids => {
    ids.forEach(id => allIds.add(id));
  });
  return Array.from(allIds);
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

function encontrarCoincidencia(product: any, courses: any[]): { course: any; metodo: string } | null {
  // 1. Buscar por relatedCourseId existente
  if (product.relatedCourseId) {
    const curso = courses.find(c => c.id === product.relatedCourseId);
    if (curso) {
      return { course: curso, metodo: 'relatedCourseId existente' };
    }
  }

  // 2. Buscar por slug
  const cursoPorSlug = courses.find(c => c.slug === product.id);
  if (cursoPorSlug) {
    return { course: cursoPorSlug, metodo: 'slug === product.id' };
  }

  // 3. Buscar por wpId
  if (product.wpId) {
    const cursoPorWpId = courses.find(c => c.relatedProductWpId === product.wpId);
    if (cursoPorWpId) {
      return { course: cursoPorWpId, metodo: 'relatedProductWpId === product.wpId' };
    }
  }

  // 4. Buscar por nombre
  const productNameNormalized = normalizeText(product.name);
  for (const course of courses) {
    const courseTitleNormalized = normalizeText(course.title);
    
    if (productNameNormalized === courseTitleNormalized) {
      return { course, metodo: 'nombre exacto' };
    }
    
    if (
      productNameNormalized.includes(courseTitleNormalized) ||
      courseTitleNormalized.includes(productNameNormalized)
    ) {
      if (Math.max(productNameNormalized.length, courseTitleNormalized.length) > 10) {
        return { course, metodo: 'nombre parcial' };
      }
    }
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const { dryRun = true } = await request.json().catch(() => ({ dryRun: true }));
    const db = getAdminDb();
    const productIds = getAllProductIds();

    // 1. Obtener productos
    const products = await getProductsByIdsFromFirestore(productIds);
    const foundProductIds = new Set(products.map(p => p.id));
    const notFoundProducts = productIds.filter(id => !foundProductIds.has(id));

    // 2. Obtener cursos online
    const onlineCourses = await getAllOnlineCoursesFromFirestore();

    // 3. Buscar coincidencias
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

    const productosConCoincidencia = new Set(coincidencias.map(c => c.product.id));
    const productosSinCoincidencia = products.filter(
      p => !productosConCoincidencia.has(p.id)
    );

    const productosAActualizar = coincidencias.filter(c => c.necesitaActualizacion);

    // 4. Actualizar si no es dry-run
    let productosActualizados = 0;
    let cursosActualizados = 0;

    if (!dryRun && productosAActualizar.length > 0) {
      // Actualizar productos
      const batchProducts = db.batch();
      for (const coincidencia of productosAActualizar) {
        const productRef = db.collection('products').doc(coincidencia.product.id);
        batchProducts.update(productRef, {
          relatedCourseId: coincidencia.course.id,
          updatedAt: Timestamp.now(),
        });
        productosActualizados++;
      }
      await batchProducts.commit();

      // Actualizar cursos online
      const batchCourses = db.batch();
      const cursosAActualizar = new Map<string, { course: any; productId: string }>();

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

        if (!data.course.relatedProductId || data.course.relatedProductId !== data.productId) {
          updateData.relatedProductId = data.productId;
          batchCourses.update(courseRef, updateData);
          cursosActualizados++;
        }
      }

      if (cursosActualizados > 0) {
        await batchCourses.commit();
      }
    }

    // Agrupar por método
    const porMetodo = new Map<string, typeof coincidencias>();
    coincidencias.forEach(c => {
      if (!porMetodo.has(c.metodo)) {
        porMetodo.set(c.metodo, []);
      }
      porMetodo.get(c.metodo)!.push(c);
    });

    return NextResponse.json({
      resumen: {
        totalProductos: productIds.length,
        productosEncontrados: products.length,
        productosNoEncontrados: notFoundProducts.length,
        totalCursosOnline: onlineCourses.length,
        coincidenciasEncontradas: coincidencias.length,
        productosAActualizar: productosAActualizar.length,
        productosActualizados: dryRun ? 0 : productosActualizados,
        cursosActualizados: dryRun ? 0 : cursosActualizados,
        productosSinCoincidencia: productosSinCoincidencia.length,
        dryRun,
      },
      productosNoEncontrados: notFoundProducts,
      coincidenciasPorMetodo: Object.fromEntries(
        Array.from(porMetodo.entries()).map(([metodo, coincidencias]) => [
          metodo,
          coincidencias.length,
        ])
      ),
      coincidencias: coincidencias.map(c => ({
        producto: {
          id: c.product.id,
          name: c.product.name,
          relatedCourseId: c.product.relatedCourseId || null,
        },
        curso: {
          id: c.course.id,
          slug: c.course.slug,
          title: c.course.title,
        },
        metodo: c.metodo,
        necesitaActualizacion: c.necesitaActualizacion,
      })),
      productosSinCoincidencia: productosSinCoincidencia.map(p => ({
        id: p.id,
        name: p.name,
        wpId: (p as any).wpId || null,
      })),
    });
  } catch (error) {
    console.error('Error enlazando productos con cursos:', error);
    return NextResponse.json(
      {
        error: 'Error al enlazar productos con cursos online',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}


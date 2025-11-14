/**
 * Funciones de transformación entre tipos Firestore y tipos del frontend
 * 
 * Estas funciones permiten convertir entre:
 * - FirestoreProduct (con Timestamps) ↔ Product (con Date/string)
 * - Y otros tipos según sea necesario
 */

import { Timestamp } from 'firebase-admin/firestore';
import type { FirestoreProduct } from '@/types/firestore';
import type { Product } from '@/types/product';

/**
 * Convierte un FirestoreProduct a Product (tipo del frontend)
 * 
 * Esta función transforma:
 * - Timestamps → Date/string
 * - Añade campos calculados necesarios para el frontend
 */
export function firestoreProductToProduct(fsProduct: FirestoreProduct): Product {
  // Convertir Timestamps a Date/string
  let createdAt: Date;
  let updatedAt: string;
  
  try {
    if (fsProduct.createdAt) {
      createdAt = fsProduct.createdAt instanceof Timestamp
        ? fsProduct.createdAt.toDate()
        : fsProduct.createdAt instanceof Date
        ? fsProduct.createdAt
        : new Date();
    } else {
      createdAt = new Date();
    }
    
    if (fsProduct.updatedAt) {
      updatedAt = fsProduct.updatedAt instanceof Timestamp
        ? fsProduct.updatedAt.toDate().toISOString()
        : fsProduct.updatedAt instanceof Date
        ? fsProduct.updatedAt.toISOString()
        : typeof fsProduct.updatedAt === 'string'
        ? fsProduct.updatedAt
        : new Date().toISOString();
    } else {
      updatedAt = new Date().toISOString();
    }
  } catch (error) {
    console.error('Error convirtiendo fechas:', error);
    createdAt = new Date();
    updatedAt = new Date().toISOString();
  }

  // Calcular precio numérico desde priceText o usar localPriceNumber
  const price = fsProduct.localPriceNumber ?? 0;

  // Determinar si está activo basado en status
  const active = fsProduct.status === 'publish';

  // Construir array de imágenes (si no existe, usar placeholder)
  const images = fsProduct.images && Array.isArray(fsProduct.images) && fsProduct.images.length > 0
    ? fsProduct.images
    : fsProduct.thumbnailMediaId
    ? [`/api/media/${fsProduct.thumbnailMediaId}`] // Endpoint para obtener imagen por mediaId
    : ['/placeholder.png'];

  return {
    // Identificadores
    id: fsProduct.id,
    wpId: fsProduct.wpId,
    sku: fsProduct.sku ?? null,

    // Información básica
    name: fsProduct.name || '',
    title: fsProduct.name || '', // Por defecto igual a name
    slug: fsProduct.slug || '',
    description: fsProduct.description ?? fsProduct.shortDescription ?? '',
    shortDescription: fsProduct.shortDescription ?? '',

    // Precios
    price,
    priceText: fsProduct.priceText,
    localPriceNumber: fsProduct.localPriceNumber ?? null,
    internacionalPriceNumber: fsProduct.internacionalPriceNumber ?? null,
    discount: {
      amount: 0, // Se puede calcular si hay precio rebajado
      percentage: 0,
    },
    promos: [],

    // Categorización
    category: fsProduct.category || '',
    subcategory: fsProduct.subcategory ?? '',
    tipoMadera: fsProduct.tipoMadera ?? '',
    sede: fsProduct.sede ?? null,

    // Medios
    images,
    srcUrl: images[0] || '/placeholder.png',
    thumbnailMediaId: fsProduct.thumbnailMediaId,
    galleryMediaIds: fsProduct.galleryMediaIds,

    // Estado
    active,
    status: fsProduct.status,
    stock: 0, // Se puede calcular desde stockStatus si es necesario
    stockStatus: fsProduct.stockStatus,

    // Flags comerciales (valores por defecto, se pueden ajustar)
    featuredBrand: false,
    freeShipping: false,
    newArrival: false,
    specialOffer: false,

    // Contenido adicional
    durationText: fsProduct.durationText ?? '',
    locationText: fsProduct.locationText ?? '',
    detailsHtml: fsProduct.detailsHtml ?? '',

    // Relaciones
    relatedCourseId: fsProduct.relatedCourseId ?? null,

    // Métricas
    rating: 0,
    sales: 0,

    // Fechas
    createdAt,
    updatedAt,
  };
}

/**
 * Convierte un Product (frontend) a FirestoreProduct
 * 
 * Útil para guardar productos desde el frontend o panel admin
 */
export function productToFirestoreProduct(
  product: Partial<Product>,
  existingProduct?: FirestoreProduct
): Partial<FirestoreProduct> {
  const now = Timestamp.now();

  return {
    // Identificadores (mantener si existe)
    wpId: product.wpId ?? existingProduct?.wpId ?? 0,
    slug: product.slug ?? existingProduct?.slug ?? product.name?.toLowerCase().replace(/\s+/g, '-') ?? '',
    sku: product.sku ?? existingProduct?.sku ?? null,

    // Información básica
    name: product.name ?? existingProduct?.name ?? '',
    shortDescription: product.shortDescription ?? existingProduct?.shortDescription ?? '',
    description: product.description ?? existingProduct?.description,

    // Precios
    priceText: product.priceText ?? existingProduct?.priceText ?? '',
    localPriceNumber: product.localPriceNumber ?? product.price ?? existingProduct?.localPriceNumber ?? null,
    internacionalPriceNumber: product.internacionalPriceNumber ?? existingProduct?.internacionalPriceNumber ?? null,

    // Información del taller
    durationText: product.durationText ?? existingProduct?.durationText ?? '',
    locationText: product.locationText ?? existingProduct?.locationText ?? '',
    detailsHtml: product.detailsHtml ?? existingProduct?.detailsHtml ?? '',

    // Medios
    thumbnailMediaId: product.thumbnailMediaId ?? existingProduct?.thumbnailMediaId ?? null,
    galleryMediaIds: product.galleryMediaIds ?? existingProduct?.galleryMediaIds ?? [],
    images: product.images ?? existingProduct?.images,

    // Categorización
    category: product.category ?? existingProduct?.category ?? '',
    subcategory: product.subcategory ?? existingProduct?.subcategory ?? null,
    tipoMadera: product.tipoMadera ?? existingProduct?.tipoMadera,
    sede: product.sede ?? existingProduct?.sede ?? null,

    // Estado
    stockStatus: product.stockStatus ?? existingProduct?.stockStatus ?? 'instock',
    status: (product.status ?? existingProduct?.status ?? 'draft') as 'draft' | 'publish',

    // Relaciones
    relatedCourseId: product.relatedCourseId ?? existingProduct?.relatedCourseId ?? null,

    // Fechas
    createdAt: existingProduct?.createdAt ?? now,
    updatedAt: now,
  };
}


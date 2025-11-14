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
 * Parsea el precio desde priceText (texto libre) y extrae el primer número encontrado
 * Ejemplos:
 * - "$5000 en efectivo, $6000 otros medios" -> 5000
 * - "5000" -> 5000
 * - "$5.000" -> 5000
 * - "5.000 pesos" -> 5000
 * - "$ 5.000" -> 5000
 * - "ARS 5000" -> 5000
 */
function parsePriceFromText(priceText: string | undefined | null): number {
  if (!priceText || typeof priceText !== 'string') {
    return 0;
  }

  // Buscar el primer número en el texto (puede tener puntos como separadores de miles)
  // Patrón: busca números con formato argentino (5.000 o 5.000,50) o internacional (5,000 o 5,000.50)
  const patterns = [
    /(\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?)/,  // Formato argentino: 5.000 o 5.000,50
    /(\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?)/,  // Formato internacional: 5,000 o 5,000.50
    /(\d+(?:[.,]\d+)?)/,                    // Número simple: 5000, 5000.50, 5000,50
  ];

  for (const pattern of patterns) {
    const match = priceText.match(pattern);
    if (match) {
      let numberStr = match[1];
      
      // Si tiene puntos como separadores de miles (formato argentino: 5.000)
      if (numberStr.includes('.') && numberStr.split('.').length > 2) {
        // Es formato de miles: 5.000 -> 5000, 5.000,50 -> 5000.50
        numberStr = numberStr.replace(/\./g, '').replace(',', '.');
      } 
      // Si tiene comas como separadores de miles (formato internacional: 5,000)
      else if (numberStr.includes(',') && numberStr.split(',').length > 2) {
        // Es formato de miles: 5,000 -> 5000, 5,000.50 -> 5000.50
        numberStr = numberStr.replace(/,/g, '');
      }
      // Si tiene una coma y es probablemente decimal (formato argentino: 5,50)
      else if (numberStr.includes(',') && numberStr.split(',').length === 2) {
        const parts = numberStr.split(',');
        if (parts[1].length <= 2) {
          // Probablemente decimal: 5,50 -> 5.50
          numberStr = numberStr.replace(',', '.');
        }
      }
      
      const parsed = parseFloat(numberStr);
      if (!isNaN(parsed) && parsed > 0) {
        return Math.round(parsed);
      }
    }
  }

  return 0;
}

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
    // createdAt siempre es Timestamp según el tipo, pero verificamos por seguridad
    const createdAtValue = fsProduct.createdAt as any;
    if (createdAtValue) {
      if (createdAtValue instanceof Timestamp) {
        createdAt = createdAtValue.toDate();
      } else if (createdAtValue instanceof Date) {
        createdAt = createdAtValue;
      } else if (typeof createdAtValue === 'string') {
        createdAt = new Date(createdAtValue);
      } else {
        createdAt = new Date();
      }
    } else {
      createdAt = new Date();
    }
    
    // updatedAt siempre es Timestamp según el tipo, pero verificamos por seguridad
    const updatedAtValue = fsProduct.updatedAt as any;
    if (updatedAtValue) {
      if (updatedAtValue instanceof Timestamp) {
        updatedAt = updatedAtValue.toDate().toISOString();
      } else if (updatedAtValue instanceof Date) {
        updatedAt = updatedAtValue.toISOString();
      } else if (typeof updatedAtValue === 'string') {
        updatedAt = updatedAtValue;
      } else {
        updatedAt = new Date().toISOString();
      }
    } else {
      updatedAt = new Date().toISOString();
    }
  } catch (error) {
    console.error('Error convirtiendo fechas:', error);
    createdAt = new Date();
    updatedAt = new Date().toISOString();
  }

  // Calcular precio numérico desde priceText o usar localPriceNumber
  // Prioridad: localPriceNumber > parsePriceFromText(priceText) > 0
  let price = 0;
  
  // Si localPriceNumber está disponible y es un número válido, usarlo
  if (fsProduct.localPriceNumber !== null && fsProduct.localPriceNumber !== undefined && !isNaN(fsProduct.localPriceNumber)) {
    price = fsProduct.localPriceNumber;
  } else {
    // Si localPriceNumber no está disponible, intentar parsear desde priceText
    const parsedPrice = parsePriceFromText(fsProduct.priceText);
    if (parsedPrice > 0) {
      price = parsedPrice;
    }
  }

  // Determinar si está activo basado en status
  const active = fsProduct.status === 'publish';

  // Construir array de imágenes desde mediaIds
  // Prioridad: images existentes > galleryMediaIds > thumbnailMediaId > placeholder
  let images: string[] = [];

  // Si ya hay imágenes en el array, usarlas
  if (fsProduct.images && Array.isArray(fsProduct.images) && fsProduct.images.length > 0) {
    images = fsProduct.images;
  } else {
    // Convertir mediaIds a URLs usando el endpoint /api/media/[id]
    const mediaUrls: string[] = [];

    // Agregar imagen principal (thumbnail)
    if (fsProduct.thumbnailMediaId) {
      mediaUrls.push(`/api/media/${fsProduct.thumbnailMediaId}`);
    }

    // Agregar imágenes de la galería (evitando duplicar la principal)
    if (fsProduct.galleryMediaIds && Array.isArray(fsProduct.galleryMediaIds)) {
      for (const mediaId of fsProduct.galleryMediaIds) {
        const url = `/api/media/${mediaId}`;
        // Solo agregar si no es la misma que la principal
        if (!fsProduct.thumbnailMediaId || mediaId !== fsProduct.thumbnailMediaId) {
          mediaUrls.push(url);
        }
      }
    }

    // Si hay al menos una imagen, usarla; sino, placeholder
    images = mediaUrls.length > 0 ? mediaUrls : ['/placeholder.png'];
  }

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


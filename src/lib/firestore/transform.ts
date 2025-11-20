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
 * Parsea el precio desde priceText (texto libre) y extrae el precio de "otros medios" o "transferencia"
 * IGNORA el precio en efectivo ya que se maneja manualmente en la sede presencial
 * Ejemplos:
 * - "$78.000 en efectivo / $94.380 otros medios" -> 94380
 * - "$78.000 en efectivo, $94.380 transferencia" -> 94380
 * - "$5000 otros medios" -> 5000
 * - "$5.000" -> 5000 (si no hay mención de efectivo)
 */
function parsePriceFromText(priceText: string | undefined | null): number {
  if (!priceText || typeof priceText !== 'string') {
    return 0;
  }

  // Buscar el precio de "otros medios" o "transferencia" (ignorar precio en efectivo)
  // Patrones para encontrar el precio después de "otros medios", "transferencia", o "/"
  const otherMethodsPatterns = [
    /(?:otros\s+medios|transferencia)[:\s]*\$?\s*(\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?)/i,  // Formato argentino después de "otros medios" o "transferencia"
    /(?:otros\s+medios|transferencia)[:\s]*\$?\s*(\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?)/i,  // Formato internacional
    /\/(?:[^$]*)\$?\s*(\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?)/i,  // Después de "/" (formato argentino)
    /\/(?:[^$]*)\$?\s*(\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?)/i,  // Después de "/" (formato internacional)
  ];

  // Primero buscar el precio de "otros medios" o "transferencia"
  for (const pattern of otherMethodsPatterns) {
    const match = priceText.match(pattern);
    if (match && match[1]) {
      let numberStr = match[1];
      
      // Formato argentino: 94.380 o 94.380,50
      if (numberStr.includes('.')) {
        const parts = numberStr.split('.');
        // Si la última parte tiene 3 dígitos, es separador de miles
        if (parts.length > 1 && parts[parts.length - 1].length === 3) {
          numberStr = numberStr.replace(/\./g, '');
          // Si hay coma, es decimal: 94.380,50 -> 94380.50
          if (numberStr.includes(',')) {
            numberStr = numberStr.replace(',', '.');
          }
        }
      }
      // Formato internacional: 94,380 o 94,380.50
      else if (numberStr.includes(',')) {
        const parts = numberStr.split(',');
        // Si la última parte tiene 3 dígitos, es separador de miles
        if (parts.length > 1 && parts[parts.length - 1].length === 3) {
          numberStr = numberStr.replace(/,/g, '');
        }
        // Si solo hay una coma y el número después tiene 1-2 dígitos, es decimal
        else if (parts.length === 2 && parts[1].length <= 2) {
          numberStr = numberStr.replace(',', '.');
        }
      }
      
      const parsed = parseFloat(numberStr);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
  }

  // Si no se encontró "otros medios" o "transferencia", verificar si hay mención de "efectivo"
  // Si hay "efectivo", no devolver el primer precio (porque sería el de efectivo)
  if (/efectivo/i.test(priceText)) {
    // Si hay mención de efectivo pero no encontramos "otros medios", retornar 0
    // para que se use localPriceNumber u otherMethodsPrice si está disponible
    return 0;
  }

  // Si no hay mención de "efectivo", buscar el primer precio disponible
  const cleanText = priceText.replace(/[$ARS\s]/gi, '');
  const patterns = [
    /(\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?)/,  // Formato argentino: 78.000 o 78.000,50
    /(\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?)/,  // Formato internacional: 78,000 o 78,000.50
  ];

  for (const pattern of patterns) {
    const match = cleanText.match(pattern);
    if (match) {
      let numberStr = match[1];
      
      if (numberStr.includes('.')) {
        const parts = numberStr.split('.');
        if (parts.length > 1 && parts[parts.length - 1].length === 3) {
          numberStr = numberStr.replace(/\./g, '');
          if (numberStr.includes(',')) {
            numberStr = numberStr.replace(',', '.');
          }
        }
      }
      else if (numberStr.includes(',')) {
        const parts = numberStr.split(',');
        if (parts.length > 1 && parts[parts.length - 1].length === 3) {
          numberStr = numberStr.replace(/,/g, '');
        }
        else if (parts.length === 2 && parts[1].length <= 2) {
          numberStr = numberStr.replace(',', '.');
        }
      }
      
      const parsed = parseFloat(numberStr);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
  }

  // Si no se encontró con patrones de miles, buscar números simples
  const simplePattern = /(\d+(?:[.,]\d{1,2})?)/;
  const simpleMatch = cleanText.match(simplePattern);
  if (simpleMatch) {
    let numberStr = simpleMatch[1];
    if (numberStr.includes(',') && !numberStr.includes('.')) {
      const parts = numberStr.split(',');
      if (parts.length === 2 && parts[1].length <= 2) {
        numberStr = numberStr.replace(',', '.');
      }
    }
    const parsed = parseFloat(numberStr);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
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

  // Función helper para convertir mediaId (puede ser número, string numérico o URL) a URL
  const mediaIdToUrl = (mediaId: number | string | null | undefined): string | null => {
    if (!mediaId) return null;
    
    // Si es una URL (string que comienza con http:// o https://), usarla directamente
    if (typeof mediaId === 'string' && (mediaId.startsWith('http://') || mediaId.startsWith('https://'))) {
      return mediaId;
    }
    
    // Si es un ID (número o string numérico), usar el endpoint /api/media/[id]
    const idValue = typeof mediaId === 'number' ? mediaId : parseInt(String(mediaId), 10);
    if (!isNaN(idValue) && idValue > 0) {
      return `/api/media/${idValue}`;
    }
    
    return null;
  };

  // Si ya hay imágenes en el array, usarlas
  if (fsProduct.images && Array.isArray(fsProduct.images) && fsProduct.images.length > 0) {
    images = fsProduct.images;
  } else {
    // Convertir mediaIds a URLs (soporta tanto IDs como URLs)
    const mediaUrls: string[] = [];

    // Agregar imagen principal (thumbnail)
    const thumbnailUrl = mediaIdToUrl(fsProduct.thumbnailMediaId);
    if (thumbnailUrl) {
      mediaUrls.push(thumbnailUrl);
    }

    // Agregar imágenes de la galería (evitando duplicar la principal)
    if (fsProduct.galleryMediaIds && Array.isArray(fsProduct.galleryMediaIds)) {
      for (const mediaId of fsProduct.galleryMediaIds) {
        const url = mediaIdToUrl(mediaId);
        if (url) {
          // Solo agregar si no es la misma que la principal
          if (!thumbnailUrl || url !== thumbnailUrl) {
            mediaUrls.push(url);
          }
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
    price, // Mantener para compatibilidad, pero usar basePrice/otherMethodsPrice según método
    priceText: fsProduct.priceText,
    localPriceNumber: fsProduct.localPriceNumber ?? null,
    internacionalPriceNumber: fsProduct.internacionalPriceNumber ?? null,
    
    // Precios diferenciados (FASE 7)
    basePrice: fsProduct.basePrice ?? fsProduct.localPriceNumber ?? price,
    cashPrice: fsProduct.cashPrice ?? null,
    otherMethodsPrice: fsProduct.otherMethodsPrice ?? fsProduct.localPriceNumber ?? price,
    internationalPrice: fsProduct.internationalPrice ?? null,
    pricingMode: fsProduct.pricingMode ?? (fsProduct.cashPrice && fsProduct.otherMethodsPrice ? 'dual' : 'single'),
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
    thumbnailMediaId: (fsProduct.thumbnailMediaId ?? null) as number | string | null | undefined,
    galleryMediaIds: (fsProduct.galleryMediaIds ?? []) as (number | string)[] | undefined,

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


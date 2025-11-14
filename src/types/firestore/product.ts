/**
 * Tipos Firestore para la colección 'products'
 * 
 * Este tipo es compatible con el tipo Product de src/types/product.ts
 * pero incluye campos específicos de Firestore (Timestamps, wpId, etc.)
 */

import { Timestamp } from 'firebase-admin/firestore';

/**
 * Producto/Taller en Firestore
 * Compatible con el modelo de WordPress/WooCommerce migrado
 */
export interface FirestoreProduct {
  // Identificadores
  id: string;                    // docId en Firestore
  wpId: number;                  // id original de WordPress (wp:post_id)
  slug: string;                   // wp:post_name
  sku: string | null;             // meta: _sku

  // Información básica
  name: string;                  // <title>
  shortDescription: string;      // meta: descripcion_corta
  description?: string;           // Descripción completa (opcional, puede venir de detailsHtml)
  
  // Precios y comercialización
  priceText: string;             // meta: precio (texto tipo "x en efectivo, y otros medios")
  localPriceNumber?: number | null;        // opcional, si parseamos número
  internacionalPriceNumber?: number | null; // opcional
  
  // Precios diferenciados por método de pago (FASE 7)
  basePrice?: number | null;              // Precio base de referencia
  cashPrice?: number | null;              // Precio en efectivo (sin IVA)
  otherMethodsPrice?: number | null;      // Precio para otros medios (tarjeta, MP, etc., con IVA)
  internationalPrice?: number | null;     // Precio internacional (opcional)
  pricingMode?: 'single' | 'dual';       // Estrategia: 'single' = un solo precio, 'dual' = efectivo vs otros
  
  // Información del taller
  durationText: string;          // meta: duracion (texto libre)
  locationText: string;          // meta: lugar
  detailsHtml: string;           // meta: detalles_del_taller (HTML completo)

  // Medios
  thumbnailMediaId: number | null;  // meta: imagen_principal (ID WP)
  galleryMediaIds: number[];        // meta: _product_image_gallery CSV IDs
  images?: string[];                // URLs de imágenes (se pueden derivar de mediaIds)

  // Categorización
  category: string;              // derivado de product_cat
  subcategory: string | null;
  tipoMadera?: string;            // Tipo de madera (específico del negocio)
  sede: 'ciudad-jardin' | 'almagro' | 'online' | 'mixto' | null; // derivado de categorías / lógica

  // Estado y disponibilidad
  stockStatus: 'instock' | 'outofstock' | 'onbackorder';
  status: 'draft' | 'publish';    // wp:status

  // Relaciones
  relatedCourseId?: string | null; // link opcional a onlineCourses

  // Fechas (Firestore Timestamps)
  createdAt: Timestamp;
  updatedAt: Timestamp;
}


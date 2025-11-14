/**
 * Tipo Product - Compatible con modelo actual y preparado para Firestore
 * 
 * Este tipo mantiene compatibilidad con el frontend actual mientras
 * permite migración gradual a Firestore. Los campos opcionales marcados
 * con "Firestore" serán agregados durante la migración.
 */
export interface Product {
  // Identificadores
  id: string;                    // docId en Firestore o ID de API externa
  wpId?: number;                 // ID original de WordPress (solo en Firestore)
  sku?: string | null;           // SKU del producto

  // Información básica
  name: string;                  // Nombre del producto
  title: string;                 // Título (puede ser igual a name)
  slug?: string;                // Slug para URLs (Firestore)
  description: string;          // Descripción completa
  shortDescription?: string;    // Descripción corta (Firestore)

  // Precios y comercialización
  price: number;                 // Precio numérico (para cálculos) - DEPRECATED: usar basePrice
  priceText?: string;           // Precio como texto libre (Firestore: "x en efectivo, y otros medios")
  localPriceNumber?: number | null;        // Precio local parseado (Firestore)
  internacionalPriceNumber?: number | null; // Precio internacional parseado (Firestore)
  
  // Precios diferenciados por método de pago (FASE 7)
  basePrice?: number | null;              // Precio base de referencia
  cashPrice?: number | null;              // Precio en efectivo (sin IVA)
  otherMethodsPrice?: number | null;      // Precio para otros medios (tarjeta, MP, etc., con IVA)
  internationalPrice?: number | null;     // Precio internacional (opcional)
  pricingMode?: 'single' | 'dual';       // Estrategia: 'single' = un solo precio, 'dual' = efectivo vs otros
  
  discount: {
    amount: number;
    percentage: number;
  };
  promos: Array<{
    cantidad: number;
    descuento: number;
    precioFinal: number;
  }>;

  // Categorización
  category: string;             // Categoría principal
  subcategory: string;          // Subcategoría
  tipoMadera?: string;          // Tipo de madera (específico del negocio)
  sede?: 'ciudad-jardin' | 'almagro' | 'online' | 'mixto' | null; // Sede (Firestore)

  // Medios
  images: string[];             // Array de URLs de imágenes
  srcUrl: string;               // URL principal de imagen
  thumbnailMediaId?: number | null;  // ID de media principal (Firestore)
  galleryMediaIds?: number[];        // IDs de galería (Firestore)

  // Estado y disponibilidad
  active: boolean;              // Si está activo/publicado
  status?: 'draft' | 'publish'; // Estado de publicación (Firestore)
  stock: number;                // Stock disponible
  stockStatus?: 'instock' | 'outofstock' | 'onbackorder'; // Estado de stock (Firestore)

  // Flags comerciales
  featuredBrand: boolean;       // Marca destacada
  freeShipping: boolean;        // Envío gratis
  newArrival: boolean;          // Producto nuevo
  specialOffer: boolean;        // Oferta especial

  // Contenido adicional (Firestore)
  durationText?: string;        // Duración como texto libre
  locationText?: string;        // Lugar como texto libre
  detailsHtml?: string;         // Detalles del taller en HTML

  // Relaciones (Firestore)
  relatedCourseId?: string | null; // Link opcional a onlineCourses

  // Métricas
  rating: number;               // Calificación (0-5)
  sales: number;                // Ventas realizadas

  // Fechas
  createdAt: Date;             // Fecha de creación
  updatedAt: string;            // Fecha de actualización (ISO string)
} 
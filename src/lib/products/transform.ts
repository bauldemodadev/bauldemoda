import { Product } from "@/types/product";

/**
 * Verifica si un item de la API externa está activo/publicado
 * @param item - Item de la API externa
 * @returns true si el producto está publicado
 */
export function isTiendaActivo(item: any): boolean {
  const p = item?.producto ?? item;
  // La API externa usa 'publicado' en lugar de 'estadoTienda'
  const publicado = p?.publicado ?? item?.publicado;
  return publicado === true;
}

/**
 * Transforma un item de la API externa (/precios) al tipo Product del frontend
 * Esta función consolida todas las versiones duplicadas de mapPrecioToProduct
 * 
 * @param item - Item crudo de la API externa
 * @returns Product normalizado para el frontend
 */
export function mapExternalPrecioToProduct(item: any): Product {
  const p = item?.producto ?? item;
  const pr = item?.pricing ?? item;

  // Normalizar imágenes desde varias posibles claves
  const rawImgs = Array.isArray(p?.imagenes)
    ? p.imagenes
    : Array.isArray(p?.images)
    ? p.images
    : [];
  const images: string[] = rawImgs.length > 0 ? rawImgs : (p?.srcUrl ? [p.srcUrl] : []);

  // Determinar precios base y final (adaptado a la estructura real de la API)
  const precioNormal = Number(p?.precio?.normal ?? 0);
  const precioRebajado = Number(p?.precio?.rebajado ?? 0);
  const precioUnitario = Number(pr?.precioUnitario ?? 0);
  
  // Usar precio unitario del pricing si está disponible, sino precio normal
  // Fallback a otras claves posibles de precio
  const precioFinal = precioUnitario > 0 
    ? precioUnitario 
    : precioNormal > 0 
    ? precioNormal 
    : Number(pr?.precioUnitarioFinal ?? pr?.precioUnitarioBase ?? p?.valorVenta ?? 0);

  // Descuentos: calcular basado en diferencia entre normal y rebajado
  const discountAmount = Math.max(0, precioNormal - precioRebajado);
  const discountPercentage = precioNormal > 0 ? Math.round((discountAmount / precioNormal) * 100) : 0;

  // Resolver nombre: priorizar nombre, luego descripción, luego fallback
  const resolvedName =
    typeof p?.nombre === 'string' && p.nombre.trim().length > 0
      ? p.nombre
      : typeof p?.descripcion === 'string' && p.descripcion.trim().length > 0
      ? p.descripcion
      : 'Sin nombre';

  // Normalizar categorías (pueden venir como array o string)
  const categoriaPrincipal = Array.isArray(p?.categorias) 
    ? p.categorias[0] 
    : p?.categoria ?? pr?.categoria ?? '';
  
  const subcategoriaPrincipal = Array.isArray(p?.categorias) && p.categorias.length > 1
    ? p.categorias[1]
    : p?.subCategoria ?? p?.subcategoria ?? pr?.unidad ?? p?.unidadMedida ?? '';

  // Normalizar stock desde varias posibles claves
  const stock = Number(p?.inventario ?? p?.stockDisponible ?? p?.stock ?? 0);

  return {
    id: String(p?.id ?? p?.codigo ?? crypto.randomUUID()),
    title: resolvedName,
    name: resolvedName,
    description: p?.descripcion ?? '',
    price: Math.round(Number(precioFinal) || 0),
    images,
    srcUrl: images[0] || p?.srcUrl || '/placeholder.png',
    category: categoriaPrincipal,
    subcategory: subcategoriaPrincipal,
    tipoMadera: p?.tipoMadera ?? p?.tipoMadera?.toString?.() ?? '',
    stock,
    discount: {
      amount: Math.max(0, Number(discountAmount) || 0),
      percentage: Math.max(0, Number(discountPercentage) || 0),
    },
    freeShipping: false,
    createdAt: new Date(),
    sales: 0,
    rating: 0,
    active: isTiendaActivo(item),
    specialOffer: (Number(discountAmount) || 0) > 0 || (Number(discountPercentage) || 0) > 0,
    newArrival: Boolean(p?.newArrival ?? false),
    featuredBrand: Boolean(p?.featuredBrand ?? false),
    promos: [],
    updatedAt: new Date().toISOString(),
  } as Product;
}


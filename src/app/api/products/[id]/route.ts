import { NextResponse } from 'next/server';
import { api } from '@/lib/api';
import { Product } from '@/types/product';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function isTiendaActivo(item: any): boolean {
  const p = item?.producto ?? item;
  // La API externa usa 'publicado' en lugar de 'estadoTienda'
  const publicado = p?.publicado ?? item?.publicado;
  return publicado === true;
}

function mapPrecioToProduct(item: any): Product {
  const p = item?.producto ?? item;
  const pr = item?.pricing ?? item;

  // Normalizar imágenes
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
  const precioFinal = precioUnitario > 0 ? precioUnitario : precioNormal;

  // Descuentos: calcular basado en diferencia entre normal y rebajado
  const discountAmount = Math.max(0, precioNormal - precioRebajado);
  const discountPercentage = precioNormal > 0 ? Math.round((discountAmount / precioNormal) * 100) : 0;

  const resolvedName = (typeof p?.nombre === 'string' && p.nombre.trim().length > 0)
    ? p.nombre
    : ((typeof p?.descripcion === 'string' && p.descripcion.trim().length > 0) ? p.descripcion : 'Sin nombre');

  return {
    id: String(p?.id ?? p?.codigo ?? crypto.randomUUID()),
    title: resolvedName,
    name: resolvedName,
    description: p?.descripcion ?? '',
    price: Math.round(Number(precioFinal) || 0),
    images,
    srcUrl: images[0] || p?.srcUrl || '/placeholder.png',
    category: Array.isArray(p?.categorias) ? p.categorias[0] : (p?.categoria ?? pr?.categoria ?? ''),
    subcategory: Array.isArray(p?.categorias) && p.categorias.length > 1 ? p.categorias[1] : (p?.subCategoria ?? p?.subcategoria ?? pr?.unidad ?? p?.unidadMedida ?? ''),
    stock: Number(p?.inventario ?? p?.stockDisponible ?? p?.stock ?? 0),
    discount: { amount: Math.max(0, Number(discountAmount) || 0), percentage: Math.max(0, Number(discountPercentage) || 0) },
    freeShipping: false,
    createdAt: new Date(),
    sales: 0,
    rating: 0,
    active: isTiendaActivo(item),
    specialOffer: (Number(discountAmount) || 0) > 0 || (Number(discountPercentage) || 0) > 0,
    newArrival: false,
    featuredBrand: false,
    promos: [],
    updatedAt: new Date().toISOString(),
  } as Product;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    // Nuevo contrato: POST /precios con body { items: [{ id, cantidad }] }
    const data = await api.post<any>(`/precios`, { items: [{ id: productId, cantidad: 1 }] });
    const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
    const activos = items.filter(isTiendaActivo);
    if (activos.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(mapPrecioToProduct(activos[0]));
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
} 
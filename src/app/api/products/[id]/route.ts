import { NextResponse } from 'next/server';
import { api } from '@/lib/api';
import { Product } from '@/types/product';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function isTiendaActivo(item: any): boolean {
  const p = item?.producto ?? item;
  const estadoTienda = p?.estadoTienda ?? item?.estadoTienda;
  return estadoTienda === 'Activo';
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

  // Precios y descuentos
  const precioBase = Number(
    pr?.precioUnitarioBase ?? p?.precioLista ?? p?.precioBase ?? p?.valorVenta ?? 0
  );
  const precioFinal = Number(
    pr?.precioUnitarioFinal ?? p?.valorVenta ?? pr?.precioUnitarioBase ?? 0
  );

  const discountAmountRaw = p?.discount?.amount;
  const discountPercentageRaw = p?.discount?.percentage;
  const calculatedAmount = Math.max(0, precioBase - precioFinal);
  const calculatedPercentage = precioBase > 0 ? Math.round((calculatedAmount / precioBase) * 100) : 0;
  const discountAmount = Number(
    typeof discountAmountRaw === 'number' ? discountAmountRaw : calculatedAmount
  );
  const discountPercentage = Number(
    typeof discountPercentageRaw === 'number' ? discountPercentageRaw : calculatedPercentage
  );

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
    category: p?.categoria ?? pr?.categoria ?? '',
    subcategory: p?.subCategoria ?? p?.subcategoria ?? pr?.unidad ?? p?.unidadMedida ?? '',
    stock: Number(p?.stockDisponible ?? p?.stock ?? 0),
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
    let precio: any | null = null;
    try {
      precio = await api.get<any>(`/precios?id=${encodeURIComponent(productId)}`);
    } catch (e) {
      // ignore and try fallback by codigo
    }

    // Fallback: algunos documentos usan "codigo" como identificador público
    if (!precio || !isTiendaActivo(precio)) {
      try {
        const byCodigo = await api.get<any>(`/precios?codigo=${encodeURIComponent(productId)}`);
        if (byCodigo && isTiendaActivo(byCodigo)) {
          precio = byCodigo;
        }
      } catch (e) {
        // no-op
      }
    }

    if (!precio || !isTiendaActivo(precio)) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(mapPrecioToProduct(precio));
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
} 
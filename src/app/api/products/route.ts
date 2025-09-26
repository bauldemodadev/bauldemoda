import { NextResponse } from 'next/server';
import { api } from '@/lib/api';
import { Product } from '@/types/product';

// Evita que Next intente prerender estáticamente esta ruta
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

  // Normalizar imágenes desde varias posibles claves
  const rawImgs = Array.isArray(p?.imagenes)
    ? p.imagenes
    : Array.isArray(p?.images)
    ? p.images
    : [];
  const images: string[] = rawImgs.length > 0 ? rawImgs : (p?.srcUrl ? [p.srcUrl] : []);

  // Determinar precios base y final (con múltiples fuentes posibles)
  const precioBase = Number(
    pr?.precioUnitarioBase ?? p?.precioLista ?? p?.precioBase ?? p?.valorVenta ?? 0
  );
  const precioFinal = Number(
    pr?.precioUnitarioFinal ?? p?.valorVenta ?? pr?.precioUnitarioBase ?? 0
  );

  // Descuentos: usar los provistos si existen, si no calcular
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

  const resolvedName =
    typeof p?.nombre === 'string' && p.nombre.trim().length > 0
      ? p.nombre
      : typeof p?.descripcion === 'string' && p.descripcion.trim().length > 0
      ? p.descripcion
      : 'Sin nombre';

  return {
    id: String(p?.id ?? p?.codigo ?? crypto.randomUUID()),
    title: resolvedName,
    name: resolvedName,
    description: p?.descripcion ?? '',
    price: Math.round(Number(precioFinal) || 0), // Mostrar precio final en el front
    images,
    srcUrl: images[0] || p?.srcUrl || '/placeholder.png',
    category: p?.categoria ?? pr?.categoria ?? '',
    subcategory: p?.subCategoria ?? p?.subcategoria ?? pr?.unidad ?? p?.unidadMedida ?? '',
    tipoMadera: p?.tipoMadera ?? p?.tipoMadera?.toString?.() ?? '',
    stock: Number(p?.stockDisponible ?? p?.stock ?? 0),
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

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const codigo = url.searchParams.get('codigo');
    const nombre = url.searchParams.get('nombre');
    const ids = url.searchParams.get('ids');
    const all = url.searchParams.get('all');
    const cantidad = url.searchParams.get('cantidad') ?? '1';
    const cepillado = url.searchParams.get('cepillado') ?? 'false';
    const redondear = url.searchParams.get('redondear') ?? 'true';

    // 1) Listado completo soportado por tu API (items[])
    if (all === '1' || all === 'true') {
      const data = await api.get<any>(`/precios?all=1`);
      const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
      const filtered = items.filter(isTiendaActivo).map(mapPrecioToProduct);
      return NextResponse.json(filtered);
    }

    // 2) Batch por ids
    if (ids) {
      const list = ids.split(',').map(s => s.trim()).filter(Boolean);
      if (list.length === 0) return NextResponse.json([], { status: 200 });
      const results = await Promise.all(
        list.map(async (oneId) => {
          const data = await api.get<any>(`/precios?id=${encodeURIComponent(oneId)}&cantidad=${cantidad}&cepillado=${cepillado}&redondear=${redondear}`);
          return isTiendaActivo(data) ? mapPrecioToProduct(data) : null;
        })
      );
      return NextResponse.json(results.filter(Boolean));
    }

    // 3) Individual por id/codigo/nombre
    if (id || codigo || nombre) {
      const qs = new URLSearchParams();
      if (id) qs.set('id', id);
      if (codigo) qs.set('codigo', codigo);
      if (nombre) qs.set('nombre', nombre);
      qs.set('cantidad', cantidad);
      qs.set('cepillado', cepillado);
      qs.set('redondear', redondear);
      const data = await api.get<any>(`/precios?${qs.toString()}`);
      const items = Array.isArray(data) ? data : [data];
      const filtered = items.filter(isTiendaActivo).map(mapPrecioToProduct);
      return NextResponse.json(filtered);
    }

    // 4) Sin filtros: intenta all=1
    const data = await api.get<any>(`/precios?all=1`);
    const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
    const filtered = items.filter(isTiendaActivo).map(mapPrecioToProduct);
    return NextResponse.json(filtered);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
} 
import { NextResponse } from 'next/server';
import { api } from '@/lib/api';
import { Product } from '@/types/product';

// Evita que Next intente prerender estáticamente esta ruta
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
  const precioFinal = precioUnitario > 0 ? precioUnitario : precioNormal;

  // Descuentos: calcular basado en diferencia entre normal y rebajado
  const discountAmount = Math.max(0, precioNormal - precioRebajado);
  const discountPercentage = precioNormal > 0 ? Math.round((discountAmount / precioNormal) * 100) : 0;

  const resolvedName =
    typeof p?.nombre === 'string' && p.nombre.trim().length > 0
      ? p.nombre
      : typeof p?.descripcion === 'string' && p.descripcion.trim().length > 0
      ? p.descripcion
      : 'Sin nombre';

  return {
    id: String(p?.id ?? crypto.randomUUID()),
    title: resolvedName,
    name: resolvedName,
    description: p?.descripcion ?? '',
    price: Math.round(Number(precioFinal) || 0), // Mostrar precio final en el front
    images,
    srcUrl: images[0] || p?.srcUrl || '/placeholder.png',
    category: Array.isArray(p?.categorias) ? p.categorias[0] : (p?.categoria ?? pr?.categoria ?? ''),
    subcategory: Array.isArray(p?.categorias) && p.categorias.length > 1 ? p.categorias[1] : (p?.subCategoria ?? p?.subcategoria ?? pr?.unidad ?? p?.unidadMedida ?? ''),
    tipoMadera: p?.tipoMadera ?? p?.tipoMadera?.toString?.() ?? '',
    stock: Number(p?.inventario ?? p?.stockDisponible ?? p?.stock ?? 0),
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

    // 1) Listado completo -> preferir POST /precios con body { items } si el backend lo soporta
    if (all === '1' || all === 'true') {
      // Paso A: obtener todos para extraer ids
      const allData = await api.get<any>(`/precios?all=1`);
      const allItems = Array.isArray(allData?.items) ? allData.items : Array.isArray(allData) ? allData : [];
      const active = allItems.filter(isTiendaActivo);
      const ids = active
        .map((it: any) => (it?.producto?.id ?? it?.id))
        .filter(Boolean);

      if (ids.length === 0) return NextResponse.json([]);

      // Paso B: reconsultar con POST y cantidades uniformes
      const payload = {
        items: ids.map((idVal: string) => ({ id: String(idVal), cantidad: Number(cantidad) || 1 })),
      } as any;
      const data = await api.post<any>(`/precios`, payload);
      const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
      const filtered = items.filter(isTiendaActivo).map(mapPrecioToProduct);
      return NextResponse.json(filtered);
    }

    // 2) Batch por ids -> nuevo contrato: POST /precios con body { items: [{ id, cantidad }] }
    if (ids) {
      const list = ids.split(',').map(s => s.trim()).filter(Boolean);
      if (list.length === 0) return NextResponse.json([], { status: 200 });
      const payload = {
        items: list.map((oneId) => ({ id: oneId, cantidad: Number(cantidad) || 1 })),
      } as any;
      const data = await api.post<any>(`/precios`, payload);
      const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
      const filtered = items.filter(isTiendaActivo).map(mapPrecioToProduct);
      return NextResponse.json(filtered);
    }

    // 3) Individual por id -> nuevo contrato: POST /precios con body { items: [{ id, cantidad }] }
    if (id) {
      const payload = { items: [{ id, cantidad: Number(cantidad) || 1 }] } as any;
      const data = await api.post<any>(`/precios`, payload);
      const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
      const filtered = items.filter(isTiendaActivo).map(mapPrecioToProduct);
      return NextResponse.json(filtered);
    }

    // 3b) Compatibilidad: por codigo/nombre (fallback a contrato anterior si el backend aún lo soporta)
    if (codigo || nombre) {
      const qs = new URLSearchParams();
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
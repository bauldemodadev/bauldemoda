import { Product } from "@/types/product";
import { api } from "@/lib/api";

function mapPrecioToProduct(item: any): Product {
  const p = item?.producto ?? item;
  const pr = item?.pricing ?? item;
  const images: string[] = Array.isArray(p?.imagenes) ? p.imagenes : [];
  const priceCandidate = pr?.precioUnitarioFinal ?? pr?.precioUnitarioBase ?? p?.valorVenta ?? 0;
  const resolvedName = (typeof p?.nombre === 'string' && p.nombre.trim().length > 0)
    ? p.nombre
    : ((typeof p?.descripcion === 'string' && p.descripcion.trim().length > 0) ? p.descripcion : 'Sin nombre');

  return {
    id: String(p?.id ?? p?.codigo ?? crypto.randomUUID()),
    title: resolvedName,
    name: resolvedName,
    description: p?.descripcion ?? '',
    price: Number((Number(priceCandidate) || 0).toFixed(2)), // Mostrar precio con 2 decimales
    images,
    srcUrl: images[0] || p?.srcUrl || '/placeholder.png',
    category: p?.categoria ?? pr?.categoria ?? '',
    subcategory: p?.subCategoria ?? pr?.unidad ?? '',
    stock: Number(p?.stockDisponible ?? 0),
    discount: { amount: 0, percentage: 0 },
    freeShipping: false,
    createdAt: new Date(),
    sales: 0,
    rating: 0,
    active: true,
    specialOffer: false,
    newArrival: false,
    featuredBrand: false,
    promos: [],
    updatedAt: new Date().toISOString(),
  } as Product;
}

export async function getProductById(productId: string): Promise<Product | null> {
  try {
    const data = await api.post<any>(`/precios`, { items: [{ id: productId, cantidad: 1 }] });
    const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
    if (!items.length) return null;
    return mapPrecioToProduct(items[0]);
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const data = await api.get<any>(`/precios?all=1`);
    const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
    return items.map(mapPrecioToProduct);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
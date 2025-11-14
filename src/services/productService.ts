import { Product } from "@/types/product";
import { api } from "@/lib/api";
import { mapExternalPrecioToProduct } from "@/lib/products/transform";

export async function getProductById(productId: string): Promise<Product | null> {
  try {
    const data = await api.post<any>(`/precios`, { items: [{ id: productId, cantidad: 1 }] });
    const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
    if (!items.length) return null;
    return mapExternalPrecioToProduct(items[0]);
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const data = await api.get<any>(`/precios?all=1`);
    const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
    return items.map(mapExternalPrecioToProduct);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
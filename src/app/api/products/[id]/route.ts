import { NextResponse } from 'next/server';
import { api } from '@/lib/api';
import { Product } from '@/types/product';
import { mapExternalPrecioToProduct, isTiendaActivo } from '@/lib/products/transform';
import { getProductByIdFromFirestore } from '@/lib/firestore/products';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Flag para usar Firestore o API externa
const USE_FIRESTORE = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    // ============================================
    // MODO FIRESTORE
    // ============================================
    if (USE_FIRESTORE) {
      const product = await getProductByIdFromFirestore(productId);
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json(product);
    }

    // ============================================
    // MODO API EXTERNA (compatibilidad)
    // ============================================
    const data = await api.post<any>(`/precios`, { items: [{ id: productId, cantidad: 1 }] });
    const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
    const activos = items.filter(isTiendaActivo);
    if (activos.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(mapExternalPrecioToProduct(activos[0]));
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
} 
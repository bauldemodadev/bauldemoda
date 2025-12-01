import { NextResponse } from 'next/server';
import { api } from '@/lib/api';
import { Product } from '@/types/product';
import { mapExternalPrecioToProduct, isTiendaActivo } from '@/lib/products/transform';
import {
  getAllProductsFromFirestore,
  getProductsByIdsFromFirestore,
  getProductsPage,
} from '@/lib/firestore/products';

// OPTIMIZADO: Cache con revalidación cada 5 minutos
export const revalidate = 300;

// Flag para usar Firestore o API externa
const USE_FIRESTORE = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';

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

    // ============================================
    // MODO FIRESTORE
    // ============================================
    if (USE_FIRESTORE) {
      try {
        // 1) Listado completo (all=1 o sin params)
        // OPTIMIZADO: Usar paginación con limit por defecto (50 items)
        if (all === '1' || all === 'true' || (!id && !ids && !codigo && !nombre)) {
          const limit = parseInt(url.searchParams.get('limit') || '50', 10);
          const cursor = url.searchParams.get('cursor');
          
          // Si se solicita explícitamente "all" sin limit, usar función legacy (compatibilidad)
          if (all === '1' && !url.searchParams.has('limit')) {
            const products = await getAllProductsFromFirestore();
            return NextResponse.json(products);
          }
          
          // Usar paginación optimizada
          const result = await getProductsPage({ limit, cursor });
          return NextResponse.json(result.products);
        }

      // 2) Batch por ids
      if (ids) {
        const list = ids.split(',').map(s => s.trim()).filter(Boolean);
        if (list.length === 0) return NextResponse.json([], { status: 200 });
        const products = await getProductsByIdsFromFirestore(list);
        return NextResponse.json(products);
      }

      // 3) Individual por id
      if (id) {
        const { getProductByIdFromFirestore } = await import('@/lib/firestore/products');
        const product = await getProductByIdFromFirestore(id);
        if (!product) {
          return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json(product);
      }

      // 4) Búsqueda por código/nombre (no soportado en Firestore aún, retornar vacío o implementar búsqueda)
      if (codigo || nombre) {
        // TODO: Implementar búsqueda en Firestore si es necesario
        return NextResponse.json([], { status: 200 });
      }

        // Fallback: todos los productos
        const products = await getAllProductsFromFirestore();
        return NextResponse.json(products);
      } catch (error) {
        console.error('❌ Error en modo Firestore:', error);
        console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
        return NextResponse.json(
          { 
            error: 'Failed to fetch products from Firestore', 
            details: error instanceof Error ? error.message : String(error),
            stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
          },
          { status: 500 }
        );
      }
    }

    // ============================================
    // MODO API EXTERNA (compatibilidad)
    // ============================================

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
      const filtered = items.filter(isTiendaActivo).map(mapExternalPrecioToProduct);
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
      const filtered = items.filter(isTiendaActivo).map(mapExternalPrecioToProduct);
      return NextResponse.json(filtered);
    }

    // 3) Individual por id -> nuevo contrato: POST /precios con body { items: [{ id, cantidad }] }
    if (id) {
      const payload = { items: [{ id, cantidad: Number(cantidad) || 1 }] } as any;
      const data = await api.post<any>(`/precios`, payload);
      const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
      const filtered = items.filter(isTiendaActivo).map(mapExternalPrecioToProduct);
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
      const filtered = items.filter(isTiendaActivo).map(mapExternalPrecioToProduct);
      return NextResponse.json(filtered);
    }

    // 4) Sin filtros: intenta all=1
    const data = await api.get<any>(`/precios?all=1`);
    const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
    const filtered = items.filter(isTiendaActivo).map(mapExternalPrecioToProduct);
    return NextResponse.json(filtered);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
} 
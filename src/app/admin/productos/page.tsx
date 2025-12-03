import { getAdminDb } from '@/lib/firebase/admin';
import ProductsList from '@/components/admin/products/ProductsList';
import SearchBar from '@/components/admin/SearchBar';
import ProductFilters from '@/components/admin/ProductFilters';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { serializeFirestoreData } from '@/lib/admin/serialize';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { verifyAdminAuth } from '@/lib/admin/auth';
import { getAdminSede } from '@/lib/firestore/stats';
import { redirect } from 'next/navigation';

const ITEMS_PER_PAGE = 20;

async function getProducts(page: number = 1, search?: string, filters?: {
  category?: string;
  subcategory?: string;
  sede?: string;
  status?: string;
  stockStatus?: string;
}) {
  const db = getAdminDb();

  // OPTIMIZADO: Estrategia diferente según si hay búsqueda o no
  // Si hay búsqueda, necesitamos leer más documentos para buscar en memoria
  // Si no hay búsqueda, podemos usar queries filtradas con limit (más eficiente)

  // Para obtener opciones de filtros (categorías, sedes), leer una muestra limitada
  const metadataSnapshot = await db
    .collection('products')
    .limit(100)
    .get();

  const metadataProducts = metadataSnapshot.docs.map((doc: QueryDocumentSnapshot) => {
    const data = doc.data();
    return serializeFirestoreData({
      id: doc.id,
      ...data,
    });
  });

  // Extraer categorías, subcategorías y sedes únicas para los filtros
  const categories = Array.from(new Set(metadataProducts.map((p: any) => p.category).filter(Boolean)));
  const subcategories = filters?.category 
    ? Array.from(new Set(metadataProducts.filter((p: any) => p.category === filters.category).map((p: any) => p.subcategory).filter(Boolean)))
    : Array.from(new Set(metadataProducts.map((p: any) => p.subcategory).filter(Boolean)));
  const sedes = Array.from(new Set(metadataProducts.map((p: any) => p.sede).filter(Boolean)));

  let products: any[] = [];
  let total = 0;

  if (search) {
    // Si hay búsqueda, leer más documentos (300) para buscar en memoria
    // Esto es menos eficiente pero necesario porque Firestore no soporta full-text search
    const searchSnapshot = await db
      .collection('products')
      .orderBy('updatedAt', 'desc')
      .limit(300) // Limitar a 300 para búsqueda
      .get();

    let allProducts = searchSnapshot.docs.map((doc: QueryDocumentSnapshot) => {
      const data = doc.data();
      return serializeFirestoreData({
        id: doc.id,
        ...data,
      });
    });

    // Aplicar búsqueda
    const searchLower = search.toLowerCase();
    allProducts = allProducts.filter((product: any) => {
      const name = (product.name || '').toLowerCase();
      const slug = (product.slug || '').toLowerCase();
      const category = (product.category || '').toLowerCase();
      return name.includes(searchLower) || slug.includes(searchLower) || category.includes(searchLower);
    });

    // Aplicar filtros
    if (filters?.status) {
      allProducts = allProducts.filter((p: any) => p.status === filters.status);
    }
    if (filters?.sede) {
      allProducts = allProducts.filter((p: any) => p.sede === filters.sede);
    }
    if (filters?.category) {
      allProducts = allProducts.filter((p: any) => p.category === filters.category);
    }
    if (filters?.subcategory) {
      allProducts = allProducts.filter((p: any) => p.subcategory === filters.subcategory);
    }
    if (filters?.stockStatus) {
      allProducts = allProducts.filter((p: any) => p.stockStatus === filters.stockStatus);
    }

    total = allProducts.length;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    products = allProducts.slice(startIndex, endIndex);
  } else {
    // Si NO hay búsqueda, usar queries filtradas con limit (más eficiente)
    let query: any = db.collection('products').orderBy('updatedAt', 'desc');

    // Aplicar filtros que Firestore puede manejar directamente
    if (filters?.status) {
      query = query.where('status', '==', filters.status);
    }
    if (filters?.sede) {
      query = query.where('sede', '==', filters.sede);
    }
    if (filters?.category) {
      query = query.where('category', '==', filters.category);
    }
    if (filters?.subcategory) {
      query = query.where('subcategory', '==', filters.subcategory);
    }

    // Aplicar paginación con limit en Firestore
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const snapshot = await query.limit(ITEMS_PER_PAGE).offset(offset).get();

    products = snapshot.docs.map((doc: QueryDocumentSnapshot) => {
      const data = doc.data();
      return serializeFirestoreData({
        id: doc.id,
        ...data,
      });
    });

    // Aplicar filtros que no se pudieron aplicar en Firestore (stockStatus)
    if (filters?.stockStatus) {
      products = products.filter((p: any) => p.stockStatus === filters.stockStatus);
    }

    // Para el total, hacer una query count limitada
    const countSnapshot = await query.limit(1000).get();
    total = countSnapshot.size;
  }

  return {
    products,
    total,
    totalPages: Math.ceil(total / ITEMS_PER_PAGE),
    currentPage: page,
    categories,
    subcategories,
    sedes,
  };
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { 
    page?: string;
    search?: string;
    category?: string;
    subcategory?: string;
    sede?: string;
    status?: string;
    stockStatus?: string;
  };
}) {
  try {
    // Obtener el email del admin autenticado
    const adminEmail = await verifyAdminAuth();
    
    // Determinar la sede del admin
    const adminSede = getAdminSede(adminEmail);
    
    // Si el admin tiene una sede específica y no se especificó un filtro de sede, 
    // aplicar filtro automático por su sede (sin redirect, solo aplicar)
    const sedeFilter = searchParams.sede || (adminSede || undefined);
    
    const page = parseInt(searchParams.page || '1', 10);
    const data = await getProducts(page, searchParams.search, {
      category: searchParams.category,
      subcategory: searchParams.subcategory,
      sede: sedeFilter,
      status: searchParams.status,
      stockStatus: searchParams.stockStatus,
    });

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'var(--font-poppins)' }}>
            Productos
          </h1>
          <p className="text-sm text-gray-500 mt-1.5" style={{ fontFamily: 'var(--font-poppins)' }}>
            Gestiona todos tus productos
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="group flex items-center justify-center gap-2 px-5 py-2.5 bg-[#E9ABBD] hover:bg-[#D44D7D] text-white rounded-lg shadow-md shadow-[#D44D7D]/20 hover:shadow-lg hover:shadow-[#D44D7D]/30 transition-all duration-200 text-sm font-medium active:scale-95"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
          <span className="whitespace-nowrap">Nuevo Producto</span>
        </Link>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-4 sm:mb-6">
        <SearchBar 
          placeholder="Buscar productos..." 
          searchParam="search"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Filtros - Colapsable en mobile */}
        <div className="lg:w-64 lg:flex-shrink-0">
          <ProductFilters
            categories={data.categories}
            subcategories={data.subcategories}
            sedes={data.sedes}
          />
        </div>

        {/* Lista de productos */}
        <div className="flex-1 min-w-0">
          <ProductsList
            products={data.products}
            totalPages={data.totalPages}
            currentPage={data.currentPage}
          />
        </div>
      </div>
    </div>
  );
  } catch (error) {
    console.error('Error en página de productos:', error);
    // En caso de error, mostrar una página de error
    return (
      <div className="w-full space-y-6">
        <div className="bg-white rounded-xl border border-red-200/80 shadow-sm p-8 text-center">
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error al cargar productos
            </h2>
            <p className="text-gray-500">
              {error instanceof Error ? error.message : 'Ha ocurrido un error inesperado'}
            </p>
          </div>
        </div>
      </div>
    );
  }
}


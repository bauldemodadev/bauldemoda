import { getAdminDb } from '@/lib/firebase/admin';
import ProductsList from '@/components/admin/products/ProductsList';
import SearchBar from '@/components/admin/SearchBar';
import ProductFilters from '@/components/admin/ProductFilters';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { serializeFirestoreData } from '@/lib/admin/serialize';

const ITEMS_PER_PAGE = 20;

async function getProducts(page: number = 1, search?: string, filters?: {
  category?: string;
  subcategory?: string;
  sede?: string;
  status?: string;
  stockStatus?: string;
}) {
  const db = getAdminDb();

  // Obtener todos los productos
  const snapshot = await db
    .collection('products')
    .orderBy('updatedAt', 'desc')
    .get();

  let allProducts = snapshot.docs.map((doc) => {
    const data = doc.data();
    return serializeFirestoreData({
      id: doc.id,
      ...data,
    });
  });

  // Aplicar búsqueda
  if (search) {
    const searchLower = search.toLowerCase();
    allProducts = allProducts.filter((product: any) => {
      const name = (product.name || '').toLowerCase();
      const slug = (product.slug || '').toLowerCase();
      const category = (product.category || '').toLowerCase();
      return name.includes(searchLower) || slug.includes(searchLower) || category.includes(searchLower);
    });
  }

  // Aplicar filtros
  if (filters) {
    if (filters.category) {
      allProducts = allProducts.filter((product: any) => product.category === filters.category);
    }
    if (filters.subcategory) {
      allProducts = allProducts.filter((product: any) => product.subcategory === filters.subcategory);
    }
    if (filters.sede) {
      allProducts = allProducts.filter((product: any) => product.sede === filters.sede);
    }
    if (filters.status) {
      allProducts = allProducts.filter((product: any) => product.status === filters.status);
    }
    if (filters.stockStatus) {
      allProducts = allProducts.filter((product: any) => product.stockStatus === filters.stockStatus);
    }
  }

  // Extraer categorías, subcategorías y sedes únicas para los filtros
  const categories = Array.from(new Set(allProducts.map((p: any) => p.category).filter(Boolean)));
  const subcategories = filters?.category 
    ? Array.from(new Set(allProducts.filter((p: any) => p.category === filters.category).map((p: any) => p.subcategory).filter(Boolean)))
    : Array.from(new Set(allProducts.map((p: any) => p.subcategory).filter(Boolean)));
  const sedes = Array.from(new Set(allProducts.map((p: any) => p.sede).filter(Boolean)));

  const total = allProducts.length;

  // Paginar en memoria
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const products = allProducts.slice(startIndex, endIndex);

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
  const page = parseInt(searchParams.page || '1', 10);
  const data = await getProducts(page, searchParams.search, {
    category: searchParams.category,
    subcategory: searchParams.subcategory,
    sede: searchParams.sede,
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
          className="group flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 text-sm font-medium active:scale-95"
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
}


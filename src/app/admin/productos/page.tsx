import { getAdminDb } from '@/lib/firebase/admin';
import ProductsList from '@/components/admin/products/ProductsList';
import Link from 'next/link';
import { Plus } from 'lucide-react';

const ITEMS_PER_PAGE = 20;

async function getProducts(page: number = 1) {
  const db = getAdminDb();

  // Obtener total de productos
  const totalSnapshot = await db.collection('products').count().get();
  const total = totalSnapshot.data().count;

  // Obtener todos los productos y paginar en memoria (para simplificar)
  // En producción, se puede optimizar usando startAfter() con cursores
  const snapshot = await db
    .collection('products')
    .orderBy('updatedAt', 'desc')
    .get();

  const allProducts = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Paginar en memoria
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const products = allProducts.slice(startIndex, endIndex);

  return {
    products,
    total,
    totalPages: Math.ceil(total / ITEMS_PER_PAGE),
    currentPage: page,
  };
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1', 10);
  const data = await getProducts(page);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Producto
        </Link>
      </div>

      <ProductsList
        products={data.products}
        totalPages={data.totalPages}
        currentPage={data.currentPage}
      />
    </div>
  );
}


import { getAdminDb } from '@/lib/firebase/admin';
import { notFound } from 'next/navigation';
import ProductEditForm from '@/components/admin/products/ProductEditForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

async function getProduct(id: string) {
  const db = getAdminDb();
  const doc = await db.collection('products').doc(id).get();

  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...doc.data(),
  };
}

export default async function AdminProductEditPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/admin/productos"
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a productos
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Editar Producto: {product.name || 'Sin nombre'}
      </h1>

      <ProductEditForm product={product} />
    </div>
  );
}


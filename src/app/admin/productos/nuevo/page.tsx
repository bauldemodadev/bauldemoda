import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductEditForm from '@/components/admin/products/ProductEditForm';

export default function AdminNewProductPage() {
  const newProduct = {
    id: 'new',
    name: '',
    slug: '',
    shortDescription: '',
    description: '',
    priceText: '',
    localPriceNumber: null,
    durationText: '',
    locationText: '',
    detailsHtml: '',
    category: '',
    subcategory: null,
    tipoMadera: '',
    sede: null,
    status: 'draft' as const,
    stockStatus: 'instock',
    thumbnailMediaId: null,
    galleryMediaIds: [],
    sku: null,
  };

  return (
    <div>
      <Link
        href="/admin/productos"
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a productos
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nuevo Producto</h1>

      <ProductEditForm product={newProduct} />
    </div>
  );
}


'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Edit, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  sede: string;
  status: 'publish' | 'draft';
  stockStatus: string;
  updatedAt: any;
}

interface ProductsListProps {
  products: Product[];
  totalPages: number;
  currentPage: number;
}

export default function ProductsList({ products, totalPages, currentPage }: ProductsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Función helper para construir URLs de paginación preservando filtros
  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `/admin/productos?${params.toString()}`;
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar el producto "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar producto');
      }

      toast({
        title: 'Producto eliminado',
        description: `El producto "${name}" ha sido eliminado correctamente`,
      });

      router.refresh();
    } catch (error) {
      console.error('Error eliminando producto:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar el producto',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      // timestamp puede ser un string ISO o un objeto Timestamp
      const date = typeof timestamp === 'string' 
        ? new Date(timestamp)
        : timestamp.toDate 
        ? timestamp.toDate() 
        : new Date(timestamp);
      
      if (isNaN(date.getTime())) return 'N/A';
      
      return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
      {/* Vista de tabla para desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-50/50">
            <tr>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría / Sede
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actualizado
              </th>
              <th className="px-4 xl:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No hay productos
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr 
                  key={product.id} 
                  className="hover:bg-gray-50/80 transition-colors duration-150 border-b border-gray-100 last:border-0 group"
                >
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900 group-hover:text-gray-950 transition-colors">
                      {product.name || 'Sin nombre'}
                    </div>
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 font-mono">{product.slug || 'N/A'}</div>
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.category || 'N/A'}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{product.sede || 'N/A'}</div>
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-all duration-200 ${
                        product.status === 'publish'
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}
                    >
                      {product.status === 'publish' ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      product.stockStatus === 'instock' 
                        ? 'text-emerald-600' 
                        : product.stockStatus === 'outofstock' 
                        ? 'text-red-600' 
                        : 'text-gray-500'
                    }`}>
                      {product.stockStatus === 'instock' ? 'En stock' : product.stockStatus === 'outofstock' ? 'Sin stock' : product.stockStatus || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(product.updatedAt)}
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/productos/${product.id}`}
                        className="p-1.5 text-[#D44D7D] hover:text-[#E9ABBD] hover:bg-[#E9ABBD]/10 rounded-lg transition-all duration-200 active:scale-95"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={deletingId === product.id}
                        className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Vista de cards para mobile */}
      <div className="lg:hidden divide-y divide-gray-100">
        {products.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="text-gray-500 font-medium">No hay productos</p>
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="p-4 hover:bg-gray-50/80 transition-colors duration-150 active:bg-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {product.name || 'Sin nombre'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 truncate font-mono">{product.slug || 'N/A'}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-xs font-medium text-gray-700">{product.category || 'N/A'}</span>
                    {product.sede && (
                      <span className="text-xs text-gray-500">• {product.sede}</span>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                        product.status === 'publish'
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      {product.status === 'publish' ? 'Publicado' : 'Borrador'}
                    </span>
                    <span className={`text-xs font-medium ${
                      product.stockStatus === 'instock' 
                        ? 'text-emerald-600' 
                        : product.stockStatus === 'outofstock' 
                        ? 'text-red-600' 
                        : 'text-gray-500'
                    }`}>
                      {product.stockStatus === 'instock' ? 'En stock' : product.stockStatus === 'outofstock' ? 'Sin stock' : product.stockStatus || 'N/A'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(product.updatedAt)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link
                    href={`/admin/productos/${product.id}`}
                    className="p-2 text-[#D44D7D] hover:text-[#E9ABBD] hover:bg-[#E9ABBD]/10 rounded-lg transition-all duration-200 active:scale-95"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    disabled={deletingId === product.id}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="bg-white px-3 sm:px-4 lg:px-6 py-3 flex items-center justify-between border-t border-gray-200">
          {/* Paginación mobile */}
          <div className="flex-1 flex justify-between lg:hidden">
            {currentPage > 1 && (
              <Link
                href={buildPageUrl(currentPage - 1)}
                className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Anterior
              </Link>
            )}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
              <span className="font-medium">{currentPage}</span>
              <span>de</span>
              <span className="font-medium">{totalPages}</span>
            </div>
            {currentPage < totalPages && (
              <Link
                href={buildPageUrl(currentPage + 1)}
                className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Siguiente
              </Link>
            )}
          </div>
          
          {/* Paginación desktop */}
          <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Página <span className="font-medium">{currentPage}</span> de{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                {currentPage > 1 && (
                  <Link
                    href={buildPageUrl(currentPage - 1)}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    Anterior
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                  ) {
                    return (
                      <Link
                        key={pageNum}
                        href={buildPageUrl(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-all duration-200 ${
                          pageNum === currentPage
                            ? 'z-10 bg-[#E9ABBD] text-white border-[#E9ABBD] shadow-sm shadow-[#D44D7D]/20'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                        }`}
                      >
                        {pageNum}
                      </Link>
                    );
                  } else if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                    return (
                      <span key={pageNum} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
                {currentPage < totalPages && (
                  <Link
                    href={buildPageUrl(currentPage + 1)}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    Siguiente
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


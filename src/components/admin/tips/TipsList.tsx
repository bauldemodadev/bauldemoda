'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Tip {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: 'publish' | 'draft';
  updatedAt: any;
}

interface TipsListProps {
  tips: Tip[];
  totalPages: number;
  currentPage: number;
}

export default function TipsList({ tips, totalPages, currentPage }: TipsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Función helper para construir URLs de paginación preservando filtros
  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `/admin/tips?${params.toString()}`;
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Estás seguro de eliminar el tip "${title}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/tips/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar tip');
      }

      toast({
        title: 'Tip eliminado',
        description: `El tip "${title}" ha sido eliminado correctamente`,
      });

      router.refresh();
    } catch (error) {
      console.error('Error eliminando tip:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar el tip',
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
    <div className="bg-white rounded-lg shadow">
      {/* Vista de tabla para desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
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
            {tips.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No hay tips
                </td>
              </tr>
            ) : (
              tips.map((tip) => (
                <tr key={tip.id} className="hover:bg-gray-50">
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{tip.title || 'Sin título'}</div>
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{tip.slug || 'N/A'}</div>
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tip.category || 'N/A'}
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        tip.status === 'publish'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {tip.status === 'publish' ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(tip.updatedAt)}
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/tips/${tip.id}`}
                        className="text-[#D44D7D] hover:text-[#E9ABBD] transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(tip.id, tip.title)}
                        disabled={deletingId === tip.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 transition-colors"
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
      <div className="lg:hidden divide-y divide-gray-200">
        {tips.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500">
            No hay tips
          </div>
        ) : (
          tips.map((tip) => (
            <div key={tip.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {tip.title || 'Sin título'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 truncate">{tip.slug || 'N/A'}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gray-600">{tip.category || 'N/A'}</span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        tip.status === 'publish'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {tip.status === 'publish' ? 'Publicado' : 'Borrador'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(tip.updatedAt)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/admin/tips/${tip.id}`}
                    className="p-2 text-[#D44D7D] hover:text-[#E9ABBD] hover:bg-[#E9ABBD]/10 rounded-lg transition-all duration-200 active:scale-95"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(tip.id, tip.title)}
                    disabled={deletingId === tip.id}
                    className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md disabled:opacity-50 transition-colors"
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
                        className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium transition-colors ${
                          pageNum === currentPage
                            ? 'z-10 bg-[#E9ABBD] bg-opacity-10 border-[#D44D7D] text-[#D44D7D]'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
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


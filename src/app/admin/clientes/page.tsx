/**
 * Panel Admin: Listado de Clientes
 * 
 * Funcionalidades:
 * - Listado de clientes con estadísticas
 * - Búsqueda por nombre o email
 * - Filtros y ordenamiento
 * - Enlaces a detalle y órdenes
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, User, Mail, Phone, DollarSign, ShoppingCart, Calendar } from 'lucide-react';
// Tipo serializado para clientes (con fechas como strings desde la API)
interface SerializedCustomer {
  id: string;
  uid?: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: string; // Serializado como ISO string
  lastOrderAt?: string | null; // Serializado como ISO string
  totalOrders: number;
  totalSpent: number;
  tags: string[];
  enrolledCourses: Array<{
    courseId: string;
    productId?: string;
    orderId: string;
    accessFrom: string; // Serializado como ISO string
    accessTo?: string | null; // Serializado como ISO string
  }>;
}

interface CustomersResponse {
  customers: SerializedCustomer[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export default function AdminClientesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [customers, setCustomers] = useState<SerializedCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, limit: 50, offset: 0 });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCustomers();
  }, [searchParams]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      params.set('limit', '50');
      params.set('offset', searchParams.get('offset') || '0');

      const response = await fetch(`/api/customers?${params.toString()}`);
      if (!response.ok) throw new Error('Error al cargar clientes');
      
      const data: CustomersResponse = await response.json();
      setCustomers(data.customers);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error cargando clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadCustomers();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  const formatDate = (dateString: string | Date | any) => {
    // Manejar diferentes formatos de fecha
    let date: Date;
    if (typeof dateString === 'string') {
      date = new Date(dateString);
    } else if (dateString instanceof Date) {
      date = dateString;
    } else if (dateString && typeof dateString === 'object' && 'toDate' in dateString) {
      // Timestamp de Firestore
      date = dateString.toDate();
    } else {
      return 'Fecha inválida';
    }
    
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="w-full">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Clientes</h1>
      </div>

      {/* Búsqueda */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-4 sm:mb-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 sm:pl-10 pr-2 sm:pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            />
          </div>
          <button
            type="submit"
            className="px-4 sm:px-6 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-md transition-colors text-sm sm:text-base whitespace-nowrap"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Tabla de clientes */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 sm:p-12 text-center">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-[#3B82F6] mx-auto"></div>
            <p className="mt-4 text-sm sm:text-base text-gray-500">Cargando clientes...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <p className="text-sm sm:text-base text-gray-500">No se encontraron clientes</p>
          </div>
        ) : (
          <>
            {/* Vista de tabla para desktop */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estadísticas
                    </th>
                    <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Última Compra
                    </th>
                    <th className="px-4 xl:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#3B82F6] bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-[#2563EB]" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                            <div className="text-xs text-gray-500">ID: {customer.id.slice(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{customer.email}</span>
                        </div>
                        {customer.phone && (
                          <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            {customer.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <ShoppingCart className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-900">{customer.totalOrders}</span>
                            <span className="text-gray-500">órdenes</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-900 font-semibold">{formatCurrency(customer.totalSpent)}</span>
                          </div>
                          {customer.enrolledCourses.length > 0 && (
                            <div className="text-xs text-gray-500">
                              {customer.enrolledCourses.length} {customer.enrolledCourses.length === 1 ? 'curso' : 'cursos'}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                        {customer.lastOrderAt ? (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            {formatDate(customer.lastOrderAt)}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Sin compras</span>
                        )}
                      </td>
                      <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/clientes/${customer.id}`}
                          className="text-[#3B82F6] hover:text-[#2563EB] transition-colors"
                        >
                          Ver detalle →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Vista de cards para mobile */}
            <div className="lg:hidden divide-y divide-gray-200">
              {customers.map((customer) => (
                <div key={customer.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#3B82F6] bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{customer.name}</h3>
                      <p className="text-xs text-gray-500">ID: {customer.id.slice(0, 8)}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-900 truncate">{customer.email}</span>
                    </div>
                    {customer.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700">{customer.phone}</span>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                          <ShoppingCart className="w-3 h-3" />
                          <span>Órdenes</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{customer.totalOrders}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                          <DollarSign className="w-3 h-3" />
                          <span>Total</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{formatCurrency(customer.totalSpent)}</span>
                      </div>
                      {customer.enrolledCourses.length > 0 && (
                        <div className="col-span-2">
                          <span className="text-xs text-gray-500">
                            {customer.enrolledCourses.length} {customer.enrolledCourses.length === 1 ? 'curso' : 'cursos'} inscrito{customer.enrolledCourses.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                      {customer.lastOrderAt && (
                        <div className="col-span-2 flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>Última compra: {formatDate(customer.lastOrderAt)}</span>
                        </div>
                      )}
                    </div>
                    <div className="pt-2">
                      <Link
                        href={`/admin/clientes/${customer.id}`}
                        className="inline-flex items-center text-sm text-[#3B82F6] hover:text-[#2563EB] transition-colors"
                      >
                        Ver detalle →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            {pagination.total > pagination.limit && (
              <div className="bg-white px-3 sm:px-4 lg:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200">
                <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                  Mostrando {pagination.offset + 1} a {Math.min(pagination.offset + pagination.limit, pagination.total)} de {pagination.total} clientes
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const newOffset = Math.max(0, pagination.offset - pagination.limit);
                      router.push(`/admin/clientes?offset=${newOffset}`);
                    }}
                    disabled={pagination.offset === 0}
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => {
                      const newOffset = pagination.offset + pagination.limit;
                      router.push(`/admin/clientes?offset=${newOffset}`);
                    }}
                    disabled={pagination.offset + pagination.limit >= pagination.total}
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Panel Admin: Detalle de Cliente
 * 
 * Muestra:
 * - Información completa del cliente
 * - Historial de compras con enlaces
 * - Cursos inscritos
 * - Estadísticas
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Phone, ShoppingCart, DollarSign, BookOpen, Calendar } from 'lucide-react';
import type { OrderStatus, PaymentStatus, PaymentMethod } from '@/types/firestore/order';

// Tipos serializados (con fechas como strings desde la API)
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

interface SerializedOrder {
  id: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  customerId: string;
  customerSnapshot: {
    name: string;
    email: string;
    phone?: string;
  };
  items: Array<{
    type: 'product' | 'onlineCourse';
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  totalAmount: number;
  createdAt: string; // Serializado como ISO string
  updatedAt: string; // Serializado como ISO string
}

interface CustomerDetailResponse {
  customer: SerializedCustomer;
  orders: SerializedOrder[];
}

export default function AdminClienteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<SerializedCustomer | null>(null);
  const [orders, setOrders] = useState<SerializedOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomer();
  }, [customerId]);

  const loadCustomer = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/customers/${customerId}`);
      if (!response.ok) throw new Error('Error al cargar cliente');
      const data: CustomerDetailResponse = await response.json();
      setCustomer(data.customer);
      setOrders(data.orders);
    } catch (error) {
      console.error('Error cargando cliente:', error);
    } finally {
      setLoading(false);
    }
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
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
      refunded: 'bg-orange-100 text-orange-800',
    };
    return styles[status] || styles.pending;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Cliente no encontrado</p>
        <Link href="/admin/clientes" className="text-pink-600 hover:text-pink-700 mt-4 inline-block">
          Volver a clientes
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-pink-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
              <p className="text-sm text-gray-500">ID: {customer.id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información de Contacto */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{customer.email}</p>
                </div>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="text-gray-900">{customer.phone}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Cliente desde</p>
                  <p className="text-gray-900">{formatDate(customer.createdAt)}</p>
                </div>
              </div>
              {customer.lastOrderAt && (
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Última compra</p>
                    <p className="text-gray-900">{formatDate(customer.lastOrderAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Historial de Compras */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Historial de Compras</h2>
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay compras registradas</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/ventas/${order.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-medium text-gray-900">Orden #{order.id.slice(0, 8)}</p>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(order.status)}`}>
                            {order.status}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                        <p className="text-xs text-gray-500 capitalize">{order.paymentMethod}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Cursos Inscritos */}
          {customer.enrolledCourses.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Cursos Inscritos</h2>
              <div className="space-y-3">
                {customer.enrolledCourses.map((enrollment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Curso {enrollment.courseId.slice(0, 8)}</p>
                        <p className="text-xs text-gray-500">
                          Acceso desde {formatDate(enrollment.accessFrom)}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/admin/ventas/${enrollment.orderId}`}
                      className="text-xs text-pink-600 hover:text-pink-700"
                    >
                      Ver orden →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Estadísticas */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Total de Órdenes</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{customer.totalOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Total Gastado</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{formatCurrency(customer.totalSpent)}</span>
              </div>
              {customer.enrolledCourses.length > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Cursos Activos</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{customer.enrolledCourses.length}</span>
                </div>
              )}
            </div>
          </div>

          {customer.tags && customer.tags.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Etiquetas</h2>
              <div className="flex flex-wrap gap-2">
                {customer.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-pink-100 text-pink-800 text-xs font-medium rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


/**
 * Panel Admin: Detalle de Orden
 * 
 * Muestra toda la información de una orden:
 * - Datos del cliente con enlace
 * - Items de la orden
 * - Estados y métodos de pago
 * - Acciones disponibles
 * - Historial de cambios
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock,
  CreditCard,
  Banknote,
  ArrowRightLeft,
  User,
  Mail,
  Phone,
  Package,
  DollarSign,
  Calendar
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import type { OrderStatus, PaymentStatus, PaymentMethod } from '@/types/firestore/order';
import { isDigitalCartItem } from '@/lib/utils/productHelpers';

// Tipo para orden serializada (con fechas como strings)
interface SerializedOrder {
  id: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  mpPaymentId?: string;
  mpPreferenceId?: string;
  externalReference?: string;
  customerId: string;
  customerSnapshot: {
    name: string;
    email: string;
    phone?: string;
  };
  items: Array<{
    type: 'product' | 'onlineCourse';
    productId?: string;
    courseId?: string;
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  totalAmount: number;
  currency: 'ARS';
  createdAt: string; // Serializado como ISO string
  updatedAt: string; // Serializado como ISO string
}

export default function AdminVentaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const orderId = params.id as string;

  const [order, setOrder] = useState<SerializedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) throw new Error('Error al cargar orden');
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Error cargando orden:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo cargar la orden',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string) => {
    setProcessing(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/actions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) throw new Error('Error al ejecutar acción');

      toast({
        title: 'Éxito',
        description: 'Orden actualizada correctamente',
      });

      loadOrder();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo ejecutar la acción',
      });
    } finally {
      setProcessing(false);
    }
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

  const getPaymentStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      refunded: 'bg-orange-100 text-orange-800',
    };
    return styles[status] || styles.pending;
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Orden no encontrada</p>
        <Link href="/admin/ventas" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
          Volver a ventas
        </Link>
      </div>
    );
  }

  // Verificar si hay productos físicos en la orden
  const hasPhysicalProducts = order.items.some(item => !isDigitalCartItem(item));
  const hasDigitalProducts = order.items.some(item => isDigitalCartItem(item));

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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orden #{order.id.slice(0, 8)}</h1>
            <p className="text-sm text-gray-500">Creada el {formatDate(order.createdAt)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {order.paymentStatus === 'pending' && order.paymentMethod === 'cash' && (
            <button
              onClick={() => handleAction('mark_as_paid')}
              disabled={processing}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              Marcar como Pagado
            </button>
          )}
          {order.status !== 'cancelled' && order.status !== 'refunded' && (
            <button
              onClick={() => handleAction('mark_as_cancelled')}
              disabled={processing}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Estados */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Estado de la Orden</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Estado</label>
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusBadge(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Estado de Pago</label>
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getPaymentStatusBadge(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Método de Pago</label>
                <div className="flex items-center gap-2">
                  {order.paymentMethod === 'mp' && <CreditCard className="w-4 h-4" />}
                  {order.paymentMethod === 'cash' && <Banknote className="w-4 h-4" />}
                  {order.paymentMethod === 'transfer' && <ArrowRightLeft className="w-4 h-4" />}
                  <span className="capitalize">{order.paymentMethod}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Total</label>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Items de la Orden</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-4 border-b border-gray-200 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.type === 'product' ? 'Producto' : 'Curso Online'}
                          {item.productId && ` • ID: ${item.productId.slice(0, 8)}`}
                          {item.courseId && ` • ID: ${item.courseId.slice(0, 8)}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(item.unitPrice)} × {item.quantity}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(item.total)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cliente */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cliente</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{order.customerSnapshot.name}</p>
                  <Link
                    href={`/admin/clientes/${order.customerId}`}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Ver perfil completo →
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <p className="text-sm text-gray-600">{order.customerSnapshot.email}</p>
              </div>
              {order.customerSnapshot.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <p className="text-sm text-gray-600">{order.customerSnapshot.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Información de Pago */}
          {order.paymentMethod === 'mp' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Mercado Pago</h2>
              <div className="space-y-2 text-sm">
                {order.mpPreferenceId && (
                  <div>
                    <span className="text-gray-500">Preferencia ID:</span>
                    <p className="font-mono text-xs text-gray-900 break-all">{order.mpPreferenceId}</p>
                  </div>
                )}
                {order.mpPaymentId && (
                  <div>
                    <span className="text-gray-500">Pago ID:</span>
                    <p className="font-mono text-xs text-gray-900 break-all">{order.mpPaymentId}</p>
                  </div>
                )}
                {order.externalReference && (
                  <div>
                    <span className="text-gray-500">Referencia Externa:</span>
                    <p className="font-mono text-xs text-gray-900 break-all">{order.externalReference}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Información de Retiro - Solo para productos físicos */}
          {hasPhysicalProducts && (
          <div className="bg-blue-50 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Retiro en Sucursal</h2>
            <p className="text-sm text-gray-700">
                {hasDigitalProducts 
                  ? 'Los productos físicos deben retirarse en nuestras sucursales. El cliente recibirá instrucciones por email.'
                  : 'Todos los pedidos deben retirarse en nuestras sucursales. El cliente recibirá instrucciones por email.'
                }
            </p>
          </div>
          )}
          
          {/* Información de Productos Digitales */}
          {hasDigitalProducts && (
            <div className="bg-green-50 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Productos Digitales</h2>
              <p className="text-sm text-gray-700">
                Esta orden contiene productos digitales o cursos online. El acceso se enviará automáticamente por email al cliente.
              </p>
            </div>
          )}

          {/* Fechas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Fechas</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Creada:</span>
                <p className="text-gray-900">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <span className="text-gray-500">Actualizada:</span>
                <p className="text-gray-900">{formatDate(order.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


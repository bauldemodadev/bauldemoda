/**
 * Página: Mis Pedidos
 * 
 * Muestra todas las órdenes del usuario autenticado con:
 * - Estado de la orden (pending, approved, rejected, cancelled, refunded)
 * - Estado del pago (pending, paid, refunded)
 * - Método de pago
 * - Items con imágenes
 * - Fechas
 * - Acciones según el estado
 */

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  CreditCard,
  Banknote,
  Eye,
  ShoppingBag,
} from 'lucide-react';
import type { OrderStatus, PaymentStatus, PaymentMethod } from '@/types/firestore/order';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import { getFormattedPickupLocations } from '@/lib/utils/pickupLocations';

interface OrderItem {
  type: 'product' | 'onlineCourse';
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  imageUrl?: string;
}

interface Order {
  id: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  totalAmount: number;
  currency: 'ARS';
  metadata?: {
    orderType?: 'curso_presencial';
    sede?: 'almagro' | 'ciudad-jardin';
  };
  createdAt: string;
  updatedAt: string;
}

const getStatusConfig = (status: OrderStatus, paymentStatus: PaymentStatus) => {
  if (status === 'approved' && paymentStatus === 'paid') {
    return {
      label: 'Aprobada y Pagada',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: CheckCircle2,
    };
  }
  if (status === 'approved' && paymentStatus === 'pending') {
    return {
      label: 'Aprobada - Pago Pendiente',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      icon: Clock,
    };
  }
  if (status === 'pending' && paymentStatus === 'pending') {
    return {
      label: 'Pendiente de Aprobación',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      icon: Clock,
    };
  }
  if (status === 'rejected') {
    return {
      label: 'Rechazada',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: XCircle,
    };
  }
  if (status === 'cancelled') {
    return {
      label: 'Cancelada',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      icon: XCircle,
    };
  }
  if (status === 'refunded' || paymentStatus === 'refunded') {
    return {
      label: 'Reembolsada',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      icon: RefreshCw,
    };
  }
  return {
    label: 'Desconocido',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    icon: Package,
  };
};

const getPaymentMethodLabel = (method: PaymentMethod): string => {
  switch (method) {
    case 'mp':
      return 'Mercado Pago';
    case 'cash':
      return 'Efectivo';
    case 'transfer':
      return 'Transferencia';
    default:
      return 'Otro';
  }
};

const getPaymentMethodIcon = (method: PaymentMethod) => {
  switch (method) {
    case 'mp':
      return CreditCard;
    case 'cash':
      return Banknote;
    case 'transfer':
      return RefreshCw;
    default:
      return CreditCard;
  }
};

const formatCurrency = (amount: number) => {
  if (amount % 1 === 0) {
    return amount.toLocaleString('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
  return amount.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function MisPedidosPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user?.email) {
      router.push(`/login?redirect=${encodeURIComponent('/mis-pedidos')}`);
      return;
    }

    if (user?.email) {
      loadOrders();
    }
  }, [user, authLoading, router]);

  const loadOrders = async () => {
    if (!user?.email) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/orders/my-orders?email=${encodeURIComponent(user.email)}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar las órdenes');
      }

      const data = await response.json();
      setOrders(data || []);
    } catch (err) {
      console.error('Error cargando órdenes:', err);
      setError('No se pudieron cargar tus pedidos. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D44D7D]"></div>
      </div>
    );
  }

  if (!user) {
    return null; // El redirect se maneja en useEffect
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadOrders}
              className="px-6 py-2 bg-[#E9ABBD] text-white rounded-lg hover:bg-[#D44D7D] transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Pedidos</h1>
          <p className="text-gray-600">Gestiona y revisa todas tus compras</p>
        </motion.div>

        {/* Lista de órdenes */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-sm p-12 text-center"
          >
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No tienes pedidos aún</h2>
            <p className="text-gray-600 mb-6">Cuando realices una compra, aparecerá aquí.</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E9ABBD] text-white rounded-lg hover:bg-[#D44D7D] transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              Ir a la tienda
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => {
              const statusConfig = getStatusConfig(order.status, order.paymentStatus);
              const StatusIcon = statusConfig.icon;
              const PaymentIcon = getPaymentMethodIcon(order.paymentMethod);

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Header de la orden */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Orden #{order.id.slice(0, 8).toUpperCase()}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor} border`}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />
                            {statusConfig.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1.5">
                            <PaymentIcon className="w-4 h-4" />
                            {getPaymentMethodLabel(order.paymentMethod)}
                          </span>
                          <span>Fecha: {formatDate(order.createdAt)}</span>
                          <span className="font-semibold text-gray-900">
                            Total: ${formatCurrency(order.totalAmount)}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/mis-pedidos/${order.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#D44D7D] hover:text-[#E9ABBD] transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Ver detalles
                      </Link>
                    </div>
                  </div>

                  {/* Items de la orden */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0"
                        >
                          <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                fill
                                className="object-cover"
                                sizes="64px"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              Cantidad: {item.quantity} × ${formatCurrency(item.unitPrice)}
                            </p>
                          </div>
                          <p className="font-semibold text-gray-900">
                            ${formatCurrency(item.total)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Información adicional para órdenes pendientes */}
                    {(order.status === 'pending' || order.paymentStatus === 'pending') && (
                      <div className="mt-4 p-4 bg-[#E9ABBD]/10 border border-[#E9ABBD] rounded-lg">
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-[#D44D7D] mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800 mb-1">
                              {order.paymentMethod === 'cash' && 'Pago en efectivo'}
                              {order.paymentMethod === 'transfer' && 'Pago por transferencia'}
                              {order.paymentMethod === 'mp' && 'Pago pendiente'}
                            </p>
                            <p className="text-sm text-gray-700">
                              {order.paymentMethod === 'cash' &&
                                'Tu orden está pendiente de aprobación. Deberás pagar en efectivo al retirar en la sucursal.'}
                              {order.paymentMethod === 'transfer' &&
                                'Tu orden está pendiente de aprobación. Realiza la transferencia y luego retira en la sucursal.'}
                              {order.paymentMethod === 'mp' &&
                                'Tu pago está siendo procesado. Te notificaremos cuando sea confirmado.'}
                            </p>
                            {order.metadata?.sede && (
                              <p className="text-sm text-gray-700 mt-2">
                                <strong>Retiro en:</strong>{' '}
                                {getFormattedPickupLocations([
                                  {
                                    sede: order.metadata.sede,
                                    locationText: null,
                                  },
                                ]).join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


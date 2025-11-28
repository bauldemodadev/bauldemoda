/**
 * Página: Detalle de Orden
 * 
 * Muestra el detalle completo de una orden con:
 * - Información completa de la orden
 * - Items con imágenes
 * - Estados y métodos de pago
 * - Información de retiro
 */

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
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
  ArrowLeft,
} from 'lucide-react';
import { CurrencyDollarIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';
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
  mpPaymentId?: string;
  mpPreferenceId?: string;
  externalReference?: string;
  customerSnapshot: {
    name: string;
    email: string;
    phone?: string;
  };
  items: OrderItem[];
  totalAmount: number;
  currency: 'ARS';
  metadata?: {
    orderType?: 'curso_presencial';
    sede?: 'almagro' | 'ciudad-jardin';
    pickupLocations?: string[];        // Lugares de retiro específicos (locationText de productos)
    hasGifts?: boolean;                // Indica si la orden contiene gift cards
    hasProductsWithPickup?: boolean;   // Indica si hay productos que requieren retiro
    [key: string]: any;
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

export default function OrderDetailPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user?.email) {
      router.push(`/login?redirect=${encodeURIComponent(`/mis-pedidos/${orderId}`)}`);
      return;
    }

    if (user?.email && orderId) {
      loadOrder();
    }
  }, [user, authLoading, orderId, router]);

  const loadOrder = async () => {
    if (!orderId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/orders/${orderId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Orden no encontrada');
        }
        throw new Error('Error al cargar la orden');
      }

      const data = await response.json();
      setOrder(data);
    } catch (err) {
      console.error('Error cargando orden:', err);
      setError(err instanceof Error ? err.message : 'No se pudo cargar la orden');
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

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-900 mb-2">Error</h2>
            <p className="text-red-700 mb-6">{error || 'No se pudo cargar la orden'}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={loadOrder}
                className="px-6 py-2 bg-[#E9ABBD] text-white rounded-lg hover:bg-[#D44D7D] transition-colors"
              >
                Reintentar
              </button>
              <Link
                href="/mis-pedidos"
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Volver a mis pedidos
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status, order.paymentStatus);
  const StatusIcon = statusConfig.icon;
  const PaymentIcon = getPaymentMethodIcon(order.paymentMethod);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link
            href="/mis-pedidos"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a mis pedidos
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Orden #{order.id.slice(0, 8).toUpperCase()}
              </h1>
              <p className="text-gray-600">Creada el {formatDate(order.createdAt)}</p>
            </div>
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor} border`}
            >
              <StatusIcon className="w-4 h-4" />
              {statusConfig.label}
            </div>
          </div>
        </motion.div>

        {/* Información de la orden */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Método de pago */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-sm font-medium text-gray-500 mb-2">Método de Pago</h3>
            <div className="flex items-center gap-3">
              <PaymentIcon className="w-6 h-6 text-[#D44D7D]" />
              <span className="text-lg font-semibold text-gray-900">
                {getPaymentMethodLabel(order.paymentMethod)}
              </span>
            </div>
            {order.mpPaymentId && (
              <p className="text-sm text-gray-500 mt-2">ID de pago: {order.mpPaymentId}</p>
            )}
          </motion.div>

          {/* Total */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total</h3>
            <p className="text-3xl font-bold text-gray-900">
              ${formatCurrency(order.totalAmount)}
            </p>
            <p className="text-sm text-gray-500 mt-1">{order.currency}</p>
          </motion.div>
        </div>

        {/* Items de la orden */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Productos</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0"
              >
                <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{item.name}</p>
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

          {/* Total */}
          <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-gray-900">
              ${formatCurrency(order.totalAmount)}
            </span>
          </div>
        </motion.div>

        {/* Información de retiro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#E9ABBD]/10 border border-[#E9ABBD] rounded-lg p-6 mb-6"
        >
          <h3 className="font-semibold text-[#D44D7D] mb-2">Retiro en Sucursal</h3>
          <p className="text-sm text-gray-700 mb-3">
            {order.items.length === 1 && order.metadata?.sede
              ? 'Tu pedido debe retirarse en:'
              : 'Tu pedido debe retirarse en una de nuestras sucursales:'}
          </p>
          <ul className="text-sm text-gray-700 space-y-1 mb-3">
            {/* Usar pickupLocations de metadata si están disponibles, sino usar sede */}
            {order.metadata?.pickupLocations && order.metadata.pickupLocations.length > 0 ? (
              order.metadata.pickupLocations.map((location: string, index: number) => (
                <li key={index}>• {location}</li>
              ))
            ) : (
              getFormattedPickupLocations(
                order.items.map(item => ({
                  sede: order.metadata?.sede || null,
                  locationText: null,
                }))
              ).map((location, index) => (
                <li key={index}>• {location}</li>
              ))
            )}
          </ul>
          {order.paymentMethod === 'cash' && (
            <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
              <CurrencyDollarIcon className="w-5 h-5 text-[#D44D7D]" />
              Pagarás en efectivo al momento del retiro. La orden quedará reservada por 48 horas.
            </p>
          )}
          {order.paymentMethod === 'transfer' && (
            <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
              <BuildingLibraryIcon className="w-5 h-5 text-[#D44D7D]" />
              Debes realizar la transferencia y luego retirar en la sucursal. La orden quedará reservada por 48 horas.
            </p>
          )}
        </motion.div>

        {/* Información del cliente */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Nombre</p>
              <p className="font-medium text-gray-900">{order.customerSnapshot.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{order.customerSnapshot.email}</p>
            </div>
            {order.customerSnapshot.phone && (
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <p className="font-medium text-gray-900">{order.customerSnapshot.phone}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}


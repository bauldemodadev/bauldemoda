/**
 * Página de Éxito del Checkout
 * 
 * Lee la orden desde Firestore y muestra:
 * - Confirmación de pago exitoso
 * - Detalles de la orden
 * - Items comprados
 * - Instrucciones de retiro
 */

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircleIcon, HomeIcon, ShoppingBagIcon, Package } from 'lucide-react';
import { CurrencyDollarIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';
import type { OrderStatus, PaymentStatus, PaymentMethod } from '@/types/firestore/order';
import { getFormattedPickupLocations } from '@/lib/utils/pickupLocations';
import Image from 'next/image';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';

// Tipo serializado para orden (con fechas como strings desde la API)
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
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
    imageUrl?: string;
  }>;
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
  createdAt: string; // Serializado como ISO string
  updatedAt: string; // Serializado como ISO string
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<SerializedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const orderId = searchParams.get('orderId') || searchParams.get('external_reference');
    
    if (!orderId) {
      setError('No se encontró el ID de la orden');
      setLoading(false);
      return;
    }

    loadOrder(orderId);
  }, [searchParams]);

  const loadOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) {
        throw new Error('Orden no encontrada');
      }
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Error cargando orden:', error);
      setError('No se pudo cargar la información de la orden');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    // Formatear sin decimales si el valor es entero
    if (amount % 1 === 0) {
      return amount.toLocaleString('es-AR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
    }
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-red-600 mb-4">{error || 'Orden no encontrada'}</p>
          <Link href="/" className="text-pink-600 hover:text-pink-700">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header de éxito */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="mx-auto flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6">
            <CheckCircleIcon className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">¡Pago exitoso!</h1>
          <p className="text-lg text-gray-600 mb-4">
            Gracias por tu compra. Tu pedido ha sido procesado correctamente.
          </p>
          <div className="text-sm text-gray-500">
            <p>ID de orden: {order.id}</p>
            {order.mpPaymentId && <p>Pago ID: {order.mpPaymentId}</p>}
          </div>
        </motion.div>

        {/* Detalles de la orden */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalles de tu orden</h2>
          
          {/* Items */}
          <div className="space-y-4 mb-6">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-4 border-b border-gray-200 last:border-0">
                <div className="flex items-center gap-4">
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
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Cantidad: {item.quantity} × {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">{formatCurrency(item.total)}</p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-gray-900">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        {/* Información de retiro */}
        <div className="bg-[#E9ABBD]/10 border border-[#E9ABBD] rounded-lg p-6 mb-6">
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
        </div>

        {/* Acciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <HomeIcon className="w-5 h-5" />
            Continuar comprando
          </Link>
          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            <ShoppingBagIcon className="w-5 h-5" />
            Ver más productos
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

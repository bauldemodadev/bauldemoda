/**
 * Página de Error en el Pago
 * 
 * Muestra mensaje de error y opciones para reintentar
 */

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { XCircleIcon, ArrowLeftIcon, HomeIcon, ShoppingBagIcon } from 'lucide-react';
import type { OrderStatus, PaymentStatus, PaymentMethod } from '@/types/firestore/order';

// Tipo serializado para orden (con fechas como strings desde la API)
interface SerializedOrder {
  id: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
}

export default function FailurePage() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<SerializedOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = searchParams.get('orderId') || searchParams.get('external_reference');
    
    if (orderId) {
      loadOrder(orderId);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const loadOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      }
    } catch (error) {
      console.error('Error cargando orden:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <motion.div className="text-center mb-12">
          <div className="mx-auto flex items-center justify-center w-24 h-24 rounded-full bg-red-100 mb-6">
            <XCircleIcon className="w-16 h-16 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Pago no procesado</h1>
          <p className="text-lg text-gray-600 mb-4">
            Lo sentimos, no se pudo procesar tu pago. Por favor, intenta nuevamente.
          </p>
          {order && (
            <div className="text-sm text-gray-500">
              <p>ID de orden: {order.id}</p>
            </div>
          )}
        </motion.div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">¿Qué puedes hacer?</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <ArrowLeftIcon className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium">Reintentar el pago</p>
                <p className="text-sm text-gray-500">Vuelve al carrito e intenta el pago nuevamente</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <HomeIcon className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium">Continuar comprando</p>
                <p className="text-sm text-gray-500">Explora más productos en nuestra tienda</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <ShoppingBagIcon className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium">Contactar soporte</p>
                <p className="text-sm text-gray-500">Si el problema persiste, contáctanos</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/cart"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Volver al carrito
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <HomeIcon className="w-5 h-5" />
            Ir al inicio
          </Link>
          <Link
            href="/contacto"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            <ShoppingBagIcon className="w-5 h-5" />
            Contactar
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

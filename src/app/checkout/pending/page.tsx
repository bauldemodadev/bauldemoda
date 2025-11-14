/**
 * Página de Pago Pendiente
 * 
 * Muestra estado de pago pendiente y verifica periódicamente
 */

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ClockIcon, HomeIcon, ShoppingBagIcon } from 'lucide-react';
import type { Order } from '@/types/firestore/order';

export default function PendingPage() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingStatus, setCheckingStatus] = useState(false);

  useEffect(() => {
    const orderId = searchParams.get('orderId') || searchParams.get('external_reference');
    
    if (!orderId) {
      setLoading(false);
      return;
    }

    loadOrder(orderId);

    // Verificar estado cada 10 segundos
    const interval = setInterval(() => {
      checkOrderStatus(orderId);
    }, 10000);

    return () => clearInterval(interval);
  }, [searchParams]);

  const loadOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
        
        // Si el pago ya fue aprobado, redirigir a success
        if (data.paymentStatus === 'paid' && data.status === 'approved') {
          window.location.href = `/checkout/success?orderId=${orderId}`;
        }
      }
    } catch (error) {
      console.error('Error cargando orden:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkOrderStatus = async (orderId: string) => {
    if (checkingStatus) return;
    
    setCheckingStatus(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
        
        // Si el pago fue aprobado, redirigir
        if (data.paymentStatus === 'paid' && data.status === 'approved') {
          window.location.href = `/checkout/success?orderId=${orderId}`;
        }
      }
    } catch (error) {
      console.error('Error verificando estado:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <motion.div className="text-center mb-12">
          <div className="mx-auto flex items-center justify-center w-24 h-24 rounded-full bg-yellow-100 mb-6">
            <ClockIcon className="w-16 h-16 text-yellow-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Pago pendiente</h1>
          <p className="text-lg text-gray-600 mb-4">
            Tu pago está siendo procesado. Te notificaremos cuando se complete.
          </p>
          {order && (
            <div className="text-sm text-gray-500">
              <p>ID de orden: {order.id}</p>
            </div>
          )}
          
          {checkingStatus && (
            <div className="flex items-center justify-center mt-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-yellow-500 mr-2"></div>
              <span className="text-sm text-gray-600">Verificando estado...</span>
            </div>
          )}
        </motion.div>

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

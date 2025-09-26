"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from '@/context/AuthContext';
import { api } from "@/lib/api";
import { useCart } from "@/lib/hooks/useCart";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  HomeIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

interface OrderData {
  status: string;
  orderId?: string;
}

const PendingPage = () => {
  const { user } = useAuth();
  const { carritoRemotoId } = useCart();
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<string>("pending");
  const [checkingStatus, setCheckingStatus] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;

    const externalReference = searchParams.get("external_reference");
    const status = searchParams.get("status");
    
    if (externalReference) {
      setOrderId(externalReference);
    }

    setLoading(false);

    // Verificar el estado de la orden cada 10 segundos
    if (externalReference) {
      const interval = setInterval(() => {
        checkOrderStatus(externalReference);
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [searchParams]);

  const checkOrderStatus = async (orderId: string) => {
    if (checkingStatus) return;
    
    setCheckingStatus(true);
    try {
      const orderData = await api.get<OrderData>(`/orders/${encodeURIComponent(orderId)}`);
      if (orderData && orderData.status && orderData.status !== "pending") {
        setOrderStatus(orderData.status);
      }
    } catch (error) {
      console.error("Error verificando estado de la orden:", error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const features = [
    {
      icon: HomeIcon,
      title: "Continuar comprando",
      description: "Mientras tanto, puedes seguir explorando productos",
      action: "Ir a la tienda",
      href: "/",
    },
    {
      icon: ShoppingBagIcon,
      title: "Ver mis pedidos",
      description: "Revisa el estado de todos tus pedidos",
      action: "Ver pedidos",
      href: "/orders",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { delayChildren: 0.3, staggerChildren: 0.2 },
          },
        }}
        className="max-w-4xl mx-auto"
      >
        <motion.div 
          variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} 
          className="text-center mb-12"
        >
          <div className="mx-auto flex items-center justify-center w-24 h-24 rounded-full bg-yellow-100 mb-6">
            <ClockIcon className="w-16 h-16 text-yellow-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Pago pendiente</h1>
          <p className="text-lg text-gray-600 mb-4">
            Tu pago está siendo procesado. Te notificaremos cuando se complete.
          </p>
          {orderId && (
            <p className="text-sm text-gray-500">ID de orden: {orderId}</p>
          )}
          
          {checkingStatus && (
            <div className="flex items-center justify-center mt-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-yellow-500 mr-2"></div>
              <span className="text-sm text-gray-600">Verificando estado...</span>
            </div>
          )}
        </motion.div>

        <motion.div
          variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-12"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">¿Qué significa esto?</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-3">
              <ClockIcon className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <p>Tu pago se encuentra en proceso de verificación</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p>Recibirás una confirmación por email cuando se apruebe</p>
            </div>
            <div className="flex items-start space-x-3">
              <XCircleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p>Si es rechazado, podrás intentar nuevamente</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <Icon className="w-8 h-8 text-yellow-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{feature.description}</p>
                  <Link 
                    href={feature.href} 
                    className="text-yellow-600 font-medium text-sm hover:underline"
                  >
                    {feature.action}
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información importante</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Los pagos pendientes pueden tardar hasta 24 horas en procesarse</li>
            <li>• Te enviaremos una notificación por email cuando se complete</li>
            <li>• Puedes revisar el estado en cualquier momento desde "Mis Pedidos"</li>
            <li>• Si tienes dudas, no dudes en contactarnos</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PendingPage;

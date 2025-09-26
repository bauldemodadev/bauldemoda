"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from '@/context/AuthContext';
import { api } from "@/lib/api";
import { useCart } from "@/lib/hooks/useCart";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  CheckCircleIcon,
  TruckIcon,
  DocumentTextIcon,
  HomeIcon,
  ShoppingBagIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { PLACEHOLDER_IMAGE } from '@/lib/constants'

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
  image?: string;
}

interface Order {
  orderId: string;
  items: OrderItem[];
  total: number;
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    dni: string;
  };
  deliveryInfo: {
    address: string;
    city: string;
    postalCode: string;
    deliveryMethod: string;
  };
  status: string;
  createdAt: any;
}

const SuccessPage = () => {
  const { user } = useAuth();
  const { carritoRemotoId } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFade, setShowFade] = useState(true);
  const [orderUpdated, setOrderUpdated] = useState(false);
  const [numeroPedido, setNumeroPedido] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [ventaCreated, setVentaCreated] = useState(false);
  const processExecuted = useRef(false);
  const searchParams = useSearchParams();

  const cargarOrdenProcesada = async (externalReference: string, orderData: any) => {
    try {
      console.log('📦 Cargando orden ya procesada:', externalReference);
      
      // Convertir los datos guardados al formato de la UI
      const convertedItems = (orderData.items || []).map((item: any) => ({
        ...item,
        totalPrice: (item.price || 0) * (item.quantity || 1)
      }));
      
      const convertedOrder: Order = {
        orderId: orderData.id || externalReference,
        items: convertedItems,
        total: orderData.total || convertedItems.reduce((sum: number, item: any) => sum + item.totalPrice, 0),
        customerInfo: {
          fullName: orderData.customerInfo?.nombre || "",
          email: orderData.customerInfo?.email || "",
          phone: orderData.customerInfo?.telefono || "",
          dni: orderData.customerInfo?.dni || ""
        },
        deliveryInfo: {
          address: orderData.deliveryInfo?.direccion || "",
          city: orderData.deliveryInfo?.ciudad || "",
          postalCode: orderData.deliveryInfo?.codigoPostal || "",
          deliveryMethod: orderData.deliveryInfo?.metodoEntrega || ""
        },
        status: "success",
        createdAt: orderData.createdAt || new Date().toISOString()
      };
      
      setOrder(convertedOrder);
      
      // Si hay número de pedido guardado, mostrarlo
      if (orderData.numeroPedido) {
        setNumeroPedido(orderData.numeroPedido);
      }
      
    } catch (error) {
      console.error('❌ Error al cargar orden procesada:', error);
    }
  };

  useEffect(() => {
    if (!searchParams) return; // 🔒 Seguridad contra null

    const externalReference = searchParams.get("external_reference");
    const paymentId = searchParams.get("payment_id");
    const status = searchParams.get("status");
    const collectionStatus = searchParams.get("collection_status");

    if (!externalReference) {
      console.error("No se encontró referencia de la orden");
      setLoading(false);
      return;
    }

    // Verificar si esta orden ya fue procesada (anti-duplicación)
    const processedOrders = JSON.parse(localStorage.getItem('processedOrders') || '{}');
    if (processedOrders[externalReference]) {
      console.log('✅ Orden ya fue procesada anteriormente, cargando datos...');
      setLoading(false);
      // Cargar datos de la orden ya procesada
      cargarOrdenProcesada(externalReference, processedOrders[externalReference]);
      return;
    }

    // Esperar a que el usuario esté disponible
    if (!user?.email) {
      console.log('⏳ Esperando datos del usuario...');
      return;
    }

    // Marcar como ejecutado para prevenir duplicación
    processExecuted.current = true;

    const processSuccessPayment = async () => {
      try {
        // 1. Obtener la orden desde la API externa
        const orderResponse = await fetch(`/api/orders/${encodeURIComponent(externalReference)}`);
        
        if (!orderResponse.ok) {
          throw new Error(`Error al obtener orden: ${orderResponse.status}`);
        }
        
        const orderData = await orderResponse.json();
        console.log('📦 Orden obtenida:', orderData);
        
            if (orderData && orderData.data) {
              // Convertir la estructura de tu API externa al formato esperado por la UI
              const convertedItems = (orderData.data.items || []).map((item: any) => ({
                ...item,
                totalPrice: (item.price || 0) * (item.quantity || 1)
              }));
              
              const convertedOrder: Order = {
                orderId: orderData.data.id || externalReference,
                items: convertedItems,
                total: orderData.data.total || convertedItems.reduce((sum: number, item: any) => sum + item.totalPrice, 0),
                customerInfo: {
                  fullName: orderData.data.customerInfo?.nombre || "",
                  email: orderData.data.customerInfo?.email || "",
                  phone: orderData.data.customerInfo?.telefono || "",
                  dni: orderData.data.customerInfo?.dni || ""
                },
                deliveryInfo: {
                  address: orderData.data.deliveryInfo?.direccion || "",
                  city: orderData.data.deliveryInfo?.ciudad || "",
                  postalCode: orderData.data.deliveryInfo?.codigoPostal || "",
                  deliveryMethod: orderData.data.deliveryInfo?.metodoEntrega || ""
                },
                status: "success",
                createdAt: orderData.data.createdAt || new Date().toISOString()
              };
          
          setOrder(convertedOrder);
          
          // 2. Actualizar estado de la orden a "success" (solo si no está ya en success)
          if (orderData.data.status !== "success") {
            console.log('🔄 Actualizando estado de orden a success...');
            await updateOrderStatus(externalReference);
          } else {
            console.log('✅ Orden ya está en estado success, saltando actualización');
          }
          
          // 3. Crear la venta final (solo si no existe markedSuccessAt)
          if (!orderData.data.markedSuccessAt) {
            console.log('🔄 Creando venta final...');
            await createVentaFromOrder(orderData.data, externalReference);
          } else {
            console.log('✅ Venta ya fue creada anteriormente (markedSuccessAt existe), saltando creación');
            // Marcar esta orden como procesada en localStorage
            const processedOrders = JSON.parse(localStorage.getItem('processedOrders') || '{}');
            processedOrders[externalReference] = {
              ...orderData.data,
              processedAt: new Date().toISOString()
            };
            localStorage.setItem('processedOrders', JSON.stringify(processedOrders));
            console.log('✅ Orden ya procesada marcada en localStorage');
            
            // Buscar el número de pedido existente
            await buscarNumeroPedidoExistente(externalReference);
          }
        } else {
          throw new Error("No se encontró la orden");
        }

      } catch (error) {
        console.error("❌ Error al procesar el pago exitoso:", error);
        setErrorMessage("Error al procesar la compra. Contacta soporte con el ID: " + externalReference);
      } finally {
        setLoading(false);
      }
    };

    const updateOrderStatus = async (orderId: string) => {
      try {
        const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}/mark-success`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`Error al actualizar estado: ${response.status}`);
        }
        
        console.log("Estado de la orden actualizado a success");
      } catch (error) {
        console.error("Error al actualizar el estado de la orden:", error);
      }
    };

    const buscarNumeroPedidoExistente = async (externalReference: string) => {
      try {
        console.log('🔍 Buscando número de pedido existente para:', externalReference);
        
        // Crear un endpoint para buscar ventas existentes por externalReference
        const response = await fetch(`/api/ventas/buscar/${encodeURIComponent(externalReference)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.numeroPedido) {
            console.log('✅ Número de pedido encontrado:', result.numeroPedido);
            setNumeroPedido(result.numeroPedido);
          } else {
            console.log('⚠️ No se encontró número de pedido existente');
          }
        } else {
          console.log('⚠️ No se pudo buscar el número de pedido existente');
        }
      } catch (error) {
        console.error('❌ Error al buscar número de pedido existente:', error);
      }
    };

    const createVentaFromOrder = async (orderData: Order, externalReference: string) => {
      if (ventaCreated) {
        console.log('⚠️ Venta ya creada en esta sesión, saltando...');
        return;
      }
      
      try {
        setVentaCreated(true);
        console.log('🔄 Iniciando creación de venta...');
        
        // Obtener email del usuario de manera segura
        const userEmail = user?.email || orderData.customerInfo?.email || 'usuario@desconocido.com';
        
        console.log('🔄 Creando venta con datos:', { 
          externalReference, 
          userEmail,
          orderData: {
            customerInfo: orderData.customerInfo,
            deliveryInfo: orderData.deliveryInfo,
            items: orderData.items,
            total: orderData.total,
            id: orderData.orderId
          }
        });

        const response = await fetch('/api/save-venta', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            externalReference,
            orderData,
            userEmail
          }),
        });

        const result = await response.json();
        
        if (result.success) {
          setNumeroPedido(result.numeroPedido);
          
          // Marcar esta orden como procesada en localStorage
          const processedOrders = JSON.parse(localStorage.getItem('processedOrders') || '{}');
          processedOrders[externalReference] = {
            ...orderData,
            numeroPedido: result.numeroPedido,
            processedAt: new Date().toISOString()
          };
          localStorage.setItem('processedOrders', JSON.stringify(processedOrders));
          console.log('✅ Orden marcada como procesada en localStorage');
          
        } else {
          console.error('❌ Error al crear la venta:', result.error);
          setVentaCreated(false); // Reset para permitir reintento
        }
      } catch (error) {
        console.error('❌ Error al crear la venta:', error);
        setVentaCreated(false); // Reset para permitir reintento
      }
    };

    const clearCart = async () => {
      try {
        if (user?.uid && carritoRemotoId) {
          await api.delete(`/carts/${encodeURIComponent(carritoRemotoId)}/clear`);
        }
        localStorage.removeItem("cart");
      } catch (error) {
        console.error("Error al limpiar el carrito:", error);
      }
    };

    processSuccessPayment();
    clearCart();

    const timer = setTimeout(() => {
      setShowFade(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [user?.email, carritoRemotoId, searchParams]);

  const features = [
    {
      icon: TruckIcon,
      title: "Seguimiento de envío",
      description: "Te mantendremos informado sobre el estado de tu pedido",
      action: "Rastrear pedido",
      href: "/orders",
    },
    {
      icon: DocumentTextIcon,
      title: "Detalles del pedido",
      description: "Revisa los detalles completos de tu compra",
      action: "Ver detalles",
      href: "/orders",
    },
    {
      icon: HomeIcon,
      title: "Seguir comprando",
      description: "Explora más productos en nuestra tienda",
      action: "Ir a la tienda",
      href: "/",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mx-auto flex items-center justify-center w-24 h-24 rounded-full bg-red-100 mb-6">
            <XCircleIcon className="w-16 h-16 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Error al cargar la orden</h1>
          <p className="text-lg text-gray-600 mb-6">{errorMessage}</p>
          <div className="space-x-4">
            <Link 
              href="/orders" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Ver mis pedidos
            </Link>
            <Link 
              href="/" 
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Ir a la tienda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <AnimatePresence>
        {showFade && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeOut" } }}
            className="fixed inset-0 bg-green-500 z-50 flex items-center justify-center"
          >
            <CheckCircleIcon className="w-24 h-24 text-white" />
          </motion.div>
        )}
      </AnimatePresence>

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
        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="text-center mb-12">
          <div className="mx-auto flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6">
            <CheckCircleIcon className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">¡Pago exitoso!</h1>
          <p className="text-lg text-gray-600">
            Gracias por tu compra. Tu pedido ha sido procesado correctamente.
          </p>
          {order && (
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-500">ID de orden: {order.orderId}</p>
              {numeroPedido && (
                <p className="text-sm font-medium text-green-600">Número de pedido: {numeroPedido}</p>
              )}
            </div>
          )}
        </motion.div>

        {order && (
          <motion.div
            variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-12"
          >
            <div className="flex items-center gap-2 mb-6">
              <ShoppingBagIcon className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Resumen de tu compra</h2>
            </div>

            {order.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-0">
                <div className="relative h-20 w-20 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image || PLACEHOLDER_IMAGE}
                    alt={item.name}
                    className="rounded-lg object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                  <p className="text-sm font-medium text-gray-900">
                    ${item.price.toFixed(2)} c/u
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base font-semibold text-gray-900">
                    ${item.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}

            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Información de envío</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Dirección de entrega:</p>
                  <p className="font-medium text-gray-900">{order.deliveryInfo.address}</p>
                  <p className="font-medium text-gray-900">
                    {order.deliveryInfo.city}, {order.deliveryInfo.postalCode}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Método de envío:</p>
                  <p className="font-medium text-gray-900">{order.deliveryInfo.deliveryMethod}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <div className="flex justify-between items-center">
                <p className="text-base font-semibold text-gray-900">Total</p>
                <p className="text-xl font-bold text-gray-900">${order.total.toFixed(2)}</p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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
                  <Icon className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{feature.description}</p>
                  <Link href={feature.href} className="text-green-600 font-medium text-sm hover:underline">
                    {feature.action}
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;

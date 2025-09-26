"use client";

import { useEffect, useState } from "react";
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api'
import Link from "next/link";
import { CheckCircleIcon, ClockIcon, XCircleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { motion } from "framer-motion";
import { ProductImage } from '@/components/ui/ProductImage'

// Define a type for the product based on the external API structure
interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  cantidad: number;
  precio: number;
  unidad: string;
  alto: number;
  ancho: number;
  largo: number;
  cepilladoAplicado: boolean;
  imagen?: string; // Campo opcional para la imagen del producto
}

// Define a type for the shipping information
interface Envio {
  estado: string;
  direccion: string;
  transportista: string;
  fechaEntrega: string;
}

// Define a type for the client
interface Cliente {
  nombre: string;
  telefono: string;
}

// Define a type for the order based on the external API structure
interface Order {
  id: string;
  numeroPedido: string;
  estado: string;
  total: number;
  fecha: string;
  fechaEntrega: string;
  medioPago: string;
  productos: Producto[];
  envio: Envio;
  cliente: Cliente;
}

// Define the API response structure for single order
interface OrderApiResponse {
  success: boolean;
  data: Order;
}

// Función para calcular el precio correcto según la unidad del producto
const calcularPrecioProducto = (producto: Producto): number => {
  // Para productos de madera con unidad M2, el precio ya incluye la cantidad
  if (producto.categoria === "Maderas" && producto.unidad === "M2") {
    return producto.precio;
  }
  // Para todos los demás productos, multiplicar precio por cantidad
  return producto.precio * producto.cantidad;
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { user: session, isLoading: loadingState } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!session?.email) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get<OrderApiResponse>(`/orders/${encodeURIComponent(params.id)}?userId=${encodeURIComponent(session.email)}`);
        if (response.success && response.data) {
          setOrder(response.data);
        } else {
          setError("Pedido no encontrado");
        }
      } catch (error) {
        console.error("Error al obtener el pedido:", error);
        setError("Ocurrió un error al cargar el pedido");
      } finally {
        setLoading(false);
      }
    };
    if (session) {
      fetchOrder();
    } else if (!loadingState) {
      setLoading(false);
    }
  }, [session, loadingState, params.id]);

  if (loadingState || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!session && !loadingState) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Primero inicia sesión</h1>
        <button
          onClick={() => (window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`)}
          className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
        >
          Iniciar Sesión
        </button>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="mb-6">{error || "No pudimos encontrar el pedido solicitado."}</p>
        <Link
          href="/orders"
          className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
        >
          Volver a mis pedidos
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/orders"
            className="inline-flex items-center text-black hover:text-gray-700 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Volver a mis pedidos
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Pedido #{order.numeroPedido}</h1>
              <p className="text-sm text-gray-500">
                {new Date(order.fecha).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            <div className="mt-2 md:mt-0">
              {order.estado === "pagado" ? (
                <div className="flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-full">
                  <CheckCircleIcon className="h-5 w-5 mr-1" />
                  <span>Pagado</span>
                </div>
              ) : order.estado === "pendiente" ? (
                <div className="flex items-center text-yellow-600 bg-yellow-50 px-4 py-2 rounded-full">
                  <ClockIcon className="h-5 w-5 mr-1" />
                  <span>Pendiente</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600 bg-red-50 px-4 py-2 rounded-full">
                  <XCircleIcon className="h-5 w-5 mr-1" />
                  <span>{order.estado}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Productos del pedido */}
          <div className="mb-8">
            <h2 className="font-medium text-xl mb-4">Productos del pedido</h2>
            <div className="space-y-4">
              {order.productos && order.productos.length > 0 ? (
                order.productos.map((producto, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="flex items-start p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden mr-6 flex-shrink-0">
                      {producto.imagen ? (
                        <ProductImage
                          src={producto.imagen}
                          alt={producto.nombre}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500 text-xs text-center">Sin imagen</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">{producto.nombre}</h3>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                              {producto.categoria}
                            </span>
                            {producto.cepilladoAplicado && (
                              <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                                Cepillado aplicado
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-sm text-gray-500">
                            {producto.unidad === "M2" && producto.categoria === "Maderas" 
                              ? "Precio total" 
                              : "Precio unitario"
                            }
                          </p>
                          <p className="font-bold text-lg text-gray-900">${producto.precio.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Cantidad</p>
                          <p className="font-medium">{producto.cantidad} {producto.unidad}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Dimensiones</p>
                          <p className="font-medium">{producto.ancho}m × {producto.largo}m × {producto.alto}m</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Subtotal</p>
                          <p className="font-medium">${calcularPrecioProducto(producto).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Unidad</p>
                          <p className="font-medium">{producto.unidad}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 italic text-center py-8">No hay productos en este pedido</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="font-medium text-xl mb-3">Información del cliente</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm mb-2">
                  <span className="font-medium">Nombre:</span> {order.cliente.nombre}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Teléfono:</span> {order.cliente.telefono}
                </p>
              </div>
            </div>
            <div>
              <h2 className="font-medium text-xl mb-3">Información de envío</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm mb-2">
                  <span className="font-medium">Estado:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    order.envio.estado === 'entregado' ? 'bg-green-100 text-green-800' :
                    order.envio.estado === 'en camino' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.envio.estado}
                  </span>
                </p>
                <p className="text-sm mb-2">
                  <span className="font-medium">Dirección:</span> {order.envio.direccion}
                </p>
                <p className="text-sm mb-2">
                  <span className="font-medium">Transportista:</span> {order.envio.transportista}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Fecha de entrega:</span> {new Date(order.envio.fechaEntrega).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="font-medium text-xl mb-3">Detalles del pago</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm mb-2">
                  <span className="font-medium">Total:</span> ${order.total.toLocaleString()}
                </p>
                <p className="text-sm mb-2">
                  <span className="font-medium">Estado:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    order.estado === 'pagado' ? 'bg-green-100 text-green-800' :
                    order.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.estado}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-medium">Medio de pago:</span> {order.medioPago}
                </p>
              </div>
            </div>
            <div>
              <h2 className="font-medium text-xl mb-3">Fechas importantes</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm mb-2">
                  <span className="font-medium">Fecha del pedido:</span> {new Date(order.fecha).toLocaleDateString('es-ES')}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Fecha de entrega:</span> {new Date(order.fechaEntrega).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-sm text-gray-500">Total del pedido</p>
                <p className="text-3xl font-bold text-gray-900">${order.total.toLocaleString()}</p>
              </div>
              <div className="flex flex-col items-start md:items-end">
                <p className="text-sm text-gray-500">Estado del envío</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.envio.estado === 'entregado' ? 'bg-green-100 text-green-800' :
                  order.envio.estado === 'en camino' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.envio.estado}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 
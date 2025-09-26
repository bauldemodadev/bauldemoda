"use client";

import { useEffect, useState } from "react";
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api'
import Link from "next/link";
import { CheckCircleIcon, ClockIcon, XCircleIcon } from "@heroicons/react/24/outline";
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

// Define the API response structure
interface OrdersApiResponse {
  success: boolean;
  data: Order[];
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

export default function OrdersPage() {
  const { user: session, isLoading: loadingState } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.email) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get<OrdersApiResponse>(`/orders?userId=${encodeURIComponent(session.email)}`);
        
        // Ordenar por fecha más reciente (asumiendo que fecha es string YYYY-MM-DD)
        const sortedOrders = response.data.sort((a, b) => {
          const dateA = new Date(a.fecha);
          const dateB = new Date(b.fecha);
          return dateB.getTime() - dateA.getTime();
        });
        
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error al obtener los pedidos:", error);
        setError("Ocurrió un error al cargar tus pedidos");
      } finally {
        setLoading(false);
      }
    };
    if (session) {
      fetchOrders();
    } else if (!loadingState) {
      setLoading(false);
    }
  }, [session, loadingState]);

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

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="mb-6">{error}</p>
        <Link
          href="/"
          className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-8 text-center"
        >
          Mis Pedidos
        </motion.h1>
        
        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-10 rounded-xl shadow-lg text-center"
          >
            <div className="mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-6 text-lg">No tienes pedidos aún.</p>
            <Link
              href="/shop"
              className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition inline-block transform hover:scale-105 duration-300"
            >
              Ir a la tienda
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: Order, index: number) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold">Pedido #{order.numeroPedido}</h2>
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

                <div className="mb-4">
                  <h3 className="font-medium mb-2">Productos</h3>
                  <div className="space-y-3">
                    {order.productos && order.productos.length > 0 ? (
                      order.productos.slice(0, 2).map((producto, idx) => (
                        <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          {producto.imagen ? (
                            <ProductImage
                              src={producto.imagen}
                              alt={producto.nombre}
                              width={80}
                              height={80}
                              className="rounded-md mr-4"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center mr-4">
                              <span className="text-gray-500 text-xs text-center">Sin imagen</span>
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{producto.nombre}</h4>
                            <p className="text-sm text-gray-600">
                              {producto.unidad === "M2" && producto.categoria === "Maderas" 
                                ? `${producto.cantidad} ${producto.unidad} - $${producto.precio.toLocaleString()}`
                                : `${producto.cantidad} x $${producto.precio.toLocaleString()} (${producto.unidad})`
                              }
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {producto.categoria}
                              </span>
                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                {producto.ancho}m × {producto.largo}m × {producto.alto}m
                              </span>
                              {producto.cepilladoAplicado && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  Cepillado
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <p className="font-semibold text-lg text-gray-900">
                              ${calcularPrecioProducto(producto).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No hay productos en este pedido</p>
                    )}
                    {order.productos && order.productos.length > 2 && (
                      <div className="text-center pt-2">
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          +{order.productos.length - 2} productos más
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500">Total del pedido</p>
                    <p className="text-2xl font-bold text-gray-900">${order.total.toLocaleString()}</p>
                  </div>
                  <Link
                    href={`/orders/${order.id}`}
                    className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors transform hover:scale-105 duration-200"
                  >
                    Ver detalles completos
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
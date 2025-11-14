import { useEffect, useState, useRef } from "react";
import { useAuth } from '@/context/AuthContext';
import { api } from "@/lib/api";
import { auth } from "@/lib/firebase/client";

interface CartItem {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
  image: string;
  slug?: string;
  productId?: string;
  discount: {
    percentage: number;
    amount: number;
  };
  srcUrl?: string;
  activePromo?: {
    cantidad: number;
    descuento: number;
    precioFinal: number;
  };
  // ID del item en el carrito remoto, si existe
  remoteItemId?: string;
}

interface CartData {
  items: CartItem[];
  adjustedTotalPrice?: number;
}

export function useCart() {
  const { user } = useAuth();
  const [cart, setCartState] = useState<CartData>({ items: [] });
  const [loading, setLoading] = useState(true);
  const [carritoRemotoId, setCarritoRemotoId] = useState<string | null>(null);

  const hasSynced = useRef(false);

  // Función auxiliar para leer localStorage
  const getLocalCart = (): CartItem[] => {
    try {
      const data = localStorage.getItem("cart");
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error leyendo carrito local:", error);
      return [];
    }
  };

  // Escuchar cambios en localStorage con un custom event "cartUpdate"
  useEffect(() => {
    const handleCartUpdate = () => {
      const localCart = getLocalCart();
      setCartState({ items: localCart });
    };

    window.addEventListener("cartUpdate", handleCartUpdate);
    return () => window.removeEventListener("cartUpdate", handleCartUpdate);
  }, []);

  // Tipos remotos mínimos
  type ItemCarritoRemoto = {
    itemId: string;
    productoId: string;
    nombreProducto: string;
    sku?: string;
    imagenUrl?: string;
    atributos?: Record<string, string>;
    precioUnitario: number;
    cantidad: number;
  };

  type CarritoRemoto = {
    carritoId: string;
    usuarioId?: string | null;
    estado?: string;
    items: ItemCarritoRemoto[];
    moneda?: string;
    actualizadoEn?: string;
  };

  const mapItemRemotoALocal = (ri: ItemCarritoRemoto): CartItem => {
    // Tu API externa guarda los datos en ri.atributos
    const attrs = ri.atributos || {};
    return {
      id: attrs.productoId || attrs.itemId || ri.productoId,
      productId: attrs.productoId || ri.productoId,
      name: attrs.nombreProducto || ri.nombreProducto,
      price: Number(attrs.precioUnitario || ri.precioUnitario) || 0,
      quantity: Number(attrs.cantidad || ri.cantidad) || 0,
      totalPrice: (Number(attrs.cantidad || ri.cantidad) || 0) * (Number(attrs.precioUnitario || ri.precioUnitario) || 0),
      image: attrs.imagenUrl || ri.imagenUrl || "",
      srcUrl: attrs.imagenUrl || ri.imagenUrl || "",
      slug: (attrs.nombreProducto || ri.nombreProducto)?.split(" ").join("-") || attrs.productoId || ri.productoId,
      discount: { percentage: 0, amount: 0 },
      remoteItemId: attrs.itemId || ri.itemId,
    };
  };

  const mapItemLocalARemotoBody = (li: CartItem) => ({
    atributos: {
      productoId: li.productId || li.id || "",
      nombreProducto: li.name,
      sku: li.productId || li.id || "",
      imagenUrl: li.image || li.srcUrl || "/placeholder.png",
      precioUnitario: li.price,
      moneda: "ARS",
      itemId: li.id,
      cantidad: li.quantity
    }
  });

  const cargarCarrito = async () => {
    setLoading(true);
    
    // Usar solo carrito local
    try {
      const localCart = getLocalCart();
      setCartState({ items: localCart });
      setCarritoRemotoId(null);
      console.log('📱 Carrito local cargado:', localCart.length, 'productos');
    } catch (error) {
      console.error("Error al cargar carrito local:", error);
      setCartState({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCarrito();
  }, [user]);

  const refrescarCarrito = async () => {
    // Simplemente recargar el carrito local
    cargarCarrito();
  };

  const totalQuantity = cart?.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  ) ?? 0;

  return { cart, loading, totalQuantity, carritoRemotoId, refrescarCarrito };
}

// Función para fusionar carritos (evita duplicados por id)
function mergeCarts(remoteItems: CartItem[], localItems: CartItem[]): CartItem[] {
  const merged = [...remoteItems];
  for (const localItem of localItems) {
    const existingIndex = merged.findIndex((item) => item.id === localItem.id);
    if (existingIndex > -1) {
      merged[existingIndex].quantity += localItem.quantity;
      merged[existingIndex].totalPrice += localItem.totalPrice;
    } else {
      merged.push(localItem);
    }
  }
  return merged;
}

"use client";
import { useAuth } from '@/context/AuthContext';
import { api } from "@/lib/api";
import { useCart } from "@/lib/hooks/useCart";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import {
  getLocalCart,
  getLocalCartCount,
  saveLocalCart,
  clearLocalCart,
  mergeCarts,
} from "@/utils/cartUtils";
import { PLACEHOLDER_IMAGE } from '@/lib/constants'
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";

interface Props {
  data: {
    id: string;
    name: string;
    price: number;
    srcUrl: string;
    discount?: { percentage: number; amount: number };
    quantity?: number;
    images: string[];
    promos?: Array<{
      cantidad: number;
      descuento: number;
      precioFinal: number;
    }>;
  };
}

export default function AddToCartBtn({ data }: Props) {
  const { user } = useAuth();
  const { carritoRemotoId, refrescarCarrito } = useCart();
  const [quantity, setQuantity] = useState(0);
  const [localCartCount, setLocalCartCount] = useState(getLocalCartCount());
  const { toast } = useToast();
  const [selectedPromos, setSelectedPromos] = useState<number[]>([]);

  // Calcular la promoción activa basada en la cantidad
  const getActivePromo = (qty: number) => {
    if (!data.promos || data.promos.length === 0) return null;
    
    // Ordenar las promociones por cantidad de mayor a menor
    const sortedPromos = [...data.promos].sort((a, b) => b.cantidad - a.cantidad);
    
    // Encontrar la promoción más alta que se ha alcanzado
    return sortedPromos.find(promo => qty >= promo.cantidad) || null;
  };

  const activePromo = getActivePromo(quantity);

  // Calcular el precio total considerando la promoción
  const calculateTotalPrice = (qty: number, promo: typeof activePromo) => {
    if (!promo) return qty * data.price;
    
    // Si hay una promoción activa, usamos su precio final
    return promo.precioFinal;
  };

  const cartItem = {
    id: data.id,
    name: data.name,
    price: data.price,
    quantity: data.quantity ?? 1,
    totalPrice: calculateTotalPrice(data.quantity ?? 1, activePromo),
    srcUrl: data.srcUrl,
    image: data.images?.[0] || data.srcUrl || PLACEHOLDER_IMAGE,
    discount: data.discount || { percentage: 0, amount: 0 },
    slug: data.name.split(" ").join("-"),
    productId: data.id,
    activePromo: activePromo ? {
      ...activePromo,
      precioFinal: calculateTotalPrice(data.quantity ?? 1, activePromo)
    } : undefined,
  };

  useEffect(() => {
    const localCart = getLocalCart();
    const itemInCart = localCart.find((item) => item.id === data.id);
    setQuantity(itemInCart ? itemInCart.quantity : 0);
  }, [data.id]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // IMPORTANTE: Verificar que NO sea un curso presencial
    const { isPresentialCourse } = require('@/lib/utils/productHelpers');
    if (isPresentialCourse(data)) {
      toast({
        variant: 'destructive',
        title: 'Compra individual',
        description: 'Los cursos presenciales se compran en forma individual y no se pueden combinar con otros productos.',
      });
      return;
    }
    
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    await updateCart(newQuantity);
    toast({
      title: "¡Producto agregado al carrito!",
      description: `${data.name} ha sido agregado correctamente al carrito.`,
      variant: "cart"
    });
  };

  const handleRemoveFromCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newQuantity = quantity - 1;
    setQuantity(newQuantity);
    await updateCart(newQuantity);
    if (newQuantity === 0) {
      toast({
        title: `${data.name} eliminado del carrito`,
        variant: "destructive"
      });
    }
  };

  const updateCart = async (newQty: number) => {
    const activePromo = getActivePromo(newQty);
    const item = {
      id: data.id,
      name: data.name,
      price: data.price,
      quantity: newQty,
      totalPrice: calculateTotalPrice(newQty, activePromo),
      image: data.images?.[0] || data.srcUrl || PLACEHOLDER_IMAGE,
      srcUrl: data.srcUrl,
      discount: data.discount,
      slug: data.name.split(" ").join("-"),
      productId: data.id,
      activePromo: activePromo ? {
        ...activePromo,
        precioFinal: calculateTotalPrice(newQty, activePromo)
      } : undefined,
    };

    // Verificar disponibilidad del producto antes de agregar
    const checkAvailability = async () => {
      try {
        const response = await fetch(`/api/products/${data.id}`);
        if (!response.ok) {
          return false;
        }
        
        const product = await response.json();
        return product && product.active === true && product.stock > 0;
      } catch (error) {
        console.error('Error verificando disponibilidad:', error);
        return false;
      }
    };

    if (newQty > 0) {
      const isAvailable = await checkAvailability();
      if (!isAvailable) {
        // Mostrar mensaje de error o no hacer nada
        return;
      }
    }

    // Usar solo carrito local
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const index = localCart.findIndex((i: any) => i.id === item.id);

      if (index > -1) {
        if (newQty > 0) {
          localCart[index] = item;
        } else {
          localCart.splice(index, 1);
        }
      } else {
        localCart.push(item);
      }

      localStorage.setItem("cart", JSON.stringify(localCart));
      window.dispatchEvent(new Event("cartUpdate"));
  };

  return (
    <div className="w-full space-y-2">
      {data.promos && data.promos.length > 0 && (
        <div className="flex flex-col gap-2 mb-2">
          {data.promos.map((promo, index) => (
            <label
              key={index}
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all",
                selectedPromos.includes(promo.cantidad)
                  ? "border-green-500 bg-green-50" 
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <input
                type="checkbox"
                checked={selectedPromos.includes(promo.cantidad)}
                onChange={() => {
                  const newSelectedPromos = [...selectedPromos];
                  const promoIndex = newSelectedPromos.indexOf(promo.cantidad);
                  
                  if (promoIndex === -1) {
                    // Agregar la promoción
                    newSelectedPromos.push(promo.cantidad);
                    const totalQuantity = newSelectedPromos.reduce((sum, qty) => sum + qty, 0);
                    setSelectedPromos(newSelectedPromos);
                    setQuantity(totalQuantity);
                    updateCart(totalQuantity);
                    toast({
                      title: "¡Promoción aplicada! 🎉",
                      description: `Has activado la promoción de ${promo.cantidad}x unidades con ${promo.descuento}% de descuento.`,
                      variant: "cart"
                    });
                  } else {
                    // Remover la promoción
                    newSelectedPromos.splice(promoIndex, 1);
                    const totalQuantity = newSelectedPromos.reduce((sum, qty) => sum + qty, 0);
                    setSelectedPromos(newSelectedPromos);
                    setQuantity(totalQuantity);
                    updateCart(totalQuantity);
                    toast({
                      title: "Promoción cancelada",
                      description: "Has eliminado la promoción del carrito.",
                      variant: "destructive"
                    });
                  }
                }}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {promo.cantidad}x unidades
                </span>
                <span className="text-xs text-gray-500">
                  Descuento: {promo.descuento}% - Precio final: ${promo.precioFinal}
                </span>
                <span className="text-xs text-gray-500">
                  Unidades adicionales al precio normal
                </span>
              </div>
            </label>
          ))}
        </div>
      )}
      
      {quantity === 0 ? (
        <motion.button
          onClick={handleAddToCart}
          className="w-full md:w-auto md:min-w-[280px] px-8 h-12 flex items-center justify-center text-sm sm:text-base font-medium rounded-full bg-black text-white hover:bg-gray-800 transition-all whitespace-nowrap"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
        >
          Agregar al Carrito
        </motion.button>
      ) : (
        <motion.div
          className="flex items-center justify-center bg-gray-50/80 border border-black/10 rounded-full w-full h-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.button
            onClick={handleRemoveFromCart}
            className="h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center text-lg sm:text-xl font-medium text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            -
          </motion.button>
          <motion.span
            key={quantity}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="text-base sm:text-lg font-medium text-gray-700 w-6 sm:w-7 text-center"
          >
            {quantity}
          </motion.span>
          <motion.button
            onClick={handleAddToCart}
            className="h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center text-lg sm:text-xl font-medium text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            +
          </motion.button>
        </motion.div>
      )}
      
      {activePromo && (
        <div className="text-sm text-green-600">
          Ahorras ${Math.round(
            (data.price * activePromo.cantidad) - 
            (activePromo.precioFinal - (Math.max(0, quantity - activePromo.cantidad) * data.price))
          )}
        </div>
      )}
    </div>
  );
}

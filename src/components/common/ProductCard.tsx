"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import Rating from "../ui/Rating";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/lib/hooks/useCart";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
// import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { formatPrice } from "@/lib/utils";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { api } from "@/lib/api";
/* Holaaaa */

function formatearTituloProducto(nombre: string): string {
  if (!nombre || typeof nombre !== "string") return "";
  const palabrasMinusculas = new Set([
    "de",
    "del",
    "la",
    "el",
    "los",
    "las",
    "y",
    "e",
    "o",
    "u",
    "para",
    "con",
    "sin",
    "en",
    "por",
    "al",
  ]);

  return nombre
    .toLowerCase()
    .split(/\s+/)
    .map((palabra, indice) => {
      if (palabra === "x") return "X";
      if (/^[0-9]/.test(palabra)) return palabra; // números o fracciones (1/2, 3.10)
      if (palabrasMinusculas.has(palabra) && indice !== 0) return palabra;
      if (!palabra) return palabra;
      return palabra.charAt(0).toUpperCase() + palabra.slice(1);
    })
    .join(" ");
}

type ProductCardProps = {
  data: Product;
  variant?: "shop" | "carousel";
  showNewBadge?: boolean;
  showDiscountBadge?: boolean;
};

const ProductCard = ({
  data,
  variant = "carousel",
  showNewBadge = false,
  showDiscountBadge = false,
}: ProductCardProps) => {
  const { user } = useAuth();
  const { cart, carritoRemotoId, refrescarCarrito } = useCart();
  const { toast } = useToast();

  // Diseño unificado y responsivo para todas las cards

  const precioConDescuento =
    data.discount.percentage > 0
      ? data.price - (data.price * data.discount.percentage) / 100
      : data.discount.amount > 0
      ? data.price - data.discount.amount
      : data.price;

  const isNew = showNewBadge && data.newArrival;

  const productSlug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const productUrl = `/shop/product/${data.id}/${productSlug}`;

  const manejarAgregarAlCarrito = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const itemCarrito = {
      id: data.id,
      name: data.name,
      price: data.price,
      quantity: 1,
      totalPrice: data.price,
      srcUrl: data.srcUrl,
      image: data.images?.[0] || data.srcUrl || PLACEHOLDER_IMAGE,
      discount: data.discount || { percentage: 0, amount: 0 },
      slug: data.name.split(" ").join("-"),
      productId: data.id,
    };

    // Verificar disponibilidad del producto antes de agregar
    const checkAvailability = async () => {
      try {
        const response = await fetch(`/api/products/${data.id}`);
        if (!response.ok) {
          toast({
            title: "Error",
            description: "No se pudo verificar la disponibilidad del producto.",
            variant: "destructive",
          });
          return false;
        }
        
        const product = await response.json();
        return product && product.active === true && product.stock > 0;
      } catch (error) {
        console.error('Error verificando disponibilidad:', error);
        return false;
      }
    };

    checkAvailability().then((isAvailable) => {
      if (!isAvailable) {
        toast({
          title: "Producto no disponible",
          description: "El producto no está disponible en este momento.",
          variant: "destructive",
        });
        return;
      }

      // Agregar al carrito local
      const carritoLocal = JSON.parse(localStorage.getItem("cart") || "[]");
      const indice = carritoLocal.findIndex(
        (i: any) => i.id === itemCarrito.id
      );

      if (indice > -1) {
        carritoLocal[indice].quantity += 1;
        carritoLocal[indice].totalPrice =
          carritoLocal[indice].quantity * itemCarrito.price;
        toast({
          title: "¡Cantidad actualizada!",
          description: `Se ha actualizado la cantidad de ${data.name} en el carrito.`,
          variant: "cart",
        });
      } else {
        carritoLocal.push(itemCarrito);
        toast({
          title: "¡Producto agregado al carrito!",
          description: `${data.name} ha sido agregado correctamente al carrito.`,
          variant: "cart",
        });
      }

      localStorage.setItem("cart", JSON.stringify(carritoLocal));
      window.dispatchEvent(new Event("cartUpdate"));
    });
  };

  const decrementarCantidad = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const item = {
      id: data.id,
      name: data.name,
      price: data.price,
      quantity: -1,
      totalPrice: data.price,
      srcUrl: data.srcUrl,
      image: data.images?.[0] || data.srcUrl || PLACEHOLDER_IMAGE,
      discount: data.discount || { percentage: 0, amount: 0 },
      slug: data.name.split(" ").join("-"),
      productId: data.id,
    };

    if (user?.uid && carritoRemotoId) {
      api
        .post(`/carts/${encodeURIComponent(carritoRemotoId)}/items`, {
          productoId: item.productId,
          nombreProducto: item.name,
          sku: item.productId,
          imagenUrl: item.image,
          atributos: {},
          precioUnitario: item.price,
          cantidad: -1,
        })
        .then(() => {
          refrescarCarrito();
          toast({
            title: "¡Cantidad actualizada!",
            description: `Se ha actualizado la cantidad de ${data.name} en el carrito.`,
            variant: "cart",
          });
        })
        .catch(() => {});
    } else {
      const carritoLocal = JSON.parse(localStorage.getItem("cart") || "[]");
      const indice = carritoLocal.findIndex((i: any) => i.id === item.id);
      if (indice > -1) {
        carritoLocal[indice].quantity -= 1;
        carritoLocal[indice].totalPrice =
          carritoLocal[indice].quantity * item.price;
        if (carritoLocal[indice].quantity <= 0) {
          carritoLocal.splice(indice, 1);
          toast({
            title: "¡Producto eliminado del carrito!",
            description: `${data.name} ha sido eliminado del carrito.`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "¡Cantidad actualizada!",
            description: `Se ha actualizado la cantidad de ${data.name} en el carrito.`,
            variant: "cart",
          });
        }
      }
      localStorage.setItem("cart", JSON.stringify(carritoLocal));
      window.dispatchEvent(new Event("cartUpdate"));
    }
  };

  const incrementarCantidad = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const item = {
      id: data.id,
      name: data.name,
      price: data.price,
      quantity: 1,
      totalPrice: data.price,
      srcUrl: data.srcUrl,
      image: data.images?.[0] || data.srcUrl || PLACEHOLDER_IMAGE,
      discount: data.discount || { percentage: 0, amount: 0 },
      slug: data.name.split(" ").join("-"),
      productId: data.id,
    };

    if (user?.uid && carritoRemotoId) {
      api
        .post(`/carts/${encodeURIComponent(carritoRemotoId)}/items`, {
          productoId: item.productId,
          nombreProducto: item.name,
          sku: item.productId,
          imagenUrl: item.image,
          atributos: {},
          precioUnitario: item.price,
          cantidad: 1,
        })
        .then(() => {
          refrescarCarrito();
          toast({
            title: "¡Cantidad actualizada!",
            description: `Se ha actualizado la cantidad de ${data.name} en el carrito.`,
            variant: "cart",
          });
        })
        .catch(() => {});
    } else {
      const carritoLocal = JSON.parse(localStorage.getItem("cart") || "[]");
      const indice = carritoLocal.findIndex((i: any) => i.id === item.id);
      if (indice > -1) {
        carritoLocal[indice].quantity += 1;
        carritoLocal[indice].totalPrice =
          carritoLocal[indice].quantity * item.price;
      } else {
        carritoLocal.push(item);
      }
      localStorage.setItem("cart", JSON.stringify(carritoLocal));
      window.dispatchEvent(new Event("cartUpdate"));
      toast({
        title: "¡Cantidad actualizada!",
        description: `Se ha actualizado la cantidad de ${data.name} en el carrito.`,
        variant: "cart",
      });
    }
  };

  return (
    <motion.div
      className={`group bg-white rounded-xl flex flex-col ${
        variant === "shop" ? "p-3" : "p-4"
      }`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col h-full">
        {/* Imagen y título */}
        <Link href={productUrl} className="block">
          <div
            className={`relative w-full aspect-[3/3] rounded-lg overflow-hidden`}
          >
            <ProductImage
              src={data.srcUrl || PLACEHOLDER_IMAGE}
              alt={data.name}
              className="absolute inset-0 w-full h-full object-contain flex items-center"
              width={variant === "shop" ? 200 : 295}
              height={variant === "shop" ? 200 : 298}
              variant={variant}
            />
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {isNew && (
                <div
                  className={`bg-black text-white uppercase tracking-wide font-semibold px-2 py-1 rounded ${
                    variant === "shop"
                      ? "text-[10px]"
                      : "text-[11px] sm:text-xs"
                  }`}
                >
                  NUEVO
                </div>
              )}
              {showDiscountBadge &&
                (data.discount.percentage > 0 || data.discount.amount > 0) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`bg-lime-500 text-white font-bold px-2 py-1 rounded ${
                      variant === "shop"
                        ? "text-[10px]"
                        : "text-[11px] sm:text-xs"
                    }`}
                  >
                    {data.discount.percentage > 0
                      ? `${data.discount.percentage}% de descuento`
                      : `-${formatPrice(data.discount.amount)}`}
                  </motion.div>
                )}
            </div>

            {/* Overlay desktop: botón o control de cantidad */}
            {(() => {
              const cantidadEnCarrito =
                cart?.items?.find((item) => item.id === data.id)?.quantity || 0;
              return (
                <div className="absolute inset-0 hidden lg:flex items-center justify-center">
                  {cantidadEnCarrito > 0 ? (
                    <div className="opacity-0 group-hover:opacity-100 bg-gray-100/90 backdrop-blur-sm border border-black/10 rounded-full px-2 py-1 shadow-sm flex items-center gap-2">
                      <button
                        onClick={decrementarCantidad}
                        className="h-8 w-8 flex items-center justify-center rounded-full bg-white border border-black/10 text-gray-700"
                        aria-label="Disminuir"
                      >
                        -
                      </button>
                      <span className="min-w-[20px] text-center text-sm font-semibold text-gray-900">
                        {cantidadEnCarrito}
                      </span>
                      <button
                        onClick={incrementarCantidad}
                        className="h-8 w-8 flex items-center justify-center rounded-full bg-white border border-black/10 text-gray-700"
                        aria-label="Aumentar"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={manejarAgregarAlCarrito}
                      className="opacity-0 group-hover:opacity-100 backdrop-blur-sm bg-white/85 text-gray-900 border border-black/10 shadow-sm rounded-full px-4 py-2 flex items-center gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Agregar al Carrito
                      </span>
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
          {/* Rating */}
          <div
            className={`flex items-center gap-1 ${
              variant === "shop" ? "mt-2" : "mt-3"
            }`}
          >
            <Rating
              initialValue={data.rating}
              readonly
              size={variant === "shop" ? 12 : 14}
              allowFraction
              SVGclassName="inline-block"
              emptyClassName="fill-gray-200"
            />
            <span
              className={`text-gray-500 ${
                variant === "shop" ? "text-[10px]" : "text-xs sm:text-sm"
              }`}
            >
              {data.rating.toFixed(1)}
            </span>
          </div>
          {/* Título */}
          <h3
            className={`font-medium text-gray-900 leading-snug line-clamp-2 ${
              variant === "shop" ? "text-xs mt-1" : "text-sm sm:text-base mt-2"
            }`}
          >
            {formatearTituloProducto(data.name)}
          </h3>
        </Link>

        {/* Footer info y precio - unificado para todas las cards */}
        <div className={variant === "shop" ? "mt-1" : "mt-1"}>
          {(data.discount.percentage > 0 || data.discount.amount > 0) && (
            <span
              className={`text-gray-400 line-through ${
                variant === "shop" ? "text-[10px]" : "text-xs sm:text-sm"
              }`}
            >
              {formatPrice(data.price)}
            </span>
          )}
          <div
            className={`font-semibold text-gray-900 ${
              variant === "shop" ? "text-xs" : "text-sm sm:text-base"
            }`}
          >
            {formatPrice(precioConDescuento)}
          </div>
        </div>

        {/* Controles mobile: CTA o contador */}
        {(() => {
          const cantidadEnCarrito =
            cart?.items?.find((item) => item.id === data.id)?.quantity || 0;
          return cantidadEnCarrito > 0 ? (
            <div
              className={`flex items-center gap-2 lg:hidden ${
                variant === "shop" ? "mt-2" : "mt-3"
              }`}
            >
              <button
                onClick={decrementarCantidad}
                className={`flex items-center justify-center rounded-full bg-gray-100 text-gray-800 border border-black/10 ${
                  variant === "shop" ? "h-7 w-7" : "h-9 w-9"
                }`}
                aria-label="Disminuir"
              >
                -
              </button>
              <span
                className={`min-w-[28px] text-center font-semibold text-gray-900 ${
                  variant === "shop"
                    ? "text-sm min-w-[20px]"
                    : "text-base min-w-[28px]"
                }`}
              >
                {cantidadEnCarrito}
              </span>
              <button
                onClick={incrementarCantidad}
                className={`flex items-center justify-center rounded-full bg-gray-100 text-gray-800 border border-black/10 ${
                  variant === "shop" ? "h-7 w-7" : "h-9 w-9"
                }`}
                aria-label="Aumentar"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={manejarAgregarAlCarrito}
              className={`lg:hidden w-full rounded-full text-black hover:text-white transition-colors ${
                variant === "shop"
                  ? "mt-2 py-1.5 text-xs font-medium bg-gray-100 hover:bg-black"
                  : "mt-3 py-2 text-sm font-medium bg-black text-white hover:bg-gray-800"
              }`}
            >
              Agregar al Carrito
            </button>
          );
        })()}
      </div>
    </motion.div>
  );
};

export default ProductCard;

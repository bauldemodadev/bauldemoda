"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/types/product";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, ArrowLeftRight } from "lucide-react";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import AvailabilityModal from "@/components/courses/AvailabilityModal";
import { usePresentialCourseCheckout } from "@/lib/hooks/usePresentialCourseCheckout";
import { isPresentialCourse } from "@/lib/utils/productHelpers";

/**
 * Función para agregar productos estándar al carrito (NO cursos presenciales)
 * Los cursos presenciales deben usar handleBuyNowPresentialCourse
 */
const manejarAgregarAlCarrito = (product: Product, toast: any) => {
  // IMPORTANTE: Verificar que NO sea un curso presencial
  if (isPresentialCourse(product)) {
    toast({
      variant: 'destructive',
      title: 'Compra individual',
      description: 'Los cursos presenciales se compran en forma individual y no se pueden combinar con otros productos. Te vamos a llevar al pago directo de este curso.',
    });
    return;
  }
  const productName = product.name || 'Producto';
  const productPrice = product.price || 0;
  
  const itemCarrito = {
    id: product.id,
    name: productName,
    price: productPrice,
    quantity: 1,
    totalPrice: productPrice,
    srcUrl: product.srcUrl,
    image: product.images?.[0] || product.srcUrl || PLACEHOLDER_IMAGE,
    discount: product.discount || { percentage: 0, amount: 0 },
    slug: productName.split(" ").join("-"),
    productId: product.id,
    // Información para identificar tipo de producto
    sede: product.sede || null,
    category: product.category,
    type: product.sede === 'online' ? 'onlineCourse' as const : 'product' as const,
  };

  const carritoLocal = JSON.parse(localStorage.getItem("cart") || "[]");
  const indice = carritoLocal.findIndex((i: any) => i.id === itemCarrito.id);

  if (indice > -1) {
    carritoLocal[indice].quantity += 1;
    carritoLocal[indice].totalPrice = carritoLocal[indice].quantity * itemCarrito.price;
    toast({
      title: "¡Cantidad actualizada!",
      description: `Se ha actualizado la cantidad de ${productName} en el carrito.`,
      variant: "cart",
    });
  } else {
    carritoLocal.push(itemCarrito);
    toast({
      title: "¡Producto agregado al carrito!",
      description: `${productName} ha sido agregado correctamente al carrito.`,
      variant: "cart",
    });
  }

  localStorage.setItem("cart", JSON.stringify(carritoLocal));
  window.dispatchEvent(new Event("cartUpdate"));
};

export default function ProductPage({ params }: { params: { slug: string[] } }) {
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Hook para manejar checkout directo de cursos presenciales
  const { handleBuyNowPresentialCourse } = usePresentialCourseCheckout();

  const [id] = params.slug;

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products?id=${id}`, { 
          cache: 'no-store' 
        });
        
        if (!response.ok) {
          throw new Error(`Error al cargar el producto: ${response.status} ${response.statusText}`);
        }
        
        const productData = await response.json() as Product;
        setProduct(productData);
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching product:', err);
        setError(`Error al cargar el producto: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-red-600">{error || "Producto no encontrado"}</p>
            <Link href="/shop" className="text-pink-600 hover:text-pink-700 mt-4 inline-block">
              Volver a la tienda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const productName = product.name || 'Producto sin nombre';
  const productDescription = product.description || product.shortDescription || '';
  const productImages = product.images || [];
  const mainImage = productImages[0] || product.srcUrl || PLACEHOLDER_IMAGE;
  const price = product.priceText || `$${product.price?.toLocaleString() || 0}`;

  // Detectar si es un curso presencial usando el helper
  const isPresencial = isPresentialCourse(product);

  /**
   * Maneja la confirmación de disponibilidad para cursos presenciales
   * En lugar de agregar al carrito, redirige al checkout directo
   */
  const handleConfirmAvailability = (selectedDate?: string, selectedTime?: string) => {
    if (product && isPresencial) {
      // Para cursos presenciales: ir directo al checkout (no al carrito)
      // Si no hay fecha/hora, permitir continuar igual (caso: no se encontraron turnos en detalles)
      handleBuyNowPresentialCourse(product, selectedDate, selectedTime);
    } else if (product && !isPresencial) {
      // Para cursos online: agregar al carrito (ahora permitimos sin fecha/hora)
      const productPrice = product.basePrice ?? 
                          product.localPriceNumber ?? 
                          product.price;

      const itemCarrito = {
        id: product.id,
        name: product.name,
        price: productPrice,
        quantity: 1,
        totalPrice: productPrice,
        srcUrl: product.srcUrl,
        image: product.images?.[0] || product.srcUrl || PLACEHOLDER_IMAGE,
        discount: { percentage: 0, amount: 0 },
        slug: product.name.split(" ").join("-"),
        productId: product.id,
        selectedDate,
        selectedTime,
      };

      const carritoLocal = JSON.parse(localStorage.getItem("cart") || "[]");
      const indice = carritoLocal.findIndex((i: any) => i.id === itemCarrito.id);

      if (indice > -1) {
        carritoLocal[indice].quantity += 1;
        carritoLocal[indice].totalPrice = carritoLocal[indice].quantity * itemCarrito.price;
        toast({
          title: "¡Cantidad actualizada!",
          description: `Se ha actualizado la cantidad de ${product.name} en el carrito.`,
          variant: "cart",
        });
      } else {
        carritoLocal.push(itemCarrito);
        const dateTimeText = selectedDate && selectedTime 
          ? ` con fecha ${selectedDate} a las ${selectedTime}`
          : '';
        toast({
          title: "¡Producto agregado al carrito!",
          description: `${product.name} ha sido agregado correctamente al carrito${dateTimeText}.`,
          variant: "cart",
        });
      }

      localStorage.setItem("cart", JSON.stringify(carritoLocal));
      window.dispatchEvent(new Event("cartUpdate"));
    }
  };

  // Extraer información del producto para los bloques
  const getFeatureText = (index: number) => {
    const category = product.category?.toLowerCase() || '';
    if (index === 0) {
      if (category.includes('revistas')) {
        return "Revista impresa con moldes reales en 3 talles. Editorial Arcadia.";
      }
      return "Producto de calidad premium con garantía.";
    } else if (index === 1) {
      return `Valen ${price}, no incluye gastos de envío.`;
    } else {
      return "Entrega sin cargo en la Sede de Ciudad Jardín y/o envíos a toda Argentina con Correo Argentino, a cuenta del comprador.";
    }
  };


  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Banner Superior */}
        <div className="relative mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 lg:gap-12 items-center">
            {/* Columna Izquierda - Texto (30%) */}
            <div className="lg:col-span-3 space-y-4">
              {/* Título principal - 2em */}
              <h1 className="text-[2em] font-bold text-gray-900 leading-tight">
                {productName.toUpperCase()}
              </h1>
              
              {/* Descripción - 1rem */}
              {productDescription && (
                <p className="text-[1rem] text-gray-700 leading-relaxed">
                  {productDescription}
                </p>
              )}
              
              {/* Botón COMPRAR - más pequeño con bordes redondeados */}
              {isPresencial ? (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-white font-bold py-2 px-6 rounded-full transition-all duration-200 shadow-lg text-sm"
                  style={{ backgroundColor: "#E9ABBD" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D44D7D"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E9ABBD"}
                >
                  COMPRAR
                </button>
              ) : (
                <button
                  onClick={() => manejarAgregarAlCarrito(product, toast)}
                  className="text-white font-bold py-2 px-6 rounded-full transition-all duration-200 shadow-lg text-sm"
                  style={{ backgroundColor: "#E9ABBD" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D44D7D"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E9ABBD"}
                >
                  COMPRAR
                </button>
              )}
            </div>

            {/* Columna Derecha - Imagen más grande (70%) */}
            <div className="lg:col-span-7 relative flex items-center justify-center">
              <img
                src={mainImage}
                alt={productName}
                className="w-full h-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                }}
              />
            </div>
          </div>
        </div>

        {/* Tres Bloques de Información */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Bloque 1 - Reloj */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <img
                src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/reloj.svg"
                alt="Reloj"
                className="w-12 h-12 object-contain"
              />
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {getFeatureText(0)}
            </p>
          </div>

          {/* Bloque 2 - Peso */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <img
                src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/peso.svg"
                alt="Peso"
                className="w-12 h-12 object-contain"
              />
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {getFeatureText(1)}
            </p>
          </div>

          {/* Bloque 3 - Pin */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <img
                src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/pin.svg"
                alt="Ubicación"
                className="w-12 h-12 object-contain"
              />
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {getFeatureText(2)}
            </p>
          </div>
        </div>

        {/* Sección de Detalles */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {/* Columna Principal - Detalles */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            {/* Título DETALLES */}
            <div className="space-y-4">
              <h2 className="text-[1.5rem] font-bold text-black uppercase tracking-wide">
                DETALLES
              </h2>
              <h3 className="font-beauty text-black text-[3rem]">
                {productName}
              </h3>
            </div>

            {/* Descripción principal - HTML del editor */}
            {product.detailsHtml ? (
              <div 
                className="product-details-html"
                dangerouslySetInnerHTML={{ __html: product.detailsHtml }}
              />
            ) : (
              <p className="text-lg md:text-xl font-bold text-black mb-6 leading-relaxed">
                PROPUESTAS SIMPLES PARA COSER EN FORMA EXPRESS. TE ENSEÑAMOS A CREAR MAS TALLES.
              </p>
            )}

            {/* Enlaces adicionales */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/contacto"
                className="text-gray-600 text-sm hover:text-pink-600 transition-colors flex items-center gap-2"
              >
                <ArrowLeftRight className="w-4 h-4" />
                CONSULTA POR ESTE CURSO
              </Link>
              <Link
                href="/shop"
                className="text-gray-600 text-sm hover:text-pink-600 transition-colors flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                VER MÁS CURSOS
              </Link>
            </div>
          </div>

          {/* Columna Lateral - Galería de Imágenes */}
          {productImages.length > 1 && (
            <div className="space-y-3 lg:space-y-4">
              {productImages.slice(1).map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative w-full max-w-[200px] lg:max-w-[250px] mx-auto lg:mx-0 aspect-[3/4] overflow-hidden"
                >
                  <img
                    src={imageUrl}
                    alt={`${productName} - Imagen ${index + 2}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Disponibilidad para cursos presenciales */}
      {isPresencial && product && (
        <AvailabilityModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={product}
          onConfirm={handleConfirmAvailability}
        />
      )}
    </div>
  );
}

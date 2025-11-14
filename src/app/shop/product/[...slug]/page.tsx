"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/types/product";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { Clock, DollarSign, MapPin, ArrowRight, ArrowLeftRight } from "lucide-react";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";

const manejarAgregarAlCarrito = (product: Product, toast: any) => {
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

  // Extraer detalles del producto
  const getDetailsList = () => {
    const category = product.category?.toLowerCase() || '';
    if (category.includes('buzos') || category.includes('revistas')) {
      return [
        "Buzo con cuello redondo",
        "Buzo irregular con capucha",
        "Buzo rayado over size",
        "Buzo con detalles divertidos"
      ];
    }
    // Parsear desde description o detailsHtml si está disponible
    if (product.detailsHtml) {
      // Extraer items de lista si hay HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(product.detailsHtml, 'text/html');
      const listItems = Array.from(doc.querySelectorAll('li')).map(li => li.textContent || '');
      if (listItems.length > 0) return listItems;
    }
    return [];
  };

  const detailsList = getDetailsList();
  const sizingInfo = "Todas los diseños en tallas del 35 al 46 con moldes a tamaño real.";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Banner Superior */}
        <div className="relative mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Columna Izquierda - Texto */}
            <div className="space-y-4">
              {/* Subtítulo en fuente script rosa */}
              <p className="font-beauty text-pink-500 text-xl md:text-2xl">
                Productos y servicios
              </p>
              
              {/* Título principal */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-tight">
                {productName.toUpperCase()}
              </h1>
              
              {/* Descripción */}
              {productDescription && (
                <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                  {productDescription}
                </p>
              )}
              
              {/* Botón COMPRAR */}
              <button
                onClick={() => manejarAgregarAlCarrito(product, toast)}
                className="bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold py-3 px-8 rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-200 shadow-lg"
              >
                COMPRAR
              </button>
            </div>

            {/* Columna Derecha - Imagen con decoraciones */}
            <div className="relative">
              {/* Formas decorativas de fondo - formas orgánicas grandes */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {/* Forma rosa grande */}
                <div className="absolute top-10 right-10 w-48 h-48 bg-pink-300 rounded-full opacity-40 blur-3xl transform rotate-12"></div>
                {/* Forma amarilla */}
                <div className="absolute bottom-10 left-10 w-56 h-56 bg-yellow-300 rounded-full opacity-40 blur-3xl transform -rotate-12"></div>
                {/* Forma teal */}
                <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-teal-300 rounded-full opacity-40 blur-3xl"></div>
              </div>
              
              {/* Imagen principal sin fondo - solo la imagen */}
              <div className="relative z-10 flex items-center justify-center">
                <img
                  src={mainImage}
                  alt={productName}
                  className="w-full h-auto object-contain max-h-[500px]"
                  style={{ background: 'transparent' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tres Bloques de Información */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Bloque 1 - Reloj */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-pink-600" />
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {getFeatureText(0)}
            </p>
          </div>

          {/* Bloque 2 - Dólar */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-pink-600" />
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {getFeatureText(1)}
            </p>
          </div>

          {/* Bloque 3 - Ubicación */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-pink-600" />
              </div>
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
            <div>
              <h2 className="text-sm font-bold text-black uppercase tracking-wide mb-2">
                DETALLES
              </h2>
              <h3 className="font-beauty text-pink-500 text-xl md:text-2xl mb-4">
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

            {/* Lista de diseños */}
            {detailsList.length > 0 && (
              <ul className="space-y-2 mb-6">
                {detailsList.map((item, index) => (
                  <li key={index} className="text-gray-700 text-sm flex items-start">
                    <span className="text-pink-500 mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Información de tallas */}
            <p className="text-gray-700 text-sm mb-6">
              {sizingInfo}
            </p>

            {/* Información de envío repetida */}
            <p className="text-gray-700 text-sm mb-6">
              Entrega sin cargo en la Sede de Ciudad Jardín y/o envíos a toda Argentina con Correo Argentino, a cuenta del comprador.
            </p>

            {/* Botón COMPRAR */}
            <button
              onClick={() => manejarAgregarAlCarrito(product, toast)}
              className="bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold py-3 px-8 rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-200 shadow-lg"
            >
              COMPRAR
            </button>

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
    </div>
  );
}

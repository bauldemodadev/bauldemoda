"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import { Product } from "@/types/product";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { Clock, DollarSign, MapPin } from "lucide-react";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";

const manejarAgregarAlCarrito = (product: Product, toast: any) => {
  const itemCarrito = {
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 1,
    totalPrice: product.price,
    srcUrl: product.srcUrl,
    image: product.images?.[0] || product.srcUrl || PLACEHOLDER_IMAGE,
    discount: product.discount || { percentage: 0, amount: 0 },
    slug: product.name.split(" ").join("-"),
    productId: product.id,
  };

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
      description: `Se ha actualizado la cantidad de ${product.name} en el carrito.`,
      variant: "cart",
    });
  } else {
    carritoLocal.push(itemCarrito);
    toast({
      title: "¡Producto agregado al carrito!",
      description: `${product.name} ha sido agregado correctamente al carrito.`,
      variant: "cart",
    });
  }

  localStorage.setItem("cart", JSON.stringify(carritoLocal));
  window.dispatchEvent(new Event("cartUpdate"));
};

const getProductFeatures = (product: Product) => {
  const features = [];
  
  // Característica 1: Tipo de producto
  if (product.category.toLowerCase().includes('revistas')) {
    features.push({
      icon: Clock,
      text: "Revista impresa con moldes reales. Editorial Arcadia."
    });
  } else if (product.category.toLowerCase().includes('cursos')) {
    features.push({
      icon: Clock,
      text: "Curso completo con videos, apuntes y asistencia en línea."
    });
  } else {
    features.push({
      icon: Clock,
      text: "Producto de calidad premium con garantía."
    });
  }

  // Característica 2: Precio
  const precioConDescuento = product.discount.percentage > 0
    ? product.price - (product.price * product.discount.percentage) / 100
    : product.discount.amount > 0
    ? product.price - product.discount.amount
    : product.price;

  features.push({
    icon: DollarSign,
    text: `Valor: $${precioConDescuento.toLocaleString()}, no incluye costos de envío.`
  });

  // Característica 3: Entrega
  features.push({
    icon: MapPin,
    text: "Entrega sin cargo en la Sede de Ciudad Jardín y/o envíos a toda Argentina con Correo Argentino, a cuenta del comprador."
  });

  return features;
};

const getProductDetails = (product: Product) => {
  // Generar contenido dinámico basado en el tipo de producto
  if (product.category.toLowerCase().includes('revistas')) {
    return {
      title: product.name,
      subtitle: "UNA REVISTA PARA CREAR PRENDAS CÓMODAS",
      summary: [
        "En esta revista encontrarás todo este sumario:",
        "Amor amarillo – Buzo con bolsillos",
        "Prenda comodín – Remera suelta", 
        "Cómodo y canchero- Pantalón jogging",
        "Rosa chicle – Vestido largo con bolsillos",
        "De noche- Capa ancha",
        "La estrella de la temporada-Mono con lazo"
      ],
      additionalInfo: "Todos los diseños se encuentran con moldes a tamaño real del Talle 40 al 46."
    };
  } else if (product.category.toLowerCase().includes('cursos')) {
    return {
      title: product.name,
      subtitle: "UN CURSO COMPLETO PARA APRENDER",
      summary: [
        "En este curso encontrarás:",
        "Videos explicativos paso a paso",
        "Apuntes y material de apoyo",
        "Asistencia personalizada",
        "Proyectos prácticos",
        "Certificado de finalización"
      ],
      additionalInfo: "Acceso de por vida al contenido del curso."
    };
  } else {
    return {
      title: product.name,
      subtitle: "UN PRODUCTO DE CALIDAD PREMIUM",
      summary: [
        "Este producto incluye:",
        "Material de primera calidad",
        "Instrucciones detalladas",
        "Soporte técnico",
        "Garantía de satisfacción"
      ],
      additionalInfo: "Producto disponible para envío inmediato."
    };
  }
};

export default function ProductPage({ params }: { params: { slug: string[] } }) {
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const [id] = params.slug;

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://bauldemoda.vercel.app/api/products?id=${id}`, { 
          cache: 'no-store' 
        });
        
        if (!response.ok) {
          throw new Error(`Error al cargar el producto: ${response.status} ${response.statusText}`);
        }
        
        const productData = await response.json() as Product;
        setProduct(productData);
        
        // Cargar productos relacionados
        const allProductsResponse = await fetch('https://bauldemoda.vercel.app/api/products', { 
          cache: 'no-store' 
        });
        
        if (allProductsResponse.ok) {
          const allProducts = await allProductsResponse.json() as Product[];
          // Filtrar productos de la misma categoría
          const related = allProducts
            .filter(p => p.id !== productData.id && p.category === productData.category)
            .slice(0, 5);
          setRelatedProducts(related);
        }
        
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <div className="h-96 bg-gray-200 rounded-lg mb-6"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-gray-200 rounded"></div>
                  <div className="h-24 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div>
                <div className="h-12 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-8"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
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

  const features = getProductFeatures(product);
  const details = getProductDetails(product);
  const precioConDescuento = product.discount.percentage > 0
    ? product.price - (product.price * product.discount.percentage) / 100
    : product.discount.amount > 0
    ? product.price - product.discount.amount
    : product.price;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-pink-600">Inicio</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-pink-600">Tienda</Link>
            <span>/</span>
            <span className="text-gray-900">Productos y servicios</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Columna izquierda - Información del producto */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Título y descripción */}
            <div className="mb-8">
              <h1 className={cn("text-4xl font-bold text-gray-900 mb-4", integralCF.className)}>
                {product.name.toUpperCase()}
              </h1>
              <p className="text-gray-700 text-lg mb-6">
                {product.description || `${product.name} - Un producto de calidad premium para tu aprendizaje.`}
              </p>
              
              {/* Botón principal */}
              <button
                onClick={() => manejarAgregarAlCarrito(product, toast)}
                className="px-8 py-4 rounded-lg font-bold text-white transition-all duration-200 bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-300 text-lg"
              >
                COMPRAR
              </button>
            </div>

            {/* Características con iconos */}
            <div className="space-y-6 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-pink-600" />
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {feature.text}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Sección de detalles */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                DETALLES
              </h3>
              <h4 className={cn("text-2xl font-bold text-gray-900 mb-4", integralCF.className)}>
                {details.title}
              </h4>
              <h5 className="text-xl font-semibold text-gray-800 mb-6">
                {details.subtitle}
              </h5>
              
              <div className="space-y-2 mb-6">
                {details.summary.map((item, index) => (
                  <p key={index} className="text-gray-700 text-sm">
                    {item}
                  </p>
                ))}
              </div>
              
              <p className="text-gray-700 text-sm mb-6">
                {details.additionalInfo}
              </p>
              
              <p className="text-gray-700 text-sm mb-8">
                Entrega sin cargo en la Sede de Ciudad Jardín y/o envíos a toda Argentina con Correo Argentino, a cuenta del comprador.
              </p>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => manejarAgregarAlCarrito(product, toast)}
                  className="px-6 py-3 rounded-lg font-bold text-white transition-all duration-200 bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-300"
                >
                  COMPRAR
                </button>
                <Link
                  href="/contacto"
                  className="px-6 py-3 rounded-lg font-bold text-gray-700 transition-all duration-200 border border-gray-300 hover:border-pink-300 hover:text-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-300 text-center"
                >
                  CONSULTA POR ESTE CURSO
                </Link>
                <Link
                  href="/shop"
                  className="px-6 py-3 rounded-lg font-bold text-gray-700 transition-all duration-200 border border-gray-300 hover:border-pink-300 hover:text-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-300 text-center"
                >
                  VER MÁS CURSOS
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Columna derecha - Imágenes */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Imagen principal */}
            <div className="relative mb-6">
              <div className="relative w-full h-96 rounded-full overflow-hidden bg-gradient-to-br from-pink-200 via-yellow-200 to-teal-200">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0].split(',')[0].trim()}
                    alt={product.name}
                    fill
                    className="object-contain p-8"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-4xl font-bold text-gray-400">📚</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Imágenes secundarias */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-2 gap-4 mb-8">
                {product.images.slice(1, 3).map((image, index) => (
                  <div key={index} className="relative h-32 rounded-lg overflow-hidden">
                    <Image
                      src={image.split(',')[0].trim()}
                      alt={`${product.name} - Imagen ${index + 2}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Sección de nuevos lanzamientos */}
            {relatedProducts.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  NUEVOS LANZAMIENTOS
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {relatedProducts.slice(0, 6).map((relatedProduct) => (
                    <Link
                      key={relatedProduct.id}
                      href={`/shop/product/${relatedProduct.id}`}
                      className="group"
                    >
                      <div className="relative h-20 rounded-lg overflow-hidden">
                        <Image
                          src={relatedProduct.images?.[0]?.split(',')[0].trim() || PLACEHOLDER_IMAGE}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 33vw, 16vw"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  CONOCÉ TODAS NUESTRAS PUBLICACIONES EN KIOSCOS DE REVISTAS
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
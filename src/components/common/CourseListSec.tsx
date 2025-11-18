"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/types/product";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import AvailabilityModal from "@/components/courses/AvailabilityModal";

type CourseListSecProps = {
  title: string;
  subtitle?: string;
  category: 'online' | 'ciudad-jardin' | 'almagro';
  courseNames: string[]; // Nombres de los cursos a buscar
  showAllUrl: string; // URL para el botón "Ver todos"
};

// Función para normalizar texto (remover acentos, convertir a minúsculas, etc.)
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s]/g, '') // Remover caracteres especiales
    .trim();
};

// Función para filtrar productos por nombres de cursos
const filterCoursesByName = (products: Product[], courseNames: string[]): Product[] => {
  const filtered: Product[] = [];
  
  courseNames.forEach(courseName => {
    const normalizedSearchName = normalizeText(courseName);
    const searchWords = normalizedSearchName.split(/\s+/).filter(w => w.length > 2); // Palabras de más de 2 caracteres
    
    const found = products.find(product => {
      const normalizedProductName = normalizeText(product.name);
      
      // Buscar coincidencia exacta o por palabras clave
      if (normalizedProductName.includes(normalizedSearchName) || normalizedSearchName.includes(normalizedProductName)) {
        return true;
      }
      
      // Buscar si todas las palabras clave están presentes
      if (searchWords.length > 0) {
        return searchWords.every(word => normalizedProductName.includes(word));
      }
      
      return false;
    });
    
    if (found && !filtered.find(p => p.id === found.id)) {
      filtered.push(found);
    }
  });
  
  return filtered;
};

const manejarAgregarAlCarrito = (e: React.MouseEvent, product: Product, toast: any) => {
  e.preventDefault();
  e.stopPropagation();

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

// Card simple sin precio (como en el inicio)
const CourseCard = ({ product, category, toast, onAddToCart }: { product: Product; category: string; toast: any; onAddToCart?: (product: Product) => void }) => {
  const categoryLabel = category === 'online' 
    ? 'Cursos Online' 
    : category === 'ciudad-jardin' 
    ? 'Cursos Ciudad Jardín' 
    : 'Cursos Almagro';

  const isPresencial = category === 'ciudad-jardin' || category === 'almagro';

  return (
    <motion.div
      className="bg-white overflow-hidden transition-all duration-300 group flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col h-full">
        {/* Imagen del producto */}
        <div className="relative h-64">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0].split(',')[0].trim()}
              alt={product.name}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-gray-400">📚</span>
              </div>
            </div>
          )}

          {/* Botón de agregar al carrito */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isPresencial && onAddToCart) {
                onAddToCart(product);
              } else {
                manejarAgregarAlCarrito(e, product, toast);
              }
            }}
            className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg z-10"
            style={{ backgroundColor: "#E9ABBD" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#D44D7D";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#E9ABBD";
              e.currentTarget.style.transform = "scale(1)";
            }}
            aria-label={isPresencial ? "Consultar disponibilidad" : "Agregar al carrito"}
          >
            <Plus className="w-5 h-5 text-white" strokeWidth={3} />
          </button>
        </div>

        {/* Contenido del producto */}
        <div className="px-4 py-3">
          <h3 className="font-bold text-gray-900 text-sm mb-1 leading-tight uppercase text-center">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 text-center">
            {categoryLabel}
          </p>
        </div>
        
        {/* Botón MÁS INFO */}
        <Link href={`/shop/product/${product.id}`}>
          <button 
            className="w-full text-white text-sm font-medium py-3 transition-colors" 
            style={{ backgroundColor: "#E9ABBD" }} 
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D44D7D"} 
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E9ABBD"}
          >
            MÁS INFO
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

const CourseListSec = ({ title, subtitle, category, courseNames, showAllUrl }: CourseListSecProps) => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const isPresencial = category === 'ciudad-jardin' || category === 'almagro';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/products', { 
          cache: 'no-store' 
        });
        
        if (!response.ok) {
          throw new Error(`Error al cargar los productos: ${response.status} ${response.statusText}`);
        }
        
        const allProducts = await response.json() as Product[];
        // Filtrar cursos por nombres
        const filteredCourses = filterCoursesByName(allProducts, courseNames);
        setProducts(filteredCourses);
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching courses:', err);
        setError(`Error al cargar los cursos: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [courseNames.join(',')]);

  if (loading) {
    const skeletonCount = courseNames.length;
    return (
      <section className="relative mb-12">
        <div 
          className="relative pt-8 pb-8"
          style={{ 
            backgroundColor: "#F5F0D7",
            marginLeft: "calc(50% - 50vw)",
            marginRight: "calc(50% - 50vw)",
            paddingLeft: "calc(50vw - 50%)",
            paddingRight: "calc(50vw - 50%)"
          }}
        >
          <div className="max-w-frame mx-auto px-4 md:px-6">
            <div className="text-left mb-6 pt-8 pb-6">
              <h2 className="font-futura font-bold text-gray-900 mb-2">
                {title}
              </h2>
              {subtitle && (
                <h3 className="font-beauty text-[3rem] text-gray-900">{subtitle}</h3>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: skeletonCount }).map((_, i) => (
                <div key={i} className="bg-white animate-pulse flex flex-col">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="px-4 py-3">
                    <div className="h-4 bg-gray-200 mb-1"></div>
                    <div className="h-3 bg-gray-200 mb-3"></div>
                  </div>
                  <div className="h-12 bg-gray-200"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-frame mx-auto px-4 md:px-6">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  // Si no hay productos, no mostrar nada
  if (!products || products.length === 0) {
    return null;
  }

  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleConfirmAvailability = (selectedDate?: string, selectedTime?: string) => {
    if (selectedProduct) {
      // Si se seleccionó fecha y hora, agregar automáticamente al carrito
      if (selectedDate && selectedTime) {
        const itemCarrito = {
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          quantity: 1,
          totalPrice: selectedProduct.price,
          srcUrl: selectedProduct.srcUrl,
          image: selectedProduct.images?.[0] || selectedProduct.srcUrl || PLACEHOLDER_IMAGE,
          discount: selectedProduct.discount || { percentage: 0, amount: 0 },
          slug: selectedProduct.name.split(" ").join("-"),
          productId: selectedProduct.id,
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
            description: `Se ha actualizado la cantidad de ${selectedProduct.name} en el carrito.`,
            variant: "cart",
          });
        } else {
          carritoLocal.push(itemCarrito);
          toast({
            title: "¡Producto agregado al carrito!",
            description: `${selectedProduct.name} ha sido agregado correctamente al carrito con fecha ${selectedDate} a las ${selectedTime}.`,
            variant: "cart",
          });
        }

        localStorage.setItem("cart", JSON.stringify(carritoLocal));
        window.dispatchEvent(new Event("cartUpdate"));
      }
      // Si no se seleccionó fecha/hora, no hacer nada (el usuario puede cerrar el modal)
    }
  };

  const isOnline = category === "online";

  return (
    <>
      <section className="relative">
        {/* Título y subtítulo - fondo blanco */}
        <div className="max-w-frame mx-auto px-4 md:px-6">
          <div className="text-left mb-6 pt-8 pb-6">
            <motion.h2
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-futura font-bold text-gray-900 mb-2"
            >
              {title}
            </motion.h2>
            {subtitle && (
              <motion.h3
                initial={{ y: "100px", opacity: 0 }}
                animate={{ y: "0", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-beauty text-[3rem] text-gray-900"
              >
                {subtitle}
              </motion.h3>
            )}
          </div>
        </div>

        {/* Para cursos online: Grid de cursos con fondo amarillo comenzando a la mitad */}
        {isOnline ? (
          <>
            {/* Grid de cursos - posición relativa para que el fondo amarillo se superponga */}
            <div className="max-w-frame mx-auto px-4 md:px-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {products.map((product, index) => (
                  <CourseCard 
                    key={product.id} 
                    product={product} 
                    category={category}
                    toast={toast}
                    onAddToCart={isPresencial ? handleAddToCart : undefined}
                  />
                ))}
              </div>
            </div>

            {/* Fondo amarillo que comienza a la mitad de las cards */}
            <div 
              className="relative pb-8"
              style={{ 
                backgroundColor: "#F5F0D7",
                marginLeft: "calc(50% - 50vw)",
                marginRight: "calc(50% - 50vw)",
                paddingLeft: "calc(50vw - 50%)",
                paddingRight: "calc(50vw - 50%)",
                marginTop: "-8rem",
                paddingTop: "8rem"
              }}
            >
              <div className="max-w-frame mx-auto px-4 md:px-6">
                {/* Botón VER TODOS */}
                <div className="text-center">
                  <Link href={showAllUrl}>
                    <motion.button
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="px-8 py-3 rounded-full font-bold text-white transition-all duration-200"
                      style={{ backgroundColor: "#E9ABBD" }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D44D7D"} 
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E9ABBD"}
                    >
                      VER TODOS
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Para cursos presenciales: estructura normal con fondo amarillo desde el inicio */
          <div 
            className="relative pt-8 pb-8"
            style={{ 
              backgroundColor: "#F5F0D7",
              marginLeft: "calc(50% - 50vw)",
              marginRight: "calc(50% - 50vw)",
              paddingLeft: "calc(50vw - 50%)",
              paddingRight: "calc(50vw - 50%)"
            }}
          >
            <div className="max-w-frame mx-auto px-4 md:px-6">
              {/* Grid de cursos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {products.map((product, index) => (
                  <CourseCard 
                    key={product.id} 
                    product={product} 
                    category={category}
                    toast={toast}
                    onAddToCart={isPresencial ? handleAddToCart : undefined}
                  />
                ))}
              </div>

              {/* Botón VER TODOS */}
              <div className="text-center">
                <Link href={showAllUrl}>
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="px-8 py-3 rounded-full font-bold text-white transition-all duration-200"
                    style={{ backgroundColor: "#E9ABBD" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D44D7D"} 
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E9ABBD"}
                  >
                    VER TODOS
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Modal de disponibilidad para cursos presenciales */}
      {isPresencial && (
        <AvailabilityModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onConfirm={handleConfirmAvailability}
        />
      )}
    </>
  );
};

export default CourseListSec;


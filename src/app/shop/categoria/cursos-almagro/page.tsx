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

// IDs organizados por sección (actualizados según especificación)
const COURSE_SECTIONS = {
  intensivos: ["11240", "11751", "139"],
  regulares: ["144", "150", "148"],
};

// Obtener todos los IDs únicos
const getAllIds = (): string[] => {
  const allIds = new Set<string>();
  Object.values(COURSE_SECTIONS).forEach(ids => {
    ids.forEach(id => allIds.add(id));
  });
  return Array.from(allIds);
};

// Función para segmentar productos por IDs
const segmentProductsByIds = (products: Product[]) => {
  const productMap = new Map(products.map(p => [String(p.id), p]));
  
  return {
    intensivos: COURSE_SECTIONS.intensivos
      .map(id => productMap.get(id))
      .filter(Boolean) as Product[],
    regulares: COURSE_SECTIONS.regulares
      .map(id => productMap.get(id))
      .filter(Boolean) as Product[],
  };
};

const manejarAgregarAlCarrito = (e: React.MouseEvent, product: Product, toast: any) => {
  e.preventDefault();
  e.stopPropagation();
};

// Card genérica reutilizable
const ProductCard = ({ product, toast, subtitle = "Cursos Presenciales", onAddToCart }: { product: Product; toast: any; subtitle?: string; onAddToCart: (product: Product) => void }) => {
  return (
    <motion.div
      className="bg-white border border-gray-200 overflow-hidden transition-all duration-300 group flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col h-full">
        {/* Imagen del producto */}
        <div className="relative h-80">
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
              onAddToCart(product);
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
            aria-label="Consultar disponibilidad"
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
            {subtitle}
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

export default function CursosAlmagroPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // OPTIMIZADO: Buscar solo los productos por IDs específicos
        const ids = getAllIds();
        const idsParam = ids.join(',');
        const response = await fetch(`/api/products?ids=${idsParam}`, { 
          cache: 'default',
          next: { revalidate: 300 }
        });
        
        if (!response.ok) {
          throw new Error(`Error al cargar los productos: ${response.status} ${response.statusText}`);
        }
        
        const fetchedProducts = await response.json() as Product[];
        setProducts(fetchedProducts);
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching products:', err);
        setError(`Error al cargar los productos: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded mb-8 w-2/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-white animate-pulse flex flex-col">
                  <div className="h-80 bg-gray-200"></div>
                  <div className="px-4 py-3">
                    <div className="h-4 bg-gray-200 mb-1"></div>
                    <div className="h-3 bg-gray-200 mb-3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const segments = segmentProductsByIds(products);

  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleConfirmAvailability = (selectedDate?: string, selectedTime?: string) => {
    if (selectedProduct) {
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
          description: `${selectedProduct.name} ha sido agregado correctamente al carrito.`,
          variant: "cart",
        });
      }

      localStorage.setItem("cart", JSON.stringify(carritoLocal));
      window.dispatchEvent(new Event("cartUpdate"));
      setIsModalOpen(false);
      setSelectedProduct(null);
    }
  };

  // Componente de sección reutilizable
  const ProductSection = ({ 
    title, 
    products, 
    subtitle = "Cursos Presenciales"
  }: { 
    title: string; 
    products: Product[]; 
    subtitle?: string;
  }) => {
    if (products.length === 0) return null;

    return (
      <section className="mb-16">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="font-beauty text-4xl md:text-5xl text-gray-900 mb-4">
            {title}
          </h2>
          
          <nav className="mb-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/shop" className="hover:text-[#E9ABBD]">Tienda</Link>
              <span>/</span>
              <Link href="/shop/categoria/cursos-almagro" className="hover:text-[#E9ABBD]">
                Cursos Almagro
              </Link>
              <span>/</span>
              <Link href="/shop/categoria/cursos-almagro" className="text-[#E9ABBD] hover:text-[#D44D7D]">
                {title}
              </Link>
              <span>→</span>
            </div>
          </nav>
        </motion.div>

        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} toast={toast} subtitle={subtitle} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Sección CURSOS PRESENCIALES */}
        <section className="mb-16">
          {/* Título y descripción - fondo blanco */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center"
          >
            <h2 className="font-futura font-bold text-gray-900 mb-4 text-2xl sm:text-3xl md:text-3xl lg:text-4xl">
              CURSOS PRESENCIALES
            </h2>
            
            {/* Línea decorativa azul ondulada */}
            <div className="mb-4 flex justify-center">
              <img
                src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/onda-celeste.svg"
                alt="Línea decorativa"
                className="h-4 md:h-5"
              />
            </div>
            
            <h3 className="font-beauty text-[3rem] text-gray-900 mb-4">
              Almagro
            </h3>
            
            <p className="text-gray-700 text-base leading-relaxed max-w-4xl mx-auto">
              Te presentamos los cursos presenciales en nuestra sede de Almagro, en Capital Federal.
            </p>
          </motion.div>
        </section>

        {/* Sección Intensivos */}
        <ProductSection 
          title="Intensivos" 
          products={segments.intensivos}
        />
        
        {/* Sección Regulares */}
        <ProductSection 
          title="Regulares" 
          products={segments.regulares}
        />
      </div>

      {/* Modal de disponibilidad */}
      <AvailabilityModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onConfirm={handleConfirmAvailability}
      />
    </div>
  );
}

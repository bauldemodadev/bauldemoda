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
import { formatPrice } from "@/lib/utils";

// Función para filtrar productos basándose en palabras clave
const filterProductsBySlug = (products: Product[], slug: string): Product[] => {
  const keywords: Record<string, string[]> = {
    'cursos-online': ['curso online', 'cursos online', 'online', 'masterclass', 'intensivo', 'pack', 'gift', 'abc costura'],
    'cursos-ciudad-jardin': ['ciudad jardín', 'ciudad jardin', 'intensivo', 'regular', 'baul a puertas abiertas', 'overlock', 'collareta'],
    'cursos-almagro': ['almagro', 'intensivo', 'regular', 'indumentaria', 'carteras', 'lencería', 'lenceria', 'mallas'],
    'productos-servicios': ['revista', 'ebook', 'insumo', 'herramienta', 'producto', 'servicio', 'gift'],
  };

  const searchTerms = keywords[slug] || [];
  
  return products.filter(product => {
    const nameLower = product.name.toLowerCase();
    const categoryLower = (product.category || '').toLowerCase();
    const searchText = `${nameLower} ${categoryLower}`;
    
    return searchTerms.some(term => searchText.includes(term));
  });
};

// Función para obtener algunos productos destacados (primeros 4)
const getFeaturedProducts = (products: Product[], limit: number = 4): Product[] => {
  return products.slice(0, limit);
};

// Card de producto
const ProductCard = ({ 
  product, 
  toast, 
  subtitle = "Productos",
  onAddToCart
}: { 
  product: Product; 
  toast: any; 
  subtitle?: string;
  onAddToCart?: (product: Product) => void;
}) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onAddToCart) {
      onAddToCart(product);
    } else {
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
        toast({
          title: "¡Producto agregado al carrito!",
          description: `${product.name} ha sido agregado correctamente al carrito.`,
          variant: "cart",
        });
      }

      localStorage.setItem("cart", JSON.stringify(carritoLocal));
      window.dispatchEvent(new Event("cartUpdate"));
    }
  };

  return (
    <motion.div
      className="bg-white border border-gray-200 overflow-hidden transition-all duration-300 group flex flex-col"
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
            onClick={handleAddToCart}
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
            aria-label="Agregar al carrito"
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
        
        {/* Botón con precio */}
        <Link href={`/shop/product/${product.id}`}>
          <button 
            className="w-full text-white text-sm font-medium py-3 transition-colors" 
            style={{ backgroundColor: "#E9ABBD" }} 
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D44D7D"} 
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E9ABBD"}
          >
            {formatPrice(product.price)}
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export default function TiendaPage() {
  const { toast } = useToast();
  const [cursosOnline, setCursosOnline] = useState<Product[]>([]);
  const [cursosCiudadJardin, setCursosCiudadJardin] = useState<Product[]>([]);
  const [cursosAlmagro, setCursosAlmagro] = useState<Product[]>([]);
  const [productosServicios, setProductosServicios] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // OPTIMIZADO: Usar limit (30 items) en lugar de cargar todos los productos
        // Solo necesitamos 4 productos destacados por categoría = máximo 16 productos
        const response = await fetch('/api/products?limit=30', { 
          cache: 'default',
          next: { revalidate: 300 }
        });
        
        if (!response.ok) {
          throw new Error(`Error al cargar los productos: ${response.status} ${response.statusText}`);
        }
        
        const allProducts = await response.json() as Product[];
        
        // Filtrar productos por categoría
        setCursosOnline(getFeaturedProducts(filterProductsBySlug(allProducts, 'cursos-online'), 4));
        setCursosCiudadJardin(getFeaturedProducts(filterProductsBySlug(allProducts, 'cursos-ciudad-jardin'), 4));
        setCursosAlmagro(getFeaturedProducts(filterProductsBySlug(allProducts, 'cursos-almagro'), 4));
        setProductosServicios(getFeaturedProducts(filterProductsBySlug(allProducts, 'productos-servicios'), 4));
      } catch (err) {
        console.error('❌ Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleConfirmAvailability = (selectedDate?: string, selectedTime?: string) => {
    if (selectedProduct) {
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
    }
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Componente de sección reutilizable
  const SectionWithTealHeader = ({ 
    title, 
    description, 
    products, 
    showAllUrl,
    subtitle,
    isPresencial = false
  }: { 
    title: string; 
    description?: string;
    products: Product[]; 
    showAllUrl: string;
    subtitle?: string;
    isPresencial?: boolean;
  }) => {
    if (loading) {
      return (
        <section className="mb-12">
          <div 
            className="w-full py-12 md:py-16"
            style={{ backgroundColor: "#9CDAD3" }}
          >
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <div className="text-center">
                <div className="h-8 bg-gray-200 rounded mb-4 w-1/3 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded mb-6 w-2/3 mx-auto"></div>
              </div>
            </div>
          </div>
        </section>
      );
    }

    if (products.length === 0) return null;

    return (
      <section className="mb-12">
        {/* Título con fondo #9CDAD3 */}
        <div 
          className="w-full py-12 md:py-16"
          style={{ backgroundColor: "#9CDAD3" }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="font-futura font-bold text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-4"
              >
                {title}
              </motion.h2>
              {description && (
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed max-w-4xl mx-auto"
                >
                  {description}
                </motion.p>
              )}
            </div>
          </div>
        </div>

        {/* Grid de productos con fondo blanco */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                toast={toast} 
                subtitle={subtitle}
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
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <main
        className="my-[50px] sm:my-[72px] mt-5 lg:pt-32 lg:-mt-32"
        style={{ backgroundColor: "#F5F0D7" }}
      >
        {/* Sección Destacado del mes - ABC Costura */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Contenido de texto - Izquierda */}
            <div className="order-2 lg:order-1">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-sm md:text-base text-gray-600 mb-2 font-futura">
                  Destacado del mes
                </p>
                <h2 className="font-futura font-bold text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-4">
                  ABC Costura
                </h2>
                <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
                  Elegí arrancar a coser de cero en el área que más te guste
                </p>
                <Link href="/shop/categoria/cursos-online">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 rounded-lg font-bold text-white transition-all duration-200"
                    style={{ backgroundColor: "#E9ABBD" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D44D7D"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E9ABBD"}
                  >
                    Ver más!
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            {/* Imagen - Derecha */}
            <div className="order-1 lg:order-2">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative w-full"
              >
                <div className="relative aspect-[4/3] lg:aspect-[5/4] overflow-hidden">
                  <Image
                    src="https://bauldemoda.com.ar/wp-content/uploads/2020/04/abc-costuraok.jpg"
                    alt="ABC Costura"
                    fill
                    className="object-contain object-center"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 50vw"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Sección Baul Rodante */}
        <section 
          className="w-full py-12 md:py-16"
          style={{ backgroundColor: "#9CDAD3" }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Contenido de texto - Izquierda */}
              <div>
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="font-futura font-bold text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-4"
                >
                  Baul Rodante
                </motion.h2>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed"
                >
                  Baúl de Moda sale de sus sedes a nuevos destinos, para seguir creando momentos para compartir el tiempo entre costuras!
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Link href="/shop">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 rounded-lg font-bold text-white transition-all duration-200"
                      style={{ backgroundColor: "#E9ABBD" }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D44D7D"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E9ABBD"}
                    >
                      Ver todos
                    </motion.button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Cursos Online */}
        <SectionWithTealHeader
          title="CURSOS ONLINE"
          description="Aprende moldería, corte y confección de forma online. Cursos desde cero o el nivel que tengas! Te enseñamos a través de videos, apuntes, ebooks y asistencia en línea para lo que necesites!"
          products={cursosOnline}
          showAllUrl="/shop/categoria/cursos-online"
          subtitle="Cursos Online"
        />

        {/* Cursos Presenciales - Ciudad Jardín */}
        <SectionWithTealHeader
          title="CURSOS PRESENCIALES"
          subtitle="Ciudad Jardín"
          products={cursosCiudadJardin}
          showAllUrl="/shop/categoria/cursos-ciudad-jardin"
          isPresencial={true}
        />

        {/* Cursos Presenciales - Almagro */}
        <SectionWithTealHeader
          title="Almagro"
          products={cursosAlmagro}
          showAllUrl="/shop/categoria/cursos-almagro"
          subtitle="Cursos Presenciales"
          isPresencial={true}
        />

        {/* Productos y Servicios */}
        <SectionWithTealHeader
          title="PRODUCTOS Y SERVICIOS"
          description="Tienda virtual donde vas a conseguir las revistas de Baúl, que desarrollamos para Editorial Arcadia, y algunas herramientas de costura. Podes comprarlas desde la web y retirarlas sin cargo por las sedes o recibirlas por correo."
          products={productosServicios}
          showAllUrl="/shop/categoria/productos-servicios"
          subtitle="Productos y Servicios"
        />
      </main>

      {/* Modal de disponibilidad para cursos presenciales */}
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

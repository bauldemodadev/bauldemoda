"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/types/product";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";

// Función para filtrar productos basándose en palabras clave del slug
const filterProductsBySlug = (products: Product[], slug: string): Product[] => {
  const keywords: Record<string, string[]> = {
    'cursos-online': ['curso online', 'cursos online', 'online', 'masterclass', 'intensivo', 'pack', 'gift', 'abc costura'],
    'cursos-ciudad-jardin': ['ciudad jardín', 'ciudad jardin', 'ciudad jardín', 'intensivo', 'regular', 'baul a puertas abiertas', 'overlock', 'collareta'],
    'cursos-almagro': ['almagro', 'intensivo', 'regular', 'indumentaria', 'carteras', 'lencería', 'lenceria', 'mallas'],
    'productos-servicios': ['revista', 'ebook', 'insumo', 'herramienta', 'producto', 'servicio'],
  };

  const searchTerms = keywords[slug] || [];
  
  return products.filter(product => {
    const nameLower = product.name.toLowerCase();
    const categoryLower = (product.category || '').toLowerCase();
    const searchText = `${nameLower} ${categoryLower}`;
    
    return searchTerms.some(term => searchText.includes(term));
  });
};

// Función para segmentar productos por categorías
const segmentProducts = (products: Product[]) => {
  const segments = {
    masterClassGratuita: [] as Product[],
    enPromo: [] as Product[],
    paraComenzar: [] as Product[],
    intensivosIndumentaria: [] as Product[],
    intensivosLenceria: [] as Product[],
    intensivosCarteras: [] as Product[],
    paraAlumnos: [] as Product[],
    paraRegalar: [] as Product[],
  };

  products.forEach(product => {
    const nameLower = product.name.toLowerCase();
    const categoryLower = (product.category || '').toLowerCase();
    const searchText = `${nameLower} ${categoryLower}`;
    
    if (searchText.includes('masterclass gratuita') || searchText.includes('masterclass gratis')) {
      segments.masterClassGratuita.push(product);
    } else if (searchText.includes('en promo') || searchText.includes('promo')) {
      segments.enPromo.push(product);
    } else if (searchText.includes('para comenzar') || searchText.includes('abc costura')) {
      segments.paraComenzar.push(product);
    } else if (searchText.includes('intensivo') && (searchText.includes('indumentaria') || searchText.includes('jean') || searchText.includes('camisa'))) {
      segments.intensivosIndumentaria.push(product);
    } else if (searchText.includes('intensivo') && (searchText.includes('lenceria') || searchText.includes('lencería') || searchText.includes('malla') || searchText.includes('bombacha'))) {
      segments.intensivosLenceria.push(product);
    } else if (searchText.includes('intensivo') && (searchText.includes('cartera') || searchText.includes('pantufla'))) {
      segments.intensivosCarteras.push(product);
    } else if (searchText.includes('para alumnos') || searchText.includes('baul disena')) {
      segments.paraAlumnos.push(product);
    } else if (searchText.includes('para regalar') || searchText.includes('gift')) {
      segments.paraRegalar.push(product);
    }
  });

  return segments;
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
const ProductCard = ({ product, toast }: { product: Product; toast: any }) => {
  return (
    <motion.div
      className="bg-white overflow-hidden transition-all duration-300 group flex flex-col"
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
            onClick={(e) => manejarAgregarAlCarrito(e, product, toast)}
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
            Cursos Online
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

const ProductSection = ({ 
  title, 
  products, 
  toast 
}: { 
  title: string; 
  products: Product[]; 
  toast: any;
}) => {
  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 mb-12">
      <div className="text-left mb-8">
        <h2 className="font-beauty text-2xl font-bold text-gray-900 mb-2">
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} toast={toast} />
        ))}
      </div>
    </section>
  );
};

export default function CursosOnlinePage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        // Filtrar productos basándose en el slug de la URL
        const filteredProducts = filterProductsBySlug(allProducts, 'cursos-online');
        
        setProducts(filteredProducts);
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white animate-pulse flex flex-col">
                  <div className="h-80 bg-gray-200"></div>
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

  const segments = segmentProducts(products);

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
            <span className="text-gray-900">Cursos Online</span>
          </div>
        </nav>

        {/* Título y descripción */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="font-beauty text-4xl font-bold text-gray-900 mb-4">
            Cursos Online
          </h1>
          <p className="text-gray-700 text-lg max-w-4xl">
            Aprende moldería, corte y confección de forma online. Cursos desde cero o el nivel que tengas! Te enseñamos a través de videos, apuntes, ebooks y asistencia en línea para lo que necesites!
          </p>
        </motion.div>

        {/* Secciones de productos */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ProductSection 
            title="MasterClass Gratuita" 
            products={segments.masterClassGratuita} 
            toast={toast}
          />
          
          <ProductSection 
            title="En Promo" 
            products={segments.enPromo} 
            toast={toast}
          />
          
          <ProductSection 
            title="Para Comenzar" 
            products={segments.paraComenzar} 
            toast={toast}
          />
          
          <ProductSection 
            title="Intensivos Indumentaria" 
            products={segments.intensivosIndumentaria} 
            toast={toast}
          />
          
          <ProductSection 
            title="Intensivos Lenceria" 
            products={segments.intensivosLenceria} 
            toast={toast}
          />
          
          <ProductSection 
            title="Intensivos Carteras" 
            products={segments.intensivosCarteras} 
            toast={toast}
          />
          
          <ProductSection 
            title="Para Alumnos" 
            products={segments.paraAlumnos} 
            toast={toast}
          />
          
          <ProductSection 
            title="Para Regalar" 
            products={segments.paraRegalar} 
            toast={toast}
          />
        </motion.div>

        {/* Botón volver a la tienda */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/shop">
            <button 
              className="px-8 py-3 rounded-lg font-bold text-gray-800 transition-all duration-200 bg-pink-100 hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              Volver a la tienda
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

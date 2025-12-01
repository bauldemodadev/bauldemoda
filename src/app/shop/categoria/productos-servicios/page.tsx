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

// Función para segmentar productos por categorías de Productos y Servicios
const segmentProducts = (products: Product[]) => {
  const segments = {
    revistas: [] as Product[],
    giftCards: [] as Product[],
  };

  products.forEach(product => {
    const nameLower = product.name.toLowerCase();
    const categoryLower = (product.category || '').toLowerCase();
    const searchText = `${nameLower} ${categoryLower}`;
    
    // Gift Cards
    if (searchText.includes('gift baulera intensivos')) {
      segments.giftCards.push(product);
    } else if (searchText.includes('gift baulera abc') && searchText.includes('intensivo')) {
      segments.giftCards.push(product);
    } else if (searchText.includes('gift baulera pack x 3') || searchText.includes('gift baulera pack x3')) {
      segments.giftCards.push(product);
    } else if (searchText.includes('gift baulera abc online')) {
      segments.giftCards.push(product);
    } else if (searchText.includes('gift')) {
      segments.giftCards.push(product);
    }
    // Revistas
    else if (searchText.includes('revista especial bebes') || searchText.includes('revista especial bebés') || searchText.includes('especial bebes') || searchText.includes('especial bebés')) {
      segments.revistas.push(product);
    } else if (searchText.includes('revista moda oversize') || searchText.includes('moda oversize')) {
      segments.revistas.push(product);
    } else if (searchText.includes('revista vida sustentable') || searchText.includes('vida sustentable')) {
      segments.revistas.push(product);
    } else if (searchText.includes('revista ropa comoda y casual') || searchText.includes('ropa comoda y casual') || searchText.includes('ropa cómoda y casual')) {
      segments.revistas.push(product);
    } else if (searchText.includes('revista vestidos simpleza y color') || searchText.includes('vestidos simpleza y color')) {
      segments.revistas.push(product);
    } else if (searchText.includes('revista lenceria i') || searchText.includes('revista lencería i') || searchText.includes('lenceria i') || searchText.includes('lencería i')) {
      segments.revistas.push(product);
    } else if (searchText.includes('revista macrame mandalas') || searchText.includes('macramé mandalas') || searchText.includes('macrame mandalas')) {
      segments.revistas.push(product);
    } else if (searchText.includes('revista vestidos dama') || searchText.includes('vestidos dama')) {
      segments.revistas.push(product);
    } else if (searchText.includes('revista costura express') || searchText.includes('costura express')) {
      segments.revistas.push(product);
    } else if (searchText.includes('revista comodo y femenino') || searchText.includes('revista cómodo y femenino') || searchText.includes('cómodo y femenino')) {
      segments.revistas.push(product);
    } else if (searchText.includes('revista ropa deportiva') || searchText.includes('ropa deportiva')) {
      segments.revistas.push(product);
    } else if (searchText.includes('revista accesorios') || searchText.includes('accesorios')) {
      segments.revistas.push(product);
    } else if (searchText.includes('revista vivi la moda') || searchText.includes('vivi la moda')) {
      segments.revistas.push(product);
    } else if (searchText.includes('revista mujeres reales') || searchText.includes('mujeres reales')) {
      segments.revistas.push(product);
    } else if (searchText.includes('revista especial abrigos') || searchText.includes('especial abrigos')) {
      segments.revistas.push(product);
    } else if (searchText.includes('revista especial vestidos') || searchText.includes('especial vestidos')) {
      segments.revistas.push(product);
    } else if (searchText.includes('revista especial buzos') || searchText.includes('especial buzos')) {
      segments.revistas.push(product);
    } else if (searchText.includes('revista ropa con apliques') || searchText.includes('ropa con apliques')) {
      segments.revistas.push(product);
    } else if (searchText.includes('revista ropa de noche') || searchText.includes('ropa de noche')) {
      segments.revistas.push(product);
    } else if (searchText.includes('revista lenceria ii') || searchText.includes('revista lencería ii') || searchText.includes('lenceria ii') || searchText.includes('lencería ii')) {
      segments.revistas.push(product);
    } else if (searchText.includes('revista mix telas') || searchText.includes('mix telas')) {
      segments.revistas.push(product);
    } else if (searchText.includes('revista diseños a medida') || searchText.includes('diseños a medida')) {
      segments.revistas.push(product);
    } else if (searchText.includes('revista vestidos nenas') || searchText.includes('vestidos nenas')) {
      segments.revistas.push(product);
    } else if (searchText.includes('revista talles reales') || searchText.includes('talles reales')) {
      segments.revistas.push(product);
    } else if (searchText.includes('revista bohemia peques') || searchText.includes('bohemia peques')) {
      segments.revistas.push(product);
    } else if (searchText.includes('revista pijamas divertidos') || searchText.includes('pijamas divertidos')) {
      segments.revistas.push(product);
    } else if (searchText.includes('revista ropa de trabajo') || searchText.includes('ropa de trabajo')) {
      segments.revistas.push(product);
    } else if (searchText.includes('revista camisas') || searchText.includes('camisas')) {
      segments.revistas.push(product);
    } else if (searchText.includes('revista de mochilas') || searchText.includes('revista mochilas') || searchText.includes('mochilas')) {
      segments.revistas.push(product);
    } else if (searchText.includes('revista')) {
      segments.revistas.push(product);
    }
  });

  return segments;
};

const manejarAgregarAlCarrito = (e: React.MouseEvent, product: Product, toast: any) => {
  e.preventDefault();
  e.stopPropagation();

  // IMPORTANTE: Verificar que NO sea un curso presencial
  const { isPresentialCourse } = require('@/lib/utils/productHelpers');
  if (isPresentialCourse(product)) {
    toast({
      variant: 'destructive',
      title: 'Compra individual',
      description: 'Los cursos presenciales se compran en forma individual y no se pueden combinar con otros productos.',
    });
    return;
  }

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

// Card genérica reutilizable
const ProductCard = ({ product, toast, subtitle = "Productos y Servicios" }: { product: Product; toast: any; subtitle?: string }) => {
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

export default function ProductosYServiciosPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // OPTIMIZADO: Usar limit (30 items) - suficiente para mostrar productos/servicios sin paginación
        const response = await fetch('/api/products?limit=30', { 
          cache: 'default',
          next: { revalidate: 300 }
        });
        
        if (!response.ok) {
          throw new Error(`Error al cargar los productos: ${response.status} ${response.statusText}`);
        }
        
        const allProducts = await response.json() as Product[];
        const filteredProducts = filterProductsBySlug(allProducts, 'productos-servicios');
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

  const segments = segmentProducts(products);
  
  // Componente de sección reutilizable
  const ProductSection = ({ 
    title, 
    products, 
    subtitle = "Productos y Servicios"
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
              <Link href="/shop/categoria/productos-servicios" className="hover:text-[#E9ABBD]">
                Productos y Servicios
              </Link>
              <span>/</span>
              <Link href="/shop/categoria/productos-servicios" className="text-[#E9ABBD] hover:text-[#D44D7D]">
                {title}
              </Link>
              <span>→</span>
            </div>
          </nav>
        </motion.div>

        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} toast={toast} subtitle={subtitle} />
            ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Sección PRODUCTOS Y SERVICIOS */}
        <section className="mb-16">
          {/* Título y descripción - fondo blanco */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center"
          >
            <h2 className="font-futura font-bold text-gray-900 mb-4 text-2xl sm:text-3xl md:text-3xl lg:text-4xl">
              PRODUCTOS Y SERVICIOS
            </h2>
            
            {/* Línea decorativa azul ondulada */}
            <div className="mb-4 flex justify-center">
              <img
                src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/onda-celeste.svg"
                alt="Línea decorativa"
                className="h-4 md:h-5"
              />
            </div>
            
            <p className="text-gray-700 text-base leading-relaxed max-w-4xl mx-auto">
              Tienda virtual donde vas a conseguir las revistas de Baúl, que desarrollamos para Editorial Arcadia, y algunas herramientas de costura. Podes comprarlas desde la web y retirarlas sin cargo por las sedes o recibirlas por correo.
            </p>
          </motion.div>
        </section>

        {/* Sección Revistas */}
        <ProductSection 
          title="Revistas" 
          products={segments.revistas}
          subtitle="Revistas"
        />
        
        {/* Sección Gift Cards */}
        <ProductSection 
          title="Gift Cards" 
          products={segments.giftCards}
          subtitle="Gift Cards"
        />
      </div>
    </div>
  );
}

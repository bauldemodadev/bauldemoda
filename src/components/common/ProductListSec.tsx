"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import { Product } from "@/types/product";
import Link from "next/link";
import Image from "next/image";

type ProductListSecProps = {
  title: string;
  productIds?: string[];
  data?: Product[];
};

const ProductListSec = ({ title, productIds, data }: ProductListSecProps) => {
  const [products, setProducts] = useState<Product[]>(data || []);
  const [loading, setLoading] = useState(!data && !!productIds);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si ya tenemos data, no necesitamos hacer fetch
    if (data) {
      setProducts(data);
      setLoading(false);
      return;
    }

    // Si no hay productIds, no hay nada que cargar
    if (!productIds || productIds.length === 0) {
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = `/api/products?ids=${productIds.join(',')}`;
        const response = await fetch(url, { 
          cache: 'no-store' 
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productIds?.join(','), data]);

  if (loading) {
    const skeletonCount = productIds?.length || 4;
    return (
      <section className="max-w-frame mx-auto px-4 md:px-6 mb-12">
        <div className="text-left mb-8">
          <h2 className={cn("text-2xl font-bold text-gray-900 mb-2", integralCF.className)}>
            {title}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: skeletonCount }).map((_, i) => (
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
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-frame mx-auto px-4 md:px-6 mb-12">
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

  return (
    <section className="max-w-frame mx-auto px-4 md:px-6 mb-12">
      {/* Título de la sección */}
      <div className="text-left mb-8">
        <motion.h2
          initial={{ y: "100px", opacity: 0 }}
          animate={{ y: "0", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={cn("text-2xl font-bold text-gray-900 mb-2", integralCF.className)}
        >
          {title}
        </motion.h2>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ y: "100px", opacity: 0 }}
            animate={{ y: "0", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white overflow-hidden transition-all duration-300 group flex flex-col"
          >
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
            </div>

            {/* Contenido del producto */}
            <div className="px-4 py-3">
              <h3 className="font-bold text-gray-900 text-sm mb-1 leading-tight uppercase text-center">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3 text-center">
                Cursos Presenciales
              </p>
            </div>
            
            {/* Botón MÁS INFO */}
            <Link href={`/shop/${product.id}`}>
              <button 
                className="w-full text-white text-sm font-medium py-3 transition-colors" 
                style={{ backgroundColor: "#E9ABBD" }} 
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D44D7D"} 
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E9ABBD"}
              >
                MÁS INFO
              </button>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProductListSec;
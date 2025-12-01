"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { InfiniteScrollList } from "@/components/common/InfiniteScrollList";

// Tipo serializado para el frontend (Timestamps convertidos a strings)
interface SerializedTip {
  id: string;
  wpId: number;
  slug: string;
  title: string;
  shortDescription: string;
  contentHtml: string;
  category: string;
  coverMediaId: number | string | null;
  downloadMediaId?: number | string | null;
  seoDescription: string;
  status: 'draft' | 'publish';
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

interface TipCardProps {
  tip: SerializedTip;
}

const TipCard = ({ tip }: TipCardProps) => {
  // Función helper para convertir coverMediaId (puede ser número, string numérico o URL) a URL
  const getImageUrl = (coverMediaId: number | string | null | undefined): string => {
    if (!coverMediaId) return '/placeholder.png';
    
    // Si es una URL (string que comienza con http:// o https://), usarla directamente
    if (typeof coverMediaId === 'string' && (coverMediaId.startsWith('http://') || coverMediaId.startsWith('https://'))) {
      return coverMediaId;
    }
    
    // Si es un ID (número o string numérico), usar el endpoint /api/media/[id]
    const idValue = typeof coverMediaId === 'number' ? coverMediaId : parseInt(String(coverMediaId), 10);
    if (!isNaN(idValue) && idValue > 0) {
      return `/api/media/${idValue}`;
    }
    
    return '/placeholder.png';
  };

  const imageUrl = getImageUrl(tip.coverMediaId);

  return (
    <motion.div
      className="bg-white rounded-t-2xl overflow-hidden flex flex-col h-full shadow-sm hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Imagen */}
      <div className="relative w-full h-64 overflow-hidden">
        <Image
          src={imageUrl}
          alt={tip.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>

      {/* Contenido */}
      <div className="px-6 py-4 flex-1 flex flex-col">
        <p className="text-gray-700 text-sm mb-3 line-clamp-3">
          {tip.shortDescription || tip.title}
        </p>
      </div>

      {/* Botón MÁS INFO */}
      <div className="px-6 pb-6">
        <Link href={`/tips/${tip.slug || tip.id}`}>
          <button 
            className="w-full text-white text-sm font-medium py-3 transition-colors rounded-md" 
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

export default function TipsPage() {
  const [initialTips, setInitialTips] = useState<SerializedTip[]>([]);
  const [initialCursor, setInitialCursor] = useState<string | undefined>(undefined);
  const [initialHasMore, setInitialHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar primer batch de tips
  useEffect(() => {
    const fetchInitialTips = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/tips?limit=15', { 
          cache: 'default',
          next: { revalidate: 300 }
        });
        
        if (!response.ok) {
          throw new Error(`Error al cargar los tips: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        // Compatibilidad: si viene como array (legacy), convertir a formato paginado
        if (Array.isArray(data)) {
          setInitialTips(data.slice(0, 15));
          setInitialHasMore(data.length > 15);
        } else {
          setInitialTips(data.items || []);
          setInitialCursor(data.nextCursor);
          setInitialHasMore(data.hasMore ?? true);
        }
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching tips:', err);
        setError(`Error al cargar los tips: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialTips();
  }, []);

  // Función para cargar más tips
  const loadMoreTips = async (cursor?: string) => {
    const response = await fetch(`/api/tips?limit=15${cursor ? `&cursor=${cursor}` : ''}`, {
      cache: 'default',
      next: { revalidate: 300 }
    });
    
    if (!response.ok) {
      throw new Error(`Error al cargar más tips: ${response.status}`);
    }
    
    const data = await response.json();
    // Compatibilidad: si viene como array (legacy)
    if (Array.isArray(data)) {
      return {
        items: data,
        nextCursor: undefined,
        hasMore: false,
      };
    }
    
    return {
      items: data.items || [],
      nextCursor: data.nextCursor,
      hasMore: data.hasMore ?? false,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-4 w-1/2 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded mb-8 w-2/3 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white animate-pulse flex flex-col rounded-t-2xl">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="px-6 py-4">
                    <div className="h-4 bg-gray-200 mb-2"></div>
                    <div className="h-4 bg-gray-200 mb-2"></div>
                    <div className="h-4 bg-gray-200 mb-4"></div>
                  </div>
                  <div className="h-12 bg-gray-200 mx-6 mb-6"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && initialTips.length === 0) {
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

  return (
    <div className="min-h-screen bg-white">
      {/* Sección de título y subtítulo - fondo blanco */}
      <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            TIPS PARA AYUDARTE
          </motion.h1>
          {/* SVG decorativo onda celeste */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center mb-4"
          >
            <img
              src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/onda-arena.svg"
              alt="Onda decorativa"
              className="h-4 md:h-5"
            />
          </motion.div>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto"
          >
            En esta sección te contamos y compartimos todos los secretos y datos útiles del mundo de la costura, los oficios y los emprendimientos.
          </motion.p>
        </div>
      </div>

      {/* Sección de cards - fondo rosado con scroll infinito */}
      <div 
        className="py-12"
        style={{ backgroundColor: "#F5E6E8" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          {initialTips.length === 0 && !loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No hay tips disponibles en este momento.</p>
            </div>
          ) : (
            <InfiniteScrollList
              initialItems={initialTips}
              initialCursor={initialCursor}
              initialHasMore={initialHasMore}
              loadMore={loadMoreTips}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              itemClassName=""
              endMessage={
                <div className="col-span-full text-center text-gray-500 py-8">
                  Has visto todos los tips disponibles
                </div>
              }
              errorMessage={(error) => (
                <div className="col-span-full text-center text-red-500 py-8">
                  Error: {error}
                </div>
              )}
              renderItem={(tip, index) => <TipCard key={tip.id} tip={tip} />}
            />
          )}
        </div>
      </div>
    </div>
  );
}


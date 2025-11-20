"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

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
  const [tips, setTips] = useState<SerializedTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTips = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/tips', { 
          cache: 'no-store' 
        });
        
        if (!response.ok) {
          throw new Error(`Error al cargar los tips: ${response.status} ${response.statusText}`);
        }
        
        const fetchedTips = await response.json() as SerializedTip[];
        setTips(fetchedTips);
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching tips:', err);
        setError(`Error al cargar los tips: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, []);

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

  return (
    <div className="min-h-screen bg-white">
      {/* Sección de título y subtítulo - fondo blanco */}
      <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="font-beauty text-4xl md:text-5xl font-bold text-gray-900 mb-4 uppercase"
          >
            TIPS PARA AYUDARTE
          </motion.h1>
          
          {/* Línea decorativa amarilla */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-1 bg-yellow-400 w-32 mx-auto mb-6 rounded-full"
            style={{ transformOrigin: 'center' }}
          />

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

      {/* Sección de cards - fondo rosado */}
      <div 
        className="py-12"
        style={{ backgroundColor: "#F5E6E8" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          {tips.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No hay tips disponibles en este momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tips.map((tip, index) => (
                <TipCard key={tip.id} tip={tip} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Download } from "lucide-react";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";

// Tipo serializado para el frontend
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
  createdAt: string;
  updatedAt: string;
}

/**
 * Función helper para obtener URL de imagen desde mediaId
 */
const getImageUrl = (mediaId: number | string | null | undefined): string => {
  if (!mediaId) return PLACEHOLDER_IMAGE;
  
  // Si es una URL (string que comienza con http:// o https://), usarla directamente
  if (typeof mediaId === 'string' && (mediaId.startsWith('http://') || mediaId.startsWith('https://'))) {
    return mediaId;
  }
  
  // Si es un ID (número o string numérico), usar el endpoint /api/media/[id]
  const idValue = typeof mediaId === 'number' ? mediaId : parseInt(String(mediaId), 10);
  if (!isNaN(idValue) && idValue > 0) {
    return `/api/media/${idValue}`;
  }
  
  return PLACEHOLDER_IMAGE;
};

/**
 * Función helper para obtener URL de descarga desde downloadMediaId
 */
const getDownloadUrl = (downloadMediaId: number | string | null | undefined): string | null => {
  if (!downloadMediaId) return null;
  
  // Si es una URL (string que comienza con http:// o https://), usarla directamente
  if (typeof downloadMediaId === 'string' && (downloadMediaId.startsWith('http://') || downloadMediaId.startsWith('https://'))) {
    return downloadMediaId;
  }
  
  // Si es un ID (número o string numérico), usar el endpoint /api/media/[id]
  const idValue = typeof downloadMediaId === 'number' ? downloadMediaId : parseInt(String(downloadMediaId), 10);
  if (!isNaN(idValue) && idValue > 0) {
    return `/api/media/${idValue}`;
  }
  
  return null;
};

export default function TipDetailPage({ params }: { params: { slug: string } }) {
  const [tip, setTip] = useState<SerializedTip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTip = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/tips/${params.slug}`, { 
          cache: 'no-store' 
        });
        
        if (!response.ok) {
          throw new Error(`Error al cargar el tip: ${response.status} ${response.statusText}`);
        }
        
        const tipData = await response.json() as SerializedTip;
        setTip(tipData);
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching tip:', err);
        setError(`Error al cargar el tip: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTip();
  }, [params.slug]);

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

  if (error || !tip) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-red-600">{error || "Tip no encontrado"}</p>
            <Link href="/tips" className="text-pink-600 hover:text-pink-700 mt-4 inline-block">
              Volver a tips
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tipTitle = tip.title || 'Tip sin título';
  const tipDescription = tip.shortDescription || '';
  const coverImageUrl = getImageUrl(tip.coverMediaId);
  const downloadUrl = getDownloadUrl(tip.downloadMediaId);

  /**
   * Maneja la descarga del contenido del tip
   */
  const handleDownload = () => {
    if (downloadUrl) {
      // Abrir en nueva pestaña para descargar
      window.open(downloadUrl, '_blank');
    } else {
      // Si no hay archivo descargable, mostrar el contenido HTML en una nueva ventana para imprimir/guardar
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${tipTitle}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
                h1 { color: #333; }
                .content { line-height: 1.6; }
              </style>
            </head>
            <body>
              <h1>${tipTitle}</h1>
              <div class="content">${tip.contentHtml}</div>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Banner Superior */}
        <div className="relative mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 lg:gap-12 items-center">
            {/* Columna Izquierda - Texto (30%) */}
            <div className="lg:col-span-3 space-y-4">
              {/* Título principal - 2em */}
              <h1 className="text-[2em] font-bold text-gray-900 leading-tight">
                {tipTitle.toUpperCase()}
              </h1>
              
              {/* Descripción - 1rem */}
              {tipDescription && (
                <p className="text-[1rem] text-gray-700 leading-relaxed">
                  {tipDescription}
                </p>
              )}
              
              {/* Botón DESCARGAR - más pequeño con bordes redondeados */}
              <button
                onClick={handleDownload}
                className="text-white font-bold py-2 px-6 rounded-full transition-all duration-200 shadow-lg text-sm flex items-center gap-2"
                style={{ backgroundColor: "#E9ABBD" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D44D7D"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E9ABBD"}
              >
                <Download className="w-4 h-4" />
                DESCARGAR
              </button>
            </div>

            {/* Columna Derecha - Imagen más grande (70%) */}
            <div className="lg:col-span-7 relative flex items-center justify-center">
              <img
                src={coverImageUrl}
                alt={tipTitle}
                className="w-full h-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                }}
              />
            </div>
          </div>
        </div>

        {/* Tres Bloques de Información */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Bloque 1 - Reloj */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <img
                src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/reloj.svg"
                alt="Reloj"
                className="w-12 h-12 object-contain"
              />
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              Tutorial completo con moldería descargable.
            </p>
          </div>

          {/* Bloque 2 - Peso */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <img
                src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/peso.svg"
                alt="Peso"
                className="w-12 h-12 object-contain"
              />
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              Contenido gratuito para descargar.
            </p>
          </div>

          {/* Bloque 3 - Pin */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <img
                src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/pin.svg"
                alt="Ubicación"
                className="w-12 h-12 object-contain"
              />
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              Disponible para descargar desde cualquier lugar.
            </p>
          </div>
        </div>

        {/* Sección de Detalles */}
        <div className="mb-12">
          {/* Título DETALLES */}
          <div className="space-y-4 mb-6">
            <h2 className="text-[1.5rem] font-bold text-black uppercase tracking-wide">
              DETALLES
            </h2>
            <h3 className="font-beauty text-black text-[3rem]">
              {tipTitle}
            </h3>
          </div>

          {/* Contenido principal - HTML del editor */}
          {tip.contentHtml ? (
            <div 
              className="product-details-html"
              dangerouslySetInnerHTML={{ __html: tip.contentHtml }}
            />
          ) : (
            <p className="text-lg md:text-xl font-bold text-black mb-6 leading-relaxed">
              {tipDescription || 'Contenido del tip disponible para descargar.'}
            </p>
          )}

          {/* Enlaces adicionales */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href="/tips"
              className="text-gray-600 text-sm hover:text-pink-600 transition-colors flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              VER MÁS TIPS
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


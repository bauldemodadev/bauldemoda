'use client';

import { useState, useEffect } from 'react';
import { Loader2, ImageOff } from 'lucide-react';

interface MediaImageProps {
  mediaId: number | string | null | undefined;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  fallback?: string;
  showId?: boolean;
}

/**
 * Componente para mostrar imágenes desde WordPress mediaIds
 */
export default function MediaImage({
  mediaId,
  alt = 'Imagen',
  width = 200,
  height = 200,
  className = '',
  fallback = '/placeholder.png',
  showId = false,
}: MediaImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!mediaId) {
      setImageUrl(fallback);
      setLoading(false);
      return;
    }

    // Si es una URL (string que comienza con http:// o https://), usarla directamente
    if (typeof mediaId === 'string' && (mediaId.startsWith('http://') || mediaId.startsWith('https://'))) {
      setImageUrl(mediaId);
      setLoading(false);
      setError(false);
      return;
    }

    // Si es un ID (número o string numérico), usar el endpoint /api/media/[id]
    const idValue = typeof mediaId === 'number' ? mediaId : parseInt(mediaId, 10);
    if (!isNaN(idValue) && idValue > 0) {
      setImageUrl(`/api/media/${idValue}`);
      setLoading(false);
      setError(false);
    } else {
      // Si no es ni URL ni ID válido, usar fallback
      setImageUrl(fallback);
      setLoading(false);
      setError(true);
    }
  }, [mediaId, fallback]);

  if (loading) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gray-100 border border-gray-300 rounded ${className}`}
        style={{ width, height }}
      >
        <Loader2 className="w-6 h-6 animate-spin text-gray-400 mb-2" />
        {showId && mediaId && (
          <span className="text-xs text-gray-500">
            {typeof mediaId === 'string' && (mediaId.startsWith('http://') || mediaId.startsWith('https://'))
              ? 'URL'
              : `ID: ${mediaId}`}
          </span>
        )}
      </div>
    );
  }

  if (error || !imageUrl || imageUrl === fallback) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gray-100 border border-gray-300 rounded text-gray-400 ${className}`}
        style={{ width, height }}
      >
        <ImageOff className="w-8 h-8 mb-2" />
        <span className="text-xs text-center px-2">Sin imagen</span>
        {showId && mediaId && (
          <span className="text-xs text-gray-500 mt-1">
            {typeof mediaId === 'string' && (mediaId.startsWith('http://') || mediaId.startsWith('https://'))
              ? 'URL'
              : `ID: ${mediaId}`}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded border border-gray-300 ${className}`} style={{ width, height }}>
      <img
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-cover"
        onError={() => {
          setImageUrl(fallback);
          setError(true);
        }}
      />
      {showId && mediaId && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1 text-center">
          {typeof mediaId === 'string' && (mediaId.startsWith('http://') || mediaId.startsWith('https://'))
            ? 'URL'
            : `ID: ${mediaId}`}
        </div>
      )}
    </div>
  );
}


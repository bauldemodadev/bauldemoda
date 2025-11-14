'use client';

import { useState, useEffect } from 'react';
import { Loader2, ImageOff } from 'lucide-react';

interface MediaImageProps {
  mediaId: number | null | undefined;
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

    setLoading(true);
    setError(false);

    // Obtener URL de la imagen desde la API
    fetch(`/api/media/${mediaId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.url) {
          setImageUrl(data.url);
        } else {
          setImageUrl(fallback);
          setError(true);
        }
      })
      .catch((err) => {
        console.error('Error cargando imagen:', err);
        setImageUrl(fallback);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [mediaId, fallback]);

  if (loading) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gray-100 border border-gray-300 rounded ${className}`}
        style={{ width, height }}
      >
        <Loader2 className="w-6 h-6 animate-spin text-gray-400 mb-2" />
        {showId && mediaId && (
          <span className="text-xs text-gray-500">ID: {mediaId}</span>
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
          <span className="text-xs text-gray-500 mt-1">ID: {mediaId}</span>
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
          ID: {mediaId}
        </div>
      )}
    </div>
  );
}


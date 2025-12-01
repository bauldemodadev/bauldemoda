"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface InfiniteScrollListProps<T> {
  /** Items iniciales (primer batch) */
  initialItems: T[];
  /** Función para renderizar cada item */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Función para cargar el siguiente batch */
  loadMore: (cursor?: string) => Promise<{ items: T[]; nextCursor?: string; hasMore: boolean }>;
  /** Cursor inicial (opcional) */
  initialCursor?: string;
  /** Si hay más items para cargar */
  initialHasMore?: boolean;
  /** Clase CSS para el contenedor */
  className?: string;
  /** Clase CSS para cada item */
  itemClassName?: string;
  /** Mensaje cuando no hay más items */
  endMessage?: React.ReactNode;
  /** Mensaje de error */
  errorMessage?: (error: string) => React.ReactNode;
  /** Threshold para IntersectionObserver (0-1) */
  threshold?: number;
}

/**
 * Componente reutilizable de scroll infinito
 * Usa IntersectionObserver para detectar cuando el usuario se acerca al final
 * y carga automáticamente el siguiente batch
 */
export function InfiniteScrollList<T extends { id?: string; slug?: string }>({
  initialItems,
  renderItem,
  loadMore,
  initialCursor,
  initialHasMore = true,
  className = "",
  itemClassName = "",
  endMessage = <div className="text-center text-gray-500 py-8">No hay más items</div>,
  errorMessage = (error) => <div className="text-center text-red-500 py-8">Error: {error}</div>,
  threshold = 0.1,
}: InfiniteScrollListProps<T>) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [cursor, setCursor] = useState<string | undefined>(initialCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Función para cargar más items
  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasMore || error) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await loadMore(cursor);
      
      setItems((prev) => [...prev, ...result.items]);
      setCursor(result.nextCursor);
      setHasMore(result.hasMore);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMsg);
      console.error("Error cargando más items:", err);
    } finally {
      setIsLoading(false);
    }
  }, [cursor, hasMore, isLoading, error, loadMore]);

  // Configurar IntersectionObserver
  useEffect(() => {
    if (!sentinelRef.current || !hasMore || isLoading) return;

    // Limpiar observer anterior
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Crear nuevo observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          handleLoadMore();
        }
      },
      {
        threshold,
        rootMargin: "100px", // Cargar cuando esté a 100px del final
      }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, handleLoadMore, threshold]);

  // Actualizar items si cambian los initialItems
  useEffect(() => {
    setItems(initialItems);
    setCursor(initialCursor);
    setHasMore(initialHasMore);
  }, [initialItems, initialCursor, initialHasMore]);

  return (
    <div className={className}>
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.div
            key={item.id || item.slug || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index % 10 * 0.05 }}
            className={itemClassName}
          >
            {renderItem(item, index)}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Sentinel para detectar cuando el usuario se acerca al final */}
      {hasMore && !error && (
        <div ref={sentinelRef} className="h-20 flex items-center justify-center">
          {isLoading && (
            <div className="text-gray-500 text-sm">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500 mx-auto"></div>
              <p className="mt-2">Cargando más...</p>
            </div>
          )}
        </div>
      )}

      {/* Mensaje de error */}
      {error && errorMessage(error)}

      {/* Mensaje de fin */}
      {!hasMore && !isLoading && items.length > 0 && endMessage}
    </div>
  );
}


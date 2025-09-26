"use client";

import React, { useEffect, useState } from "react";
import * as motion from "framer-motion/client";
import { cn } from "@/lib/utils";
import { satoshi, integralCF } from "@/styles/fonts";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import ProductCard from "./ProductCard";
import { Product } from "@/types/product";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

type ProductListSecProps = {
  title: string;
  data: Product[];
  viewAllLink?: string;
  showDiscountBadge?: boolean;
  showNewBadge?: boolean;
};

const ProductListSec = ({ title, data, viewAllLink, showDiscountBadge, showNewBadge }: ProductListSecProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Función para obtener el timestamp de una fecha (soporta Date, ISO string y formato español)
  const getTimestamp = (valorFecha: any): number => {
    if (!valorFecha) return 0;

    // Date nativo
    if (valorFecha instanceof Date) {
      const ms = valorFecha.getTime();
      return Number.isNaN(ms) ? 0 : ms;
    }

    // Timestamp de Firebase
    if (typeof valorFecha === 'object' && typeof valorFecha.seconds === 'number') {
      return valorFecha.seconds * 1000; // Convertir a milisegundos
    }

    // String ISO u otros formatos parseables por Date
    if (typeof valorFecha === 'string') {
      const parsedIso = Date.parse(valorFecha);
      if (!Number.isNaN(parsedIso)) {
        return parsedIso;
      }

      // Formato español: "día de mes de año, hh:mm:ss a.m./p.m."
      try {
        const meses: { [key: string]: number } = {
          'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
          'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
        };

        const [parteFecha, parteTiempo] = valorFecha.split(', ');
        const [dia, mes, anio] = (parteFecha || '').split(' de ');
        const [horaTexto, periodoRaw] = (parteTiempo || '').split(' ');
        const [horas, minutos, segundos] = (horaTexto || '').split(':');

        let hora = parseInt(horas || '0');
        const periodo = (periodoRaw || '').toLowerCase().replace(/\./g, '').trim(); // 'pm' | 'am'
        if (periodo === 'pm' && hora !== 12) {
          hora += 12;
        } else if (periodo === 'am' && hora === 12) {
          hora = 0;
        }

        const indiceMes = meses[(mes || '').toLowerCase()];
        if (typeof indiceMes !== 'number') return 0;

        return new Date(
          parseInt(anio || '0'),
          indiceMes,
          parseInt(dia || '1'),
          hora,
          parseInt(minutos || '0'),
          parseInt(segundos || '0')
        ).getTime();
      } catch {
        return 0;
      }
    }

    return 0;
  };

  
  const activeProducts = data
    .filter(product => product.active === true)
    .sort((a, b) => {
      const timestampA = getTimestamp(a.createdAt);
      const timestampB = getTimestamp(b.createdAt);
      return timestampB - timestampA; // Orden descendente (más reciente primero)
    });
    
  // Determinar si el carrusel debe hacer loop (solo si hay más de 5 productos)
  const shouldLoop = activeProducts.length > 5;

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    if (!api) return;

    // Solo activar auto-scroll en desktop si hay más de 5 productos
    const isDesktop = window.innerWidth >= 768; // md breakpoint
    if (isDesktop && activeProducts.length > 5) {
      const interval = setInterval(() => {
        api.scrollNext();
      }, 5000); // Mover cada 5 segundos

      return () => clearInterval(interval);
    }
  }, [api, activeProducts.length]);

  return (
    <section className="max-w-frame mx-auto">
      <motion.h2
        initial={{ y: "100px", opacity: 0 }}
        whileInView={{ y: "0", opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={cn([
          integralCF.className,
          "text-2xl font-bold text-left mb-8 md:mb-12 ml-8 md:ml-0",
        ])}
      >
        {title}
      </motion.h2>
      <motion.div
        initial={{ y: "100px", opacity: 0 }}
        whileInView={{ y: "0", opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: shouldLoop,
            skipSnaps: false,
            containScroll: "trimSnaps",
          }}
          className="w-full mb-6 md:mb-9 relative"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="relative w-full h-full">
              {shouldLoop && (
                <>
                  <CarouselPrevious 
                    variant="ghost" 
                    className="pointer-events-auto hidden md:flex text-2xl hover:bg-black/5 absolute -left-12 top-1/2 -translate-y-1/2 md:-left-16 lg:-left-20 z-0 !bg-white/80 hover:!bg-white"
                  >
                    <FaArrowLeft />
                  </CarouselPrevious>
                  <CarouselNext 
                    variant="ghost" 
                    className="pointer-events-auto hidden md:flex text-2xl hover:bg-black/5 absolute -right-12 top-1/2 -translate-y-1/2 md:-right-16 lg:-right-20 z-0 !bg-white/80 hover:!bg-white"
                  >
                    <FaArrowRight />
                  </CarouselNext>
                </>
              )}
            </div>
          </div>
          <CarouselContent className="mx-4 xl:mx-0 space-x-3 sm:space-x-4 relative z-10">
            {activeProducts.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-0 basis-2/3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <ProductCard 
                  data={product} 
                  variant="shop"
                  showNewBadge={showNewBadge}
                  showDiscountBadge={showDiscountBadge}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {viewAllLink && (
          <div className="w-full px-4 sm:px-0 text-center">
            <Link
              href={viewAllLink}
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-medium text-sm hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <span>Ver todos</span>
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 8l4 4m0 0l-4 4m4-4H3" 
                />
              </svg>
            </Link>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default ProductListSec;
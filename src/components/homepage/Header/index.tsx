"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type BannerItem = {
  id: string;
  imagenUrl: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  ctaTexto: string;
  ctaUrl: string;
};

const Header = () => {
  const banners: BannerItem[] = useMemo(
    () => [
      {
        id: "1",
        imagenUrl: "https://bauldemoda.com.ar/wp-content/uploads/2020/05/slider-abc-costura-online.jpg",
        titulo: "Nueva Colección",
        subtitulo: "Primavera Verano 2024",
        descripcion: "Descubre las últimas tendencias en moda con nuestra nueva colección. Diseños únicos que reflejan tu personalidad.",
        ctaTexto: "Ver Colección",
        ctaUrl: "/shop"
      },
      {
        id: "2", 
        imagenUrl: "https://bauldemoda.com.ar/wp-content/uploads/2023/03/masterclass-slide.jpg",
        titulo: "Ofertas Especiales",
        subtitulo: "Hasta 50% OFF",
        descripcion: "No te pierdas nuestras ofertas especiales en ropa y accesorios. Calidad premium a precios increíbles.",
        ctaTexto: "Comprar Ahora",
        ctaUrl: "/shop?filter=specialOffer"
      }
    ],
    []
  );

  const [indiceActual, setIndiceActual] = useState(0);
  const intervaloRef = useRef<NodeJS.Timeout | null>(null);

  const cambiarSlide = useCallback((nuevoIndice: number) => {
    const totalSlides = banners.length;
    if (totalSlides === 0) return;
    const indiceNormalizado = ((nuevoIndice % totalSlides) + totalSlides) % totalSlides;
    setIndiceActual(indiceNormalizado);
  }, [banners.length]);

  // Autoplay simple
  useEffect(() => {
    intervaloRef.current = setInterval(() => {
      cambiarSlide(indiceActual + 1);
    }, 5000);

    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
    };
  }, [indiceActual, cambiarSlide]);

  return (
    <section className="relative w-full bg-white">
      <div className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden">
        {/* Slide actual */}
        <div className="relative w-full h-full">
          <div className="h-full flex items-center">
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
                {/* Contenido de texto - Izquierda */}
                <div className="w-full lg:w-2/5 text-center lg:text-left">
                  <div className="max-w-lg mx-auto lg:mx-0">
                    {/* Subtítulo */}
                    <div className="mb-3">
                      <span className="inline-block bg-pink-100 text-pink-600 px-3 py-1.5 rounded-full text-xs font-medium uppercase">
                        {banners[indiceActual].subtitulo}
                      </span>
                    </div>
                    
                    {/* Título */}
                    <h1 className="font-beauty text-2xl sm:text-3xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                      {banners[indiceActual].titulo}
                    </h1>
                    
                    {/* Descripción */}
                    <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed">
                      {banners[indiceActual].descripcion}
                    </p>
                    
                    {/* Botón CTA */}
                    <div className="flex justify-center lg:justify-start">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-6 py-3 text-sm font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                        onClick={() => window.location.href = banners[indiceActual].ctaUrl}
                      >
                        {banners[indiceActual].ctaTexto}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Imagen - Derecha */}
                <div className="w-full lg:w-3/5 flex justify-center">
                  <div className="relative w-full max-w-xl lg:max-w-3xl xl:max-w-4xl">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={banners[indiceActual].imagenUrl}
                        alt={banners[indiceActual].titulo}
                        fill
                        className="object-contain object-center"
                        priority={indiceActual === 0}
                      />
                      {/* Overlay decorativo */}
                      <div className="absolute inset-0" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Indicadores */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => cambiarSlide(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === indiceActual ? 'bg-pink-500 scale-125' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Ir al slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Botones de navegación */}
        <button
          type="button"
          onClick={() => cambiarSlide(indiceActual - 1)}
          aria-label="Anterior"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-pink-500 hover:bg-pink-600 text-white transition-all shadow-lg hover:shadow-xl"
        >
          <span className="text-xl">‹</span>
        </button>
        
        <button
          type="button"
          onClick={() => cambiarSlide(indiceActual + 1)}
          aria-label="Siguiente"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-pink-500 hover:bg-pink-600 text-white transition-all shadow-lg hover:shadow-xl"
        >
          <span className="text-xl">›</span>
        </button>
      </div>
    </section>
  );
};

export default Header;
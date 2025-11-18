"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type BannerItem = {
  id: string;
  imagenUrl: string;
  titulo: string;
  subtitulo?: string;
  descripcion: string;
  ctaTexto: string | string[];
  ctaUrl: string | string[];
};

const Header = () => {
  const banners: BannerItem[] = useMemo(
    () => [
      {
        id: "1",
        imagenUrl: "https://bauldemoda.com.ar/wp-content/uploads/2025/11/slider.jpg",
        titulo: "Especial Navidad",
        descripcion: "Este año celebramos las fiestas creando un muñeco con base universal, que luego podrás adaptar a otras temáticas durante todo el año. Fechas en ambas sedes",
        ctaTexto: "Anotate en la sede más cercana",
        ctaUrl: "/contacto"
      },
      {
        id: "2",
        imagenUrl: "https://bauldemoda.com.ar/wp-content/uploads/2025/09/Sin-titulo-1150-x-700-px-1150x700-1.png",
        titulo: "Moda Circular online",
        descripcion: "Lanzamiento Moda Ciruclar online. Recupera tus prendas y dale una nueva oportunidad",
        ctaTexto: "Sacar Clase",
        ctaUrl: "/shop/categoria/cursos-online"
      },
      {
        id: "3",
        imagenUrl: "https://bauldemoda.com.ar/wp-content/uploads/2023/02/slide-masterclass.jpg",
        titulo: "Master Class",
        descripcion: "Una guía gratuita sobre limpieza y lubricación para máquinas felices.",
        ctaTexto: "Sacar Clase",
        ctaUrl: "/shop/categoria/cursos-online"
      },
      {
        id: "4",
        imagenUrl: "https://bauldemoda.com.ar/wp-content/uploads/2020/05/slider-abc-costura-online.jpg",
        titulo: "Abc Costura online",
        descripcion: "Una guía gratuita sobre limpieza y lubricación para máquinas felices.",
        ctaTexto: "Ver más",
        ctaUrl: "/shop/categoria/cursos-online"
      },
      {
        id: "5",
        imagenUrl: "https://bauldemoda.com.ar/wp-content/uploads/2023/03/masterclass-slide.jpg",
        titulo: "Master Class",
        descripcion: "Una clase abierta y gratuita con Todo lo que tenes que saber sobre Máquinas de Coser.",
        ctaTexto: "Sacar Clase",
        ctaUrl: "/shop/categoria/cursos-online"
      },
      {
        id: "6",
        imagenUrl: "https://bauldemoda.com.ar/wp-content/uploads/2024/09/slide-web.png",
        titulo: "Intensivo de Jeans",
        descripcion: "Renovamos nuestro intensivo de JEANS, ya podes disfrutar de su versión más dinámica!",
        ctaTexto: "Comprar Curso",
        ctaUrl: "/shop/categoria/cursos-online"
      },
      {
        id: "7",
        imagenUrl: "https://bauldemoda.com.ar/wp-content/uploads/2022/11/slider.gif",
        titulo: "Clases Presenciales",
        descripcion: "Conoce la Grilla de nuestras clases presenciales!",
        ctaTexto: ["Almagro", "Ciudad Jardin"],
        ctaUrl: ["/shop/categoria/cursos-almagro", "/shop/categoria/cursos-ciudad-jardin"]
      },
      {
        id: "8",
        imagenUrl: "https://bauldemoda.com.ar/wp-content/uploads/2024/08/SALIMOS-EN-MAS-CHIC.jpg",
        titulo: "Salimos en la Tele!",
        descripcion: "En el episodio 7 de \"Locas por el Jean\" donde vamos a estar reciclando una prenda de Jean y customizando...no te la pierdas! Transmite el canal MasChic x Flow.",
        ctaTexto: ["Ver Programa en Flow", "Maschictv"],
        ctaUrl: ["https://flow.com.ar", "https://maschic.tv"]
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
      <div className="relative w-full h-[450px] sm:h-[550px] md:h-[600px] lg:h-[700px] xl:h-[600px] overflow-hidden">
        {/* Slide actual */}
        <div className="relative w-full h-full">
          <div className="h-full flex items-start pt-4 sm:pt-6 lg:pt-8">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6 lg:gap-8">
                {/* Contenido de texto - Izquierda */}
                <div className="w-full lg:w-2/5 xl:w-2/5 text-center lg:text-left order-2 lg:order-1">
                  <div className="max-w-lg mx-auto lg:mx-0">
                    {(() => {
                      const bannerActual = banners[indiceActual];
                      const tieneMultiplesBotones = Array.isArray(bannerActual.ctaTexto);
                      
                      return (
                        <>
                          {/* Subtítulo - solo si existe */}
                          {bannerActual.subtitulo && (
                            <div className="mb-3">
                              <span className="inline-block bg-pink-100 text-pink-600 px-3 py-1.5 rounded-full text-xs font-medium uppercase">
                                {bannerActual.subtitulo}
                              </span>
                            </div>
                          )}
                          
                          {/* Título */}
                          <h1 className="font-beauty text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-gray-900 mb-3 sm:mb-4 leading-tight">
                            {bannerActual.titulo}
                          </h1>
                          
                          {/* Descripción */}
                          <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                            {bannerActual.descripcion}
                          </p>
                          
                          {/* Botones CTA - soporta múltiples botones */}
                          <div className={`flex ${tieneMultiplesBotones ? 'flex-col gap-3' : 'justify-center lg:justify-start'}`}>
                            {tieneMultiplesBotones ? (
                              // Múltiples botones
                              (bannerActual.ctaTexto as string[]).map((texto, index) => {
                                const urls = bannerActual.ctaUrl as string[];
                                return (
                                  <Button
                                    key={index}
                                    size="sm"
                                    className="text-white px-6 py-3 text-sm font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl w-full lg:w-auto"
                                    style={{ backgroundColor: "#E9ABBD" }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D44D7D"}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E9ABBD"}
                                    onClick={() => {
                                      const url = urls[index];
                                      if (url.startsWith('http')) {
                                        window.open(url, '_blank');
                                      } else {
                                        window.location.href = url;
                                      }
                                    }}
                                  >
                                    {texto}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                  </Button>
                                );
                              })
                            ) : (
                              // Un solo botón
                              <Button
                                size="sm"
                                className="text-white px-6 py-3 text-sm font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                                style={{ backgroundColor: "#E9ABBD" }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D44D7D"}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E9ABBD"}
                                onClick={() => {
                                  const url = bannerActual.ctaUrl as string;
                                  if (url.startsWith('http')) {
                                    window.open(url, '_blank');
                                  } else {
                                    window.location.href = url;
                                  }
                                }}
                              >
                                {bannerActual.ctaTexto as string}
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Imagen - Derecha */}
                <div className="w-full lg:w-3/5 xl:w-3/5 flex justify-center order-1 lg:order-2">
                  <div className="relative w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl">
                    <div className="relative aspect-[4/3] lg:aspect-[5/4] xl:aspect-[6/4] overflow-hidden">
                      <Image
                        src={banners[indiceActual].imagenUrl}
                        alt={banners[indiceActual].titulo}
                        fill
                        className="object-contain object-center"
                        priority={indiceActual === 0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 50vw"
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
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => cambiarSlide(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: '8px',
                height: '8px',
                minWidth: '8px',
                minHeight: '8px',
                maxWidth: '8px',
                maxHeight: '8px',
                backgroundColor: i === indiceActual ? "#E9ABBD" : "#D1D5DB",
                borderRadius: '50%',
                padding: 0,
                border: 'none'
              }}
              onMouseEnter={(e) => {
                if (i !== indiceActual) {
                  e.currentTarget.style.backgroundColor = "#9CA3AF";
                }
              }}
              onMouseLeave={(e) => {
                if (i !== indiceActual) {
                  e.currentTarget.style.backgroundColor = "#D1D5DB";
                }
              }}
              aria-label={`Ir al slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Botones de navegación */}
        <button
          type="button"
          onClick={() => cambiarSlide(indiceActual - 1)}
          aria-label="Anterior"
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full text-white transition-all shadow-lg hover:shadow-xl z-10"
          style={{ backgroundColor: "#E9ABBD" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D44D7D"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E9ABBD"}
        >
          <span className="text-lg sm:text-xl">‹</span>
        </button>
        
        <button
          type="button"
          onClick={() => cambiarSlide(indiceActual + 1)}
          aria-label="Siguiente"
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full text-white transition-all shadow-lg hover:shadow-xl z-10"
          style={{ backgroundColor: "#E9ABBD" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D44D7D"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E9ABBD"}
        >
          <span className="text-lg sm:text-xl">›</span>
        </button>
      </div>
    </section>
  );
};

export default Header;
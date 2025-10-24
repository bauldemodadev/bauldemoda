import React, { useState } from "react";
import * as motion from "framer-motion/client";
import Image from "next/image";
import { cn } from "@/lib/utils";

const obras = [
  {
    id: 1,
    titulo: "Mesa de Comedor Personalizada",
    descripcion: "Mesa de 8 plazas en madera de pino macizo con acabado natural",
    imagen: "/images/obra-mesa-comedor.jpg",
    categoria: "Mobiliario"
  },
  {
    id: 2,
    titulo: "Estantería Modular",
    descripcion: "Sistema de estanterías modulares en eucalipto para biblioteca",
    imagen: "/images/obra-estanteria.jpg",
    categoria: "Almacenamiento"
  },
  {
    id: 3,
    titulo: "Escalera de Madera",
    descripcion: "Escalera interior con pasamanos tallado en quebracho",
    imagen: "/images/obra-escalera.jpg",
    categoria: "Construcción"
  },
  {
    id: 4,
    titulo: "Cocina Integral",
    descripcion: "Cocina completa con muebles de madera de saligna",
    imagen: "/images/obra-cocina.jpg",
    categoria: "Cocina"
  },
  {
    id: 5,
    titulo: "Deck Exterior",
    descripcion: "Deck de madera de grandis para terraza con tratamiento anti-humedad",
    imagen: "/images/obra-deck.jpg",
    categoria: "Exterior"
  },
  {
    id: 6,
    titulo: "Puertas Interiores",
    descripcion: "Set de puertas interiores en madera de pino con molduras",
    imagen: "/images/obra-puertas.jpg",
    categoria: "Carpintería"
  }
];

const Obras = () => {
  const [obraSeleccionada, setObraSeleccionada] = useState<number | null>(null);

  return (
    <div className="px-4 xl:px-0">
      <section id="obras" className="max-w-frame mx-auto px-4 md:px-6 py-16 md:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ y: "100px", opacity: 0 }}
            whileInView={{ y: "0", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={cn([
              
              "text-2xl font-bold text-center ml-8 md:ml-0",
            ])}
          >
            Nuestras Obras
          </motion.h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mt-4 sm:mt-6">
            Descubre la excelencia de nuestro trabajo a través de proyectos realizados 
            con pasión, calidad y la mejor selección de maderas
          </p>
        </motion.div>

        {/* Galería */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {obras.map((obra, index) => (
            <motion.div
              key={obra.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setObraSeleccionada(obra.id)}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
                {/* Imagen */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={obra.imagen}
                    alt={obra.titulo}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Categoría */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1.5 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-800 rounded-full">
                      {obra.categoria}
                    </span>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                    {obra.titulo}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {obra.descripcion}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <a
            href="/obras"
            className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-300 hover:scale-105"
          >
            Ver Todas las Obras
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </section>
    </div>
  );
};

export default Obras;

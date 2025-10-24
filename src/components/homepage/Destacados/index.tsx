import React from "react";
import * as motion from "framer-motion/client";
import DestacadoCard from "./DestacadoCard";
import { cn } from "@/lib/utils";

const destacados = [
  {
    id: 1,
    categoria: "ACCESORIOS",
    titulo: "HOME",
    subtitulo: "Carpintería",
    boton: "VER MÁS",
    imagen: "/images/5.jpg",
    url: "/shop?category=accesorios",
    tipo: "vertical" as const,
    colorBoton: "light" as const,
    mostrarBoton: true,
    esOferta: false
  },
  {
    id: 2,
    categoria: "UTILIDADES",
    titulo: "VARIEDAD",
    subtitulo: "Profesional",
    boton: "EXPLORAR",
    imagen: "/images/2.jpg",
    url: "/shop?category=ferreteria",
    tipo: "vertical" as const,
    colorBoton: "light" as const,
    mostrarBoton: true,
    esOferta: false
  },
  {
    id: 3,
    categoria: "DECORACIÓN",
    titulo: "MADERAS",
    subtitulo: "Pino",
    boton: "VER COLECCIÓN",
    imagen: "/images/4.jpg",
    url: "/shop?madera=pino",
    tipo: "vertical" as const,
    colorBoton: "dark" as const,
    mostrarBoton: true,
    esOferta: false
  },
  {
    id: 4,
    categoria: "BANCOS",
    titulo: "FINANCIACIÓN",
    descripcion: "Cuotas sin interés en todas nuestras maderas y herramientas",
    boton: "VER PLANES",
    imagen: "/images/7.jpg",
    url: "/shop?financiacion=cuotas",
    tipo: "horizontal" as const,
    colorBoton: "dark" as const,
    mostrarBoton: true,
    esOferta: true
  },
  {
    id: 5,
    categoria: "OFERTAS",
    titulo: "DESCUENTOS",
    subtitulo: "Especiales",
    boton: "VER OFERTAS",
    imagen: "/images/8.jpg",
    url: "/shop?ofertas=descuentos",
    tipo: "vertical" as const,
    colorBoton: "light" as const,
    mostrarBoton: false,
    esOferta: true
  }
];

const Destacados = () => {
  return (
    <div className="px-4 xl:px-0">
      <section className="max-w-frame mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12 sm:mb-16 md:mb-20"
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
            DESTACADOS
          </motion.h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mt-4 sm:mt-6 text-center">
            Descubre nuestras mejores promociones y colecciones seleccionadas
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {/* Primera fila: 3 items verticales */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0 * 0.15, ease: "easeOut" }}
            className="sm:col-span-1 lg:col-span-1"
          >
            <DestacadoCard {...destacados[0]} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1 * 0.15, ease: "easeOut" }}
            className="sm:col-span-1 lg:col-span-1"
          >
            <DestacadoCard {...destacados[1]} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 2 * 0.15, ease: "easeOut" }}
            className="sm:col-span-1 lg:col-span-1"
          >
            <DestacadoCard {...destacados[2]} />
          </motion.div>
          
          {/* Segunda fila: item horizontal + item vertical */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 3 * 0.15, ease: "easeOut" }}
            className="sm:col-span-2 lg:col-span-2"
          >
            <DestacadoCard {...destacados[3]} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 4 * 0.15, ease: "easeOut" }}
            className="sm:col-span-2 lg:col-span-1"
          >
            <DestacadoCard {...destacados[4]} />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Destacados;

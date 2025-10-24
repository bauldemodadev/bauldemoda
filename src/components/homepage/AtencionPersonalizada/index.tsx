import React from "react";
import * as motion from "framer-motion/client";
import { beauty } from "@/styles/fonts";
import { cn } from "@/lib/utils";

const AtencionPersonalizada = () => {
  return (
    <div className="px-4 xl:px-0">
      <section className="max-w-frame mx-auto px-4 md:px-6 py-12 md:py-16 bg-white">
        <div className="text-center">
          {/* Título principal */}
          <motion.h2
            initial={{ y: "100px", opacity: 0 }}
            whileInView={{ y: "0", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={cn([
              beauty.className,
              "text-4xl md:text-5xl font-bold text-gray-800 mb-4",
            ])}
          >
            CONOCENOS
          </motion.h2>
          
          {/* Subtítulo */}
          <motion.p
            initial={{ y: "50px", opacity: 0 }}
            whileInView={{ y: "0", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-gray-700 mb-12 md:mb-16"
          >
            Te invitamos a formar parte de nuestro Mundo Baúl
          </motion.p>

          {/* Tres bloques de contenido */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 max-w-6xl mx-auto">
            {/* Bloque 1: bauleras */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center flex-1 max-w-sm"
            >
              {/* Icono corazón */}
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-pink-500 rounded"></div>
                </div>
              </div>
              
              {/* Título */}
              <h3 className={cn([
                beauty.className,
                "text-2xl md:text-3xl font-bold text-gray-800 mb-4"
              ])}>
                bauleras
              </h3>
              
              {/* Descripción */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                Descubrí quiénes somos<br />
                y nuestra historia
              </p>
              
              {/* Link */}
              <a href="#" className="text-pink-500 underline hover:text-pink-600 transition-colors">
                ver más
              </a>
            </motion.div>

            {/* Bloque 2: comunidad */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center flex-1 max-w-sm"
            >
              {/* Icono burbujas de chat */}
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  {/* Burbuja izquierda */}
                  <div className="w-12 h-12 border-2 border-pink-300 rounded-full flex items-center justify-center">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-pink-300 rounded-full"></div>
                      <div className="w-1 h-1 bg-pink-300 rounded-full"></div>
                      <div className="w-1 h-1 bg-pink-300 rounded-full"></div>
                    </div>
                  </div>
                  {/* Burbuja derecha */}
                  <div className="absolute -right-2 -top-2 w-8 h-8 bg-pink-500 rounded-full"></div>
                </div>
              </div>
              
              {/* Título */}
              <h3 className={cn([
                beauty.className,
                "text-2xl md:text-3xl font-bold text-gray-800 mb-4"
              ])}>
                comunidad
              </h3>
              
              {/* Descripción */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                Conoce los beneficios para<br />
                alumnos y nuestros eventos
              </p>
              
              {/* Link */}
              <a href="#" className="text-pink-500 underline hover:text-pink-600 transition-colors">
                ver más
              </a>
            </motion.div>

            {/* Bloque 3: tips */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center flex-1 max-w-sm"
            >
              {/* Icono pulgar arriba */}
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3m0 11V9a2 2 0 012-2h4a2 2 0 012 2v11M7 22h10M7 22l-3-3m3 3l3-3m-3 3V9a2 2 0 012-2h4a2 2 0 012 2v11"/>
                    </svg>
                  </div>
                  {/* Líneas radiadas */}
                  <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-pink-500 transform -translate-x-1/2 -translate-y-2"></div>
                    <div className="absolute top-2 right-0 w-4 h-0.5 bg-pink-500 transform translate-x-2"></div>
                    <div className="absolute bottom-2 left-0 w-3 h-0.5 bg-pink-500 transform -translate-x-1"></div>
                  </div>
                </div>
              </div>
              
              {/* Título */}
              <h3 className={cn([
                beauty.className,
                "text-2xl md:text-3xl font-bold text-gray-800 mb-4"
              ])}>
                tips
              </h3>
              
              {/* Descripción */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                Accede a nuestro blog<br />
                de datos útiles
              </p>
              
              {/* Link */}
              <a href="#" className="text-pink-500 underline hover:text-pink-600 transition-colors">
                ver más
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AtencionPersonalizada;

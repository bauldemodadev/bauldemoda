import React from "react";
import * as motion from "framer-motion/client";
import { cn } from "@/lib/utils";

const Redes = () => {
  return (
    <div className="px-4 xl:px-0"
    style={{ backgroundColor: "#9CDAD3" }}>
      <section 
        className="max-w-frame mx-auto px-4 md:px-6 py-16 md:py-24"
      >
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
              
              "text-3xl md:text-4xl font-bold text-gray-800 uppercase tracking-wide mb-4",
            ])}
          >
            SEGUINOS EN INSTAGRAM
          </motion.h2>
          <motion.p
            initial={{ y: "50px", opacity: 0 }}
            whileInView={{ y: "0", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-gray-700"
          >
            y enterate de todas las novedades
          </motion.p>
        </motion.div>

        {/* Grid de Instagram Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
          {/* Post 1 - SOMOS Baúl Moda */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {/* Imagen placeholder - puedes reemplazar con imagen real */}
            <div className="w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <div className="text-gray-500">Imagen de mujeres con teléfonos</div>
              </div>
            </div>
            
            {/* Overlay de texto */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
              <div className="text-black font-bold text-lg mb-2">SOMOS</div>
              <div className="text-pink-600 font-bold text-xl mb-2" style={{ fontFamily: 'cursive' }}>Baúl Moda</div>
              <div className="text-black font-bold text-lg">PERO NOS DICEN...</div>
            </div>
            
            {/* Play button */}
            <div className="absolute top-4 right-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                <svg className="w-4 h-4 text-gray-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Post 2 - RUTA BAULERA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {/* Imagen placeholder */}
            <div className="w-full h-full bg-gradient-to-br from-yellow-200 to-orange-200 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <div className="text-gray-500">Ilustración de auto rosa</div>
              </div>
            </div>
            
            {/* Overlay de texto */}
            <div className="absolute inset-0 flex flex-col justify-between p-4">
              <div className="flex justify-end">
                <div className="bg-yellow-400 text-black font-bold px-3 py-1 rounded-full text-sm">
                  20% DTO.
                </div>
              </div>
              <div className="text-center">
                <div className="text-black font-bold text-lg mb-1">RUTA BAULERA</div>
                <div className="text-blue-600 text-sm">UN RECORRIDO POR NUESTROS CURSOS ONLINE</div>
              </div>
            </div>
          </motion.div>

          {/* Post 3 - DÍA DE LA MUJER */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {/* Imagen placeholder */}
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-400 rounded-full mx-auto mb-4"></div>
                <div className="text-gray-500">Foto mujer leyendo periódico</div>
              </div>
            </div>
            
            {/* Overlay de texto */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
              <div className="text-black text-sm mb-2">POR QUÉ SE CONMEMORA EL</div>
              <div className="text-pink-600 font-bold text-xl">DÍA DE LA MUJER?</div>
            </div>
            
            {/* Calendario overlay */}
            <div className="absolute top-4 left-4 bg-white rounded-lg p-2 shadow-md">
              <div className="text-center">
                <div className="text-xs text-gray-600">MARZO 2024</div>
                <div className="text-pink-600 font-bold text-lg">8M</div>
              </div>
            </div>
          </motion.div>

          {/* Post 4 - ÚTILES PARA VENIR A CLASE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {/* Imagen placeholder */}
            <div className="w-full h-full bg-gradient-to-br from-blue-200 to-green-200 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <div className="text-gray-500">Útiles escolares</div>
              </div>
            </div>
            
            {/* Overlay de texto */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
              <div className="text-pink-600 font-bold text-xl mb-2">ÚTILES</div>
              <div className="text-black text-sm mb-2">PARA VENIR A</div>
              <div className="text-white font-bold text-xl bg-gray-800 px-4 py-1 rounded">CLASE</div>
            </div>
            
            {/* Play button */}
            <div className="absolute top-4 right-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                <svg className="w-4 h-4 text-gray-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Post 5 - BAÚL RODANTE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {/* Imagen placeholder */}
            <div className="w-full h-full bg-gradient-to-br from-yellow-200 to-pink-200 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <div className="text-gray-500">Mujeres con kimonos</div>
              </div>
            </div>
            
            {/* Overlay de texto */}
            <div className="absolute inset-0 flex flex-col justify-between p-4">
              <div className="text-center">
                <div className="text-black font-bold text-lg mb-2">BAÚL RODANTE</div>
                <div className="bg-white px-3 py-1 rounded-full text-pink-600 font-bold text-sm">
                  HICIMOS UN KIMONO
                </div>
              </div>
            </div>
            
            {/* Play button */}
            <div className="absolute top-4 right-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                <svg className="w-4 h-4 text-gray-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Post 6 - MARZO */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {/* Imagen placeholder */}
            <div className="w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <div className="text-gray-500">Cuaderno abierto</div>
              </div>
            </div>
            
            {/* Overlay de texto */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
              <div className="text-black font-bold text-xl">MARZO</div>
            </div>
          </motion.div>
        </div>

        {/* Iconos de redes sociales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex justify-center space-x-6"
        >
          {/* Facebook */}
          <motion.a
            href="#"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 border-2 border-gray-600 rounded-full flex items-center justify-center hover:bg-gray-600 hover:text-white transition-colors duration-300"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </motion.a>

          {/* YouTube */}
          <motion.a
            href="#"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 border-2 border-gray-600 rounded-full flex items-center justify-center hover:bg-gray-600 hover:text-white transition-colors duration-300"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </motion.a>

          {/* Instagram */}
          <motion.a
            href="#"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 border-2 border-gray-600 rounded-full flex items-center justify-center hover:bg-gray-600 hover:text-white transition-colors duration-300"
          >
             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
               <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
             </svg>
          </motion.a>
        </motion.div>
      </section>
    </div>
  );
};

export default Redes;

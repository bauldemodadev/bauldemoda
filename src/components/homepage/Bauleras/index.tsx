"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import UbicacionWrapper from "@/components/homepage/Ubicacion/UbicacionWrapper";

const Bauleras = () => {
  return (
    <div className="px-4 xl:px-0">
      {/* Sección Somos Baúl de Moda */}
      <section 
        className="w-full py-12 md:py-16" 
        style={{ backgroundColor: "#F8F5E8" }}
      >
        <div className="max-w-frame mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Contenido de texto */}
            <div>
              <motion.h2
                initial={{ y: "100px", opacity: 0 }}
                animate={{ y: "0", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={cn("text-3xl md:text-4xl font-bold text-gray-900 mb-6")}
              >
                SOMOS<br />
                BAÚL DE MODA
              </motion.h2>

              <motion.p
                initial={{ y: "100px", opacity: 0 }}
                animate={{ y: "0", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-gray-700 mb-6 text-lg"
              >
                Un lugar para que te encuentres con nuevos hobbies, viejos oficios y posibles emprendimientos. Un espacio para conectar con la creatividad, liberar el stress y romper con la rutina del día.
              </motion.p>

              <motion.p
                initial={{ y: "100px", opacity: 0 }}
                animate={{ y: "0", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg mb-4"
                style={{ color: "#E9749B" }}
              >
                <strong>Somos Juli y Vero,</strong> dos diseñadoras de Indumentaria, emprendedoras y amantes de los oficios. Disfrutamos, junto a más profes, compartir "el tiempo entre costuras…y otros oficios".
              </motion.p>

              <motion.p
                initial={{ y: "100px", opacity: 0 }}
                animate={{ y: "0", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg font-bold"
                style={{ color: "#E9749B" }}
              >
                Cualquiera sea tu búsqueda, nosotras te acompañamos!
              </motion.p>
            </div>

            {/* Imagen y elementos decorativos */}
            <div className="relative">
              {/* Elementos decorativos */}
              <div className="absolute inset-0">
                <svg width="100%" height="400" viewBox="0 0 400 400" className="absolute">
                  {/* Forma amarilla de fondo */}
                  <ellipse cx="200" cy="200" rx="180" ry="160" fill="#FFD700" opacity="0.8" />
                  
                  {/* Hojas decorativas */}
                  <path d="M50 100 Q80 80 120 100 Q100 120 80 140 Q60 120 50 100" fill="#E9749B" opacity="0.7" />
                  <path d="M350 80 Q380 60 420 80 Q400 100 380 120 Q360 100 350 80" fill="#E9749B" opacity="0.7" />
                  <path d="M60 300 Q90 280 130 300 Q110 320 90 340 Q70 320 60 300" fill="#20B2AA" opacity="0.7" />
                  <path d="M340 320 Q370 300 410 320 Q390 340 370 360 Q350 340 340 320" fill="#20B2AA" opacity="0.7" />
                  
                  {/* Corazones */}
                  <path d="M150 80 Q140 70 150 60 Q160 70 150 80" fill="#FFD700" />
                  <path d="M250 60 Q240 50 250 40 Q260 50 250 60" fill="#FFD700" />
                  <path d="M180 350 Q170 340 180 330 Q190 340 180 350" fill="#FFD700" />
                  
                  {/* Botón */}
                  <circle cx="320" cy="120" r="8" fill="#E9749B" />
                  <circle cx="320" cy="120" r="4" fill="white" />
                  
                  {/* Carretes de hilo */}
                  <rect x="80" y="200" width="12" height="8" fill="#FFD700" />
                  <rect x="80" y="202" width="12" height="4" fill="white" />
                  <rect x="300" y="250" width="12" height="8" fill="#E9749B" />
                  <rect x="300" y="252" width="12" height="4" fill="white" />
                  
                  {/* Líneas onduladas */}
                  <path d="M320 350 Q340 360 360 350 Q380 360 400 350" stroke="#FFD700" strokeWidth="3" fill="none" />
                </svg>
              </div>

              {/* Imagen central */}
              <div className="relative z-10 bg-white rounded-lg p-8 shadow-lg">
                <div className="text-center">
                  <div className="w-64 h-64 bg-gradient-to-br from-pink-100 to-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg width="200" height="200" viewBox="0 0 200 200" className="text-gray-600">
                      {/* Juli y Vero */}
                      <circle cx="80" cy="80" r="20" fill="#8B4513" />
                      <rect x="60" y="100" width="40" height="50" fill="#4169E1" />
                      <rect x="70" y="110" width="20" height="30" fill="#87CEEB" />
                      
                      <circle cx="120" cy="80" r="20" fill="#8B4513" />
                      <rect x="100" y="100" width="40" height="50" fill="#E9749B" />
                      <rect x="110" y="110" width="20" height="30" fill="#FFB6C1" />
                      
                      {/* Máquina de coser */}
                      <rect x="40" y="160" width="40" height="20" fill="#C0C0C0" />
                      <rect x="45" y="165" width="30" height="10" fill="#000" />
                      <rect x="50" y="167" width="20" height="6" fill="#87CEEB" />
                      
                      {/* Tijeras */}
                      <path d="M160 40 Q170 50 160 60 Q150 50 160 40" fill="#000" />
                      
                      {/* Elementos de costura */}
                      <circle cx="30" cy="120" r="3" fill="#FFD700" />
                      <circle cx="170" cy="140" r="3" fill="#E9749B" />
                      <rect x="25" y="180" width="6" height="6" fill="#20B2AA" />
                      <rect x="165" y="190" width="6" height="6" fill="#FFD700" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Juli y Vero</h4>
                  <p className="text-sm text-gray-600">Fundadoras de Baúl de Moda</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Video */}
      <section 
        className="w-full py-12 md:py-16" 
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div className="max-w-frame mx-auto px-4 md:px-6">
          <div className="text-center">
            <motion.div
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-8 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-pink-600">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <span className="text-white font-bold">Baúl de Moda online!</span>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="text-white hover:text-yellow-200 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </button>
                  <button className="text-white hover:text-yellow-200 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Video placeholder */}
              <div className="bg-yellow-300 rounded-lg p-8 relative">
                <div className="flex items-center justify-center">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" className="text-red-600 ml-2">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                
                {/* Logo Baúl de Moda */}
                <div className="absolute top-4 right-4">
                  <div className="bg-white rounded-full p-2 shadow-lg">
                    <span className="text-pink-600 font-bold text-sm">Baúl de Moda</span>
                  </div>
                </div>
                
                {/* Texto descriptivo */}
                <div className="absolute bottom-4 left-4">
                  <span className="text-pink-600 font-bold text-sm">CURSOS - WORKSHOPS - EVENTOS</span>
                </div>
              </div>
              
              <div className="mt-4">
                <button className="bg-red-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 mx-auto hover:bg-red-700 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span>Mirar en YouTube</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sección Historia */}
      <section 
        className="w-full py-12 md:py-16" 
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div className="max-w-frame mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Imagen y elementos decorativos */}
            <div className="relative">
              {/* Elementos decorativos */}
              <div className="absolute inset-0">
                <svg width="100%" height="400" viewBox="0 0 400 400" className="absolute">
                  {/* Forma amarilla de fondo */}
                  <ellipse cx="200" cy="200" rx="180" ry="160" fill="#FFD700" opacity="0.8" />
                  
                  {/* Hojas decorativas */}
                  <path d="M50 100 Q80 80 120 100 Q100 120 80 140 Q60 120 50 100" fill="#E9749B" opacity="0.7" />
                  <path d="M350 80 Q380 60 420 80 Q400 100 380 120 Q360 100 350 80" fill="#E9749B" opacity="0.7" />
                  <path d="M60 300 Q90 280 130 300 Q110 320 90 340 Q70 320 60 300" fill="#20B2AA" opacity="0.7" />
                  <path d="M340 320 Q370 300 410 320 Q390 340 370 360 Q350 340 340 320" fill="#20B2AA" opacity="0.7" />
                  
                  {/* Corazones */}
                  <path d="M150 80 Q140 70 150 60 Q160 70 150 80" fill="#FFD700" />
                  <path d="M250 60 Q240 50 250 40 Q260 50 250 60" fill="#FFD700" />
                  <path d="M180 350 Q170 340 180 330 Q190 340 180 350" fill="#FFD700" />
                  
                  {/* Botón */}
                  <circle cx="320" cy="120" r="8" fill="#E9749B" />
                  <circle cx="320" cy="120" r="4" fill="white" />
                  
                  {/* Carretes de hilo */}
                  <rect x="80" y="200" width="12" height="8" fill="#FFD700" />
                  <rect x="80" y="202" width="12" height="4" fill="white" />
                  <rect x="300" y="250" width="12" height="8" fill="#E9749B" />
                  <rect x="300" y="252" width="12" height="4" fill="white" />
                  
                  {/* Líneas onduladas */}
                  <path d="M320 350 Q340 360 360 350 Q380 360 400 350" stroke="#FFD700" strokeWidth="3" fill="none" />
                </svg>
              </div>

              {/* Imagen central */}
              <div className="relative z-10 bg-white rounded-lg p-8 shadow-lg">
                <div className="text-center">
                  <div className="w-64 h-64 bg-gradient-to-br from-pink-100 to-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg width="200" height="200" viewBox="0 0 200 200" className="text-gray-600">
                      {/* Mujeres cosiendo */}
                      <circle cx="80" cy="80" r="20" fill="#8B4513" />
                      <rect x="60" y="100" width="40" height="50" fill="#4169E1" />
                      <rect x="70" y="110" width="20" height="30" fill="#87CEEB" />
                      
                      <circle cx="120" cy="80" r="20" fill="#8B4513" />
                      <rect x="100" y="100" width="40" height="50" fill="#E9749B" />
                      <rect x="110" y="110" width="20" height="30" fill="#FFB6C1" />
                      
                      {/* Máquinas de coser */}
                      <rect x="40" y="160" width="40" height="20" fill="#C0C0C0" />
                      <rect x="45" y="165" width="30" height="10" fill="#000" />
                      <rect x="50" y="167" width="20" height="6" fill="#87CEEB" />
                      
                      <rect x="120" y="160" width="40" height="20" fill="#C0C0C0" />
                      <rect x="125" y="165" width="30" height="10" fill="#000" />
                      <rect x="130" y="167" width="20" height="6" fill="#87CEEB" />
                      
                      {/* Carretes de hilo */}
                      <circle cx="50" cy="140" r="8" fill="#FFD700" />
                      <circle cx="50" cy="140" r="4" fill="white" />
                      <circle cx="150" cy="140" r="8" fill="#E9749B" />
                      <circle cx="150" cy="140" r="4" fill="white" />
                      
                      {/* Alfileres */}
                      <circle cx="30" cy="120" r="2" fill="#FFD700" />
                      <circle cx="170" cy="120" r="2" fill="#E9749B" />
                      <circle cx="30" cy="180" r="2" fill="#20B2AA" />
                      <circle cx="170" cy="180" r="2" fill="#FFD700" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Historia de Baúl</h4>
                  <p className="text-sm text-gray-600">Desde 2008</p>
                </div>
              </div>
            </div>

            {/* Contenido de texto */}
            <div>
              <motion.h3
                initial={{ y: "100px", opacity: 0 }}
                animate={{ y: "0", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className={cn("text-2xl font-bold text-gray-900 mb-6")}
              >
                La Historia
              </motion.h3>

              <motion.div
                initial={{ y: "100px", opacity: 0 }}
                animate={{ y: "0", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-gray-700 space-y-4"
              >
                <p>
                  Baúl nace en el <strong style={{ color: "#E9749B" }}>año 2008</strong> en un viaje de colectivo y tras una noche de lluvia de ideas comienza a tomar forma en "la casa de los abuelos", su primer sede, con July a la cabeza.
                </p>

                <p>
                  Baúl se generó con el fin de armar un espacio creativo que revalorice los oficios y potencie el espíritu Emprendedor, en el oeste…"<em>un sueño cumplido que, por suerte, al día de hoy sigue creciendo, abriendo nuevos horizontes y trascendiendo zonas"</em>…
                </p>

                <p>
                  Baúl es un universo donde cada pieza es fundamental. <strong style={{ color: "#E9749B" }}>Somos muchas Bauleras!</strong>
                </p>

                <p>
                  En el 2010 se suma Vero, como profe, luego como par y amiga. También, nos acompañan hace años, un gran grupo de <strong style={{ color: "#E9749B" }}>profesoras – Diseñadoras, Artesanas y Artistas</strong> – que vienen a transmitir y compartir su conocimiento a través de talleres, cursos y seminarios, creando momentos únicos.
                </p>

                <p>
                  Ellas son testigos de las risas y las charlas que se crean entre mates y puntadas dentro de las clases, junto a otra pieza fundamental que son <strong style={{ color: "#E9749B" }}>"los alumnos y alumnas"</strong> con sus historias y personalidades.
                </p>

                <p>
                  Baúl es un Mundo, del cual nos encanta ser parte y que todos, de alguna forma, también lo sean!
                </p>

                <p>
                  <strong style={{ color: "#E9749B" }}>Unite a la comunidad Baulera</strong> que crece año a año, ahora también de forma online.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Prensa */}
      <section 
        className="w-full py-12 md:py-16" 
        style={{ backgroundColor: "#B2D8D8" }}
      >
        <div className="max-w-frame mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <motion.h3
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className={cn("text-2xl font-bold text-gray-900 mb-4")}
            >
              PRENSA
            </motion.h3>

            <motion.p
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="text-gray-700"
            >
              Compartimos nuestra participación en distintos medios y eventos.
            </motion.p>
          </div>

          {/* Grid de tarjetas de prensa */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Card 1: Online */}
            <motion.div
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-center">
                {/* Ilustración */}
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-pink-100 rounded-lg flex items-center justify-center">
                    <svg width="40" height="40" viewBox="0 0 40 40" className="text-pink-500">
                      {/* Megáfono */}
                      <path d="M8 20 L12 16 L12 24 Z" fill="currentColor" />
                      <path d="M12 18 L20 14 L20 22 L12 18 Z" fill="currentColor" />
                      {/* Corazones */}
                      <path d="M22 12 Q21 11 22 10 Q23 11 22 12" fill="currentColor" />
                      <path d="M24 14 Q23 13 24 12 Q25 13 24 14" fill="currentColor" />
                      {/* Teléfono */}
                      <rect x="28" y="16" width="8" height="12" rx="2" fill="currentColor" />
                      <rect x="30" y="18" width="4" height="8" fill="white" />
                    </svg>
                  </div>
                </div>

                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  ONLINE
                </h4>

                <p className="text-sm text-gray-600 mb-4">
                  Baúl en Blogs & Páginas
                </p>

                <button 
                  className="w-full px-4 py-2 text-white font-medium rounded-lg transition-colors"
                  style={{ backgroundColor: "#E9ABBD" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D44D7D"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E9ABBD"}
                >
                  MÁS INFO
                </button>
              </div>
            </motion.div>

            {/* Card 2: Contenido Revistas */}
            <motion.div
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-center">
                {/* Ilustración */}
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-pink-100 rounded-lg flex items-center justify-center">
                    <svg width="40" height="40" viewBox="0 0 40 40" className="text-pink-500">
                      {/* Revistas */}
                      <rect x="8" y="12" width="8" height="12" fill="currentColor" />
                      <rect x="16" y="10" width="8" height="12" fill="currentColor" />
                      <rect x="24" y="14" width="8" height="12" fill="currentColor" />
                      {/* Hojas */}
                      <path d="M6 8 Q8 6 10 8 Q8 10 6 8" fill="#20B2AA" />
                      <path d="M32 6 Q34 4 36 6 Q34 8 32 6" fill="#8B4513" />
                    </svg>
                  </div>
                </div>

                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  CONTENIDO REVISTAS
                </h4>

                <p className="text-sm text-gray-600 mb-4">
                  Arcadia
                </p>

                <button 
                  className="w-full px-4 py-2 text-white font-medium rounded-lg transition-colors"
                  style={{ backgroundColor: "#E9ABBD" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D44D7D"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E9ABBD"}
                >
                  MÁS INFO
                </button>
              </div>
            </motion.div>

            {/* Card 3: Exposiciones */}
            <motion.div
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-center">
                {/* Ilustración */}
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-pink-100 rounded-lg flex items-center justify-center">
                    <svg width="40" height="40" viewBox="0 0 40 40" className="text-pink-500">
                      {/* Mesa circular */}
                      <circle cx="20" cy="20" r="12" fill="currentColor" />
                      {/* Mujeres */}
                      <circle cx="16" cy="16" r="3" fill="#8B4513" />
                      <rect x="14" y="19" width="4" height="6" fill="#4169E1" />
                      <circle cx="24" cy="16" r="3" fill="#8B4513" />
                      <rect x="22" y="19" width="4" height="6" fill="#E9749B" />
                      {/* Corazones */}
                      <path d="M12 8 Q11 7 12 6 Q13 7 12 8" fill="#FFD700" />
                      <path d="M28 8 Q27 7 28 6 Q29 7 28 8" fill="#FFD700" />
                    </svg>
                  </div>
                </div>

                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  EXPOSICIONES
                </h4>

                <p className="text-sm text-gray-600 mb-4">
                  Eventos, Expos y Premios.
                </p>

                <button 
                  className="w-full px-4 py-2 text-white font-medium rounded-lg transition-colors"
                  style={{ backgroundColor: "#E9ABBD" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D44D7D"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E9ABBD"}
                >
                  MÁS INFO
                </button>
              </div>
            </motion.div>

            {/* Card 4: Diarios */}
            <motion.div
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-center">
                {/* Ilustración */}
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-pink-100 rounded-lg flex items-center justify-center">
                    <svg width="40" height="40" viewBox="0 0 40 40" className="text-pink-500">
                      {/* Periódico */}
                      <rect x="8" y="10" width="24" height="20" fill="white" stroke="currentColor" strokeWidth="1" />
                      <rect x="10" y="12" width="20" height="2" fill="currentColor" />
                      <rect x="10" y="15" width="15" height="1" fill="currentColor" />
                      <rect x="10" y="17" width="18" height="1" fill="currentColor" />
                      <rect x="10" y="19" width="12" height="1" fill="currentColor" />
                      <rect x="10" y="21" width="16" height="1" fill="currentColor" />
                      <rect x="10" y="23" width="14" height="1" fill="currentColor" />
                      {/* Clip */}
                      <rect x="6" y="8" width="2" height="4" fill="currentColor" />
                      <rect x="32" y="8" width="2" height="4" fill="currentColor" />
                      {/* Hoja */}
                      <path d="M6 6 Q8 4 10 6 Q8 8 6 6" fill="#FFD700" />
                    </svg>
                  </div>
                </div>

                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  DIARIOS
                </h4>

                <p className="text-sm text-gray-600 mb-4">
                  Clarín & La Nación
                </p>

                <button 
                  className="w-full px-4 py-2 text-white font-medium rounded-lg transition-colors"
                  style={{ backgroundColor: "#E9ABBD" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D44D7D"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E9ABBD"}
                >
                  MÁS INFO
                </button>
              </div>
            </motion.div>
          </div>

          {/* Indicadores de paginación */}
          <div className="flex justify-center items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#E9749B" }}></div>
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <div className="ml-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-pink-500">
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Ubicación */}
      <UbicacionWrapper />
    </div>
  );
};

export default Bauleras;


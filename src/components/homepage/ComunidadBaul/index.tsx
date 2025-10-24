"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { beauty } from "@/styles/fonts";
import UbicacionWrapper from "@/components/homepage/Ubicacion/UbicacionWrapper";

const ComunidadBaul = () => {
  return (
    <div className="px-4 xl:px-0">
      <section 
        className="w-full py-12 md:py-16" 
        style={{ backgroundColor: "#F8F5E8" }}
      >
        <div className="max-w-frame mx-auto px-4 md:px-6">
        {/* Título principal */}
        <div className="text-center mb-8">
          <motion.h2
            initial={{ y: "100px", opacity: 0 }}
            animate={{ y: "0", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={cn("text-3xl md:text-4xl font-bold text-gray-900 mb-4", beauty.className)}
          >
            COMUNIDAD BAÚL
          </motion.h2>
          
          {/* Línea decorativa azul */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-24 h-1 mx-auto mb-4"
            style={{ backgroundColor: "#87CEEB" }}
          />
          
          <motion.p
            initial={{ y: "100px", opacity: 0 }}
            animate={{ y: "0", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-gray-700 font-medium"
          >
            Un espacio amigo para alumnos, ex alumnos y emprendedores que pasan por Baúl de Moda.
          </motion.p>
        </div>

        {/* Sección de beneficios */}
        <div className="mb-12">
          <motion.h3
            initial={{ y: "100px", opacity: 0 }}
            animate={{ y: "0", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={cn("text-2xl font-bold text-gray-900 mb-4", beauty.className)}
          >
            NUESTROS BENEFICIOS
          </motion.h3>
          
          <motion.div
            initial={{ y: "100px", opacity: 0 }}
            animate={{ y: "0", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-gray-700 mb-8"
          >
            <p className="mb-2">
              Al formar parte de la Comunidad Baúl, automáticamente contas con las siguientes promociones.
            </p>
            <p>
              Solicita la credencial virtual para acceder a todos ellos.
            </p>
          </motion.div>

          {/* Grid de cards de beneficios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: La Tienda Baúl */}
            <motion.div
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-center">
                {/* Dibujo de estantería */}
                <div className="mb-4 flex justify-center">
                  <svg width="80" height="60" viewBox="0 0 80 60" className="text-gray-800">
                    {/* Estantería */}
                    <rect x="10" y="20" width="60" height="4" fill="currentColor" />
                    <rect x="10" y="40" width="60" height="4" fill="currentColor" />
                    <rect x="10" y="20" width="4" height="24" fill="currentColor" />
                    <rect x="66" y="20" width="4" height="24" fill="currentColor" />
                    
                    {/* Maceta con cactus */}
                    <rect x="15" y="35" width="8" height="6" fill="#8B4513" />
                    <path d="M19 30 Q19 25 19 20" stroke="#228B22" strokeWidth="2" fill="none" />
                    <circle cx="19" cy="22" r="2" fill="#228B22" />
                    
                    {/* Cuadro con corazón */}
                    <rect x="50" y="25" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M56 30 Q56 28 58 28 Q60 28 60 30 Q60 32 58 34 Q56 32 56 30" fill="#FF69B4" />
                  </svg>
                </div>
                
                <h4 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'cursive' }}>
                  LA TIENDA BAUL
                </h4>
                
                {/* Rosa decorativa */}
                <div className="flex justify-center mb-3">
                  <svg width="30" height="30" viewBox="0 0 30 30" className="text-gray-800">
                    <path d="M15 5 Q12 8 15 12 Q18 8 15 5" fill="currentColor" />
                    <path d="M15 12 Q12 15 15 18 Q18 15 15 12" fill="currentColor" />
                    <path d="M15 18 Q12 21 15 25 Q18 21 15 18" fill="currentColor" />
                    <rect x="14" y="25" width="2" height="5" fill="#8B4513" />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Telas Agustín */}
            <motion.div
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-center">
                {/* Franjas de telas arriba */}
                <div className="mb-4 flex justify-center">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-orange-400 rounded"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <div className="w-3 h-3 bg-pink-400 rounded"></div>
                  </div>
                </div>
                
                <h4 className="text-lg font-bold text-orange-600 mb-4" style={{ fontFamily: 'cursive' }}>
                  Telas Agustín
                </h4>
                
                {/* Franjas de telas abajo */}
                <div className="flex justify-center">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-green-400 rounded"></div>
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <div className="w-3 h-3 bg-indigo-500 rounded"></div>
                    <div className="w-3 h-3 bg-teal-400 rounded"></div>
                    <div className="w-3 h-3 bg-amber-500 rounded"></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Enigma */}
            <motion.div
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-center">
                {/* Logo dragón */}
                <div className="mb-4 flex justify-center">
                  <svg width="60" height="40" viewBox="0 0 60 40" className="text-red-600">
                    {/* Dragón estilizado */}
                    <path d="M10 20 Q15 10 25 15 Q35 5 45 15 Q50 20 45 25 Q35 35 25 25 Q15 30 10 20" 
                          fill="currentColor" />
                    <circle cx="45" cy="15" r="3" fill="white" />
                    <circle cx="47" cy="13" r="1" fill="currentColor" />
                  </svg>
                </div>
                
                <h4 className="text-lg font-bold text-red-600 mb-1">
                  Enigma.
                  <span className="text-xs">®</span>
                </h4>
                
                <p className="text-sm text-gray-600">
                  Calidad Superior
                </p>
              </div>
            </motion.div>

            {/* Card 4: Epojé */}
            <motion.div
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-center">
                {/* Logo con bloques */}
                <div className="mb-4 flex justify-center">
                  <div className="flex items-end space-x-1">
                    <div className="w-4 h-8 bg-amber-200"></div>
                    <div className="w-4 h-6 bg-pink-200"></div>
                    <div className="w-4 h-10 bg-amber-300"></div>
                    <div className="w-4 h-4 bg-pink-300"></div>
                    <div className="w-4 h-7 bg-amber-400"></div>
                  </div>
                </div>
                
                <h4 className="text-lg font-bold text-gray-800 mb-1">
                  Epojé
                </h4>
                
                <p className="text-sm text-gray-500">
                  / ESPACIO TEXTIL
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Sección Baúl Emprende */}
        <div className="mb-12">
          <motion.h3
            initial={{ y: "100px", opacity: 0 }}
            animate={{ y: "0", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className={cn("text-2xl font-bold text-gray-900 mb-4", beauty.className)}
          >
            BAÚL EMPRENDE
          </motion.h3>
          
          <motion.p
            initial={{ y: "100px", opacity: 0 }}
            animate={{ y: "0", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="text-gray-700 mb-8"
          >
            Te presentamos nuestro catálogo de emprendedores que vimos nacer y/o crecer.
          </motion.p>

          {/* Grid de emprendedores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Card 1: Kluma Deco */}
            <motion.div
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-center">
                {/* Logo Kluma Deco */}
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-teal-500 rounded-lg flex items-center justify-center">
                    <svg width="40" height="40" viewBox="0 0 40 40" className="text-white">
                      <rect x="8" y="12" width="24" height="16" fill="none" stroke="white" strokeWidth="2" />
                      <path d="M20 8 L20 12" stroke="white" strokeWidth="2" />
                      <path d="M12 20 L28 20" stroke="white" strokeWidth="2" />
                      <text x="20" y="32" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">KLUMA DECO</text>
                    </svg>
                  </div>
                </div>
                
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  KLUMA DECO
                </h4>
                
                <p className="text-sm text-gray-600 mb-4">
                  Deco con diseños textiles exclusivos.
                </p>
                
                {/* Iconos sociales */}
                <div className="flex justify-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.436 9.884-9.889 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Dani Ramirez */}
            <motion.div
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-center">
                {/* Logo Dani Ramirez */}
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-white border-2 border-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xs font-bold text-gray-800">DANI</div>
                      <div className="text-xs font-bold text-gray-800">RAMIREZ</div>
                      <div className="text-xs text-gray-800">*</div>
                      <div className="text-xs text-gray-800 italic">ilustradora</div>
                    </div>
                  </div>
                </div>
                
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  DANI RAMIREZ
                </h4>
                
                <p className="text-sm text-gray-600 mb-4">
                  Soy ilustradora. Creo objetos para la vida cotidiana e ilustro para otras marcas. Productos mágicos, únicos y con sentido.
                </p>
                
                {/* Iconos sociales */}
                <div className="flex justify-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Buziana */}
            <motion.div
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-center">
                {/* Logo Buziana */}
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                    <div className="text-pink-600 font-bold text-sm">
                      buziana<span className="text-xs">®</span>
                    </div>
                  </div>
                </div>
                
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  BUZIANA
                </h4>
                
                <p className="text-sm text-gray-600 mb-4">
                  BUZIANA. LIBRETAS Y CUADERNOS PARA INSPIRARTE!
                </p>
                
                {/* Iconos sociales */}
                <div className="flex justify-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </motion.div>

            {/* Card 4: Mover los Hilos */}
            <motion.div
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-center">
                {/* Logo Mover los Hilos */}
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                    <div className="text-white text-center text-xs">
                      <div className="font-bold">MOVER</div>
                      <div className="font-bold">LOS HILOS</div>
                      <div className="border-t border-dashed border-white my-1"></div>
                      <div className="text-xs">MAGIAS A TU</div>
                      <div className="text-xs">MEDIDA</div>
                    </div>
                  </div>
                </div>
                
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  MOVER LOS HILOS
                </h4>
                
                <p className="text-sm text-gray-600 mb-4">
                  Tienda de tejidos artesanales realizados a medida. Ciudad Jardín, El Palomar.
                </p>
                
                {/* Iconos sociales */}
                <div className="flex justify-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Botón Ver Todos */}
          <div className="text-center">
            <motion.button
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.6 }}
              className="px-8 py-3 text-white font-bold rounded-lg transition-colors"
              style={{ backgroundColor: "#E9ABBD" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D44D7D"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E9ABBD"}
            >
              VER TODOS
            </motion.button>
          </div>
        </div>
        </div>
      </section>

      {/* Sección Eventos */}
      <section 
        className="w-full py-12 md:py-16" 
        style={{ backgroundColor: "#B2D8D8" }}
      >
        <div className="max-w-frame mx-auto px-4 md:px-6">
        <div className="mb-12">
          <motion.h3
            initial={{ y: "100px", opacity: 0 }}
            animate={{ y: "0", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.7 }}
            className={cn("text-2xl font-bold text-gray-900 mb-4", beauty.className)}
          >
            EVENTOS
          </motion.h3>
          
          <motion.p
            initial={{ y: "100px", opacity: 0 }}
            animate={{ y: "0", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.8 }}
            className="text-gray-700 mb-8"
          >
            Conocé nuestros eventos, ferias, exposiciones y festivales.
          </motion.p>

          {/* Grid de eventos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Card 1: Festival 11° Ed. Ciudad Jardín */}
            <motion.div
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.9 }}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-center">
                {/* Imagen del festival */}
                <div className="mb-4 flex justify-center">
                  <div className="w-full h-32 bg-gradient-to-br from-blue-200 to-green-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <svg width="120" height="80" viewBox="0 0 120 80" className="absolute">
                      {/* Banner */}
                      <rect x="10" y="5" width="100" height="8" fill="#FF6B6B" />
                      <text x="60" y="12" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">Festival Baul CIUDAD JARDIN 11° EDICION</text>
                      
                      {/* Persona con guitarra */}
                      <circle cx="25" cy="35" r="4" fill="#8B4513" />
                      <rect x="22" y="38" width="6" height="8" fill="#4169E1" />
                      <rect x="20" y="40" width="10" height="2" fill="#8B4513" />
                      
                      {/* Perchero */}
                      <rect x="60" y="25" width="2" height="20" fill="#8B4513" />
                      <rect x="55" y="25" width="12" height="2" fill="#8B4513" />
                      <circle cx="58" cy="30" r="2" fill="#FF69B4" />
                      <circle cx="66" cy="30" r="2" fill="#32CD32" />
                      
                      {/* Árbol de Navidad */}
                      <path d="M90 50 L85 60 L95 60 Z" fill="#228B22" />
                      <rect x="89" y="60" width="2" height="5" fill="#8B4513" />
                      
                      {/* Sol */}
                      <circle cx="15" cy="15" r="6" fill="#FFD700" />
                      <path d="M15 5 L15 3 M15 27 L15 29 M5 15 L3 15 M27 15 L29 15" stroke="#FFD700" strokeWidth="1" />
                      
                      {/* Pájaros */}
                      <path d="M40 20 Q42 18 44 20 Q42 22 40 20" fill="#000" />
                      <path d="M50 25 Q52 23 54 25 Q52 27 50 25" fill="#000" />
                    </svg>
                  </div>
                </div>
                
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  FESTIVAL 11° ED. EN CIUDAD JARDÍN
                </h4>
                
                <p className="text-sm text-gray-600 mb-4">
                  DOMINGO 19 DE DICIEMBRE 2021 de 16hs a 22hs en la Calle. Te esperan más de 30 emprendedores con Música en vivo, Shows, Entretenimiento y Sorteos.
                </p>
                
                {/* Iconos sociales */}
                <div className="flex justify-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Festival 12° Ed. Ciudad Jardín */}
            <motion.div
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 2.0 }}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-center">
                {/* Imagen del festival */}
                <div className="mb-4 flex justify-center">
                  <div className="w-full h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <svg width="120" height="80" viewBox="0 0 120 80" className="absolute">
                      {/* Banner */}
                      <rect x="10" y="5" width="100" height="8" fill="#FF6B6B" />
                      <text x="60" y="12" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">Festival Baul CIUDAD JARDIN 12° EDICION</text>
                      
                      {/* Persona con sombrero */}
                      <circle cx="25" cy="35" r="4" fill="#8B4513" />
                      <path d="M20 32 Q25 28 30 32" stroke="#8B4513" strokeWidth="2" fill="none" />
                      <rect x="22" y="38" width="6" height="8" fill="#FF69B4" />
                      
                      {/* Perchero */}
                      <rect x="60" y="25" width="2" height="20" fill="#8B4513" />
                      <rect x="55" y="25" width="12" height="2" fill="#8B4513" />
                      <circle cx="58" cy="30" r="2" fill="#32CD32" />
                      <circle cx="66" cy="30" r="2" fill="#FFD700" />
                      
                      {/* Auto amarillo */}
                      <rect x="80" y="40" width="15" height="8" fill="#FFD700" />
                      <circle cx="85" cy="50" r="2" fill="#000" />
                      <circle cx="90" cy="50" r="2" fill="#000" />
                      
                      {/* Árbol de Navidad */}
                      <path d="M90 50 L85 60 L95 60 Z" fill="#228B22" />
                      <rect x="89" y="60" width="2" height="5" fill="#8B4513" />
                      
                      {/* Sol */}
                      <circle cx="15" cy="15" r="6" fill="#FFD700" />
                      <path d="M15 5 L15 3 M15 27 L15 29 M5 15 L3 15 M27 15 L29 15" stroke="#FFD700" strokeWidth="1" />
                      
                      {/* Pájaros */}
                      <path d="M40 20 Q42 18 44 20 Q42 22 40 20" fill="#000" />
                      <path d="M50 25 Q52 23 54 25 Q52 27 50 25" fill="#000" />
                    </svg>
                  </div>
                </div>
                
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  FESTIVAL 12° ED. EN CIUDAD JARDÍN
                </h4>
                
                <p className="text-sm text-gray-600 mb-4">
                  DOMINGO 11 DE DICIEMBRE 2022 de 16hs a 22hs en la Calle. Te esperan más de 30 emprendedores con Música en vivo, Shows, Entretenimiento y Sorteos.
                </p>
                
                {/* Iconos sociales */}
                <div className="flex justify-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 3: El Mercadillo de Almagro Navidad */}
            <motion.div
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 2.1 }}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-center">
                {/* Imagen circular navideña */}
                <div className="mb-4 flex justify-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-200 to-green-200 rounded-full flex items-center justify-center relative overflow-hidden">
                    <svg width="80" height="80" viewBox="0 0 80 80" className="absolute">
                      {/* Círculo central */}
                      <circle cx="40" cy="40" r="35" fill="none" stroke="#8B4513" strokeWidth="2" strokeDasharray="5,5" />
                      
                      {/* Texto central */}
                      <text x="40" y="35" textAnchor="middle" fontSize="6" fill="#8B4513" fontWeight="bold">TIENDA</text>
                      <text x="40" y="42" textAnchor="middle" fontSize="6" fill="#8B4513" fontWeight="bold">MERCADILLO</text>
                      <text x="40" y="49" textAnchor="middle" fontSize="6" fill="#8B4513" fontWeight="bold">DE ALMAGRO</text>
                      <text x="40" y="56" textAnchor="middle" fontSize="6" fill="#8B4513" fontWeight="bold">EMPRENDEDORA</text>
                      
                      {/* Elementos navideños */}
                      <path d="M20 20 Q25 15 30 20" fill="#228B22" />
                      <circle cx="25" cy="18" r="2" fill="#FF0000" />
                      <circle cx="15" cy="25" r="1.5" fill="#FFD700" />
                      <rect x="35" y="15" width="3" height="3" fill="#8B4513" />
                      <path d="M60 20 Q65 15 70 20" fill="#228B22" />
                    </svg>
                  </div>
                </div>
                
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  EL MERCADILLO DE ALMAGRO NAVIDAD
                </h4>
                
                <p className="text-sm text-gray-600 mb-4">
                  SÁBADO 18 DE DIC 2021 La sede de Almagro te espera con una feria emprendedora en toda su galería y shows en vivo. De 14hs a 20.30hs y continua en la semana del 20 al 23 de 12 a 19.30hs Av. Rivadavia 4390, Almagro.
                </p>
                
                {/* Iconos sociales */}
                <div className="flex justify-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 4: Festival en Casa */}
            <motion.div
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 2.2 }}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-center">
                {/* Imagen con elementos de costura */}
                <div className="mb-4 flex justify-center">
                  <div className="w-full h-32 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <svg width="120" height="80" viewBox="0 0 120 80" className="absolute">
                      {/* Máquina de coser */}
                      <rect x="20" y="35" width="15" height="8" fill="#C0C0C0" />
                      <circle cx="27" cy="39" r="3" fill="#000" />
                      
                      {/* Tijeras */}
                      <path d="M40 30 L45 35 L40 40" stroke="#C0C0C0" strokeWidth="2" fill="none" />
                      <path d="M45 30 L40 35 L45 40" stroke="#C0C0C0" strokeWidth="2" fill="none" />
                      
                      {/* Hilo */}
                      <circle cx="60" cy="35" r="2" fill="#FF0000" />
                      <path d="M60 37 Q65 40 70 37" stroke="#FF0000" strokeWidth="1" fill="none" />
                      
                      {/* Botones */}
                      <circle cx="80" cy="30" r="2" fill="#000" />
                      <circle cx="85" cy="35" r="2" fill="#000" />
                      <circle cx="80" cy="40" r="2" fill="#000" />
                      
                      {/* Cinta métrica */}
                      <rect x="30" y="50" width="20" height="2" fill="#FFD700" />
                      <rect x="30" y="50" width="2" height="2" fill="#000" />
                      
                      {/* Casa */}
                      <path d="M90 45 L85 55 L95 55 Z" fill="#8B4513" />
                      <rect x="87" y="55" width="6" height="5" fill="#8B4513" />
                      
                      {/* Estrellas */}
                      <path d="M15 20 L17 25 L22 25 L18 28 L20 33 L15 30 L10 33 L12 28 L8 25 L13 25 Z" fill="#FFD700" />
                      <path d="M100 25 L101 28 L104 28 L102 30 L103 33 L100 31 L97 33 L98 30 L96 28 L99 28 Z" fill="#FFD700" />
                      
                      {/* Confeti */}
                      <rect x="25" y="15" width="2" height="2" fill="#FF69B4" />
                      <rect x="35" y="20" width="2" height="2" fill="#32CD32" />
                      <rect x="45" y="18" width="2" height="2" fill="#FFD700" />
                      
                      {/* Texto */}
                      <text x="60" y="70" textAnchor="middle" fontSize="8" fill="#87CEEB" fontWeight="bold" fontStyle="italic">Festival en casa</text>
                    </svg>
                  </div>
                </div>
                
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  FESTIVAL EN CASA
                </h4>
                
                <p className="text-sm text-gray-600 mb-4">
                  Este 2020 lo cerramos en nuestras sedes que tanto nos extrañaron con Feria, Shows y muchas sorpresas más! Conoce los horarios de cada sede y pasa por la que te quede más cerca! Ciudad Jardín Almagro
                </p>
                
                {/* Iconos sociales */}
                <div className="flex justify-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Botón Ver Todos */}
          <div className="text-center">
            <motion.button
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 2.3 }}
              className="px-8 py-3 text-white font-bold rounded-lg transition-colors"
              style={{ backgroundColor: "#E9ABBD" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D44D7D"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E9ABBD"}
            >
              VER TODOS
            </motion.button>
          </div>
        </div>
        </div>
      </section>

      {/* Sección Testimonios */}
      <section 
        className="max-w-frame mx-auto px-4 md:px-6 py-12 md:py-16" 
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div className="relative">
          {/* Elementos decorativos */}
          <div className="absolute top-0 left-0 w-32 h-32 opacity-20">
            <div className="w-full h-full rounded-full" style={{ backgroundColor: "#F5F0D7" }}></div>
          </div>
          <div className="absolute top-8 left-8 w-1 h-16 opacity-30" style={{ backgroundColor: "#F0C8D7" }}></div>
          <div className="absolute top-12 left-12 w-1 h-12 opacity-30" style={{ backgroundColor: "#F0C8D7" }}></div>
          <div className="absolute top-16 left-16 w-1 h-8 opacity-30" style={{ backgroundColor: "#F0C8D7" }}></div>
          <div className="absolute top-20 left-20 w-1 h-6 opacity-30" style={{ backgroundColor: "#F0C8D7" }}></div>
          <div className="absolute top-24 left-24 w-1 h-4 opacity-30" style={{ backgroundColor: "#F0C8D7" }}></div>

          {/* Contenido del testimonio */}
          <div className="relative z-10 text-center py-16">
            <motion.blockquote
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 2.4 }}
              className="text-lg md:text-xl text-gray-700 italic leading-relaxed max-w-4xl mx-auto mb-8"
            >
              "En Baúl no solo aprendí distintas herramientas para coser sino que encontré un lugar cálido, amigable, de sostén y acompañamiento para animarme con mi proyecto y poder, actualmente, trabajar como emprendedora con mi marca Viriva."
            </motion.blockquote>
            
            <motion.cite
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 2.5 }}
              className="text-lg font-bold"
              style={{ color: "#E9749B" }}
            >
              AIME DE 'VIRIVA'
            </motion.cite>
          </div>

          {/* Flechas de navegación */}
          <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 2.6 }}
              className="w-8 h-8 flex items-center justify-center"
              style={{ color: "#E9749B" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </motion.button>
          </div>
          
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 2.7 }}
              className="w-8 h-8 flex items-center justify-center"
              style={{ color: "#E9749B" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
              </svg>
            </motion.button>
          </div>
        </div>
      </section>

      {/* Sección Co-Working / Alquiler de máquinas */}
      <section 
        className="w-full py-12 md:py-16" 
        style={{ backgroundColor: "#F0C8D7" }}
      >
        <div className="max-w-frame mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contenido de texto */}
          <div>
            <motion.h3
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 2.8 }}
              className={cn("text-2xl font-bold text-gray-900 mb-6", beauty.className)}
            >
              CO-WORKING / ALQUILER DE MÁQUINAS
            </motion.h3>
            
            <motion.div
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 2.9 }}
              className="text-gray-700 space-y-4"
            >
              <p>
                Baúl de Moda abre sus puertas a la comunidad emprendedora, ofreciéndote un área de trabajo creativo y relajado en donde vas a poder sacarle provecho de tus horas laborales!
              </p>
              
              <p className="italic">
                Ideal si necesitas salir un poco de tu casa o necesitas el uso de maquinarias e instalaciones!
              </p>
              
              <p>
                Existen distintas modalidades, consulta disponibilidad y precios sobre la que te interese:
              </p>
              
              <div className="space-y-3">
                <div>
                  <strong>Taller:</strong> ideal para venir a coser y/o cortar muestras o pequeñas producciones.
                </div>
                
                <div>
                  <strong>Oficina:</strong> Ideal para venir con tu notebook a trabajar, tener entrevistas/reuniones, o hacer otros tipos de trabajo como sección de fotos.
                </div>
                
                <div>
                  <strong>Alquiler de Sala, Baúl a Puertas Abiertas:</strong> si buscas un lugar para dar clases u organizar eventos. Ver más!
                </div>
              </div>
              
              <p>
                Todos los servicios incluyen: wifi libre, agua, té, mate, café, heladera para guardar gaseosas o viandas, aire acondicionado (frío o calor), música ambiente, entre otras comodidades.
              </p>
            </motion.div>
          </div>

          {/* Imagen y elementos decorativos */}
          <div className="relative">
            {/* Forma amarilla de fondo */}
            <div className="absolute inset-0">
              <svg width="100%" height="400" viewBox="0 0 400 400" className="absolute">
                <path d="M50 50 Q100 20 200 50 Q300 80 350 50 Q380 100 350 150 Q320 200 350 250 Q380 300 350 350 Q300 380 200 350 Q100 320 50 350 Q20 300 50 250 Q80 200 50 150 Q20 100 50 50" 
                      fill="#FFD700" opacity="0.8" />
              </svg>
            </div>

            {/* Elementos decorativos */}
            <div className="absolute top-8 left-8">
              <svg width="40" height="40" viewBox="0 0 40 40" className="text-pink-400">
                <path d="M20 5 Q15 10 20 15 Q25 10 20 5" fill="currentColor" />
                <path d="M20 15 Q15 20 20 25 Q25 20 20 15" fill="currentColor" />
                <path d="M20 25 Q15 30 20 35 Q25 30 20 25" fill="currentColor" />
              </svg>
            </div>

            <div className="absolute top-16 left-16">
              <svg width="30" height="30" viewBox="0 0 30 30" className="text-teal-400">
                <path d="M15 5 Q12 8 15 12 Q18 8 15 5" fill="currentColor" />
                <path d="M15 12 Q12 15 15 18 Q18 15 15 12" fill="currentColor" />
                <path d="M15 18 Q12 21 15 25 Q18 21 15 18" fill="currentColor" />
              </svg>
            </div>

            <div className="absolute top-24 left-12">
              <svg width="25" height="25" viewBox="0 0 25 25" className="text-yellow-500">
                <path d="M12.5 2 L15 8 L22 8 L17 12 L19 19 L12.5 15 L6 19 L8 12 L3 8 L10 8 Z" fill="currentColor" />
              </svg>
            </div>

            <div className="absolute top-32 left-20">
              <svg width="20" height="20" viewBox="0 0 20 20" className="text-yellow-500">
                <circle cx="10" cy="10" r="8" fill="currentColor" />
                <path d="M10 2 L10 6 M10 14 L10 18 M2 10 L6 10 M14 10 L18 10" stroke="white" strokeWidth="1" />
              </svg>
            </div>

            <div className="absolute top-40 left-8">
              <svg width="35" height="35" viewBox="0 0 35 35" className="text-pink-400">
                <path d="M17.5 5 Q15 8 17.5 12 Q20 8 17.5 5" fill="currentColor" />
                <path d="M17.5 12 Q15 15 17.5 18 Q20 15 17.5 12" fill="currentColor" />
                <path d="M17.5 18 Q15 21 17.5 25 Q20 21 17.5 18" fill="currentColor" />
                <path d="M17.5 25 Q15 28 17.5 30 Q20 28 17.5 25" fill="currentColor" />
              </svg>
            </div>

            <div className="absolute top-48 left-16">
              <svg width="30" height="30" viewBox="0 0 30 30" className="text-white">
                <path d="M15 5 L20 15 L30 15 L22 22 L25 32 L15 27 L5 32 L8 22 L0 15 L10 15 Z" fill="currentColor" />
              </svg>
            </div>

            {/* Imagen central */}
            <div className="relative z-10 bg-white rounded-lg p-8 shadow-lg">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg width="80" height="80" viewBox="0 0 80 80" className="text-gray-600">
                    {/* Persona trabajando */}
                    <circle cx="40" cy="25" r="8" fill="#8B4513" />
                    <rect x="32" y="33" width="16" height="20" fill="#4169E1" />
                    
                    {/* Notebook */}
                    <rect x="25" y="45" width="20" height="12" fill="#000" />
                    <rect x="27" y="47" width="16" height="8" fill="#87CEEB" />
                    
                    {/* Teléfono */}
                    <rect x="50" y="48" width="6" height="10" fill="#000" />
                    
                    {/* Organizador */}
                    <rect x="20" y="50" width="12" height="8" fill="#E0E0E0" />
                    <circle cx="24" cy="52" r="1" fill="#FF0000" />
                    <circle cx="28" cy="52" r="1" fill="#00FF00" />
                    <circle cx="24" cy="55" r="1" fill="#0000FF" />
                    <circle cx="28" cy="55" r="1" fill="#FFFF00" />
                    
                    {/* Bolso */}
                    <rect x="55" y="45" width="8" height="6" fill="#FF69B4" />
                    <path d="M59 45 Q59 42 59 40" stroke="#FF69B4" strokeWidth="1" fill="none" />
                    
                    {/* Mouse */}
                    <ellipse cx="48" cy="58" rx="3" ry="2" fill="#C0C0C0" />
                    
                    {/* Cuaderno */}
                    <rect x="15" y="40" width="8" height="10" fill="#FFFFFF" stroke="#000" strokeWidth="1" />
                    <rect x="16" y="42" width="6" height="1" fill="#FFD700" />
                    <rect x="16" y="44" width="6" height="1" fill="#FFD700" />
                    <rect x="16" y="46" width="6" height="1" fill="#FFD700" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Co-Working Baúl</h4>
                <p className="text-sm text-gray-600">Espacio creativo y productivo</p>
              </div>
            </div>

            {/* Elementos decorativos adicionales */}
            <div className="absolute bottom-8 right-8">
              <svg width="40" height="40" viewBox="0 0 40 40" className="text-red-500">
                <path d="M20 5 Q15 10 20 15 Q25 10 20 5" fill="currentColor" />
                <path d="M20 15 Q15 20 20 25 Q25 20 20 15" fill="currentColor" />
                <path d="M20 25 Q15 30 20 35 Q25 30 20 25" fill="currentColor" />
              </svg>
            </div>

            <div className="absolute bottom-16 right-16">
              <svg width="30" height="30" viewBox="0 0 30 30" className="text-green-400">
                <path d="M15 5 Q12 8 15 12 Q18 8 15 5" fill="currentColor" />
                <path d="M15 12 Q12 15 15 18 Q18 15 15 12" fill="currentColor" />
                <path d="M15 18 Q12 21 15 25 Q18 21 15 18" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>
        </div>
      </section>
      
      <UbicacionWrapper />
    </div>
  );
};

export default ComunidadBaul;

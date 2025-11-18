"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import UbicacionWrapper from "@/components/homepage/Ubicacion/UbicacionWrapper";

const ComunidadBaul = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      quote: "Arranque en Baul en el 2010 haciendo el curso de Lencería y trajes de baño, que daba Juli. Además de aprender y divertirme, me lleve una amiga y socia! Nos fuimos de viaje después del curso y armamos una marca.",
      author: "Sofi"
    },
    {
      quote: "En Baúl de Moda puse en marcha mi proyecto de diseño sustentable Carola Cornejo. En Baúl encontrás además de cursos de moldería, clases especiales, contactos de talleres con los que trabajo todavía, y oportunidades para vender mis productos, conocí dos personas generosas de corazón que se brindaron y brindan cada día con la misma calidez, paciencia, honestidad y profesionalismo! Ellas con Julieta y Verónica! Fueron quienes me dieron los primeros elementos para lograr un diseño con identidad, confiando en las capacidades que cada una tenemos! Imperdible conocerlas! Seres generosos como pocos que te enseñan en un clima de armonía único! Súper recomendables!!!! Seguimos juntas desde hace más de 5 años!!!! Gracias Juli y Vero!!!",
      author: "Caro de \"Carola Cornejo\""
    },
    {
      quote: "En Baúl no solo aprendí distintas herramientas para coser sino que encontré un lugar cálido, amigable, de sostén y acompañamiento para animarme con mi proyecto y poder, actualmente, trabajar como emprendedora con mi marca Viriva.",
      author: "Aime de \"Viriva\""
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="px-4 xl:px-0 overflow-x-hidden">
      <section 
        className="w-full" 
        style={{ backgroundColor: "#F8F5E8" }}
      >
        <div className="max-w-frame mx-auto px-4 md:px-6">
        {/* Título principal con fondo blanco a todo el ancho */}
        <div 
          className="text-center py-12 md:py-16 mb-8"
          style={{
            backgroundColor: "#FFFFFF",
            marginLeft: "calc(50% - 50vw)",
            marginRight: "calc(50% - 50vw)",
            paddingLeft: "calc(50vw - 50%)",
            paddingRight: "calc(50vw - 50%)"
          }}
        >
          <motion.h2
            initial={{ y: "100px", opacity: 0 }}
            animate={{ y: "0", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={cn("text-3xl md:text-4xl font-bold text-gray-900 mb-4")}
          >
            COMUNIDAD BAÚL
          </motion.h2>
          
          {/* SVG decorativo onda celeste */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center mb-4"
          >
            <img
              src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/onda-celeste.svg"
              alt="Onda decorativa"
              className="h-4 md:h-5"
            />
          </motion.div>
          
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
            className={cn("text-2xl font-bold text-gray-900 mb-4")}
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
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              <div className="text-center flex-1 flex flex-col">
                {/* Imagen real - más grande */}
                <div className="mb-4 flex justify-center">
                  <img
                    src="https://bauldemoda.com.ar/wp-content/uploads/2020/05/tienda-baul-330x330.jpg"
                    alt="La Tienda Baúl"
                    className="w-24 h-24 md:w-32 md:h-32 object-contain"
                  />
                </div>
                
                <h4 className="font-bold text-base md:text-lg text-gray-900 mb-3">
                  LA TIENDA BAÚL
                </h4>
                
                <p className="text-xs md:text-sm text-gray-600 mb-4 flex-1">
                  Nuestra tiendita de Diseño 100% emprendedor se suma a la comunidad con descuentos imperdibles para alumnas Baúl: 20% en efectivo / 10% débito / 5% crédito.
                </p>
                
                {/* Iconos de redes sociales */}
                <div className="flex justify-center gap-2 mt-auto pt-4">
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"></div>
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .96 4.534.96 10.09c0 1.76.413 3.421 1.15 4.891L.08 24l9.218-2.41a11.876 11.876 0 005.752 1.48h.005c5.554 0 10.089-4.534 10.089-10.09 0-2.688-1.06-5.216-2.987-7.113"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.344 5.667c.28 0 .511.231.511.511v11.644c0 .28-.231.511-.511.511H5.656c-.28 0-.511-.231-.511-.511V6.178c0-.28.231-.511.511-.511h12.688zm-6.172 5.49L7.25 8.5v7l4.922-2.343L17.094 15.5v-7l-4.922 2.657z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Telas Agustín */}
            <motion.div
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              <div className="text-center flex-1 flex flex-col">
                {/* Imagen real - más grande */}
                <div className="mb-4 flex justify-center">
                  <img
                    src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/telas-agustin.jpg"
                    alt="Telas Agustín"
                    className="w-24 h-24 md:w-32 md:h-32 object-contain"
                  />
                </div>
                
                <h4 className="font-bold text-base md:text-lg text-gray-900 mb-3">
                  TELAS AGUSTÍN
                </h4>
                
                <p className="text-xs md:text-sm text-gray-600 mb-4 flex-1">
                  Ofrece la más amplia variedad en telas por menor y mayor con descuentos especiales para la Comunidad Baúl, del 10% en telas x metro. Santos Vega 7300, esq. 12 de Octubre, Villa Bosch. con envíos a domicilio.
                </p>
                
                {/* Iconos de redes sociales */}
                <div className="flex justify-center gap-2 mt-auto pt-4">
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.344 5.667c.28 0 .511.231.511.511v11.644c0 .28-.231.511-.511.511H5.656c-.28 0-.511-.231-.511-.511V6.178c0-.28.231-.511.511-.511h12.688zm-6.172 5.49L7.25 8.5v7l4.922-2.343L17.094 15.5v-7l-4.922 2.657z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .96 4.534.96 10.09c0 1.76.413 3.421 1.15 4.891L.08 24l9.218-2.41a11.876 11.876 0 005.752 1.48h.005c5.554 0 10.089-4.534 10.089-10.09 0-2.688-1.06-5.216-2.987-7.113"/>
                    </svg>
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
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              <div className="text-center flex-1 flex flex-col">
                {/* Imagen real - más grande */}
                <div className="mb-4 flex justify-center">
                  <img
                    src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/club-baul-2-330x330.jpg"
                    alt="Enigma, Casa Gonzalez"
                    className="w-24 h-24 md:w-32 md:h-32 object-contain"
                  />
                </div>
                
                <h4 className="font-bold text-base md:text-lg text-gray-900 mb-3">
                  ENIGMA, CASA GONZALEZ
                </h4>
                
                <p className="text-xs md:text-sm text-gray-600 mb-4 flex-1">
                  Descuentos del 5% en máquinas de coser, repuesto e insumos para la confección / 7% pagos en efectivo. Av. Belgrano 3787, Almagro.
                </p>
                
                {/* Iconos de redes sociales */}
                <div className="flex justify-center gap-2 mt-auto pt-4">
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.344 5.667c.28 0 .511.231.511.511v11.644c0 .28-.231.511-.511.511H5.656c-.28 0-.511-.231-.511-.511V6.178c0-.28.231-.511.511-.511h12.688zm-6.172 5.49L7.25 8.5v7l4.922-2.343L17.094 15.5v-7l-4.922 2.657z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"></div>
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.344 5.667c.28 0 .511.231.511.511v11.644c0 .28-.231.511-.511.511H5.656c-.28 0-.511-.231-.511-.511V6.178c0-.28.231-.511.511-.511h12.688zm-6.172 5.49L7.25 8.5v7l4.922-2.343L17.094 15.5v-7l-4.922 2.657z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 4: Epojé */}
            <motion.div
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              <div className="text-center flex-1 flex flex-col">
                {/* Imagen real - más grande */}
                <div className="mb-4 flex justify-center">
                  <img
                    src="https://bauldemoda.com.ar/wp-content/uploads/2021/12/21dbac7e-d532-4608-badf-a69ae09d4e6a-330x330.jpg"
                    alt="EPOJE TEXTIL"
                    className="w-24 h-24 md:w-32 md:h-32 object-contain"
                  />
                </div>
                
                <h4 className="font-bold text-base md:text-lg text-gray-900 mb-3">
                  EPOJE TEXTIL
                </h4>
                
                <p className="text-xs md:text-sm text-gray-600 mb-4 flex-1">
                  Showroom de telas, gran variedad de retazos en telas planas y de punto. Descuentos del 10% para la comunidad. Venta por mayor y menor. Venezuela 4736 Villa Martelli
                </p>
                
                {/* Iconos de redes sociales */}
                <div className="flex justify-center gap-2 mt-auto pt-4">
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"></div>
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .96 4.534.96 10.09c0 1.76.413 3.421 1.15 4.891L.08 24l9.218-2.41a11.876 11.876 0 005.752 1.48h.005c5.554 0 10.089-4.534 10.089-10.09 0-2.688-1.06-5.216-2.987-7.113"/>
                    </svg>
                  </div>
                </div>
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
            className={cn("text-2xl font-bold text-gray-900 mb-4")}
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
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              <div className="text-center flex-1 flex flex-col">
                {/* Imagen real - más grande */}
                <div className="mb-4 flex justify-center">
                  <img
                    src="https://bauldemoda.com.ar/wp-content/uploads/2022/11/162736908_153938863654181_2552882831917902521_n-330x330.jpg"
                    alt="Kluma Deco"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
                  />
                </div>
                
                <h4 className="font-bold text-base md:text-lg text-gray-900 mb-3">
                  KLUMA DECO
                </h4>
                
                <p className="text-xs md:text-sm text-gray-600 mb-4 flex-1">
                  Deco con diseños textiles exclusivos.
                </p>
                
                {/* Iconos de redes sociales */}
                <div className="flex justify-center gap-2 mt-auto pt-4">
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"></div>
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .96 4.534.96 10.09c0 1.76.413 3.421 1.15 4.891L.08 24l9.218-2.41a11.876 11.876 0 005.752 1.48h.005c5.554 0 10.089-4.534 10.089-10.09 0-2.688-1.06-5.216-2.987-7.113"/>
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
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              <div className="text-center flex-1 flex flex-col">
                {/* Imagen real - más grande */}
                <div className="mb-4 flex justify-center">
                  <img
                    src="https://bauldemoda.com.ar/wp-content/uploads/2022/11/AB63E0AAC6614D38A33C0C8ECB4D1B4E-330x330.jpg"
                    alt="Dani Ramirez"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
                  />
                </div>
                
                <h4 className="font-bold text-base md:text-lg text-gray-900 mb-3">
                  DANI RAMIREZ
                </h4>
                
                <p className="text-xs md:text-sm text-gray-600 mb-4 flex-1">
                  Soy ilustradora. Creo objetos para la vida cotidiana e ilustro para otras marcas. Productos mágicos, únicos y con sentido.
                </p>
                
                {/* Iconos de redes sociales */}
                <div className="flex justify-center gap-2 mt-auto pt-4">
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.344 5.667c.28 0 .511.231.511.511v11.644c0 .28-.231.511-.511.511H5.656c-.28 0-.511-.231-.511-.511V6.178c0-.28.231-.511.511-.511h12.688zm-6.172 5.49L7.25 8.5v7l4.922-2.343L17.094 15.5v-7l-4.922 2.657z"/>
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
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              <div className="text-center flex-1 flex flex-col">
                {/* Imagen real - más grande */}
                <div className="mb-4 flex justify-center">
                  <img
                    src="https://bauldemoda.com.ar/wp-content/uploads/2022/11/LOGOS-pdf.jpg"
                    alt="Buziana"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
                  />
                </div>
                
                <h4 className="font-bold text-base md:text-lg text-gray-900 mb-3">
                  BUZIANA
                </h4>
                
                <p className="text-xs md:text-sm text-gray-600 mb-4 flex-1">
                  BUZIANA. LIBRETAS Y CUADERNOS PARA INSPIRARTE!
                </p>
                
                {/* Iconos de redes sociales */}
                <div className="flex justify-center gap-2 mt-auto pt-4">
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.344 5.667c.28 0 .511.231.511.511v11.644c0 .28-.231.511-.511.511H5.656c-.28 0-.511-.231-.511-.511V6.178c0-.28.231-.511.511-.511h12.688zm-6.172 5.49L7.25 8.5v7l4.922-2.343L17.094 15.5v-7l-4.922 2.657z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"></div>
                </div>
              </div>
            </motion.div>

            {/* Card 4: Mover los Hilos */}
            <motion.div
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              <div className="text-center flex-1 flex flex-col">
                {/* Imagen real - más grande */}
                <div className="mb-4 flex justify-center">
                  <img
                    src="https://bauldemoda.com.ar/wp-content/uploads/2023/06/mover-los-hilos.jpg"
                    alt="Mover los Hilos"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
                  />
                </div>
                
                <h4 className="font-bold text-base md:text-lg text-gray-900 mb-3">
                  MOVER LOS HILOS
                </h4>
                
                <p className="text-xs md:text-sm text-gray-600 mb-4 flex-1">
                  Tienda de tejidos artesanales realizados a medida. Ciudad Jardín, El Palomar.
                </p>
                
                {/* Iconos de redes sociales */}
                <div className="flex justify-center gap-2 mt-auto pt-4">
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
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
            className={cn("text-2xl font-bold text-gray-900 mb-4")}
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
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              <div className="text-center flex-1 flex flex-col">
                {/* Imagen real */}
                <div className="mb-4">
                  <img
                    src="https://bauldemoda.com.ar/wp-content/uploads/2021/11/1-330x330.jpg"
                    alt="Festival 11° Ed. Ciudad Jardín"
                    className="w-full h-40 md:h-48 object-cover rounded-lg"
                  />
                </div>
                
                <h4 className="font-bold text-base md:text-lg text-gray-900 mb-3">
                  FESTIVAL 11° ED. EN CIUDAD JARDÍN
                </h4>
                
                <p className="text-xs md:text-sm text-gray-600 mb-4 flex-1">
                  DOMINGO 19 DE DICIEMBRE 2021 de 16hs a 22hs en la Calle. Te esperan más de 30 emprendedores con Música en vivo, Shows, Entretenimiento y Sorteos.
                </p>
                
                {/* Iconos de redes sociales */}
                <div className="flex justify-center gap-2 mt-auto pt-4">
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.344 5.667c.28 0 .511.231.511.511v11.644c0 .28-.231.511-.511.511H5.656c-.28 0-.511-.231-.511-.511V6.178c0-.28.231-.511.511-.511h12.688zm-6.172 5.49L7.25 8.5v7l4.922-2.343L17.094 15.5v-7l-4.922 2.657z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.344 5.667c.28 0 .511.231.511.511v11.644c0 .28-.231.511-.511.511H5.656c-.28 0-.511-.231-.511-.511V6.178c0-.28.231-.511.511-.511h12.688zm-6.172 5.49L7.25 8.5v7l4.922-2.343L17.094 15.5v-7l-4.922 2.657z"/>
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
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              <div className="text-center flex-1 flex flex-col">
                {/* Imagen real */}
                <div className="mb-4">
                  <img
                    src="https://bauldemoda.com.ar/wp-content/uploads/2022/11/feed-festival-330x330.gif"
                    alt="Festival 12° Ed. Ciudad Jardín"
                    className="w-full h-40 md:h-48 object-cover rounded-lg"
                  />
                </div>
                
                <h4 className="font-bold text-base md:text-lg text-gray-900 mb-3">
                  FESTIVAL 12° ED. EN CIUDAD JARDÍN
                </h4>
                
                <p className="text-xs md:text-sm text-gray-600 mb-4 flex-1">
                  DOMINGO 11 DE DICIEMBRE 2022 de 16hs a 22hs en la Calle. Te esperan más de 30 emprendedores con Música en vivo, Shows, Entretenimiento y Sorteos.
                </p>
                
                {/* Iconos de redes sociales */}
                <div className="flex justify-center gap-2 mt-auto pt-4">
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.344 5.667c.28 0 .511.231.511.511v11.644c0 .28-.231.511-.511.511H5.656c-.28 0-.511-.231-.511-.511V6.178c0-.28.231-.511.511-.511h12.688zm-6.172 5.49L7.25 8.5v7l4.922-2.343L17.094 15.5v-7l-4.922 2.657z"/>
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
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              <div className="text-center flex-1 flex flex-col">
                {/* Imagen real */}
                <div className="mb-4">
                  <img
                    src="https://bauldemoda.com.ar/wp-content/uploads/2021/11/mercadillo-navidad-330x330.jpg"
                    alt="El Mercadillo de Almagro Navidad"
                    className="w-full h-40 md:h-48 object-cover rounded-lg"
                  />
                </div>
                
                <h4 className="font-bold text-base md:text-lg text-gray-900 mb-3">
                  EL MERCADILLO DE ALMAGRO NAVIDAD
                </h4>
                
                <p className="text-xs md:text-sm text-gray-600 mb-4 flex-1">
                  SÁBADO 18 DE DIC 2021 La sede de Almagro te espera con una feria emprendedora en toda su galería y shows en vivo. De 14hs a 20.30hs y continua en la semana del 20 al 23 de 12 a 19.30hs Av. Rivadavia 4390, Almagro.
                </p>
                
                {/* Iconos de redes sociales */}
                <div className="flex justify-center gap-2 mt-auto pt-4">
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.344 5.667c.28 0 .511.231.511.511v11.644c0 .28-.231.511-.511.511H5.656c-.28 0-.511-.231-.511-.511V6.178c0-.28.231-.511.511-.511h12.688zm-6.172 5.49L7.25 8.5v7l4.922-2.343L17.094 15.5v-7l-4.922 2.657z"/>
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
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              <div className="text-center flex-1 flex flex-col">
                {/* Imagen real */}
                <div className="mb-4">
                  <img
                    src="https://bauldemoda.com.ar/wp-content/uploads/2020/12/131822889_10158279931233924_4735578909456527845_o-330x330.jpg"
                    alt="Festival en Casa"
                    className="w-full h-40 md:h-48 object-cover rounded-lg"
                  />
                </div>
                
                <h4 className="font-bold text-base md:text-lg text-gray-900 mb-3">
                  FESTIVAL EN CASA
                </h4>
                
                <p className="text-xs md:text-sm text-gray-600 mb-4 flex-1">
                  Este 2020 lo cerramos en nuestras sedes que tanto nos extrañaron con Feria, Shows y muchas sorpresas más! Conoce los horarios de cada sede y pasa por la que te quede más cerca! Ciudad Jardín Almagro
                </p>
                
                {/* Iconos de redes sociales */}
                <div className="flex justify-center gap-2 mt-auto pt-4">
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
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
          {/* Elemento decorativo SVG */}
          <div className="absolute top-0 left-0 w-64 h-64 md:w-80 md:h-80 opacity-30 pointer-events-none">
            <Image
              src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/brush-testimonial.svg"
              alt="Decoración testimonial"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 256px, 320px"
              unoptimized
            />
          </div>

          {/* Contenido del testimonio - Slider */}
          <div className="relative z-10 text-center py-16 min-h-[300px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
              >
                <blockquote className="text-lg md:text-xl text-gray-700 italic leading-relaxed mb-8">
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>
                
                <cite className="text-lg font-bold block" style={{ color: "#E9749B" }}>
                  {testimonials[currentTestimonial].author.toUpperCase()}
                </cite>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Flechas de navegación */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full hover:bg-pink-100 transition-colors z-20"
            style={{ color: "#E9749B" }}
            aria-label="Testimonio anterior"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full hover:bg-pink-100 transition-colors z-20"
            style={{ color: "#E9749B" }}
            aria-label="Testimonio siguiente"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
            </svg>
          </button>

          {/* Indicadores de puntos */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentTestimonial ? 'bg-pink-500 w-8' : 'bg-pink-200'
                }`}
                aria-label={`Ir al testimonio ${index + 1}`}
              />
            ))}
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
              className={cn("text-2xl font-bold text-gray-900 mb-6")}
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
              <p className="text-base md:text-lg leading-relaxed">
                Baúl de Moda abre sus puertas a la comunidad emprendedora, ofreciéndote un área de trabajo creativo y relajado en donde vas a poder sacarle provecho de tus horas laborales! Ideal si necesitas salir un poco de tu casa o necesitas el uso de maquinarias e instalaciones! Existen distintas modalidades, consulta disponibilidad y precios sobre la que te interese:
              </p>
              
              <div className="space-y-4 mt-6">
                <div>
                  <p className="font-bold text-gray-900 mb-1">Taller:</p>
                  <p className="text-base md:text-lg leading-relaxed">
                    ideal para venir a coser y/o cortar muestras o pequeñas producciones.
                  </p>
                </div>
                
                <div>
                  <p className="font-bold text-gray-900 mb-1">Oficina:</p>
                  <p className="text-base md:text-lg leading-relaxed">
                    Ideal para venir con tu notebook a trabajar, tener entrevistas/reuniones, o hacer otros tipos de trabajo como sección de fotos.
                  </p>
                </div>
                
                <div>
                  <p className="font-bold text-gray-900 mb-1">Alquiler de Sala, Baúl a Puertas Abiertas:</p>
                  <p className="text-base md:text-lg leading-relaxed">
                    si buscas un lugar para dar clases u organizar eventos. <span className="font-semibold" style={{ color: "#E9749B" }}>Ver más!</span>
                  </p>
                </div>
              </div>
              
              <p className="text-base md:text-lg leading-relaxed mt-6" style={{ color: "#E9749B" }}>
                Todos los servicios incluyen: wifi libre, agua, té, mate, café, heladera para guardar gaseosas o viandas, aire acondicionado (frío o calor), música ambiente, entre otras comodidades.
              </p>
            </motion.div>
          </div>

          {/* Imagen de Co-Working */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 3.0 }}
            className="relative"
          >
            <div className="relative w-full h-[400px] rounded-lg shadow-lg overflow-hidden bg-gray-100">
              <Image
                src="https://bauldemoda.com.ar/wp-content/uploads/2020/05/cowork.png"
                alt="Co-Working Baúl de Moda"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
              />
            </div>
          </motion.div>
        </div>
        </div>
      </section>
      
      <UbicacionWrapper />
    </div>
  );
};

export default ComunidadBaul;

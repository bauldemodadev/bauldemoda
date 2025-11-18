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
        style={{ backgroundColor: "#FFFFFF" }}
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

            {/* Imagen */}
            <div className="relative">
              <img
                src="https://bauldemoda.com.ar/wp-content/uploads/2020/04/6-3.jpg"
                alt="Somos Baúl de Moda"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sección Video */}
      <section 
        className="w-full py-12 md:py-16" 
        style={{ backgroundColor: "#EBCCD5" }}
      >
        <div className="max-w-frame mx-auto px-4 md:px-6">
          <div className="text-center">
            <motion.div
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/R0rG-C3MErE?si=f0htzeZIapllYlme"
                  title="Baúl de Moda - Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
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
            {/* Imagen */}
            <div className="relative">
              <img
                src="https://bauldemoda.com.ar/wp-content/uploads/2021/05/1150x750-C-1150x700.jpg"
                alt="Historia de Baúl de Moda"
                className="w-full h-auto rounded-lg shadow-lg"
              />
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
                {/* Imagen real */}
                <div className="mb-4 flex justify-center">
                  <img
                    src="https://bauldemoda.com.ar/wp-content/uploads/2021/03/imagenes-intervenidas-para-web-baul-2020-330x330.jpg"
                    alt="Baúl en Blogs & Páginas"
                    className="w-full h-48 object-cover rounded-lg"
                  />
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
                {/* Imagen real */}
                <div className="mb-4 flex justify-center">
                  <img
                    src="https://bauldemoda.com.ar/wp-content/uploads/2020/05/1-7.jpg"
                    alt="Contenido Revistas - Arcadia"
                    className="w-full h-48 object-cover rounded-lg"
                  />
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
                {/* Imagen real */}
                <div className="mb-4 flex justify-center">
                  <img
                    src="https://bauldemoda.com.ar/wp-content/uploads/2020/05/5-3.jpg"
                    alt="Eventos, Expos y Premios"
                    className="w-full h-48 object-cover rounded-lg"
                  />
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
                {/* Imagen real */}
                <div className="mb-4 flex justify-center">
                  <img
                    src="https://bauldemoda.com.ar/wp-content/uploads/2020/05/2-4.jpg"
                    alt="Clarín & La Nación"
                    className="w-full h-48 object-cover rounded-lg"
                  />
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

        </div>
      </section>

      {/* Sección Ubicación */}
      <UbicacionWrapper />
    </div>
  );
};

export default Bauleras;


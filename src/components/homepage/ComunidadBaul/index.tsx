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
            className={cn("text-3xl md:text-4xl font-bold text-gray-900 mb-4")}
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
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-center">
                {/* Imagen real */}
                <div className="mb-4 flex justify-center">
                  <img
                    src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/tienda-baul.jpg"
                    alt="La Tienda Baúl"
                    className="w-16 h-16 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://bauldemoda.com.ar/wp-content/uploads/2020/03/tienda-baul.png";
                    }}
                  />
                </div>
                
                <h4 className="font-beauty text-lg font-bold text-gray-900 mb-2">
                  LA TIENDA BAUL
                </h4>
                
                <p className="text-sm text-gray-600">
                  Nuestra tiendita de Diseño 100% emprendedor se suma a la comunidad con descuentos imperdibles para alumnas Baúl: 20% en efectivo / 10% débito / 5% crédito.
                </p>
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
                {/* Imagen real */}
                <div className="mb-4 flex justify-center">
                  <img
                    src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/telas-agustin.jpg"
                    alt="Telas Agustín"
                    className="w-16 h-16 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://bauldemoda.com.ar/wp-content/uploads/2020/03/telas-agustin.png";
                    }}
                  />
                </div>
                
                <h4 className="font-beauty text-lg font-bold text-gray-900 mb-2">
                  Telas Agustín
                </h4>
                
                <p className="text-sm text-gray-600">
                  Ofrece la más amplia variedad en telas por menor y mayor con descuentos especiales para la Comunidad Baúl, del 10% en telas x metro. Santos Vega 7300, esq. 12 de Octubre, Villa Bosch. con envíos a domicilio.
                </p>
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
                {/* Imagen real */}
                <div className="mb-4 flex justify-center">
                  <img
                    src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/enigma.jpg"
                    alt="Enigma, Casa Gonzalez"
                    className="w-16 h-16 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://bauldemoda.com.ar/wp-content/uploads/2020/03/enigma.png";
                    }}
                  />
                </div>
                
                <h4 className="font-beauty text-lg font-bold text-gray-900 mb-2">
                  Enigma, Casa Gonzalez
                </h4>
                
                <p className="text-sm text-gray-600">
                  Descuentos del 5% en máquinas de coser, repuesto e insumos para la confección / 7% pagos en efectivo. Av. Belgrano 3787, Almagro.
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
                {/* Imagen real */}
                <div className="mb-4 flex justify-center">
                  <img
                    src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/epoje.jpg"
                    alt="EPOJE TEXTIL"
                    className="w-16 h-16 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://bauldemoda.com.ar/wp-content/uploads/2020/03/epoje.png";
                    }}
                  />
                </div>
                
                <h4 className="font-beauty text-lg font-bold text-gray-900 mb-2">
                  EPOJE TEXTIL
                </h4>
                
                <p className="text-sm text-gray-600">
                  Showroom de telas, gran variedad de retazos en telas planas y de punto. Descuentos del 10% para la comunidad. Venta por mayor y menor. Venezuela 4736 Villa Martelli
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
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-center">
                {/* Imagen real */}
                <div className="mb-4 flex justify-center">
                  <img
                    src="https://bauldemoda.com.ar/wp-content/uploads/2022/11/162736908_153938863654181_2552882831917902521_n-330x330.jpg"
                    alt="Kluma Deco"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
                
                <h4 className="font-beauty text-lg font-bold text-gray-900 mb-2">
                  KLUMA DECO
                </h4>
                
                <p className="text-sm text-gray-600 mb-4">
                  Deco con diseños textiles exclusivos.
                </p>
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
                {/* Imagen real */}
                <div className="mb-4 flex justify-center">
                  <img
                    src="https://bauldemoda.com.ar/wp-content/uploads/2022/11/AB63E0AAC6614D38A33C0C8ECB4D1B4E-330x330.jpg"
                    alt="Dani Ramirez"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
                
                <h4 className="font-beauty text-lg font-bold text-gray-900 mb-2">
                  DANI RAMIREZ
                </h4>
                
                <p className="text-sm text-gray-600 mb-4">
                  Soy ilustradora. Creo objetos para la vida cotidiana e ilustro para otras marcas. Productos mágicos, únicos y con sentido.
                </p>
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
                {/* Imagen real */}
                <div className="mb-4 flex justify-center">
                  <img
                    src="https://bauldemoda.com.ar/wp-content/uploads/2022/11/LOGOS-pdf.jpg"
                    alt="Buziana"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
                
                <h4 className="font-beauty text-lg font-bold text-gray-900 mb-2">
                  BUZIANA
                </h4>
                
                <p className="text-sm text-gray-600 mb-4">
                  BUZIANA. LIBRETAS Y CUADERNOS PARA INSPIRARTE!
                </p>
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
                {/* Imagen real */}
                <div className="mb-4 flex justify-center">
                  <img
                    src="https://bauldemoda.com.ar/wp-content/uploads/2023/06/mover-los-hilos.jpg"
                    alt="Mover los Hilos"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
                
                <h4 className="font-beauty text-lg font-bold text-gray-900 mb-2">
                  MOVER LOS HILOS
                </h4>
                
                <p className="text-sm text-gray-600 mb-4">
                  Tienda de tejidos artesanales realizados a medida. Ciudad Jardín, El Palomar.
                </p>
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
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-center">
                {/* Imagen real */}
                <div className="mb-4 flex justify-center">
                  <img
                    src="https://bauldemoda.com.ar/wp-content/uploads/2021/11/1-330x330.jpg"
                    alt="Festival 11° Ed. Ciudad Jardín"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                
                <h4 className="font-beauty text-lg font-bold text-gray-900 mb-2">
                  FESTIVAL 11° ED. EN CIUDAD JARDÍN
                </h4>
                
                <p className="text-sm text-gray-600 mb-4">
                  DOMINGO 19 DE DICIEMBRE 2021 de 16hs a 22hs en la Calle. Te esperan más de 30 emprendedores con Música en vivo, Shows, Entretenimiento y Sorteos.
                </p>
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
                {/* Imagen real */}
                <div className="mb-4 flex justify-center">
                  <img
                    src="https://bauldemoda.com.ar/wp-content/uploads/2022/11/feed-festival-330x330.gif"
                    alt="Festival 12° Ed. Ciudad Jardín"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                
                <h4 className="font-beauty text-lg font-bold text-gray-900 mb-2">
                  FESTIVAL 12° ED. EN CIUDAD JARDÍN
                </h4>
                
                <p className="text-sm text-gray-600 mb-4">
                  DOMINGO 11 DE DICIEMBRE 2022 de 16hs a 22hs en la Calle. Te esperan más de 30 emprendedores con Música en vivo, Shows, Entretenimiento y Sorteos.
                </p>
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
                {/* Imagen real */}
                <div className="mb-4 flex justify-center">
                  <img
                    src="https://bauldemoda.com.ar/wp-content/uploads/2021/11/mercadillo-navidad-330x330.jpg"
                    alt="El Mercadillo de Almagro Navidad"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                
                <h4 className="font-beauty text-lg font-bold text-gray-900 mb-2">
                  EL MERCADILLO DE ALMAGRO NAVIDAD
                </h4>
                
                <p className="text-sm text-gray-600 mb-4">
                  SÁBADO 18 DE DIC 2021 La sede de Almagro te espera con una feria emprendedora en toda su galería y shows en vivo. De 14hs a 20.30hs y continua en la semana del 20 al 23 de 12 a 19.30hs Av. Rivadavia 4390, Almagro.
                </p>
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
                {/* Imagen real */}
                <div className="mb-4 flex justify-center">
                  <img
                    src="https://bauldemoda.com.ar/wp-content/uploads/2020/12/131822889_10158279931233924_4735578909456527845_o-330x330.jpg"
                    alt="Festival en Casa"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                
                <h4 className="font-beauty text-lg font-bold text-gray-900 mb-2">
                  FESTIVAL EN CASA
                </h4>
                
                <p className="text-sm text-gray-600 mb-4">
                  Este 2020 lo cerramos en nuestras sedes que tanto nos extrañaron con Feria, Shows y muchas sorpresas más! Conoce los horarios de cada sede y pasa por la que te quede más cerca! Ciudad Jardín Almagro
                </p>
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
                src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/coworking.jpg"
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

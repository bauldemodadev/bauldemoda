"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
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
                    src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/icon-tienda.svg"
                    alt="La Tienda Baúl"
                    className="w-16 h-16"
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
                    src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/icon-telas.svg"
                    alt="Telas Agustín"
                    className="w-16 h-16"
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
                    src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/icon-enigma.svg"
                    alt="Enigma, Casa Gonzalez"
                    className="w-16 h-16"
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
                    src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/icon-epoje.svg"
                    alt="EPOJE TEXTIL"
                    className="w-16 h-16"
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
                    src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/kluma-deco.jpg"
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
                    src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/dani-ramirez.jpg"
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
                    src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/buziana.jpg"
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
                    src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/mover-los-hilos.jpg"
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
                    src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/festival-11-ed.jpg"
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
                    src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/festival-12-ed.jpg"
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
                    src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/mercadillo-almagro.jpg"
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
                    src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/festival-en-casa.jpg"
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

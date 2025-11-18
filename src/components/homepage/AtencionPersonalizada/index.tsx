import React from "react";
import * as motion from "framer-motion/client";

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
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
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
              className="text-center flex-1 max-w-sm w-full flex flex-col items-center"
            >
              {/* Imagen */}
              <div className="mb-6 flex justify-center items-center w-full">
                <img 
                  src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/icon-bauleras.svg" 
                  alt="Bauleras" 
                  className="w-32 h-32 md:w-40 md:h-40 object-contain"
                />
              </div>
              
              {/* Título */}
              <h3 className="font-beauty text-3xl md:text-5xl text-gray-800 mb-4">
                bauleras
              </h3>
              
              {/* Descripción */}
              <p className="text-gray-700 mb-6 leading-relaxed text-sm md:text-base">
                Descubrí quiénes somos<br />
                y nuestra historia
              </p>
              
              {/* Link */}
              <a href="#" className="text-pink-500 hover:text-pink-600 transition-colors text-sm md:text-base">
                ver más
              </a>
            </motion.div>

            {/* Bloque 2: comunidad */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center flex-1 max-w-sm w-full flex flex-col items-center"
            >
              {/* Imagen */}
              <div className="mb-6 flex justify-center items-center w-full">
                <img 
                  src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/icon-comunidad.svg" 
                  alt="Comunidad" 
                  className="w-32 h-32 md:w-40 md:h-40 object-contain"
                />
              </div>
              
              {/* Título */}
              <h3 className="font-beauty text-3xl md:text-5xl text-gray-800 mb-4">
                comunidad
              </h3>
              
              {/* Descripción */}
              <p className="text-gray-700 mb-6 leading-relaxed text-sm md:text-base">
                Conoce los beneficios para<br />
                alumnos y nuestros eventos
              </p>
              
              {/* Link */}
              <a href="#" className="text-pink-500 hover:text-pink-600 transition-colors text-sm md:text-base">
                ver más
              </a>
            </motion.div>

            {/* Bloque 3: tips */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center flex-1 max-w-sm w-full flex flex-col items-center"
            >
              {/* Imagen */}
              <div className="mb-6 flex justify-center items-center w-full">
                <img 
                  src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/icon-tips.svg" 
                  alt="Tips" 
                  className="w-32 h-32 md:w-40 md:h-40 object-contain"
                />
              </div>
              
              {/* Título */}
              <h3 className="font-beauty text-3xl md:text-5xl text-gray-800 mb-4">
                tips
              </h3>
              
              {/* Descripción */}
              <p className="text-gray-700 mb-6 leading-relaxed text-sm md:text-base">
                Accede a nuestro blog<br />
                de datos útiles
              </p>
              
              {/* Link */}
              <a href="#" className="text-pink-500 hover:text-pink-600 transition-colors text-sm md:text-base">
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

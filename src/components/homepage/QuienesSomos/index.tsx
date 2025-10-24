import React from "react";
import * as motion from "framer-motion/client";
import { cn } from "@/lib/utils";

const QuienesSomos = () => {
  return (
    <div className="px-4 xl:px-0">
      <section id="nosotros" className="max-w-frame mx-auto px-4 md:px-6 py-16 md:py-24 bg-gradient-to-br from-gray-100 to-white rounded-3xl">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ y: "100px", opacity: 0 }}
            whileInView={{ y: "0", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={cn([
              
              "text-2xl font-bold text-center ml-8 md:ml-0",
            ])}
          >
            Nosotros
          </motion.h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mt-4 sm:mt-6">
            Conocé al equipo que hace posible tu proyecto
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Contenido de texto */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                Nuestra Historia
              </h2>
              <p className="text-gray-700 leading-relaxed text-base">
                Más de 5 años ofreciendo maderas de calidad en Buenos Aires. 
                Empezamos como un pequeño taller familiar y hoy somos tu 
                proveedor de confianza para todos tus proyectos de carpintería.
              </p>
            </div>

            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                Nuestro Compromiso
              </h2>
              <p className="text-gray-700 leading-relaxed text-base">
                Te garantizamos maderas seleccionadas a mano, herramientas 
                profesionales y el mejor asesoramiento. Sabemos que cada proyecto 
                es especial, por eso te acompañamos desde la idea hasta el resultado final.
              </p>
            </div>

            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                Nuestra Misión
              </h2>
              <p className="text-gray-700 leading-relaxed text-base">
                Queremos que te sientas como en casa cuando vengas a visitarnos. 
                No solo vendemos madera, construimos relaciones duraderas con 
                nuestros clientes. Tu satisfacción es nuestro mayor logro.
              </p>
            </div>

            <div className="pt-4">
              <p className="text-gray-600 text-sm italic">
                "En Baúl de Moda, cada cliente es parte de nuestra familia. 
                Te invitamos a conocernos y descubrir por qué somos la elección 
                de los mejores carpinteros de Buenos Aires."
              </p>
            </div>
          </motion.div>

          {/* Foto del equipo o taller */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl overflow-hidden shadow-lg">
              {/* Aquí puedes reemplazar con una foto real del equipo o taller */}
              <div className="w-full h-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center relative">
                {/* Placeholder para la foto - Reemplazar con imagen real */}
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-amber-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-amber-700"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-amber-800 font-semibold text-lg mb-2">
                    Nuestro Equipo
                  </p>
                  <p className="text-amber-700 text-sm">
                    Profesionales apasionados por la madera
                  </p>
                </div>
                
                {/* Overlay con información adicional */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-800/80 to-transparent p-4">
                  <p className="text-white text-sm font-medium">
                    Más de 5 años de experiencia
                  </p>
                  <p className="text-amber-100 text-xs">
                    Atención personalizada y asesoramiento experto
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default QuienesSomos;

import React from "react";
import * as motion from "framer-motion/client";
import Image from "next/image";

const Ubicacion = () => {
  return (
    <div className="px-4 xl:px-0">
      <section className="max-w-frame mx-auto px-4 md:px-6 py-16 md:py-24 bg-white">
        {/* Ubicaciones */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          {/* Ciudad Jardín */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full max-w-md lg:max-w-lg lg:-mr-[165px]"
          >
            <div className="relative space-y-4">
              {/* Imagen Ciudad Jardín */}
              <div className="w-full flex justify-center">
                <Image
                  src="https://bauldemoda.com.ar/wp-content/uploads/2020/04/cjinfo.svg"
                  alt="Ciudad Jardín - Baúl de Moda"
                  width={300}
                  height={400}
                  className="w-full max-w-sm h-auto"
                />
              </div>
              
              {/* Botones verticales */}
              <div className="flex flex-col gap-2 items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 text-white font-bold rounded-lg text-sm transition-colors duration-300 uppercase tracking-wide"
                  style={{ backgroundColor: "#E9ABBD" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D44D7D"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E9ABBD"}
                >
                  CONTACTAR
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 text-white font-bold rounded-lg text-sm transition-colors duration-300 uppercase tracking-wide"
                  style={{ backgroundColor: "#E9ABBD" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D44D7D"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E9ABBD"}
                >
                  NEWSLETTER
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Almagro */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative w-full max-w-md lg:max-w-lg"
          >
            <div className="relative space-y-4">
              {/* Imagen Almagro */}
              <div className="w-full flex justify-center">
                <Image
                  src="https://bauldemoda.com.ar/wp-content/uploads/2020/04/almagroinfo.svg"
                  alt="Almagro - Baúl de Moda"
                  width={300}
                  height={400}
                  className="w-full max-w-sm h-auto"
                />
              </div>
              
              {/* Botones verticales */}
              <div className="flex flex-col gap-2 items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 text-white font-bold rounded-lg text-sm transition-colors duration-300 uppercase tracking-wide"
                  style={{ backgroundColor: "#E9ABBD" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D44D7D"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E9ABBD"}
                >
                  CONTACTAR
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 text-white font-bold rounded-lg text-sm transition-colors duration-300 uppercase tracking-wide"
                  style={{ backgroundColor: "#E9ABBD" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D44D7D"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E9ABBD"}
                >
                  NEWSLETTER
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Ubicacion;

import React from "react";
import * as motion from "framer-motion/client";
import { integralCF } from "@/styles/fonts";
import { cn } from "@/lib/utils";

const Ubicacion = () => {
  return (
    <div className="px-4 xl:px-0">
      <section className="max-w-frame mx-auto px-4 md:px-6 py-16 md:py-24 bg-white">
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
              integralCF.className,
              "text-3xl md:text-4xl font-bold text-gray-800 mb-4",
            ])}
          >
            Nuestras Ubicaciones
          </motion.h2>
        </motion.div>

        {/* Ubicaciones */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          {/* Ciudad Jardín */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full max-w-md lg:max-w-lg"
          >
            {/* Fondo con forma orgánica - Rosa */}
            <div 
              className="absolute inset-0 rounded-3xl opacity-60" 
              style={{ 
                backgroundColor: "#F8BBD9",
                clipPath: 'polygon(0% 0%, 100% 0%, 95% 20%, 100% 40%, 90% 60%, 100% 80%, 95% 100%, 0% 100%, 5% 80%, 0% 60%, 10% 40%, 0% 20%)'
              }} 
            />
            
            <div className="relative p-8 lg:p-10 space-y-6">
              {/* Título */}
              <div className="text-center">
                <h3 className={cn([
                  integralCF.className,
                  "text-2xl md:text-3xl font-bold text-gray-800 mb-6"
                ])}>
                  Ciudad Jardín
                </h3>
              </div>
              
              {/* Ilustración */}
              <div className="w-full h-48 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <div className="text-gray-500 text-sm">Ilustración edificio Ciudad Jardín</div>
                  </div>
                </div>
              </div>
              
              {/* Dirección */}
              <div className="text-center space-y-2">
                <p className="text-gray-700 font-medium">Av. Dr. Ricardo Balbín 2950, local 33</p>
                <p className="text-gray-700 font-medium">Shopping Paradise</p>
                <p className="text-gray-700 font-medium">Zona Oeste</p>
              </div>
              
              {/* Botones */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-12 bg-pink-200 text-black font-bold rounded-lg hover:bg-pink-300 transition-colors duration-300 uppercase tracking-wide"
                >
                  CONTACTAR
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-12 bg-pink-200 text-black font-bold rounded-lg hover:bg-pink-300 transition-colors duration-300 uppercase tracking-wide"
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
            {/* Fondo con forma orgánica - Amarillo */}
            <div 
              className="absolute inset-0 rounded-3xl opacity-60" 
              style={{ 
                backgroundColor: "#FFF2CC",
                clipPath: 'polygon(5% 0%, 100% 0%, 100% 20%, 90% 40%, 100% 60%, 95% 80%, 100% 100%, 5% 100%, 0% 80%, 5% 60%, 0% 40%, 10% 20%)'
              }} 
            />
            
            <div className="relative p-8 lg:p-10 space-y-6">
              {/* Título */}
              <div className="text-center">
                <h3 className={cn([
                  integralCF.className,
                  "text-2xl md:text-3xl font-bold text-gray-800 mb-6"
                ])}>
                  Almagro
                </h3>
              </div>
              
              {/* Ilustración */}
              <div className="w-full h-48 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <div className="text-gray-500 text-sm">Ilustración edificio Almagro</div>
                  </div>
                </div>
              </div>
              
              {/* Dirección */}
              <div className="text-center space-y-2">
                <p className="text-gray-700 font-medium">Castro y Agrelo</p>
                <p className="text-gray-700 font-medium">Almagro</p>
                <p className="text-gray-700 font-medium">Capital Federal</p>
              </div>
              
              {/* Botones */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-12 bg-pink-200 text-black font-bold rounded-lg hover:bg-pink-300 transition-colors duration-300 uppercase tracking-wide"
                >
                  CONTACTAR
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-12 bg-pink-200 text-black font-bold rounded-lg hover:bg-pink-300 transition-colors duration-300 uppercase tracking-wide"
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

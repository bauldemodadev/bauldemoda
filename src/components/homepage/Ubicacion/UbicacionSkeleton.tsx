import React from "react";
import { motion } from "framer-motion";

const UbicacionSkeleton = () => {
  return (
    <div className="px-4 xl:px-0">
      <section className="max-w-frame mx-auto px-4 md:px-6 py-16 md:py-24 bg-white">
        {/* Header skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ y: "100px", opacity: 0 }}
            animate={{ y: "0", opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-80 h-10 bg-gray-200 rounded mx-auto mb-4 animate-pulse"
          />
        </motion.div>

        {/* Ubicaciones skeleton */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          {/* Ciudad Jardín skeleton */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
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
              {/* Título skeleton */}
              <div className="text-center">
                <div className="w-40 h-8 bg-gray-300 rounded-full mx-auto mb-6 animate-pulse" />
              </div>
              
              {/* Ilustración skeleton */}
              <div className="w-full h-48 bg-gray-200 rounded-2xl flex items-center justify-center animate-pulse">
                <div className="w-32 h-32 bg-gray-300 rounded-lg" />
              </div>
              
              {/* Dirección skeleton */}
              <div className="text-center space-y-2">
                <div className="w-56 h-5 bg-gray-300 rounded mx-auto animate-pulse" />
                <div className="w-48 h-5 bg-gray-300 rounded mx-auto animate-pulse" />
                <div className="w-40 h-5 bg-gray-300 rounded mx-auto animate-pulse" />
              </div>
              
              {/* Botones skeleton */}
              <div className="space-y-3">
                <div className="w-full h-12 bg-gray-300 rounded-lg animate-pulse" />
                <div className="w-full h-12 bg-gray-300 rounded-lg animate-pulse" />
              </div>
            </div>
          </motion.div>

          {/* Almagro skeleton */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
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
              {/* Título skeleton */}
              <div className="text-center">
                <div className="w-32 h-8 bg-gray-300 rounded-full mx-auto mb-6 animate-pulse" />
              </div>
              
              {/* Ilustración skeleton */}
              <div className="w-full h-48 bg-gray-200 rounded-2xl flex items-center justify-center animate-pulse">
                <div className="w-32 h-32 bg-gray-300 rounded-lg" />
              </div>
              
              {/* Dirección skeleton */}
              <div className="text-center space-y-2">
                <div className="w-48 h-5 bg-gray-300 rounded mx-auto animate-pulse" />
                <div className="w-36 h-5 bg-gray-300 rounded mx-auto animate-pulse" />
                <div className="w-44 h-5 bg-gray-300 rounded mx-auto animate-pulse" />
              </div>
              
              {/* Botones skeleton */}
              <div className="space-y-3">
                <div className="w-full h-12 bg-gray-300 rounded-lg animate-pulse" />
                <div className="w-full h-12 bg-gray-300 rounded-lg animate-pulse" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default UbicacionSkeleton;

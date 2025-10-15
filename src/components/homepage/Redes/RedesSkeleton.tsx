import React from "react";
import { motion } from "framer-motion";

const RedesSkeleton = () => {
  // Generar 6 skeletons para simular los posts de Instagram
  const postSkeletons = Array.from({ length: 6 }, (_, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-lg"
    >
      {/* Imagen skeleton */}
      <div className="w-full h-full bg-gray-200 animate-pulse">
        {/* Play button skeleton */}
        <div className="absolute top-4 right-4">
          <div className="w-8 h-8 bg-gray-300 rounded-full" />
        </div>
        
        {/* Texto skeleton */}
        <div className="absolute inset-0 flex flex-col justify-center items-center p-4">
          <div className="w-24 h-4 bg-gray-300 rounded mb-2" />
          <div className="w-32 h-5 bg-gray-300 rounded mb-2" />
          <div className="w-20 h-4 bg-gray-300 rounded" />
        </div>
      </div>
    </motion.div>
  ));

  return (
    <div className="px-4 xl:px-0">
      <section 
        className="max-w-frame mx-auto px-4 md:px-6 py-16 md:py-24"
        style={{ backgroundColor: "#9CDAD3" }}
      >
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
          <motion.div
            initial={{ y: "100px", opacity: 0 }}
            animate={{ y: "0", opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-64 h-6 bg-gray-200 rounded mx-auto animate-pulse"
          />
        </motion.div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
          {postSkeletons}
        </div>

        {/* Iconos de redes sociales skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center space-x-6"
        >
          <div className="w-12 h-12 border-2 border-gray-300 rounded-full animate-pulse" />
          <div className="w-12 h-12 border-2 border-gray-300 rounded-full animate-pulse" />
          <div className="w-12 h-12 border-2 border-gray-300 rounded-full animate-pulse" />
        </motion.div>
      </section>
    </div>
  );
};

export default RedesSkeleton;

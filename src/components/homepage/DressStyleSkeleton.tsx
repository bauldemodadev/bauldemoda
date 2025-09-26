import React from "react";

const DressStyleSkeleton = () => {
  // Generar 4 skeletons para simular cursos
  const courseSkeletons = Array.from({ length: 4 }, (_, index) => (
    <div
      key={index}
      className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
    >
      {/* Imagen del curso skeleton */}
      <div className="relative h-48 bg-gray-200">
        {/* Tag skeleton */}
        <div className="absolute top-3 left-3">
          <div className="w-20 h-6 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Imagen placeholder skeleton */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Contenido del curso skeleton */}
      <div className="p-6">
        {/* Título skeleton */}
        <div className="space-y-2 mb-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
        
        {/* Subtítulo skeleton */}
        <div className="h-3 bg-gray-300 rounded w-1/3 mb-4"></div>
        
        {/* Botón skeleton */}
        <div className="h-10 bg-gray-300 rounded-lg w-full"></div>
      </div>
    </div>
  ));

  return (
    <div className="px-4 xl:px-0">
      <section className="max-w-frame mx-auto px-4 md:px-6 py-12 md:py-16 bg-stone-50">
        {/* Título de la sección skeleton */}
        <div className="text-center mb-8">
          <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-2 animate-pulse"></div>
          <div className="h-5 bg-gray-300 rounded w-32 mx-auto animate-pulse"></div>
        </div>

        {/* Grid de cursos skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {courseSkeletons}
        </div>

        {/* Botón VER TODOS skeleton */}
        <div className="text-center">
          <div className="h-12 bg-gray-300 rounded-lg w-32 mx-auto animate-pulse"></div>
        </div>
      </section>
    </div>
  );
};

export default DressStyleSkeleton;

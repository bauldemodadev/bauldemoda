import React from 'react';
import { motion } from 'framer-motion';

const FiltersSkeleton = () => {
  return (
    <div className="space-y-5 md:space-y-6">
      {/* Categorías skeleton */}
      <div>
        <div className="w-24 h-5 bg-gray-200 rounded mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded" />
              <div className="w-20 h-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Subcategorías skeleton */}
      <div>
        <div className="w-32 h-5 bg-gray-200 rounded mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded" />
              <div className="w-24 h-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Tipo de madera skeleton */}
      <div>
        <div className="w-28 h-5 bg-gray-200 rounded mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded" />
              <div className="w-20 h-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Filtros especiales skeleton */}
      <div>
        <div className="w-32 h-5 bg-gray-200 rounded mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded" />
              <div className="w-28 h-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Rango de precios skeleton */}
      <div>
        <div className="w-32 h-5 bg-gray-200 rounded mb-3" />
        <div className="space-y-3">
          <div className="w-full h-2 bg-gray-200 rounded" />
          <div className="flex justify-between">
            <div className="w-16 h-4 bg-gray-200 rounded" />
            <div className="w-16 h-4 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersSkeleton;

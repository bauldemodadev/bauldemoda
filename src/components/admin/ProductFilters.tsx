'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X, ChevronDown } from 'lucide-react';
import { Disclosure } from '@headlessui/react';

interface ProductFiltersProps {
  categories: string[];
  subcategories: string[];
  sedes: string[];
  onFilterChange?: () => void;
}

export default function ProductFilters({ 
  categories, 
  subcategories, 
  sedes,
  onFilterChange 
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState(searchParams.get('subcategory') || '');
  const [selectedSede, setSelectedSede] = useState(searchParams.get('sede') || '');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '');
  const [selectedStockStatus, setSelectedStockStatus] = useState(searchParams.get('stockStatus') || '');

  const updateURL = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    params.set('page', '1'); // Reset a página 1 al filtrar
    router.push(`?${params.toString()}`);
    
    if (onFilterChange) {
      onFilterChange();
    }
  };

  const handleCategoryChange = (category: string) => {
    const newCategory = selectedCategory === category ? '' : category;
    setSelectedCategory(newCategory);
    setSelectedSubcategory(''); // Reset subcategoría al cambiar categoría
    updateURL({ category: newCategory, subcategory: '' });
  };

  const handleSubcategoryChange = (subcategory: string) => {
    const newSubcategory = selectedSubcategory === subcategory ? '' : subcategory;
    setSelectedSubcategory(newSubcategory);
    updateURL({ subcategory: newSubcategory });
  };

  const handleSedeChange = (sede: string) => {
    const newSede = selectedSede === sede ? '' : sede;
    setSelectedSede(newSede);
    updateURL({ sede: newSede });
  };

  const handleStatusChange = (status: string) => {
    const newStatus = selectedStatus === status ? '' : status;
    setSelectedStatus(newStatus);
    updateURL({ status: newStatus });
  };

  const handleStockStatusChange = (stockStatus: string) => {
    const newStockStatus = selectedStockStatus === stockStatus ? '' : stockStatus;
    setSelectedStockStatus(newStockStatus);
    updateURL({ stockStatus: newStockStatus });
  };

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedSede('');
    setSelectedStatus('');
    setSelectedStockStatus('');
    updateURL({
      category: '',
      subcategory: '',
      sede: '',
      status: '',
      stockStatus: '',
    });
  };

  const hasActiveFilters = selectedCategory || selectedSubcategory || selectedSede || selectedStatus || selectedStockStatus;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-900">Filtros</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-pink-600 hover:text-pink-700 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Limpiar todo
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Categorías */}
        {categories.length > 0 && (
          <Disclosure defaultOpen>
            {({ open }) => (
              <div className="border border-gray-100 rounded-lg">
                <Disclosure.Button className="flex w-full justify-between items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                  <span>Categorías</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'transform rotate-180' : ''}`} />
                </Disclosure.Button>
                <Disclosure.Panel className="px-3 pb-2 space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
                        selectedCategory === category
                          ? 'bg-pink-100 text-pink-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        )}

        {/* Subcategorías */}
        {selectedCategory && subcategories.length > 0 && (
          <Disclosure defaultOpen>
            {({ open }) => (
              <div className="border border-gray-100 rounded-lg">
                <Disclosure.Button className="flex w-full justify-between items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                  <span>Subcategorías</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'transform rotate-180' : ''}`} />
                </Disclosure.Button>
                <Disclosure.Panel className="px-3 pb-2 space-y-1">
                  {subcategories.map((subcategory) => (
                    <button
                      key={subcategory}
                      onClick={() => handleSubcategoryChange(subcategory)}
                      className={`w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
                        selectedSubcategory === subcategory
                          ? 'bg-pink-100 text-pink-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {subcategory}
                    </button>
                  ))}
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        )}

        {/* Sedes */}
        {sedes.length > 0 && (
          <Disclosure defaultOpen>
            {({ open }) => (
              <div className="border border-gray-100 rounded-lg">
                <Disclosure.Button className="flex w-full justify-between items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                  <span>Sedes</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'transform rotate-180' : ''}`} />
                </Disclosure.Button>
                <Disclosure.Panel className="px-3 pb-2 space-y-1">
                  {sedes.map((sede) => (
                    <button
                      key={sede}
                      onClick={() => handleSedeChange(sede)}
                      className={`w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
                        selectedSede === sede
                          ? 'bg-pink-100 text-pink-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {sede}
                    </button>
                  ))}
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        )}

        {/* Estado */}
        <Disclosure defaultOpen>
          {({ open }) => (
            <div className="border border-gray-100 rounded-lg">
              <Disclosure.Button className="flex w-full justify-between items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                <span>Estado</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'transform rotate-180' : ''}`} />
              </Disclosure.Button>
              <Disclosure.Panel className="px-3 pb-2 space-y-1">
                {['publish', 'draft'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors capitalize ${
                      selectedStatus === status
                        ? 'bg-pink-100 text-pink-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {status === 'publish' ? 'Publicado' : 'Borrador'}
                  </button>
                ))}
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* Stock */}
        <Disclosure defaultOpen>
          {({ open }) => (
            <div className="border border-gray-100 rounded-lg">
              <Disclosure.Button className="flex w-full justify-between items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                <span>Stock</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'transform rotate-180' : ''}`} />
              </Disclosure.Button>
              <Disclosure.Panel className="px-3 pb-2 space-y-1">
                {['instock', 'outofstock', 'onbackorder'].map((stockStatus) => (
                  <button
                    key={stockStatus}
                    onClick={() => handleStockStatusChange(stockStatus)}
                    className={`w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors capitalize ${
                      selectedStockStatus === stockStatus
                        ? 'bg-pink-100 text-pink-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {stockStatus === 'instock' ? 'En stock' : stockStatus === 'outofstock' ? 'Sin stock' : 'Pedido especial'}
                  </button>
                ))}
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
      </div>
    </div>
  );
}


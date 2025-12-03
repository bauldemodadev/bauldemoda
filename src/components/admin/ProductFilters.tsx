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
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5" style={{ fontFamily: 'var(--font-poppins)' }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-[#E9ABBD]/10 rounded-lg">
            <Filter className="w-4 h-4 text-[#D44D7D]" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">Filtros</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-[#D44D7D] hover:text-[#E9ABBD] font-medium flex items-center gap-1.5 px-2 py-1 hover:bg-[#E9ABBD]/10 rounded-md transition-colors duration-200"
          >
            <X className="w-3 h-3" />
            Limpiar
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Categorías - OCULTO TEMPORALMENTE */}
        {/* {categories.length > 0 && (
          <Disclosure defaultOpen>
            {({ open }) => (
              <div className="border border-gray-100 rounded-lg">
                <Disclosure.Button className="flex w-full justify-between items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <span>Categorías</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open ? 'transform rotate-180' : ''}`} />
                </Disclosure.Button>
                <Disclosure.Panel className="px-3 pb-3 space-y-1.5">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                        selectedCategory === category
                          ? 'bg-[#E9ABBD] text-white font-semibold shadow-sm shadow-[#D44D7D]/20'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        )} */}

        {/* Subcategorías - OCULTO TEMPORALMENTE */}
        {/* {selectedCategory && subcategories.length > 0 && (
          <Disclosure defaultOpen>
            {({ open }) => (
              <div className="border border-gray-100 rounded-lg">
                <Disclosure.Button className="flex w-full justify-between items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <span>Subcategorías</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open ? 'transform rotate-180' : ''}`} />
                </Disclosure.Button>
                <Disclosure.Panel className="px-3 pb-3 space-y-1.5">
                  {subcategories.map((subcategory) => (
                    <button
                      key={subcategory}
                      onClick={() => handleSubcategoryChange(subcategory)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                        selectedSubcategory === subcategory
                          ? 'bg-[#E9ABBD] text-white font-semibold shadow-sm shadow-[#D44D7D]/20'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      {subcategory}
                    </button>
                  ))}
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        )} */}

        {/* Sedes */}
        {sedes.length > 0 && (
          <Disclosure defaultOpen>
            {({ open }) => (
              <div className="border border-gray-100 rounded-lg">
                <Disclosure.Button className="flex w-full justify-between items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <span>Sedes</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open ? 'transform rotate-180' : ''}`} />
                </Disclosure.Button>
                <Disclosure.Panel className="px-3 pb-3 space-y-1.5">
                  {sedes.map((sede) => (
                    <button
                      key={sede}
                      onClick={() => handleSedeChange(sede)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                        selectedSede === sede
                          ? 'bg-[#E9ABBD] text-white font-semibold shadow-sm shadow-[#D44D7D]/20'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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
              <Disclosure.Button className="flex w-full justify-between items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <span>Estado</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open ? 'transform rotate-180' : ''}`} />
              </Disclosure.Button>
              <Disclosure.Panel className="px-3 pb-3 space-y-1.5">
                {['publish', 'draft'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200 capitalize ${
                      selectedStatus === status
                        ? 'bg-[#E9ABBD] text-white font-semibold shadow-sm shadow-[#D44D7D]/20'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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
              <Disclosure.Button className="flex w-full justify-between items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <span>Stock</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open ? 'transform rotate-180' : ''}`} />
              </Disclosure.Button>
              <Disclosure.Panel className="px-3 pb-3 space-y-1.5">
                {['instock', 'outofstock', 'onbackorder'].map((stockStatus) => (
                  <button
                    key={stockStatus}
                    onClick={() => handleStockStatusChange(stockStatus)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200 capitalize ${
                      selectedStockStatus === stockStatus
                        ? 'bg-[#E9ABBD] text-white font-semibold shadow-sm shadow-[#D44D7D]/20'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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


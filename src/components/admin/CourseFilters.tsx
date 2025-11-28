'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X, ChevronDown } from 'lucide-react';
import { Disclosure } from '@headlessui/react';

interface CourseFiltersProps {
  onFilterChange?: () => void;
}

export default function CourseFilters({ onFilterChange }: CourseFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '');

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

  const handleStatusChange = (status: string) => {
    const newStatus = selectedStatus === status ? '' : status;
    setSelectedStatus(newStatus);
    updateURL({ status: newStatus });
  };

  const clearAllFilters = () => {
    setSelectedStatus('');
    updateURL({ status: '' });
  };

  const hasActiveFilters = selectedStatus;

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
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Limpiar todo
          </button>
        )}
      </div>

      <div className="space-y-4">
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
                        ? 'bg-blue-100 text-blue-700 font-medium'
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
      </div>
    </div>
  );
}


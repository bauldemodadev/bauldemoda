'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchBarProps {
  placeholder?: string;
  searchParam?: string;
  onSearch?: (query: string) => void;
  debounceMs?: number;
}

export default function SearchBar({ 
  placeholder = 'Buscar...', 
  searchParam = 'search',
  onSearch,
  debounceMs = 300 
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get(searchParam) || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (query.trim()) {
        params.set(searchParam, query.trim());
        params.set('page', '1'); // Reset a página 1 al buscar
      } else {
        params.delete(searchParam);
      }

      router.push(`?${params.toString()}`);
      
      if (onSearch) {
        onSearch(query.trim());
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, searchParam, router, searchParams, onSearch, debounceMs]);

  const handleClear = () => {
    setQuery('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete(searchParam);
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        placeholder={placeholder}
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  );
}


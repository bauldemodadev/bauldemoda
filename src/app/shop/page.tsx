"use client";

import { useEffect, useState } from "react";
import { FilterProvider, useFilter } from "@/context/FilterContext";
import { useSearchParams, useRouter } from "next/navigation";
import BreadcrumbShop from "@/components/shop-page/BreadcrumbShop";
import { FiSliders } from "react-icons/fi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MobileFilters from "@/components/shop-page/filters/MobileFilters";
import Filters from "@/components/shop-page/filters";
import FiltersSkeleton from "@/components/shop-page/filters/FiltersSkeleton";
import ProductGrid from '@/components/shop-page/ProductGrid';
import ProductGridSkeleton from '@/components/shop-page/ProductGridSkeleton';
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

type SortOption = 'most-popular' | 'low-price' | 'high-price' | 'newest';
type FilterType = 'specialOffer' | 'newArrival' | 'featuredBrand' | 'freeShipping';

interface Product {
  active: boolean;
  category: string;
  createdAt: Date;
  description: string;
  discount: {
    amount: number;
    percentage: number;
  };
  featuredBrand: boolean;
  freeShipping: boolean;
  images: string[];
  name: string;
  newArrival: boolean;
  price: number;
  promos: Array<{
    cantidad: number;
    descuento: number;
    precioFinal: number;
  }>;
  rating: number;
  sales: number;
  specialOffer: boolean;
  srcUrl: string;
  stock: number;
  subcategory: string;
  title: string;
  updatedAt: string;
}

function ShopContent() {
  const { 
    filteredProducts, 
    setSortOption, 
    loading,
    specialOffer,
    newArrival,
    featuredBrand,
    freeShipping,
    setSpecialOffer,
    setNewArrival,
    setFeaturedBrand,
    setFreeShipping,
    selectedCategory,
    selectedSubcategory,
    selectedWoodType
  } = useFilter();
  const searchParams = useSearchParams();
  const router = useRouter();
  const sort = searchParams?.get('sort') as SortOption | null;
  const filter = searchParams?.get('filter');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    if (sort) {
      setSortOption(sort);
    }
  }, [sort, setSortOption]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, sort, specialOffer, newArrival, featuredBrand, freeShipping, selectedCategory, selectedSubcategory, selectedWoodType]);

  useEffect(() => {
    if (filter) {
      const filters = filter.split(',') as FilterType[];
      setSpecialOffer(filters.includes('specialOffer'));
      setNewArrival(filters.includes('newArrival'));
      setFeaturedBrand(filters.includes('featuredBrand'));
      setFreeShipping(filters.includes('freeShipping'));
    } else {
      setSpecialOffer(false);
      setNewArrival(false);
      setFeaturedBrand(false);
      setFreeShipping(false);
    }
  }, [filter, setSpecialOffer, setNewArrival, setFeaturedBrand, setFreeShipping]);

  // Sincronizar categoría, subcategoría y tipo de madera con la URL
  useEffect(() => {
    if (!searchParams) return;
    const newParams = new URLSearchParams(searchParams.toString());

    // Evitar borrar parámetros de la URL antes de que el estado se inicialice desde la URL
    const urlHasCategory = !!searchParams.get('category');
    const urlHasSubcategory = !!searchParams.get('subcategory');
    const urlHasMadera = !!searchParams.get('madera');

    const readyToSync = (!urlHasCategory || selectedCategory !== null)
      && (!urlHasSubcategory || selectedSubcategory !== null)
      && (!urlHasMadera || selectedWoodType !== null);

    if (!readyToSync) return;

    if (selectedCategory) newParams.set('category', selectedCategory); else newParams.delete('category');
    if (selectedSubcategory) newParams.set('subcategory', selectedSubcategory); else newParams.delete('subcategory');
    if (selectedWoodType) newParams.set('madera', selectedWoodType); else newParams.delete('madera');

    const nextQuery = newParams.toString();
    const currentQuery = searchParams.toString();
    if (nextQuery !== currentQuery) {
      router.push(`/shop?${nextQuery}`);
    }
  }, [selectedCategory, selectedSubcategory, selectedWoodType, searchParams, router]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortChange = (value: SortOption) => {
    if (!searchParams) return;
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('sort', value);
    router.push(`/shop?${newParams.toString()}`);
  };

  const handleFilterChange = (filterType: FilterType, value: boolean) => {
    if (!searchParams) return;
    const newParams = new URLSearchParams(searchParams.toString());
    const currentFilters = newParams.get('filter')?.split(',') || [];
    
    if (value) {
      if (!currentFilters.includes(filterType)) {
        currentFilters.push(filterType);
      }
    } else {
      const index = currentFilters.indexOf(filterType);
      if (index > -1) {
        currentFilters.splice(index, 1);
      }
    }
    
    if (currentFilters.length > 0) {
      newParams.set('filter', currentFilters.join(','));
    } else {
      newParams.delete('filter');
    }
    
    router.push(`/shop?${newParams.toString()}`);
  };

  if (loading) {
    return (
      <main className="pb-20">
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
          <BreadcrumbShop />
          <div className="flex md:space-x-5 items-start">
            <div className="hidden md:block min-w-[295px] max-w-[295px] bg-white rounded-xl shadow-lg border border-gray-100 px-5 md:px-6 py-5 space-y-5 md:space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-bold text-black text-xl">Filtros</span>
                <FiSliders className="text-2xl text-black/40" />
              </div>
              <FiltersSkeleton />
            </div>

            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:justify-between mb-6">
                <div className="flex items-center justify-between">
                  <div className="w-32 h-8 bg-gray-200 rounded" />
                  <MobileFilters />
                </div>
                <div className="flex flex-col sm:items-center sm:flex-row mt-4 lg:mt-0">
                  <div className="w-40 h-5 bg-gray-200 rounded mr-3" />
                  <div className="flex items-center">
                    <div className="w-24 h-5 bg-gray-200 rounded mr-2" />
                    <div className="w-32 h-8 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>

              <ProductGridSkeleton count={12} />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbShop />
        <div className="flex md:space-x-5 items-start">
          <div className="hidden md:block min-w-[295px] max-w-[295px] bg-white rounded-xl shadow-lg border border-gray-100 px-5 md:px-6 py-5 space-y-5 md:space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-black text-xl">Filtros</span>
              <FiSliders className="text-2xl text-black/40" />
            </div>
            <Filters />
          </div>

          <div className="flex-1">
            <div className="flex flex-col lg:flex-row lg:justify-between mb-6">
              <div className="flex items-center justify-between">
                <h1 className="font-bold text-2xl md:text-[32px]">Productos</h1>
                <MobileFilters />
              </div>
              <div className="flex flex-col sm:items-center sm:flex-row mt-4 lg:mt-0">
                <span className="text-sm md:text-base text-black/60 mr-3">
                  Mostrando {filteredProducts.length} Productos
                </span>
                <div className="flex items-center">
                  Ordenar por:{" "}
                  <Select 
                    defaultValue={sort || "most-popular"} 
                    onValueChange={handleSortChange}
                  >
                    <SelectTrigger className="font-medium text-sm px-1.5 sm:text-base w-fit text-black bg-transparent shadow-none border-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="most-popular">Más Popular</SelectItem>
                      <SelectItem value="low-price">Precio Bajo</SelectItem>
                      <SelectItem value="high-price">Precio Alto</SelectItem>
                      <SelectItem value="newest">Más Recientes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <ProductGrid products={currentProducts} />

            {filteredProducts.length > productsPerPage && (
              <>
                <hr className="border-t-black/10 mt-8" />
                {/* Paginación responsive y compacta */}
                <div className="mt-6">
                  {/* Mobile: indicador compacto */}
                  <div className="flex items-center justify-between md:hidden">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`flex items-center gap-1 px-3 py-2 rounded-md border border-black/10 ${
                        currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                      }`}
                    >
                      <ArrowLeftIcon className="h-4 w-4" />
                      <span>Anterior</span>
                    </button>
                    <span className="text-sm text-black/70">Página {currentPage} de {totalPages}</span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`flex items-center gap-1 px-3 py-2 rounded-md border border-black/10 ${
                        currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                      }`}
                    >
                      <span>Siguiente</span>
                      <ArrowRightIcon className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Desktop: paginación con elipsis */}
                  <div className="hidden md:flex items-center justify-between">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`flex items-center gap-1 px-2.5 py-2 rounded-md border border-black/10 ${
                        currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                      }`}
                    >
                      <ArrowLeftIcon className="h-4 w-4" />
                      <span>Anterior</span>
                    </button>

                    <div className="flex items-center gap-1 flex-wrap">
                      {(() => {
                        const pages: (number | string)[] = [];
                        const add = (p: number | string) => pages.push(p);
                        const last = totalPages;
                        const cur = currentPage;
                        // Siempre mostrar 1
                        add(1);
                        // Ellipsis después de 1
                        if (cur > 4) add('…');
                        // Ventana alrededor del actual
                        const start = Math.max(2, cur - 1);
                        const end = Math.min(last - 1, cur + 1);
                        for (let p = start; p <= end; p++) add(p);
                        // Ellipsis antes del último
                        if (cur < last - 3) add('…');
                        // Mostrar último si hay más de 1 página
                        if (last > 1) add(last);

                        return pages.map((p, idx) =>
                          typeof p === 'number' ? (
                            <button
                              key={`p-${p}-${idx}`}
                              onClick={() => handlePageChange(p)}
                              className={`min-w-[36px] h-9 px-2 flex items-center justify-center rounded-md ${
                                currentPage === p ? 'bg-black/5 text-black' : 'hover:bg-gray-50'
                              }`}
                            >
                              {p}
                            </button>
                          ) : (
                            <span key={`d-${idx}`} className="px-2 text-black/40">
                              {p}
                            </span>
                          )
                        );
                      })()}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`flex items-center gap-1 px-2.5 py-2 rounded-md border border-black/10 ${
                        currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                      }`}
                    >
                      <span>Siguiente</span>
                      <ArrowRightIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ShopPage() {
  const searchParams = useSearchParams();

  const category = searchParams?.get('category');
  const subcategory = searchParams?.get('subcategory');
  const madera = searchParams?.get('madera');
  const sort = searchParams?.get('sort') as SortOption | null;
  const filter = searchParams?.get('filter');

  return (
    <FilterProvider initialFilters={{
      selectedCategory: category || (madera ? 'Maderas' : null),
      selectedSubcategory: subcategory,
      selectedWoodType: madera,
      sortOption: sort || 'most-popular',
      filter: filter
    }}>
      <ShopContent />
    </FilterProvider>
  );
}

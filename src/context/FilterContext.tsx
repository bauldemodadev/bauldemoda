"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { Product } from '@/types/product';
// Consumimos el listado mapeado desde la API interna del proyecto

type SortOption = 'most-popular' | 'low-price' | 'high-price' | 'newest';

interface FilterContextType {
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  error: string | null;
  categories: string[];
  subcategories: string[];
  priceRange: [number, number];
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  selectedWoodType: string | null;
  sortOption: SortOption;
  activeFilters: string[];
  specialOffer: boolean;
  newArrival: boolean;
  featuredBrand: boolean;
  freeShipping: boolean;
  setProducts: (products: Product[]) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedSubcategory: (subcategory: string | null) => void;
  setSelectedWoodType: (wood: string | null) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortOption: (option: SortOption) => void;
  toggleFilter: (filter: string) => void;
  applyFilters: () => void;
  getSubcategoriesForCategory: (category: string) => string[];
  getWoodTypesForCategory: (category: string) => string[];
  setSpecialOffer: (specialOffer: boolean) => void;
  setNewArrival: (newArrival: boolean) => void;
  setFeaturedBrand: (featuredBrand: boolean) => void;
  setFreeShipping: (freeShipping: boolean) => void;
}

interface InitialFilters {
  selectedCategory?: string | null;
  selectedSubcategory?: string | null;
  selectedWoodType?: string | null;
  sortOption?: SortOption;
  filter?: string | null;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};

interface FilterProviderProps {
  children: ReactNode;
  initialFilters?: InitialFilters;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children, initialFilters }) => {
  // Estado base
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado de filtros
  const [selectedCategory, _setSelectedCategory] = useState<string | null>(initialFilters?.selectedCategory || null);
  const [selectedSubcategory, _setSelectedSubcategory] = useState<string | null>(initialFilters?.selectedSubcategory || null);
  const [selectedWoodType, _setSelectedWoodType] = useState<string | null>(initialFilters?.selectedWoodType || null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortOption, _setSortOption] = useState<SortOption>(initialFilters?.sortOption || 'most-popular');
  const [activeFilters, _setActiveFilters] = useState<string[]>([]);
  const [specialOffer, setSpecialOffer] = useState<boolean>(false);
  const [newArrival, setNewArrival] = useState<boolean>(false);
  const [featuredBrand, setFeaturedBrand] = useState<boolean>(false);
  const [freeShipping, setFreeShipping] = useState<boolean>(false);

  // Actualizar estados cuando cambian los filtros iniciales
  useEffect(() => {
    if (initialFilters?.selectedCategory !== undefined) {
      _setSelectedCategory(initialFilters.selectedCategory);
    }
    if (initialFilters?.selectedSubcategory !== undefined) {
      _setSelectedSubcategory(initialFilters.selectedSubcategory);
    }
    if (initialFilters?.selectedWoodType !== undefined) {
      _setSelectedWoodType(initialFilters.selectedWoodType);
    }
    if (initialFilters?.sortOption) {
      _setSortOption(initialFilters.sortOption);
    }
    if (initialFilters?.filter) {
      const filters = initialFilters.filter.split(',');
      setSpecialOffer(filters.includes('specialOffer'));
      setNewArrival(filters.includes('newArrival'));
      setFeaturedBrand(filters.includes('featuredBrand'));
    }
  }, [initialFilters]);

  // Cargar productos desde API externa
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Intento de listado completo
        let res = await fetch(`/api/products?all=1`, { cache: 'no-store' });
        if (!res.ok) {
          // Fallback a lista por ids de ejemplo si no hubiera soporte de "all"
          const exampleIds = ['4GdzfFreqmEadqPeldFG'];
          res = await fetch(`/api/products?ids=${exampleIds.join(',')}`, { cache: 'no-store' });
        }
        const fetchedProducts = (await res.json()) as Product[];

        // console.log('Productos activos cargados:', fetchedProducts.length);
        setProducts(fetchedProducts);
        
        // Establecer rango de precios inicial basado en los productos
        if (fetchedProducts.length > 0) {
          const prices = fetchedProducts.map((p: Product) => p.price);
          const minPrice = Math.floor(Math.min(...prices));
          const maxPrice = Math.ceil(Math.max(...prices));
          setPriceRange([minPrice, maxPrice]);
        }
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError('Error al cargar productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Extraer categorías y subcategorías únicas de los productos
  const { categories, subcategories } = useMemo(() => {
    if (!products.length) return { categories: [], subcategories: [] };
    
    const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
    const uniqueSubcategories = Array.from(new Set(products.map(p => p.subcategory || '').filter(Boolean)));
    
    return { 
      categories: uniqueCategories, 
      subcategories: uniqueSubcategories 
    };
  }, [products]);

  // Función para obtener subcategorías específicas de una categoría
  const getSubcategoriesForCategory = useCallback((category: string): string[] => {
    if (!category || !products.length) return [];
    
    return Array.from(
      new Set(
        products
          .filter(product => product.category === category)
          .map(p => p.subcategory || '')
          .filter(Boolean)
      )
    );
  }, [products]);

  const getWoodTypesForCategory = useCallback((category: string): string[] => {
    if (!category || !products.length) return [];
    const normalized = category.toLowerCase();
    return Array.from(
      new Set(
        products
          .filter(product => (product.category || '').toLowerCase() === normalized)
          .map(p => (p.tipoMadera || '').trim())
          .filter(Boolean)
      )
    ).sort();
  }, [products]);

  // Aplicar filtros y ordenamiento
  const applyFilters = useCallback(() => {
    if (!products.length) return [];
    
    // console.log('Aplicando filtros...');
    // console.log('Productos disponibles:', products.map(p => ({ id: p.id, category: p.category, subcategory: p.subcategory })));
    
    // Iniciar con todos los productos
    let result = [...products];
    
    // Aplicar filtro de categoría
    if (selectedCategory) {
      // console.log('Categoría seleccionada:', selectedCategory);
      // console.log('Categorías en productos:', Array.from(new Set(products.map(p => p.category))));
      
      // Convertir la categoría seleccionada de formato con guiones a formato con espacios
      const normalizedSelectedCategory = selectedCategory.replace(/-/g, ' ');
      
      result = result.filter(product => {
        // Normalizar la categoría del producto para comparación
        const normalizedProductCategory = product.category.toLowerCase();
        const matches = normalizedProductCategory === normalizedSelectedCategory.toLowerCase();
        // console.log(`Producto ${product.id}: categoría=${product.category}, normalizada=${normalizedProductCategory}, coincide=${matches}`);
        return matches;
      });
      
      console.log(`Filtrado por categoría "${selectedCategory}": ${result.length} productos`);
    }
    
    // Aplicar filtro de subcategoría
    if (selectedSubcategory) {
      // console.log('Subcategoría seleccionada:', selectedSubcategory);
      // console.log('Subcategorías en productos filtrados:', Array.from(new Set(result.map(p => p.subcategory))));
      
      // Convertir la subcategoría seleccionada de formato con guiones a formato con espacios
      const normalizedSelectedSubcategory = selectedSubcategory.replace(/-/g, ' ');
      
      result = result.filter(product => {
        // Normalizar la subcategoría del producto para comparación
        const normalizedProductSubcategory = product.subcategory?.toLowerCase() || '';
        const matches = normalizedProductSubcategory === normalizedSelectedSubcategory.toLowerCase();
        // console.log(`Producto ${product.id}: subcategoría=${product.subcategory}, normalizada=${normalizedProductSubcategory}, coincide=${matches}`);
        return matches;
      });
      
      console.log(`Filtrado por subcategoría "${selectedSubcategory}": ${result.length} productos`);
    }
    
    // Filtro de tipo de madera
    if (selectedWoodType) {
      const normalizedWood = selectedWoodType.toLowerCase();
      result = result.filter(product => (product.tipoMadera || '').toLowerCase() === normalizedWood);
      // Si por UX estamos filtrando por tipo de madera, aseguramos que la categoría sea Maderas
      // para coherencia visual en los filtros (no afecta a la API, solo a la UI)
      if (selectedCategory !== 'Maderas') {
        _setSelectedCategory('Maderas');
      }
    }

    // Aplicar filtro de rango de precios
    const [minPrice, maxPrice] = priceRange;
    if (minPrice > 0 || maxPrice < 100000) {
      result = result.filter(product => {
        const matches = product.price >= minPrice && product.price <= maxPrice;
        // console.log(`Producto ${product.id}: precio=${product.price}, coincide=${matches}`);
        return matches;
      });
      
      // console.log(`Filtrado por precio (${minPrice}-${maxPrice}): ${result.length} productos`);
    }
    
    // Aplicar filtros adicionales
    if (activeFilters.includes('in-stock')) {
      result = result.filter(product => product.stock > 0);
    }
    
    if (activeFilters.includes('on-sale')) {
      result = result.filter(product => product.discount.amount > 0);
    }
    
    if (activeFilters.includes('free-shipping')) {
      result = result.filter(product => product.freeShipping);
    }
    
    if (activeFilters.includes('new-arrivals')) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      result = result.filter(product => new Date(product.createdAt || 0) > thirtyDaysAgo);
    }
    
    if (activeFilters.includes('best-sellers')) {
      result = result.filter(product => product.sales > 100);
    }

    // Aplicar nuevos filtros
    if (specialOffer) {
      result = result.filter(product => product.specialOffer);
    }

    if (newArrival) {
      result = result.filter(product => product.newArrival);
    }

    if (featuredBrand) {
      result = result.filter(product => product.featuredBrand);
    }

    if (freeShipping) {
      result = result.filter(product => product.freeShipping);
    }
    
    // Aplicar ordenamiento
    switch (sortOption) {
      case 'most-popular':
        result.sort((a, b) => b.sales - a.sales);
        break;
      case 'low-price':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'high-price':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        break;
    }
    
    // console.log(`Total de productos filtrados: ${result.length}`);
    return result;
  }, [products, selectedCategory, selectedSubcategory, selectedWoodType, priceRange, sortOption, activeFilters, specialOffer, newArrival, featuredBrand, freeShipping]);

  // Calcular productos filtrados usando useMemo para evitar recálculos innecesarios
  const filteredProducts = useMemo(() => {
    return applyFilters() || [];
  }, [applyFilters]);

  // Actualizar subcategorías cuando cambia la categoría seleccionada
  useEffect(() => {
    if (selectedCategory) {
      const newSubcategories = getSubcategoriesForCategory(selectedCategory);
      
      // Si la subcategoría actual no está en las nuevas subcategorías, resetearla
      if (selectedSubcategory && !newSubcategories.includes(selectedSubcategory)) {
        _setSelectedSubcategory(null);
      }
    }

    // Normalizar comparación de categoría "Maderas"
    const esCategoriaMaderas = (selectedCategory || '').toLowerCase() === 'maderas';

    // Resetear tipo de madera si la categoría no es "Maderas"
    if (!esCategoriaMaderas) {
      if (selectedWoodType) _setSelectedWoodType(null);
      return;
    }

    // Si la categoría es "Maderas", validar el tipo solo cuando haya productos cargados y tipos disponibles
    const woods = getWoodTypesForCategory('Maderas');
    if (!products.length || woods.length === 0) {
      // Evita limpiar prematuramente antes de cargar productos/tipos
      return;
    }
    if (selectedWoodType) {
      const woodsLower = woods.map(w => w.toLowerCase());
      if (!woodsLower.includes(selectedWoodType.toLowerCase())) {
        _setSelectedWoodType(null);
      }
    }
  }, [selectedCategory, selectedSubcategory, selectedWoodType, products, getSubcategoriesForCategory, getWoodTypesForCategory]);

  // Aplicar filtros automáticamente cuando cambian los valores
  useEffect(() => {
    applyFilters();
  }, [selectedCategory, selectedSubcategory, selectedWoodType, sortOption, activeFilters]);

  // Funciones mejoradas para cambiar categoría y subcategoría
  const setSelectedCategory = useCallback((category: string | null) => {
    _setSelectedCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const setSelectedSubcategory = useCallback((subcategory: string | null) => {
    _setSelectedSubcategory(subcategory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const setSelectedWoodType = useCallback((wood: string | null) => {
    _setSelectedWoodType(wood);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Función mejorada para cambiar el ordenamiento
  const setSortOption = useCallback((option: SortOption) => {
    _setSortOption(option);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Función mejorada para alternar filtros
  const toggleFilter = useCallback((filter: string) => {
    _setActiveFilters(prev => {
      const newFilters = prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter];
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return newFilters;
    });
  }, []);

  const value = {
    products,
    filteredProducts,
    loading,
    error,
    categories,
    subcategories,
    priceRange,
    selectedCategory,
    selectedSubcategory,
    selectedWoodType,
    sortOption,
    activeFilters,
    specialOffer,
    newArrival,
    featuredBrand,
    freeShipping,
    setProducts,
    setSelectedCategory,
    setSelectedSubcategory,
    setSelectedWoodType,
    setPriceRange,
    setSortOption,
    toggleFilter,
    applyFilters,
    getSubcategoriesForCategory,
    getWoodTypesForCategory,
    setSpecialOffer,
    setNewArrival,
    setFeaturedBrand,
    setFreeShipping,
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}; 
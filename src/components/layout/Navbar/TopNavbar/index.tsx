"use client";

import { cn } from "@/lib/utils";
import { satoshi, integralCF } from "@/styles/fonts";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { NavMenu } from "../navbar.types";
import { MenuList } from "./MenuList";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { MenuItem } from "./MenuItem";
import Image from "next/image";
import InputGroup from "@/components/ui/input-group";
import ResTopNavbar from "./ResTopNavbar";
import CartBtn from "./CartBtn";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, ChevronDown, Clock, Search as SearchIcon, X, User } from "lucide-react";
import { useCart } from "@/lib/hooks/useCart";
import { getLocalCart, getLocalCartCount } from "@/utils/cartUtils";
import { useFilter } from '@/context/FilterContext';
import { Product } from '@/types/product';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ProductImage } from '@/components/ui/ProductImage'
import { useAuth } from '@/context/AuthContext';

const data: NavMenu = [
  {
    id: 1,
    label: "Tienda",
    type: "MenuList",
    children: [
      {
        id: 10,
        label: "Pino",
        url: "/shop?madera=pino",
        description: "Madera ligera y versátil, ideal para usos generales.",
      },
      {
        id: 11,
        label: "Eucalipto",
        url: "/shop?madera=eucalipto",
        description: "Resistente y estable, perfecta para estructuras.",
      },
      {
        id: 12,
        label: "Saligna",
        url: "/shop?madera=saligna",
        description: "Acabado prolijo y uniforme para proyectos finos.",
      },
      {
        id: 13,
        label: "Quebracho",
        url: "/shop?madera=quebracho",
        description: "Madera dura y de alta durabilidad para exterior.",
      },
      {
        id: 14,
        label: "Grandis",
        url: "/shop?madera=grandis",
        description: "Buena relación peso‑resistencia para carpintería.",
      },
      {
        id: 15,
        label: "Ferretería",
        url: "/shop?category=ferretería",
        description: "Accesorios y herrajes para tus proyectos.",
      },
    ],
  },
  {
    id: 2,
    type: "MenuItem",
    label: "Nosotros",
    url: "/#nosotros",
    children: [],
  },
  {
    id: 3,
    label: "Proyectos",
    type: "MenuList",
    children: [
      {
        id: 30,
        label: "Cocinas Modernas",
        url: "/proyectos/cocinas-modernas",
        description: "Diseño y fabricación de cocinas a medida.",
      },
      {
        id: 31,
        label: "Decks Exteriores",
        url: "/proyectos/decks-exteriores",
        description: "Construcción de decks y terrazas de madera.",
      },
      {
        id: 32,
        label: "Muebles a Medida",
        url: "/proyectos/muebles-medida",
        description: "Mobiliario personalizado para tu hogar u oficina.",
      },
      {
        id: 33,
        label: "Ver Todos",
        url: "/proyectos",
        description: "Explora todos nuestros proyectos y servicios.",
      },
    ],
  },
  {
    id: 4,
    type: "MenuItem",
    label: "Obras",
    url: "/#obras",
    children: [],
  },
  {
    id: 5,
    type: "MenuItem",
    label: "Donde estamos",
    url: "/#ubicacion",
    children: [],
  },
];

const DropdownContent = motion(DropdownMenu.Content);
const MAX_RECENT_SEARCHES = 5;

const SearchModal = ({
  isOpen,
  onClose,
  searchTerm,
  setSearchTerm,
  filteredProducts,
  isSearchLoading,
  recentSearches,
  removeFromRecentSearches,
  handleNavigation,
  addToRecentSearches
}: {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredProducts: Product[];
  isSearchLoading: boolean;
  recentSearches: string[];
  removeFromRecentSearches: (term: string) => void;
  handleNavigation: (url: string) => void;
  addToRecentSearches: (term: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleProductSelection = async (url: string, term: string) => {
    setIsNavigating(true);
    try {
      addToRecentSearches(term);
      await handleNavigation(url);
    } finally {
      setIsNavigating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="fixed inset-0 bg-white z-[100] flex flex-col"
        >
          {/* Overlay de carga */}
          <AnimatePresence>
            {isNavigating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/90 z-10 flex items-center justify-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  className="w-12 h-12 border-3 border-black/10 border-t-black border-r-black rounded-full"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cabecera */}
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 border-b border-black/10"
          >
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <InputGroup className="bg-black/5">
                  <InputGroup.Text>
                    <SearchIcon className="w-5 h-5 text-black/60" />
                  </InputGroup.Text>
                  <InputGroup.Input
                    ref={inputRef}
                    type="search"
                    name="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar bebidas, categorías, marcas..."
                    className="bg-transparent placeholder:text-black/40"
                    autoComplete="off"
                    disabled={isNavigating}
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60 transition-colors"
                      disabled={isNavigating}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </InputGroup>
              </div>
              <button 
                onClick={onClose}
                className="text-black/60 hover:text-black transition-colors px-2 py-1"
                disabled={isNavigating}
              >
                Cancelar
              </button>
            </div>
          </motion.div>

          {/* Cuerpo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1 overflow-y-auto"
          >
            {!searchTerm ? (
              <div className="p-4">
                <h3 className="text-sm font-medium text-black/80 mb-3">Búsquedas recientes</h3>
                {recentSearches.length > 0 ? (
                  <div className="space-y-2">
                    {recentSearches.map((term) => (
                      <motion.div 
                        key={term}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-between"
                      >
                        <button
                          onClick={() => setSearchTerm(term)}
                          className="flex items-center gap-3 text-black/80 hover:text-black transition-colors py-2 w-full text-left"
                          disabled={isNavigating}
                        >
                          <Clock className="w-4 h-4 text-black/40 flex-shrink-0" />
                          <span className="truncate">{term}</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromRecentSearches(term);
                          }}
                          className="p-1 text-black/30 hover:text-black/60 transition-colors"
                          disabled={isNavigating}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-black/40 text-sm">No hay búsquedas recientes</p>
                )}
              </div>
            ) : isSearchLoading ? (
              <div className="flex justify-center items-center h-32">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-6 h-6 border-2 border-black/10 border-t-black/60 rounded-full"
                />
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="divide-y divide-black/5">
                {filteredProducts.map((product) => (
                  <motion.button
                    key={product.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      handleProductSelection(
                        `/shop/product/${product.id}/${encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, '-'))}`,
                        searchTerm
                      );
                    }}
                    className="w-full flex items-center gap-3 p-4 hover:bg-black/5 active:bg-black/10 transition-colors"
                    disabled={isNavigating}
                  >
                    <div className="relative w-12 h-12 rounded overflow-hidden bg-black/5 flex-shrink-0">
                      <ProductImage
                        src={product.images[0] || '/placeholder.png'}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="rounded-md"
                        variant="search"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-black truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-black/60 mt-0.5 truncate">
                        {product.category}
                        {product.subcategory && ` • ${product.subcategory}`}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-sm font-medium text-black">
                        ${product.price.toLocaleString()}
                      </span>
                    </div>
                  </motion.button>
                ))}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleProductSelection(
                      `/shop?search=${encodeURIComponent(searchTerm)}`,
                      searchTerm
                    );
                  }}
                  className="w-full py-3 text-center text-sm font-medium text-black/80 hover:text-black transition-colors"
                  disabled={isNavigating}
                >
                  Ver todos los resultados para "{searchTerm}"
                </motion.button>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-32 text-black/40"
              >
                <SearchIcon className="w-6 h-6 mb-2" />
                <p>No se encontraron resultados</p>
                <p className="text-xs mt-1">"{searchTerm}"</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const TopNavbar = () => {
  const { user, signOut, isLoading } = useAuth();
  const { cart, loading: cartLoading, totalQuantity } = useCart();
  const [localCartCount, setLocalCartCount] = useState(getLocalCartCount());
  const { products } = useFilter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isRouting, setIsRouting] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = `${pathname}${searchParams && searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('recentSearches') || '[]');
    }
    return [];
  });

  useEffect(() => {
    const handleCartUpdate = () => {
      const newTotal = getLocalCartCount();
      setLocalCartCount(newTotal);
    };

    window.addEventListener("cartUpdate", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdate", handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    if (isMobileSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileSearchOpen]);

  const addToRecentSearches = (term: string) => {
    if (!term.trim()) return;
    
    const updated = [
      term,
      ...recentSearches.filter(item => item !== term)
    ].slice(0, MAX_RECENT_SEARCHES);
    
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const removeFromRecentSearches = (term: string) => {
    const updated = recentSearches.filter(item => item !== term);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts([]);
      return;
    }

    setIsSearchLoading(true);
    const timer = setTimeout(() => {
      const searchResults = products
        .filter(product => {
          const searchLower = searchTerm.toLowerCase();
          return (
            product.name.toLowerCase().includes(searchLower) ||
            product.category.toLowerCase().includes(searchLower) ||
            product.subcategory?.toLowerCase().includes(searchLower)
          );
        })
        .slice(0, 5);

      setFilteredProducts(searchResults);
      setIsSearchLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, products]);

  const handleNavigation = async (url: string) => {
    try {
      setIsRouting(true);
      await router.push(url);
      setIsMobileSearchOpen(false);
      setSearchTerm('');
      setIsSearchOpen(false);
    } catch (error) {
      console.error('Error durante la navegación:', error);
    } finally {
      setIsRouting(false);
    }
  };

  const totalItems = user ? totalQuantity : localCartCount;

  return (
    <nav className="sticky top-0 bg-white z-20 border-b border-black/10">
      <div className="flex relative max-w-frame mx-auto items-center justify-between md:justify-start py-4 md:py-5 px-4 xl:px-0">
        <div className="flex items-center">
          <div className="block md:hidden mr-4">
            <ResTopNavbar data={data} />
          </div>
          <Link
            href="/"
            className={cn([
              integralCF.className,
              "text-2xl lg:text-[32px] mb-1 mr-3 lg:mr-10 text-black text-center",
            ])}
          >
            BAÚL <br /> DE MODA
          </Link>
        </div>

        <NavigationMenu className="hidden md:flex mr-2 lg:mr-7">
          <NavigationMenuList>
            {data.map((item) => (
              <React.Fragment key={item.id}>
                {item.type === "MenuItem" && (
                  <MenuItem label={item.label} url={item.url} />
                )}
                {item.type === "MenuList" && (
                  <MenuList data={item.children} label={item.label} />
                )}
              </React.Fragment>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div ref={searchRef} className="hidden md:block relative flex-1 max-w-xl">
          <InputGroup className="bg-black/5 mr-3 lg:mr-10">
            <InputGroup.Text>
              <SearchIcon className="w-5 h-5 text-black/60" />
            </InputGroup.Text>
            <InputGroup.Input
              type="search"
              name="search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Buscar bebidas, categorías, marcas..."
              className="bg-transparent placeholder:text-black/40"
            />
          </InputGroup>

          {isSearchOpen && filteredProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-black/10 overflow-hidden"
            >
              <div className="py-1">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/shop/product/${product.id}/${encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, '-'))}`}
                    onClick={() => {
                      setSearchTerm('');
                      setIsSearchOpen(false);
                    }}
                    className="block px-4 py-3 flex items-center gap-3 hover:bg-black/5 transition-colors"
                  >
                    <div className="relative w-10 h-10 rounded overflow-hidden bg-black/5 flex-shrink-0">
                      <ProductImage
                        src={product.images[0] || '/placeholder.png'}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="rounded-md"
                        variant="search"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-black truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-black/60 truncate">
                        {product.category}
                        {product.subcategory && ` • ${product.subcategory}`}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-sm font-medium text-black">
                        ${product.price.toLocaleString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileSearchOpen(true)}
            className="p-1.5 md:hidden text-black/60 hover:text-black transition-colors"
          >
            <SearchIcon className="w-5 h-5" />
          </button>

          <SearchModal
            isOpen={isMobileSearchOpen}
            onClose={() => {
              setIsMobileSearchOpen(false);
              setSearchTerm('');
            }}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredProducts={filteredProducts}
            isSearchLoading={isSearchLoading}
            recentSearches={recentSearches}
            removeFromRecentSearches={removeFromRecentSearches}
            handleNavigation={handleNavigation}
            addToRecentSearches={addToRecentSearches}
          />

          {cartLoading ? (
            <div className="w-6 h-6 border-2 border-black/10 border-t-black/60 rounded-full animate-spin" />
          ) : (
            <CartBtn totalItems={totalItems} />
          )}

          {user ? (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-1 p-1 group rounded-full hover:scale-105 transition-transform focus:outline-none">
                  {false ? (
                    <Image
                      src={"/placeholder.png"}
                      alt={String(user?.email || "avatar")}
                      width={36}
                      height={36}
                      className="rounded-full border border-black/10 group-hover:ring-2 group-hover:ring-black/10 transition-all"
                    />
                  ) : (
                    <span className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 text-black font-bold text-lg">
                      {(user?.email || 'U').slice(0,1).toUpperCase()}
                    </span>
                  )}
                  <ChevronDown className="text-black/60 w-4 h-4 group-hover:rotate-180 transition-transform" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  sideOffset={8}
                  className="z-40 w-48 rounded-lg bg-white shadow-lg border border-black/10 p-1 text-sm"
                >
                  <DropdownMenu.Item asChild>
                    <Link
                      href="/account"
                      className="flex items-center gap-2 px-3 py-2 hover:bg-black/5 rounded-md transition-colors duration-150"
                    >
                      <User className="w-4 h-4" />
                      Mi cuenta
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link
                      href="/orders"
                      className="flex items-center gap-2 px-3 py-2 hover:bg-black/5 rounded-md transition-colors duration-150"
                    >
                      <Image src="/icons/orders.svg" alt="orders" width={20} height={20} />
                      Mis Pedidos
                    </Link>
                  </DropdownMenu.Item>
                  
                  <DropdownMenu.Separator className="h-px my-1 bg-black/10" />
                  <DropdownMenu.Item
                    onSelect={() => signOut()}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-black/5 rounded-md cursor-pointer text-black/80 transition-colors duration-150"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          ) : (
            <Link
              href={`/login?redirect=${encodeURIComponent(currentUrl || '/')}`}
              className="p-1 rounded-full hover:scale-105 transition-transform"
            >
              <Image
                priority
                src="/icons/user.svg"
                height={24}
                width={24}
                alt="user"
                className="max-w-[22px] max-h-[22px] text-black/60"
              />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
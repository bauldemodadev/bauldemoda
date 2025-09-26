"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { NavMenu } from "../navbar.types";
import Image from "next/image";
import ResTopNavbar from "./ResTopNavbar";
import CartBtn from "./CartBtn";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogOut, ChevronDown, User } from "lucide-react";
import { useCart } from "@/lib/hooks/useCart";
import { getLocalCartCount } from "@/utils/cartUtils";
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const data: NavMenu = [
  {
    id: 1,
    type: "MenuItem",
    label: "INICIO",
    url: "/",
    children: [],
  },
  {
    id: 2,
    type: "MenuItem",
    label: "TIENDA",
    url: "/shop",
    children: [],
  },
  {
    id: 3,
    type: "MenuItem",
    label: "TIPS",
    url: "/tips",
    children: [],
  },
  {
    id: 4,
    type: "MenuItem",
    label: "COMUNIDAD",
    url: "/comunidad",
    children: [],
  },
  {
    id: 5,
    type: "MenuItem",
    label: "BAULERAS",
    url: "/bauleras",
    children: [],
  },
  {
    id: 6,
    type: "MenuItem",
    label: "CONTACTO",
    url: "/contacto",
    children: [],
  },
];


const TopNavbar = () => {
  const { user, signOut, isLoading } = useAuth();
  const { cart, loading: cartLoading, totalQuantity } = useCart();
  const [localCartCount, setLocalCartCount] = useState(getLocalCartCount());
  const pathname = usePathname();

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

  const totalItems = user ? totalQuantity : localCartCount;

  return (
    <nav className="sticky top-0 bg-pink-100 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.svg"
                alt="Baúl de Moda"
                width={120}
                height={40}
                className="h-8 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Navegación central */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {data.map((item) => (
                <Link
                  key={item.id}
                  href={item.url || '/'}
                  className={cn(
                    "text-sm font-medium transition-colors duration-200",
                    pathname === item.url 
                      ? "text-pink-600" 
                      : "text-gray-700 hover:text-pink-600"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Lado derecho - Redes sociales, carrito y login */}
          <div className="flex items-center space-x-4">
            {/* Iconos de redes sociales */}
            <div className="hidden md:flex items-center space-x-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 hover:text-pink-600 hover:border-pink-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 hover:text-pink-600 hover:border-pink-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 hover:text-pink-600 hover:border-pink-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.297c-.49 0-.875-.385-.875-.875s.385-.875.875-.875.875.385.875.875-.385.875-.875.875z"/>
                </svg>
              </a>
            </div>

            {/* Carrito */}
            {cartLoading ? (
              <div className="w-6 h-6 border-2 border-gray-400 border-t-pink-600 rounded-full animate-spin" />
            ) : (
              <CartBtn totalItems={totalItems} />
            )}

            {/* Botón de login */}
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
                        className="rounded-full border border-gray-400 group-hover:ring-2 group-hover:ring-pink-600 transition-all"
                      />
                    ) : (
                      <span className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold text-lg">
                        {(user?.email || 'U').slice(0,1).toUpperCase()}
                      </span>
                    )}
                    <ChevronDown className="text-gray-600 w-4 h-4 group-hover:rotate-180 transition-transform" />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    sideOffset={8}
                    className="z-40 w-48 rounded-lg bg-white shadow-lg border border-gray-200 p-1 text-sm"
                  >
                    <DropdownMenu.Item asChild>
                      <Link
                        href="/account"
                        className="flex items-center gap-2 px-3 py-2 hover:bg-pink-50 rounded-md transition-colors duration-150"
                      >
                        <User className="w-4 h-4" />
                        Mi cuenta
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <Link
                        href="/orders"
                        className="flex items-center gap-2 px-3 py-2 hover:bg-pink-50 rounded-md transition-colors duration-150"
                      >
                        <Image src="/icons/orders.svg" alt="orders" width={20} height={20} />
                        Mis Pedidos
                      </Link>
                    </DropdownMenu.Item>
                    
                    <DropdownMenu.Separator className="h-px my-1 bg-gray-200" />
                    <DropdownMenu.Item
                      onSelect={() => signOut()}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-pink-50 rounded-md cursor-pointer text-gray-700 transition-colors duration-150"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar sesión
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            ) : (
              <Link
                href={`/login?redirect=${encodeURIComponent(pathname || '/')}`}
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <span>ACCEDER</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>

          {/* Menú móvil */}
          <div className="md:hidden">
            <ResTopNavbar data={data} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
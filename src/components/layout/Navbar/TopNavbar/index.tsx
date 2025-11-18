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
    children: [
      { id: 21, label: "CURSOS ONLINE", url: "/shop/categoria/cursos-online" },
      { id: 22, label: "CURSOS CIUDAD JARDÍN", url: "/shop/categoria/cursos-ciudad-jardin" },
      { id: 23, label: "CURSOS ALMAGRO", url: "/shop/categoria/cursos-almagro" },
      { id: 24, label: "PRODUCTOS Y SERVICIOS", url: "/shop/categoria/productos-servicios" },
      { id: 25, label: "TODOS", url: "/tienda" },
    ],
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
    <nav className="sticky top-0 bg-pink-50 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.svg"
                alt="Baúl de Moda"
                width={300}
                height={80}
                className="h-16 w-auto"
                priority
              />
            </Link>
        </div>

          {/* Navegación central */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
            {data.map((item) => (
              item.children && item.children.length > 0 ? (
                <DropdownMenu.Root key={item.id}>
                  <DropdownMenu.Trigger asChild>
                    <button
                      className={cn(
                        "text-sm font-semibold uppercase tracking-wide transition-colors duration-200 flex items-center gap-1",
                        pathname === item.url 
                          ? "text-pink-700" 
                          : "text-gray-800 hover:text-pink-700"
                      )}
                    >
                      {item.label}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      sideOffset={8}
                      className="z-40 w-56 rounded-lg bg-white shadow-lg border border-gray-200 p-1 text-sm"
                    >
                      {item.children.map((child) => (
                        <DropdownMenu.Item key={child.id} asChild>
                          <Link
                            href={child.url || '/'}
                            className="flex items-center px-3 py-2 text-pink-600 hover:bg-pink-50 rounded-md transition-colors duration-150 font-medium"
                          >
                            {child.label}
                          </Link>
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              ) : (
                <Link
                  key={item.id}
                  href={item.url || '/'}
                  className={cn(
                    "text-sm font-semibold uppercase tracking-wide transition-colors duration-200",
                    pathname === item.url 
                      ? "text-pink-700" 
                      : "text-gray-800 hover:text-pink-700"
                  )}
                >
                  {item.label}
                </Link>
              )
            ))}
              </div>
        </div>

          {/* Lado derecho - Redes sociales, carrito y login */}
          <div className="flex items-center space-x-3">
            {/* Iconos de redes sociales */}
            <div className="hidden md:flex items-center space-x-2">
              <a
                href="https://facebook.com/bauldemoda"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:text-gray-900 hover:border-gray-500 hover:bg-gray-50 transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com/@bauldemoda"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:text-gray-900 hover:border-gray-500 hover:bg-gray-50 transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com/bauldemoda"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:text-gray-900 hover:border-gray-500 hover:bg-gray-50 transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
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
                className="bg-pink-300 hover:bg-pink-400 text-white px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wide transition-colors duration-200 flex items-center gap-2"
              >
                <span>ACCEDER</span>
                <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                  <svg className="w-3 h-3 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
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
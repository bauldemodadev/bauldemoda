'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  BookOpen, 
  Lightbulb, 
  Users, 
  ShoppingCart,
  Image,
  MessageCircle,
  Store
} from 'lucide-react';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/cursos-online', label: 'Cursos Online', icon: BookOpen },
  { href: '/admin/tips', label: 'Tips', icon: Lightbulb },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
  { href: '/admin/ventas', label: 'Ventas', icon: ShoppingCart },
  { href: '/admin/banners', label: 'Banners', icon: Image },
  { href: '/admin/comunidad', label: 'Comunidad', icon: MessageCircle },
  { href: '/admin/baulera', label: 'Baulera', icon: Store },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const previousPathnameRef = useRef<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  // Mostrar overlay con un pequeño delay para evitar que capture el clic del botón
  useEffect(() => {
    if (isOpen) {
      // Retrasar la aparición del overlay para que el botón pueda manejar el evento primero
      const timer = setTimeout(() => {
        setShowOverlay(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setShowOverlay(false);
    }
  }, [isOpen]);

  // Cerrar sidebar solo cuando cambia la ruta en mobile
  // IMPORTANTE: Este efecto SOLO se ejecuta cuando cambia pathname, NO cuando cambia isOpen
  useEffect(() => {
    // Ignorar la primera renderización (cuando previousPathnameRef.current es null)
    if (previousPathnameRef.current === null) {
      previousPathnameRef.current = pathname;
      return;
    }

    // Solo cerrar si el pathname realmente cambió
    const pathnameChanged = previousPathnameRef.current !== pathname;
    
    if (pathnameChanged) {
      // Solo cerrar si estamos en mobile y el sidebar está abierto
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
      if (isMobile && isOpen && onClose) {
        onClose();
      }
      // Actualizar el pathname anterior
      previousPathnameRef.current = pathname;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]); // SOLO pathname en las dependencias - leemos isOpen y onClose pero no queremos que se ejecute cuando cambian

  // Prevenir scroll del body cuando el sidebar está abierto en mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay para mobile - se muestra con un pequeño delay para evitar conflictos */}
      {isOpen && showOverlay && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[40] lg:hidden transition-opacity duration-200"
          onClick={(e) => {
            // Solo cerrar si el click es directamente en el overlay
            if (e.target === e.currentTarget && onClose) {
              onClose();
            }
          }}
          onTouchEnd={(e) => {
            // Usar onTouchEnd para evitar conflictos con otros eventos
            if (e.target === e.currentTarget && onClose) {
              onClose();
            }
          }}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`
          fixed lg:fixed inset-y-0 left-0 z-[50] lg:z-auto
          w-64 bg-white border-r border-gray-200
          lg:shadow-[0_2px_8px_rgba(0,0,0,0.04)]
          transform transition-all duration-300 ease-out
          ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0 lg:shadow-[0_2px_8px_rgba(0,0,0,0.04)]'}
          lg:h-[calc(100vh-64px)] lg:top-16
        `}
        role="navigation"
        aria-label="Menu de navegación"
      >
        <div className="h-full flex flex-col overflow-y-auto overflow-x-hidden">

          <nav className="mt-2 flex-1 px-2 py-3">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              // Lógica mejorada para determinar si un item está activo
              // Solo activar si es exactamente igual o es una subruta (pero no activar /admin cuando estás en /admin/productos)
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname.startsWith(item.href + '/'));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    // Cerrar sidebar en mobile al hacer clic
                    if (window.innerWidth < 1024 && isOpen) {
                      onClose?.();
                    }
                  }}
                    className={`
                    group flex items-center px-3 py-2.5 mb-1 text-sm font-medium rounded-lg
                    transition-all duration-200 ease-out touch-manipulation
                    ${isActive
                      ? 'bg-[#E9ABBD] text-white shadow-md shadow-[#D44D7D]/20'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                  style={{ 
                    fontFamily: 'var(--font-poppins)',
                    animationDelay: `${index * 30}ms`
                  }}
                >
                  <Icon className={`w-5 h-5 mr-3 flex-shrink-0 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white ml-auto" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}


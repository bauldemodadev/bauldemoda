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
  ShoppingCart 
} from 'lucide-react';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/cursos-online', label: 'Cursos Online', icon: BookOpen },
  { href: '/admin/tips', label: 'Tips', icon: Lightbulb },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
  { href: '/admin/ventas', label: 'Ventas', icon: ShoppingCart },
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
          w-64 bg-white shadow-xl lg:shadow-sm
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:h-[calc(100vh-64px)] lg:top-16
        `}
        role="navigation"
        aria-label="Menu de navegación"
      >
        <div className="h-full flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-poppins)' }}>Panel Admin</h1>
          </div>
          <nav className="mt-4 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              
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
                    flex items-center px-4 py-3 text-sm font-medium transition-colors touch-manipulation
                    ${isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}


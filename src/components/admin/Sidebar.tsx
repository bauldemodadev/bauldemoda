'use client';

import { useEffect } from 'react';
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

  // Cerrar sidebar cuando cambia la ruta en mobile
  useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      onClose?.();
    }
  }, [pathname, isOpen, onClose]);

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
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-white shadow-lg lg:shadow-sm
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:min-h-screen
        `}
      >
        <div className="h-full flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Panel Admin</h1>
          </div>
          <nav className="mt-4 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    // Cerrar sidebar en mobile al hacer clic
                    if (window.innerWidth < 1024) {
                      onClose?.();
                    }
                  }}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-[#E9ABBD] bg-opacity-10 text-[#D44D7D] border-r-2 border-[#D44D7D]'
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
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


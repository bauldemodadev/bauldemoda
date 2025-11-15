'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

interface AdminHeaderProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

export default function AdminHeader({ onMenuToggle, isMenuOpen }: AdminHeaderProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      // Eliminar cookie del servidor primero
      await fetch('/api/admin/auth', {
        method: 'DELETE',
        credentials: 'include',
      });

      // Cerrar sesión en Firebase
      if (auth) {
        await signOut(auth);
      }

      // Usar window.location para forzar recarga completa
      // Esto asegura que el servidor verifique la cookie eliminada
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Aún así, redirigir a login
      window.location.href = '/admin/login';
    }
  };

  // Cerrar menú de usuario cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu && !(event.target as Element).closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-[45] lg:z-50">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-3">
          {/* Botón de menú para mobile */}
          {onMenuToggle && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onMenuToggle) {
                  onMenuToggle();
                }
              }}
              onMouseDown={(e) => {
                // Prevenir que el evento se propague al overlay
                e.preventDefault();
                e.stopPropagation();
              }}
              onTouchStart={(e) => {
                // Prevenir que el evento se propague al overlay
                e.stopPropagation();
              }}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100 rounded-md transition-colors touch-manipulation -ml-1 relative z-[60]"
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMenuOpen}
              type="button"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          )}
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            <span className="hidden sm:inline">Administración</span>
            <span className="sm:hidden">Admin</span>
          </h2>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Información de usuario - ocultar en mobile muy pequeño */}
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span className="hidden md:inline">admin@admin.com</span>
          </div>
          {/* Botón de cerrar sesión - versión responsive */}
          <div className="relative user-menu-container">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="sm:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors touch-manipulation"
              aria-label="User menu"
              type="button"
            >
              <User className="w-5 h-5" />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-[60]">
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                  admin@admin.com
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                  type="button"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            type="button"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
}


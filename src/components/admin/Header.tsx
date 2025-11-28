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
    <header 
      className="bg-white/95 backdrop-blur-sm border-b border-gray-200/80 fixed top-0 left-0 right-0 z-[45] lg:z-50 shadow-sm" 
      style={{ fontFamily: 'var(--font-poppins)' }}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex items-center gap-3 lg:gap-4">
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
                e.preventDefault();
                e.stopPropagation();
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
              }}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-all duration-200 touch-manipulation -ml-1 relative z-[60] active:scale-95"
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMenuOpen}
              type="button"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 transition-transform duration-200" />
              ) : (
                <Menu className="w-5 h-5 transition-transform duration-200" />
              )}
            </button>
          )}
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 tracking-tight">
              <span className="hidden sm:inline">Panel Admin</span>
              <span className="sm:hidden">Admin</span>
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Información de usuario - ocultar en mobile muy pequeño */}
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-gray-50 text-sm text-gray-700">
            <div className="w-8 h-8 rounded-full bg-[#E9ABBD] flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="hidden md:inline font-medium">admin@admin.com</span>
          </div>
          {/* Botón de cerrar sesión - versión responsive */}
          <div className="relative user-menu-container">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="sm:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 touch-manipulation active:scale-95"
              aria-label="User menu"
              type="button"
            >
              <User className="w-5 h-5" />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200/80 py-2 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 text-sm font-medium text-gray-900 border-b border-gray-100">
                  admin@admin.com
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#D44D7D] transition-colors text-left rounded-lg mx-1"
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
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#D44D7D] hover:bg-gray-50 rounded-lg transition-all duration-200 active:scale-95"
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


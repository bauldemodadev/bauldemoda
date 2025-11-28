'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Componente cliente que verifica la autenticación del admin
 * y maneja redirecciones de forma más suave
 */
export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // No verificar si estamos en la página de login
    if (pathname === '/admin/login' || pathname?.startsWith('/admin/login')) {
      setIsChecking(false);
      setIsAuthenticated(true);
      return;
    }

    // Verificar autenticación
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });

        if (response.ok) {
          const data = await response.json();
          // Verificar que el email sea el admin
          if (data.email === 'admin@admin.com') {
            setIsAuthenticated(true);
          } else {
            // Usuario autenticado pero no es admin
            router.push('/admin/login');
          }
        } else {
          // Si no está autenticado, redirigir a login
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        router.push('/admin/login');
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Mostrar loading mientras se verifica
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E9ABBD] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no renderizar nada (ya se está redirigiendo)
  if (!isAuthenticated) {
    return null;
  }

  // Si está autenticado, renderizar el contenido
  return <>{children}</>;
}


'use client';

import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

export default function AdminHeader() {
  const router = useRouter();
  const { toast } = useToast();

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

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-gray-900">Administración</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>admin@admin.com</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}


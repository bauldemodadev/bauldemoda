import { ReactNode } from 'react';
import { verifyAdminAuth } from '@/lib/admin/auth';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';
import { Toaster } from '@/components/ui/toaster';
import QuillStyles from '@/components/admin/QuillStyles';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { poppins } from '@/styles/fonts';
import { cn } from '@/lib/utils';
import './admin.css';

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Obtener pathname desde headers (agregado por middleware)
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  // Si es la página de login, no verificar autenticación ni mostrar layout admin
  // Hacer esto ANTES de cualquier otra verificación para evitar renders innecesarios
  if (pathname === '/admin/login' || pathname.startsWith('/admin/login')) {
    // Para login, retornar solo los children sin layout admin
    // El layout de login ya maneja el Toaster
    return <>{children}</>;
  }

  // Para todas las demás rutas admin, verificar autenticación en el servidor
  // El middleware ya verificó que la cookie existe, aquí verificamos que el token sea válido
  // Verificar autenticación ANTES de renderizar cualquier cosa
  const email = await verifyAdminAuth();
  
  if (!email) {
    // Si no está autenticado (cookie no válida o token inválido), redirigir a login
    // redirect() debe ser llamado directamente sin try-catch para que Next.js lo maneje correctamente
    redirect('/admin/login');
  }

  // Si llegamos aquí, el usuario está autenticado en el servidor
  // Renderizar directamente el layout admin
  return (
    <div className={cn("min-h-screen bg-gray-50", poppins.variable)}>
      <QuillStyles />
      <AdminLayoutClient>
        {children}
      </AdminLayoutClient>
      <Toaster />
    </div>
  );
}

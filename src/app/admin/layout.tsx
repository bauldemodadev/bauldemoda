import { ReactNode } from 'react';
import { requireAdminAuth } from '@/lib/admin/auth';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';
import { Toaster } from '@/components/ui/toaster';
import QuillStyles from '@/components/admin/QuillStyles';
import { headers } from 'next/headers';

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
    return <>{children}</>;
  }

  // Para todas las demás rutas admin, verificar autenticación en el servidor
  // Esto redirigirá inmediatamente a /admin/login si no está autenticado
  // La verificación debe hacerse FUERA de cualquier Suspense para que la redirección
  // ocurra antes de renderizar cualquier contenido
  await requireAdminAuth();

  // Si llegamos aquí, el usuario está autenticado en el servidor
  // Renderizar directamente el layout admin
  return (
    <div className="min-h-screen bg-gray-50">
      <QuillStyles />
      <AdminLayoutClient>
        {children}
      </AdminLayoutClient>
      <Toaster />
    </div>
  );
}

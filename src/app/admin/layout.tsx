import { ReactNode } from 'react';
import { requireAdminAuth } from '@/lib/admin/auth';
import AdminSidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/Header';
import { Toaster } from '@/components/ui/toaster';
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
  if (pathname === '/admin/login' || pathname.startsWith('/admin/login')) {
    return <>{children}</>;
  }

  // Para todas las demás rutas admin, verificar autenticación
  await requireAdminAuth();

  // Si llegamos aquí, el usuario está autenticado
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}


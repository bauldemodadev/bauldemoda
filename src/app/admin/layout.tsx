import { ReactNode } from 'react';
import { requireAdminAuth } from '@/lib/admin/auth';
import AdminSidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/Header';
import { Toaster } from '@/components/ui/toaster';
import QuillStyles from '@/components/admin/QuillStyles';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';
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

  // Para todas las demás rutas admin, verificar autenticación en el servidor
  // Esto puede redirigir si no está autenticado
  try {
    await requireAdminAuth();
  } catch (error) {
    // Si hay un error de redirección, dejar que Next.js lo maneje
    // El redirect() lanza un error especial que Next.js captura
    throw error;
  }

  // Si llegamos aquí, el usuario está autenticado en el servidor
  // Usar AdminAuthGuard para verificación adicional en el cliente
  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-gray-50">
        <QuillStyles />
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
        <Toaster />
      </div>
    </AdminAuthGuard>
  );
}

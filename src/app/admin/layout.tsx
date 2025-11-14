import { ReactNode } from 'react';
import { requireAdminAuth } from '@/lib/admin/auth';
import AdminSidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/Header';
import { Toaster } from '@/components/ui/toaster';

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Verificar autenticación (redirige a /admin/login si no está autenticado)
  // La página de login tiene su propio layout que no requiere auth
  try {
    await requireAdminAuth();
  } catch (error) {
    // Si falla la autenticación, requireAdminAuth ya redirige a /admin/login
    // Pero si estamos en /admin/login, no deberíamos llegar aquí
    // Por seguridad, retornamos children para que Next.js maneje la redirección
    return <>{children}</>;
  }

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


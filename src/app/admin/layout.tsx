import { ReactNode, Suspense } from 'react';
import { requireAdminAuth } from '@/lib/admin/auth';
import AdminSidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/Header';
import { Toaster } from '@/components/ui/toaster';
import QuillStyles from '@/components/admin/QuillStyles';
import { headers } from 'next/headers';

// Componente de loading
function AdminLayoutLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#E9ABBD] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando panel de administración...</p>
      </div>
    </div>
  );
}

// Componente que verifica autenticación
async function AdminLayoutContent({ children, pathname }: { children: ReactNode; pathname: string }) {
  // Si es la página de login, no verificar autenticación ni mostrar layout admin
  if (pathname === '/admin/login' || pathname.startsWith('/admin/login')) {
    return <>{children}</>;
  }

  // Para todas las demás rutas admin, verificar autenticación en el servidor
  // Esto puede redirigir si no está autenticado
  await requireAdminAuth();

  // Si llegamos aquí, el usuario está autenticado en el servidor
  // Renderizar directamente el layout admin
  return (
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
  );
}

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Obtener pathname desde headers (agregado por middleware)
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  // Usar Suspense para manejar mejor la carga
  return (
    <Suspense fallback={<AdminLayoutLoading />}>
      <AdminLayoutContent pathname={pathname}>
        {children}
      </AdminLayoutContent>
    </Suspense>
  );
}

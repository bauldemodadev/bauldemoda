import { ReactNode } from 'react';
import { Toaster } from '@/components/ui/toaster';

// Layout separado para login que no requiere autenticación
export default function AdminLoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}


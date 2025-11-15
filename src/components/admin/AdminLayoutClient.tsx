'use client';

import { useState, useCallback } from 'react';
import AdminSidebar from './Sidebar';
import AdminHeader from './Header';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <>
      <AdminHeader onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />
      <div className="flex flex-col lg:flex-row relative">
        <AdminSidebar isOpen={isMenuOpen} onClose={closeMenu} />
        <main className="flex-1 p-4 sm:p-6 lg:p-6 w-full min-w-0 overflow-x-auto">
          {children}
        </main>
      </div>
    </>
  );
}


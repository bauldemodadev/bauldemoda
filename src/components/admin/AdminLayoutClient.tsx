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
    <div className="admin-container min-h-screen bg-gray-50/50">
      <AdminHeader onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />
      <div className="flex flex-col lg:flex-row relative" style={{ marginTop: '64px', height: 'calc(100vh - 64px)' }}>
        <AdminSidebar isOpen={isMenuOpen} onClose={closeMenu} />
        <main 
          className="flex-1 p-4 sm:p-6 lg:p-8 w-full min-w-0 overflow-y-auto overflow-x-hidden lg:ml-64 scroll-smooth" 
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          <div className="mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}


'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  BookOpen, 
  Lightbulb, 
  Users, 
  ShoppingCart 
} from 'lucide-react';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/cursos-online', label: 'Cursos Online', icon: BookOpen },
  { href: '/admin/tips', label: 'Tips', icon: Lightbulb },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
  { href: '/admin/ventas', label: 'Ventas', icon: ShoppingCart },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-sm min-h-screen">
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-900">Panel Admin</h1>
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-pink-50 text-pink-700 border-r-2 border-pink-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}


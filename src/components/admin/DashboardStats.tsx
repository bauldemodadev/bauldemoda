/**
 * Componente: Dashboard con Estadísticas
 * 
 * Muestra estadísticas del dashboard con filtrado por sede
 */

'use client';

import { useEffect, useState } from 'react';
import {
  Package,
  BookOpen,
  Lightbulb,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  Banknote,
  RefreshCw,
  BarChart3,
} from 'lucide-react';

interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  pendingOrders: number;
  approvedOrders: number;
  rejectedOrders: number;
  totalProducts: number;
  topProducts: Array<{
    productId: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  recentOrders: number;
  paymentMethods: {
    mp: number;
    cash: number;
    transfer: number;
    other: number;
  };
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
}

interface DashboardStatsResponse {
  stats: DashboardStats;
  sede: 'almagro' | 'ciudad-jardin' | null;
  adminSede: 'almagro' | 'ciudad-jardin' | null;
  isGlobal: boolean;
}

const formatCurrency = (amount: number) => {
  if (amount % 1 === 0) {
    return amount.toLocaleString('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
  return amount.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sedeFilter, setSedeFilter] = useState<'almagro' | 'ciudad-jardin' | 'global'>('global');
  const [adminSede, setAdminSede] = useState<'almagro' | 'ciudad-jardin' | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    loadStats();
  }, [sedeFilter]);

  const loadStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const sedeParam = sedeFilter === 'global' ? 'global' : sedeFilter;
      const response = await fetch(`/api/admin/stats?sede=${sedeParam}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar estadísticas');
      }

      const data: DashboardStatsResponse = await response.json();
      setStats(data.stats);
      
      // Solo establecer adminSede en la primera carga
      if (!initialized) {
        setAdminSede(data.adminSede);
        setInitialized(true);
        
        // Si el admin tiene una sede y el filtro es 'global', cambiar a su sede
        if (data.adminSede && sedeFilter === 'global') {
          setSedeFilter(data.adminSede);
          return; // Retornar para evitar doble carga
        }
      }
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
      setError('No se pudieron cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const handleSedeChange = (newSede: 'almagro' | 'ciudad-jardin' | 'global') => {
    setSedeFilter(newSede);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D44D7D]"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 mb-4">{error || 'Error al cargar estadísticas'}</p>
        <button
          onClick={loadStats}
          className="px-6 py-2 bg-[#E9ABBD] text-white rounded-lg hover:bg-[#D44D7D] transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Determinar si mostrar el switch
  const showSwitch = adminSede !== null; // Solo mostrar si el admin tiene una sede específica

  const statCards = [
    {
      title: 'Ventas Totales',
      value: stats.totalSales,
      icon: ShoppingCart,
      color: 'pink',
      gradient: 'from-[#E9ABBD] to-[#D44D7D]',
      bgGradient: 'from-[#E9ABBD]/10 to-[#D44D7D]/5',
      suffix: 'órdenes',
    },
    {
      title: 'Ingresos Totales',
      value: `$${formatCurrency(stats.totalRevenue)}`,
      icon: DollarSign,
      color: 'emerald',
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100/50',
      suffix: '',
    },
    {
      title: 'Productos Activos',
      value: stats.totalProducts,
      icon: Package,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100/50',
      suffix: 'productos',
    },
    {
      title: 'Órdenes Pendientes',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'amber',
      gradient: 'from-amber-500 to-amber-600',
      bgGradient: 'from-amber-50 to-amber-100/50',
      suffix: 'pendientes',
    },
    {
      title: 'Órdenes Aprobadas',
      value: stats.approvedOrders,
      icon: CheckCircle2,
      color: 'green',
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100/50',
      suffix: 'aprobadas',
    },
    {
      title: 'Ingresos Hoy',
      value: `$${formatCurrency(stats.todayRevenue)}`,
      icon: TrendingUp,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100/50',
      suffix: '',
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header con Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'var(--font-poppins)' }}>
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1.5" style={{ fontFamily: 'var(--font-poppins)' }}>
            {sedeFilter === 'global' 
              ? 'Resumen general del sistema'
              : sedeFilter === 'almagro'
              ? 'Estadísticas de Almagro'
              : 'Estadísticas de Ciudad Jardín'}
          </p>
        </div>

        {/* Switch de Filtrado por Sede */}
        {showSwitch && (
          <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 p-2">
            <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'var(--font-poppins)' }}>
              Vista:
            </span>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleSedeChange(adminSede!)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  sedeFilter === adminSede
                    ? 'bg-[#E9ABBD] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                {adminSede === 'almagro' ? 'Almagro' : 'Ciudad Jardín'}
              </button>
              <button
                onClick={() => handleSedeChange('global')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  sedeFilter === 'global'
                    ? 'bg-[#E9ABBD] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Global
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cards de Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="group relative bg-white rounded-xl border border-gray-200/80 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
              style={{ 
                fontFamily: 'var(--font-poppins)',
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className={`w-5 h-5 text-${stat.color}-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                {stat.suffix && (
                  <p className="text-xs text-gray-500 mt-1">{stat.suffix}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sección de Productos Más Vendidos */}
      {stats.topProducts.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200/80 p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-[#D44D7D]" />
            <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-poppins)' }}>
              Productos Más Vendidos
            </h2>
          </div>
          <div className="space-y-3">
            {stats.topProducts.slice(0, 5).map((product, index) => (
              <div
                key={product.productId}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E9ABBD] flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate" style={{ fontFamily: 'var(--font-poppins)' }}>
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {product.quantity} unidades vendidas
                    </p>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="font-semibold text-gray-900">
                    ${formatCurrency(product.revenue)}
                  </p>
                  <p className="text-xs text-gray-500">Ingresos</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección de Métodos de Pago */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Métodos de Pago */}
        <div className="bg-white rounded-xl border border-gray-200/80 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-poppins)' }}>
            Métodos de Pago
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Mercado Pago</span>
              </div>
              <span className="font-semibold text-gray-900">{stats.paymentMethods.mp}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Banknote className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Efectivo</span>
              </div>
              <span className="font-semibold text-gray-900">{stats.paymentMethods.cash}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">Transferencia</span>
              </div>
              <span className="font-semibold text-gray-900">{stats.paymentMethods.transfer}</span>
            </div>
          </div>
        </div>

        {/* Ingresos por Período */}
        <div className="bg-white rounded-xl border border-gray-200/80 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-poppins)' }}>
            Ingresos por Período
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Hoy</span>
              <span className="font-semibold text-gray-900">${formatCurrency(stats.todayRevenue)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Últimos 7 días</span>
              <span className="font-semibold text-gray-900">${formatCurrency(stats.weekRevenue)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Últimos 30 días</span>
              <span className="font-semibold text-gray-900">${formatCurrency(stats.monthRevenue)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


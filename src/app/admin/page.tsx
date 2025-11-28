import { getAdminDb } from '@/lib/firebase/admin';

async function getStats() {
  const db = getAdminDb();
  
  const [productsCount, coursesCount, tipsCount] = await Promise.all([
    db.collection('products').where('status', '==', 'publish').count().get(),
    db.collection('onlineCourses').where('status', '==', 'publish').count().get(),
    db.collection('tips').where('status', '==', 'publish').count().get(),
  ]);

  return {
    products: productsCount.data().count,
    courses: coursesCount.data().count,
    tips: tipsCount.data().count,
  };
}

import { Package, BookOpen, Lightbulb, TrendingUp } from 'lucide-react';

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    {
      title: 'Productos Activos',
      value: stats.products,
      icon: Package,
      color: 'pink',
      gradient: 'from-[#E9ABBD] to-[#D44D7D]',
      bgGradient: 'from-[#E9ABBD]/10 to-[#D44D7D]/5',
    },
    {
      title: 'Cursos Online',
      value: stats.courses,
      icon: BookOpen,
      color: 'emerald',
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100/50',
    },
    {
      title: 'Tips',
      value: stats.tips,
      icon: Lightbulb,
      color: 'amber',
      gradient: 'from-amber-500 to-amber-600',
      bgGradient: 'from-amber-50 to-amber-100/50',
    },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'var(--font-poppins)' }}>
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1.5" style={{ fontFamily: 'var(--font-poppins)' }}>
            Resumen general del sistema
          </p>
        </div>
      </div>
      
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
              {/* Background gradient decorativo */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg shadow-${stat.color}-500/20`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className={`w-5 h-5 text-${stat.color}-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


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

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="w-full">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500">Productos Activos</h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{stats.products}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500">Cursos Online</h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{stats.courses}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500">Tips</h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{stats.tips}</p>
        </div>
      </div>
    </div>
  );
}


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
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Productos Activos</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.products}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Cursos Online</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.courses}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Tips</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.tips}</p>
        </div>
      </div>
    </div>
  );
}


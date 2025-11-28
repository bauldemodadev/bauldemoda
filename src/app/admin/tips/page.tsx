import { getAdminDb } from '@/lib/firebase/admin';
import TipsList from '@/components/admin/tips/TipsList';
import SearchBar from '@/components/admin/SearchBar';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { serializeFirestoreData } from '@/lib/admin/serialize';

const ITEMS_PER_PAGE = 20;

async function getTips(page: number = 1, search?: string) {
  const db = getAdminDb();

  const snapshot = await db
    .collection('tips')
    .orderBy('updatedAt', 'desc')
    .get();

  let allTips = snapshot.docs.map((doc) => {
    const data = doc.data();
    return serializeFirestoreData({
      id: doc.id,
      ...data,
    });
  });

  // Aplicar búsqueda
  if (search) {
    const searchLower = search.toLowerCase();
    allTips = allTips.filter((tip: any) => {
      const title = (tip.title || '').toLowerCase();
      const slug = (tip.slug || '').toLowerCase();
      const category = (tip.category || '').toLowerCase();
      return title.includes(searchLower) || slug.includes(searchLower) || category.includes(searchLower);
    });
  }

  const total = allTips.length;

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const tips = allTips.slice(startIndex, endIndex);

  return {
    tips,
    total,
    totalPages: Math.ceil(total / ITEMS_PER_PAGE),
    currentPage: page,
  };
}

export default async function AdminTipsPage({
  searchParams,
}: {
  searchParams: { 
    page?: string;
    search?: string;
  };
}) {
  const page = parseInt(searchParams.page || '1', 10);
  const data = await getTips(page, searchParams.search);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Tips</h1>
        <Link
          href="/admin/tips/nuevo"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm sm:text-base"
        >
          <Plus className="w-4 h-4" />
          <span className="whitespace-nowrap">Nuevo Tip</span>
        </Link>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-4 sm:mb-6">
        <SearchBar 
          placeholder="Buscar tips..." 
          searchParam="search"
        />
      </div>

      <TipsList
        tips={data.tips}
        totalPages={data.totalPages}
        currentPage={data.currentPage}
      />
    </div>
  );
}


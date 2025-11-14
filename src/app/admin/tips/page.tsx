import { getAdminDb } from '@/lib/firebase/admin';
import TipsList from '@/components/admin/tips/TipsList';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { serializeFirestoreData } from '@/lib/admin/serialize';

const ITEMS_PER_PAGE = 20;

async function getTips(page: number = 1) {
  const db = getAdminDb();

  const totalSnapshot = await db.collection('tips').count().get();
  const total = totalSnapshot.data().count;

  const snapshot = await db
    .collection('tips')
    .orderBy('updatedAt', 'desc')
    .get();

  const allTips = snapshot.docs.map((doc) => {
    const data = doc.data();
    return serializeFirestoreData({
      id: doc.id,
      ...data,
    });
  });

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
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1', 10);
  const data = await getTips(page);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tips</h1>
        <Link
          href="/admin/tips/nuevo"
          className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Tip
        </Link>
      </div>

      <TipsList
        tips={data.tips}
        totalPages={data.totalPages}
        currentPage={data.currentPage}
      />
    </div>
  );
}


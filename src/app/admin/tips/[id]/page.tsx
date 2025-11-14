import { getAdminDb } from '@/lib/firebase/admin';
import { notFound } from 'next/navigation';
import TipEditForm from '@/components/admin/tips/TipEditForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { serializeFirestoreData } from '@/lib/admin/serialize';

async function getTip(id: string) {
  const db = getAdminDb();
  const doc = await db.collection('tips').doc(id).get();

  if (!doc.exists) {
    return null;
  }

  const data = doc.data() as any;
  return serializeFirestoreData({
    id: doc.id,
    ...data,
  });
}

export default async function AdminTipEditPage({
  params,
}: {
  params: { id: string };
}) {
  const tip = await getTip(params.id);

  if (!tip) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/admin/tips"
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a tips
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Editar Tip: {tip.title || 'Sin título'}
      </h1>

      <TipEditForm tip={tip} />
    </div>
  );
}


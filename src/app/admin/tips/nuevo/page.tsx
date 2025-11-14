import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import TipEditForm from '@/components/admin/tips/TipEditForm';

export default function AdminNewTipPage() {
  const newTip = {
    id: 'new',
    title: '',
    slug: '',
    shortDescription: '',
    contentHtml: '',
    category: '',
    coverMediaId: null,
    downloadMediaId: null,
    seoDescription: '',
    status: 'draft' as const,
  };

  return (
    <div>
      <Link
        href="/admin/tips"
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a tips
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nuevo Tip</h1>

      <TipEditForm tip={newTip} />
    </div>
  );
}


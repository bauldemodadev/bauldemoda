import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CourseEditForm from '@/components/admin/courses/CourseEditForm';

export default function AdminNewCoursePage() {
  const newCourse = {
    id: 'new',
    title: '',
    slug: '',
    shortDescription: '',
    seoDescription: '',
    status: 'draft' as const,
    lessons: [],
    infoBlocks: [],
    thumbnailMediaId: null,
    relatedProductId: null,
  };

  return (
    <div>
      <Link
        href="/admin/cursos-online"
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a cursos
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nuevo Curso Online</h1>

      <CourseEditForm course={newCourse} />
    </div>
  );
}


import { getAdminDb } from '@/lib/firebase/admin';
import { notFound } from 'next/navigation';
import CourseEditForm from '@/components/admin/courses/CourseEditForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

async function getCourse(id: string) {
  const db = getAdminDb();
  const doc = await db.collection('onlineCourses').doc(id).get();

  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...doc.data(),
  };
}

export default async function AdminCourseEditPage({
  params,
}: {
  params: { id: string };
}) {
  const course = await getCourse(params.id);

  if (!course) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/admin/cursos-online"
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a cursos
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Editar Curso: {course.title || 'Sin título'}
      </h1>

      <CourseEditForm course={course} />
    </div>
  );
}


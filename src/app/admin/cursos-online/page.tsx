import { getAdminDb } from '@/lib/firebase/admin';
import CoursesList from '@/components/admin/courses/CoursesList';
import Link from 'next/link';
import { Plus } from 'lucide-react';

const ITEMS_PER_PAGE = 20;

async function getCourses(page: number = 1) {
  const db = getAdminDb();

  const totalSnapshot = await db.collection('onlineCourses').count().get();
  const total = totalSnapshot.data().count;

  const snapshot = await db
    .collection('onlineCourses')
    .orderBy('updatedAt', 'desc')
    .get();

  const allCourses = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const courses = allCourses.slice(startIndex, endIndex);

  return {
    courses,
    total,
    totalPages: Math.ceil(total / ITEMS_PER_PAGE),
    currentPage: page,
  };
}

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1', 10);
  const data = await getCourses(page);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cursos Online</h1>
        <Link
          href="/admin/cursos-online/nuevo"
          className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Curso
        </Link>
      </div>

      <CoursesList
        courses={data.courses}
        totalPages={data.totalPages}
        currentPage={data.currentPage}
      />
    </div>
  );
}


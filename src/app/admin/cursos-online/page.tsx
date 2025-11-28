import { getAdminDb } from '@/lib/firebase/admin';
import CoursesList from '@/components/admin/courses/CoursesList';
import SearchBar from '@/components/admin/SearchBar';
import CourseFilters from '@/components/admin/CourseFilters';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { serializeFirestoreData } from '@/lib/admin/serialize';

const ITEMS_PER_PAGE = 20;

async function getCourses(page: number = 1, search?: string, filters?: {
  status?: string;
}) {
  const db = getAdminDb();

  const snapshot = await db
    .collection('onlineCourses')
    .orderBy('updatedAt', 'desc')
    .get();

  let allCourses = snapshot.docs.map((doc) => {
    const data = doc.data();
    return serializeFirestoreData({
      id: doc.id,
      ...data,
    });
  });

  // Aplicar búsqueda
  if (search) {
    const searchLower = search.toLowerCase();
    allCourses = allCourses.filter((course: any) => {
      const title = (course.title || '').toLowerCase();
      const slug = (course.slug || '').toLowerCase();
      const shortDescription = (course.shortDescription || '').toLowerCase();
      return title.includes(searchLower) || slug.includes(searchLower) || shortDescription.includes(searchLower);
    });
  }

  // Aplicar filtros
  if (filters?.status) {
    allCourses = allCourses.filter((course: any) => course.status === filters.status);
  }

  const total = allCourses.length;

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
  searchParams: { 
    page?: string;
    search?: string;
    status?: string;
  };
}) {
  const page = parseInt(searchParams.page || '1', 10);
  const data = await getCourses(page, searchParams.search, {
    status: searchParams.status,
  });

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'var(--font-poppins)' }}>
            Cursos Online
          </h1>
          <p className="text-sm text-gray-500 mt-1.5" style={{ fontFamily: 'var(--font-poppins)' }}>
            Gestiona tus cursos online
          </p>
        </div>
        <Link
          href="/admin/cursos-online/nuevo"
          className="group flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 text-sm font-medium active:scale-95"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
          <span className="whitespace-nowrap">Nuevo Curso</span>
        </Link>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-4 sm:mb-6">
        <SearchBar 
          placeholder="Buscar cursos..." 
          searchParam="search"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Filtros */}
        <div className="lg:w-64 lg:flex-shrink-0">
          <CourseFilters />
        </div>

        {/* Lista de cursos */}
        <div className="flex-1 min-w-0">
          <CoursesList
            courses={data.courses}
            totalPages={data.totalPages}
            currentPage={data.currentPage}
          />
        </div>
      </div>
    </div>
  );
}


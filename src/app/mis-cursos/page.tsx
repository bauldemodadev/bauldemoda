"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowRight } from "lucide-react";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";

// Tipo serializado para el frontend
interface SerializedOnlineCourse {
  id: string;
  wpId: number;
  slug: string;
  title: string;
  shortDescription: string;
  thumbnailMediaId: number | null;
  status: 'draft' | 'publish';
  createdAt: string;
  updatedAt: string;
}

/**
 * Función helper para obtener URL de imagen desde mediaId
 */
const getImageUrl = (mediaId: number | null | undefined): string => {
  if (!mediaId) return PLACEHOLDER_IMAGE;
  
  // Si es un ID (número), usar el endpoint /api/media/[id]
  if (typeof mediaId === 'number' && mediaId > 0) {
    return `/api/media/${mediaId}`;
  }
  
  return PLACEHOLDER_IMAGE;
};

interface CourseCardProps {
  course: SerializedOnlineCourse;
  index: number;
}

const CourseCard = ({ course, index }: CourseCardProps) => {
  const imageUrl = getImageUrl(course.thumbnailMediaId);

  return (
    <motion.div
      initial={{ y: "100px", opacity: 0 }}
      animate={{ y: "0", opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 * index }}
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
    >
      {/* Imagen del curso */}
      <div className="relative w-full h-64 md:h-72 overflow-hidden bg-white">
        <img
          src={imageUrl}
          alt={course.title}
          className="w-full h-full object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
          }}
        />
      </div>

      {/* Título */}
      <div className="px-4 py-3 bg-white">
        <h3 className="text-base font-bold text-gray-900 text-center uppercase">
          {course.title}
        </h3>
      </div>

      {/* Footer rosa con botón */}
      <div className="mt-auto" style={{ backgroundColor: "#E9ABBD" }}>
        <Link href={`/cursos-online/${course.slug || course.id}`}>
          <button
            className="w-full text-white text-sm font-medium py-3 px-4 transition-colors uppercase"
            style={{ backgroundColor: "#E9ABBD" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D44D7D"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E9ABBD"}
          >
            IR AL CURSO
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export default function MisCursosPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<SerializedOnlineCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user?.email) {
      router.push(`/login?redirect=${encodeURIComponent('/mis-cursos')}`);
      return;
    }

    if (user?.email) {
      loadCourses();
    }
  }, [user, authLoading, router]);

  const loadCourses = async () => {
    if (!user?.email) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/courses/my-courses?email=${encodeURIComponent(user.email)}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar los cursos');
      }

      const data = await response.json();
      setCourses(data || []);
    } catch (err) {
      console.error('Error cargando cursos:', err);
      setError('No se pudieron cargar tus cursos. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F8F5E8" }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D44D7D]"></div>
      </div>
    );
  }

  if (!user) {
    return null; // El redirect se maneja en useEffect
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#9CDAD3" }}>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadCourses}
              className="px-6 py-2 bg-[#E9ABBD] text-white rounded-lg hover:bg-[#D44D7D] transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: "#9CDAD3" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-12 md:pb-16">
        {/* Título principal con fondo blanco a todo el ancho */}
        <div
          className="text-center py-12 md:py-16 mb-8 overflow-hidden"
          style={{
            backgroundColor: "#FFFFFF",
            marginLeft: "calc(50% - 50vw)",
            marginRight: "calc(50% - 50vw)",
            paddingLeft: "calc(50vw - 50%)",
            paddingRight: "calc(50vw - 50%)"
          }}
        >
          <motion.h2
            initial={{ y: "100px", opacity: 0 }}
            animate={{ y: "0", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            MIS CURSOS ONLINE
          </motion.h2>
          
          {/* SVG decorativo onda celeste */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center mb-4"
          >
            <img
              src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/onda-celeste.svg"
              alt="Onda decorativa"
              className="h-4 md:h-5"
            />
          </motion.div>
          
          <motion.p
            initial={{ y: "100px", opacity: 0 }}
            animate={{ y: "0", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-gray-700 font-medium"
          >
            Todos tus cursos online
          </motion.p>
        </div>

        {/* Grid de cursos */}
        {courses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-sm p-12 text-center"
          >
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes cursos aún</h3>
            <p className="text-gray-600 mb-6">Cuando compres un curso online, aparecerá aquí.</p>
            <Link
              href="/shop/categoria/cursos-online"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E9ABBD] text-white rounded-lg hover:bg-[#D44D7D] transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
              Ver cursos disponibles
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


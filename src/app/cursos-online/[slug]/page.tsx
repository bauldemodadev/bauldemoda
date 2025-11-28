"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { Clock, ChevronDown, ChevronUp, BookOpen, Mail, ExternalLink, Shield } from "lucide-react";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";

// Tipos
interface SerializedOnlineCourseLesson {
  index: number;
  title: string;
  descriptionHtml: string;
  videoUrl: string;
  videoPassword?: string;
  duration?: string;
}

interface SerializedOnlineCourseInfoBlock {
  index: number;
  title: string;
  contentHtml: string;
}

interface SerializedOnlineCourse {
  id: string;
  wpId: number;
  slug: string;
  title: string;
  shortDescription: string;
  seoDescription: string;
  thumbnailMediaId: number | null;
  status: 'draft' | 'publish';
  lessons: SerializedOnlineCourseLesson[];
  infoBlocks: SerializedOnlineCourseInfoBlock[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Función helper para obtener URL de imagen desde mediaId
 */
const getImageUrl = (mediaId: number | null | undefined): string => {
  if (!mediaId) return PLACEHOLDER_IMAGE;
  
  if (typeof mediaId === 'number' && mediaId > 0) {
    return `/api/media/${mediaId}`;
  }
  
  return PLACEHOLDER_IMAGE;
};

/**
 * Formatea la duración (ej: "01:40" -> "01:40 min")
 */
const formatDuration = (duration?: string): string => {
  if (!duration) return "";
  // Si ya tiene "min", devolverlo tal cual
  if (duration.includes("min")) return duration;
  // Si es formato "HH:MM" o "MM:SS", agregar " min"
  return `${duration} min`;
};

/**
 * Componente de Clase expandible
 */
const LessonCard = ({ lesson, index }: { lesson: SerializedOnlineCourseLesson; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-lg mb-3 overflow-hidden" style={{ backgroundColor: "#F5F5DC" }}>
      {/* Header de la clase */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between transition-colors"
        style={{ backgroundColor: isExpanded ? "#F0F0D0" : "transparent" }}
        onMouseEnter={(e) => {
          if (!isExpanded) {
            e.currentTarget.style.backgroundColor = "#F0F0D0";
          }
        }}
        onMouseLeave={(e) => {
          if (!isExpanded) {
            e.currentTarget.style.backgroundColor = "transparent";
          }
        }}
      >
        <div className="flex items-center gap-3 flex-1 text-left">
          <Clock className="w-5 h-5 text-gray-600 flex-shrink-0" />
          {lesson.duration && (
            <span className="text-sm text-gray-600 font-medium whitespace-nowrap">
              {formatDuration(lesson.duration)}
            </span>
          )}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-sm font-bold whitespace-nowrap" style={{ color: "#E9749B" }}>
              Clase {index + 1}
            </span>
            <span className="text-sm text-gray-900 truncate">{lesson.title}</span>
          </div>
        </div>
        <div className="flex-shrink-0 ml-2">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-red-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-red-600" />
          )}
        </div>
      </button>

      {/* Contenido expandible */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 py-4 bg-white border-t border-gray-200">
              {/* Video */}
              {lesson.videoUrl && (
                <div className="mb-4">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={lesson.videoUrl}
                      title={lesson.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  {lesson.videoPassword && (
                    <p className="text-xs text-gray-500 mt-2">
                      Contraseña del video: <strong>{lesson.videoPassword}</strong>
                    </p>
                  )}
                </div>
              )}

              {/* Descripción HTML */}
              {lesson.descriptionHtml && (
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: lesson.descriptionHtml }}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function OnlineCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const courseSlug = params.slug as string;
  
  const [course, setCourse] = useState<SerializedOnlineCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  // Verificar acceso del usuario
  useEffect(() => {
    const checkAccess = async () => {
      if (!user?.email) {
        setHasAccess(false);
        setCheckingAccess(false);
        return;
      }

      try {
        const response = await fetch(`/api/courses/my-courses?email=${encodeURIComponent(user.email)}`);
        if (response.ok) {
          const courses = await response.json();
          // Verificar si el curso actual está en la lista
          const hasCourse = courses.some((c: SerializedOnlineCourse) => c.slug === courseSlug || c.id === courseSlug);
          setHasAccess(hasCourse);
        }
      } catch (err) {
        console.error('Error verificando acceso:', err);
        setHasAccess(false);
      } finally {
        setCheckingAccess(false);
      }
    };

    if (!authLoading) {
      checkAccess();
    }
  }, [user, authLoading, courseSlug]);

  // Cargar curso
  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/online-courses/${courseSlug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Curso no encontrado');
          }
          throw new Error('Error al cargar el curso');
        }

        const data = await response.json();
        setCourse(data);
      } catch (err) {
        console.error('Error cargando curso:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseSlug]);

  if (loading || checkingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D44D7D]"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Curso no encontrado</h1>
          <p className="text-gray-600 mb-6">{error || 'El curso que buscas no existe'}</p>
          <Link
            href="/mis-cursos"
            className="inline-block px-6 py-3 bg-[#E9ABBD] text-white rounded-lg hover:bg-[#D44D7D] transition-colors"
          >
            Volver a Mis Cursos
          </Link>
        </div>
      </div>
    );
  }

  // Si no tiene acceso, mostrar mensaje
  if (!hasAccess && user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Restringido</h1>
          <p className="text-gray-600 mb-6">
            No tienes acceso a este curso. Si lo compraste, asegúrate de estar logueado con la cuenta correcta.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/mis-cursos"
              className="px-6 py-3 bg-[#E9ABBD] text-white rounded-lg hover:bg-[#D44D7D] transition-colors"
            >
              Mis Cursos
            </Link>
            <Link
              href="/shop/categoria/cursos-online"
              className="px-6 py-3 border-2 border-[#E9ABBD] text-[#D44D7D] rounded-lg hover:bg-[#E9ABBD] hover:text-white transition-colors"
            >
              Ver Cursos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const heroImageUrl = getImageUrl(course.thumbnailMediaId);

  return (
    <div className="min-h-screen bg-white">
      <style jsx global>{`
        .course-info-block {
          font-family: inherit;
        }
        .course-info-block h3,
        .course-info-block h4 {
          font-family: var(--font-beauty);
          font-size: 1.5rem;
          color: #E9749B;
          margin-bottom: 1rem;
        }
        .course-info-block p {
          margin-bottom: 0.75rem;
          line-height: 1.6;
        }
        .course-info-block a {
          color: #16a34a;
          text-decoration: underline;
        }
        .course-info-block a:hover {
          color: #15803d;
        }
        .course-info-block button,
        .course-info-block .button {
          background-color: #E9ABBD;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .course-info-block button:hover,
        .course-info-block .button:hover {
          background-color: #D44D7D;
        }
        .course-info-block img {
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
        }
        .course-info-block ul,
        .course-info-block ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .course-info-block li {
          margin-bottom: 0.5rem;
        }
        .course-info-block strong {
          font-weight: 700;
        }
      `}</style>

      {/* Header/Hero Section */}
      <section className="w-full py-8 md:py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Logo */}
          <div className="mb-6">
            <Link href="/">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-beauty" style={{ color: "#E9749B" }}>
                  Baúl
                </span>
                <span className="text-lg text-gray-900">de Moda</span>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Columna Izquierda - Texto */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {course.title.toUpperCase()}
              </h1>
              <p className="text-2xl font-beauty mb-6" style={{ color: "#E9749B" }}>
                Online
              </p>

              <div className="space-y-4">
                <p className="text-lg font-bold text-gray-900">
                  Bienvenida/o a este Curso Online de {course.title}
                </p>
                <div
                  className="text-base text-gray-700 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: course.shortDescription }}
                />
              </div>
            </div>

            {/* Columna Derecha - Imagen Hero */}
            <div className="relative w-full h-[400px] md:h-[500px]">
              <Image
                src={heroImageUrl}
                alt={course.title}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Clases */}
      <section className="w-full py-8 md:py-12 px-4 md:px-6" style={{ backgroundColor: "#F8F5E8" }}>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-3">
            {course.lessons
              .sort((a, b) => a.index - b.index)
              .map((lesson, index) => (
                <LessonCard key={lesson.index} lesson={lesson} index={index} />
              ))}
          </div>
        </div>
      </section>

      {/* Sección Información Útil */}
      {course.infoBlocks && course.infoBlocks.length > 0 && (
        <section className="w-full py-8 md:py-12 px-4 md:px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                INFORMACIÓN ÚTIL
              </h2>
              <p className="text-lg text-gray-700">
                Otros recursos y ayudas que te van a servir para este curso.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Columna Izquierda */}
              <div className="space-y-8">
                {course.infoBlocks
                  .filter((block, index) => index % 2 === 0) // Primera mitad
                  .map((block) => (
                    <div
                      key={block.index}
                      className="course-info-block"
                      dangerouslySetInnerHTML={{ __html: block.contentHtml }}
                    />
                  ))}
              </div>

              {/* Columna Derecha */}
              <div className="space-y-8">
                {course.infoBlocks
                  .filter((block, index) => index % 2 === 1) // Segunda mitad
                  .map((block) => (
                    <div
                      key={block.index}
                      className="course-info-block"
                      dangerouslySetInnerHTML={{ __html: block.contentHtml }}
                    />
                  ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sección Comunidad Baúl */}
      <section className="w-full py-8 md:py-12 px-4 md:px-6" style={{ backgroundColor: "#F8F5E8" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Panel Izquierdo - Texto */}
            <div className="rounded-lg p-6 md:p-8" style={{ backgroundColor: "#F5F5DC" }}>
              <h3 className="text-2xl font-beauty mb-4" style={{ color: "#E9749B" }}>
                Comunidad Baúl
              </h3>
              <div className="space-y-4 text-gray-700 text-sm md:text-base">
                <p>
                  Por ser alumno/a podes disfrutar de descuentos en distintos lugares para máquinas de coser, telas, avíos, insumos, servicios técnicos y servicios/productos para emprendedores.
                </p>
                <p>
                  Conoce los beneficios que tienen nuestros alumnos y alumnas:{" "}
                  <Link href="/comunidad" className="text-green-600 hover:underline">
                    ver más
                  </Link>
                </p>
                <p>
                  Actualiza tu credencial todos los años desde este link:{" "}
                  <Link href="/comunidad" className="text-green-600 hover:underline">
                    Credencial actualizada
                  </Link>
                </p>
                <p>
                  Esta credencial se renueva anualmente, sólo tenes que mantenerla vigente año a año. La misma se renovará desde esta plataforma o vas a poder solicitarla no importa el año que cursaste en Baúl.
                </p>
                <p>
                  En caso de tener inconvenientes en el uso, por favor dar aviso para poder solucionarlo.
                </p>
              </div>
              <Link href="/comunidad">
                <button
                  className="mt-6 w-full md:w-auto px-8 py-3 text-white font-bold rounded-lg transition-colors"
                  style={{ backgroundColor: "#E9ABBD" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D44D7D"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E9ABBD"}
                >
                  CONOCER MÁS
                </button>
              </Link>
            </div>

            {/* Panel Derecho - Imagen */}
            <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden">
              <Image
                src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/comunidad-baul-hero.jpg"
                alt="Comunidad Baúl"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Segunda Fila - Imagen y Texto */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Imagen Izquierda */}
            <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden">
              <Image
                src="https://bauldemoda.com.ar/wp-content/uploads/2020/03/comunidad-baul-grupo.jpg"
                alt="Grupo de Bauleras"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Texto Derecho */}
            <div className="flex items-center">
              <div>
                <h3 className="text-2xl font-beauty mb-4" style={{ color: "#E9749B" }}>
                  Ayudanos a proteger nuestro trabajo
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  El contenido del taller y sus accesos son de uso personal. Esta prohibida la reventa o divulgación del material. Baúl de Moda se guarda el derecho de admisión y acceso a videos ante el mal uso del curso.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


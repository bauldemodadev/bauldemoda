"use client";

import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { motion } from "framer-motion";

const DressStyle = () => {
  const [courses, setCourses] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // IDs específicos de los cursos
  const courseIds = ["p96oHm22N2E5rzNOeAzJ", "szet9FZ0k4vNWPzlnljJ", "DM9RSF7Kws97w3MaOMB2", "H1BdVSwXwqoc0ZlvnNpE"];


  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        console.log('🔍 Buscando cursos con IDs:', courseIds);
        const url = `/api/products?ids=${courseIds.join(',')}`;
        console.log('🌐 URL de la API:', url);
        
        const response = await fetch(url, { 
          cache: 'no-store' 
        });
        
        console.log('📡 Respuesta de la API:', response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error(`Error al cargar los cursos: ${response.status} ${response.statusText}`);
        }
        
        const fetchedCourses = await response.json() as Product[];
        console.log('📦 Cursos obtenidos:', fetchedCourses);
        console.log('📊 Cantidad de cursos:', fetchedCourses.length);
        
        // Debug: verificar las imágenes
        fetchedCourses.forEach((course, index) => {
          if (course.images && course.images.length > 0) {
            console.log(`🖼️ Curso ${index + 1} (${course.name}):`, {
              original: course.images[0],
              firstImage: course.images[0].split(',')[0].trim()
            });
          }
        });
        
        setCourses(fetchedCourses);
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching courses:', err);
        setError(`Error al cargar los cursos: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="px-4 xl:px-0">
        <section className="max-w-frame mx-auto px-4 md:px-6 py-12 md:py-16" style={{ backgroundColor: "#F8F5E8" }}>
          <div className="text-center mb-8">
            <h2 className={cn("text-3xl md:text-4xl font-bold text-gray-900 mb-2", integralCF.className)}>
              CURSOS ONLINE
            </h2>
            <p className="text-lg text-gray-600 italic">
              hacelos en casa
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white animate-pulse flex flex-col">
                <div className="h-64 bg-gray-200"></div>
                <div className="px-4 py-3">
                  <div className="h-4 bg-gray-200 mb-1"></div>
                  <div className="h-3 bg-gray-200 mb-3"></div>
                </div>
                <div className="h-12 bg-gray-200"></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 xl:px-0">
        <section className="max-w-frame mx-auto px-4 md:px-6 py-12 md:py-16" style={{ backgroundColor: "#F8F5E8" }}>
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="px-4 xl:px-0">
      <section className="max-w-frame mx-auto px-4 md:px-6 py-12 md:py-16" style={{ backgroundColor: "#F8F5E8" }}>
        {/* Título de la sección */}
        <div className="text-left mb-8">
          <motion.h2
            initial={{ y: "100px", opacity: 0 }}
            animate={{ y: "0", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={cn("text-3xl md:text-4xl font-bold text-gray-900 mb-2", integralCF.className)}
          >
            CURSOS ONLINE
          </motion.h2>
          <motion.p
            initial={{ y: "100px", opacity: 0 }}
            animate={{ y: "0", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 italic"
          >
            hacelos en casa
          </motion.p>
        </div>

        {/* Grid de cursos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white overflow-hidden transition-all duration-300 group flex flex-col"
            >
              {/* Imagen del curso */}
              <div className="relative h-64 bg-gradient-to-br from-pink-100 to-purple-100">
                {course.images && course.images.length > 0 ? (
                  <Image
                    src={course.images[0].split(',')[0].trim()}
                    alt={course.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-gray-400">📚</span>
                    </div>
                  </div>
                )}
                
                {/* Tags específicos según el curso */}
                {course.id === "p96oHm22N2E5rzNOeAzJ" && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-bold bg-pink-500">
                    OFERTA
                  </div>
                )}
                {course.id === "szet9FZ0k4vNWPzlnljJ" && (
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-white text-xs font-bold bg-teal-600">
                    CURSO RENOVADO
                  </div>
                )}
                {course.id === "DM9RSF7Kws97w3MaOMB2" && (
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-yellow-900 text-xs font-bold bg-yellow-400">
                    SÚPER EXPRESS
                  </div>
                )}
              </div>

              {/* Contenido del curso */}
              <div className="px-4 py-3">
                <h3 className="font-bold text-gray-900 text-sm mb-1 leading-tight uppercase text-center">
                  {course.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 text-center">
                  Cursos Online
                </p>
              </div>
              
              {/* Botón MÁS INFO */}
              <Link href={`/shop/${course.id}`}>
                <button className="w-full text-white text-sm font-medium py-3 transition-colors" style={{ backgroundColor: "#E9ABBD" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D44D7D"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E9ABBD"}>
                  MÁS INFO
                </button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Botón VER TODOS */}
        <div className="text-center">
          <motion.div
            initial={{ y: "100px", opacity: 0 }}
            animate={{ y: "0", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link href="/shop">
              <button className="text-white px-8 py-3 text-lg font-medium transition-colors" style={{ backgroundColor: "#E9ABBD" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D44D7D"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E9ABBD"}>
                VER TODOS
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default DressStyle;

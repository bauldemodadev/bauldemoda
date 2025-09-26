import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const cursos = [
  {
    id: "1",
    titulo: "PREVENTA DE ARREGLOS DE ROPA",
    subtitulo: "MODA CIRCULAR",
    tag: "OFERTA",
    tagColor: "bg-pink-500",
    imagen: "/images/curso-moda-circular.jpg",
    url: "/cursos/moda-circular",
    color: "bg-pink-100"
  },
  {
    id: "2",
    titulo: "INTENSIVO MI PRIMER JEAN",
    subtitulo: "INTENSIVO MI PRIMER JEAN",
    tag: "CURSO RENOVADO",
    tagColor: "bg-blue-500",
    imagen: "/images/curso-jean.jpg",
    url: "/cursos/mi-primer-jean",
    color: "bg-blue-100"
  },
  {
    id: "3",
    titulo: "ABC COSTURA ONLINE",
    subtitulo: "ABC COSTURA ONLINE",
    tag: "SÚPER EXPRESS",
    tagColor: "bg-yellow-500",
    imagen: "/images/curso-costura.jpg",
    url: "/cursos/abc-costura",
    color: "bg-teal-100"
  },
  {
    id: "4",
    titulo: "INTENSIVO MALLAS",
    subtitulo: "INTENSIVO MALLAS",
    imagen: "/images/curso-mallas.jpg",
    url: "/cursos/intensivo-mallas",
    color: "bg-yellow-100"
  }
];

const DressStyle = () => {
  return (
    <div className="px-4 xl:px-0">
      <section className="max-w-frame mx-auto px-4 md:px-6 py-12 md:py-16 bg-stone-50">
        {/* Título de la sección */}
        <div className="text-center mb-8">
          <h2 className={cn("text-3xl md:text-4xl font-bold text-gray-900 mb-2", integralCF.className)}>
            CURSOS ONLINE
          </h2>
          <p className="text-lg text-gray-600">
            hacelos en casa
          </p>
        </div>

        {/* Grid de cursos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cursos.map((curso) => (
            <div key={curso.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
              {/* Imagen del curso */}
              <div className="relative h-48 bg-gradient-to-br from-pink-100 to-purple-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Placeholder para la imagen del curso */}
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-gray-400">📚</span>
                  </div>
                </div>
                
                {/* Tag */}
                {curso.tag && (
                  <div className={cn("absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-bold", curso.tagColor)}>
                    {curso.tag}
                  </div>
                )}
              </div>

              {/* Contenido del curso */}
              <div className="p-6">
                <h3 className="font-bold text-gray-900 text-sm mb-2 leading-tight">
                  {curso.titulo}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Cursos Online
                </p>
                
                {/* Botón MÁS INFO */}
                <Link href={curso.url}>
                  <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                    MÁS INFO
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Botón VER TODOS */}
        <div className="text-center">
          <Button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 text-lg font-medium rounded-lg transition-colors">
            VER TODOS
          </Button>
        </div>
      </section>
    </div>
  );
};

export default DressStyle;

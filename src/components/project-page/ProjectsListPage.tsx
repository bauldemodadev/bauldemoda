"use client";

import { Project } from '@/types/project';
import { motion } from 'framer-motion';
import { beauty } from '@/styles/fonts';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ProjectsListPageProps {
  projects: Project[];
}

const ProjectsListPage = ({ projects }: ProjectsListPageProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Obtener todas las categorías únicas
  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];

  // Filtrar proyectos por categoría
  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={cn([
              beauty.className,
              "text-5xl lg:text-7xl font-bold mb-8"
            ])}>
              Nuestros Proyectos
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Descubre la excelencia de nuestro trabajo a través de proyectos realizados 
              con pasión, calidad y la mejor selección de maderas
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="px-6 py-2 rounded-full capitalize"
              >
                {category === 'all' ? 'Todos' : category}
              </Button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No hay proyectos disponibles
              </h3>
              <p className="text-gray-600">
                No se encontraron proyectos para la categoría seleccionada.
              </p>
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProjects.map((project) => (
                <motion.article
                  key={project.slug}
                  variants={itemVariants}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
                >
                  {/* Project Image */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={project.banner.slides[0]?.backgroundImage || '/placeholder.png'}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-black px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                        <Tag className="h-3 w-3 mr-1" />
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(project.createdAt)}
                    </div>

                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 group-hover:text-black transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                      {project.banner.slides[0]?.description || project.seo.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-6 text-sm">
                      <div className="flex items-center space-x-4">
                        {project.services && (
                          <span className="text-gray-500">
                            {project.services.length} servicios
                          </span>
                        )}
                        {project.gallery && (
                          <span className="text-gray-500">
                            {project.gallery.items.length} imágenes
                          </span>
                        )}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link href={`/proyectos/${project.slug}`}>
                      <Button className="w-full bg-black hover:bg-gray-800 text-white group/btn">
                        Ver Proyecto
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-5xl font-bold mb-8">
              ¿Tienes un proyecto en mente?
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Contáctanos y hagamos realidad tu próximo proyecto con la mejor calidad y atención personalizada
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-black hover:bg-gray-100 px-8 py-4">
                  Iniciar Proyecto
                </Button>
              </Link>
              <Link href="tel:01134976239">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black px-8 py-4">
                  Llamar Ahora
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ProjectsListPage;

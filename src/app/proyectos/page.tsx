import { Metadata } from 'next';
import { getAllProjects } from '@/lib/projects';
import ProjectsListPage from '@/components/project-page/ProjectsListPage';

export const metadata: Metadata = {
  title: 'Nuestros Proyectos - Baúl de Moda',
  description: 'Descubre todos nuestros proyectos de moda, diseño y colecciones especializadas.',
  keywords: [
    'proyectos', 'moda', 'diseño', 'colecciones',
    'tendencias', 'estilo', 'galería', 'portfolio'
  ],
  openGraph: {
    title: 'Nuestros Proyectos - Baúl de Moda',
    description: 'Descubre todos nuestros proyectos de moda, diseño y colecciones especializadas.',
    type: 'website',
  },
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  const activeProjects = projects.filter(project => project.status === 'active');

  return <ProjectsListPage projects={activeProjects} />;
}

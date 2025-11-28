'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Save, Plus, Trash2 } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';
import MediaImage from '@/components/admin/MediaImage';

interface Lesson {
  index: number;
  title: string;
  descriptionHtml: string;
  videoUrl: string;
  videoPassword?: string;
  duration?: string;
}

interface InfoBlock {
  index: number;
  title: string;
  contentHtml: string;
}

interface Course {
  id: string;
  title?: string;
  slug?: string;
  shortDescription?: string;
  seoDescription?: string;
  status?: 'publish' | 'draft';
  lessons?: Lesson[];
  infoBlocks?: InfoBlock[];
  thumbnailMediaId?: number | null;
  relatedProductId?: string | null;
}

interface CourseEditFormProps {
  course: Course;
}

export default function CourseEditForm({ course }: CourseEditFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Course>(course);

  const handleChange = (field: keyof Course, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLessonChange = (index: number, field: keyof Lesson, value: any) => {
    setFormData((prev) => ({
      ...prev,
      lessons: (prev.lessons || []).map((lesson, i) =>
        i === index ? { ...lesson, [field]: value } : lesson
      ),
    }));
  };

  const handleAddLesson = () => {
    setFormData((prev) => ({
      ...prev,
      lessons: [
        ...(prev.lessons || []),
        {
          index: prev.lessons?.length || 0,
          title: '',
          descriptionHtml: '',
          videoUrl: '',
          videoPassword: '',
          duration: '',
        },
      ],
    }));
  };

  const handleRemoveLesson = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      lessons: (prev.lessons || []).filter((_, i) => i !== index).map((lesson, i) => ({
        ...lesson,
        index: i,
      })),
    }));
  };

  const handleInfoBlockChange = (index: number, field: keyof InfoBlock, value: any) => {
    setFormData((prev) => ({
      ...prev,
      infoBlocks: (prev.infoBlocks || []).map((block, i) =>
        i === index ? { ...block, [field]: value } : block
      ),
    }));
  };

  const handleAddInfoBlock = () => {
    setFormData((prev) => ({
      ...prev,
      infoBlocks: [
        ...(prev.infoBlocks || []),
        {
          index: prev.infoBlocks?.length || 0,
          title: '',
          contentHtml: '',
        },
      ],
    }));
  };

  const handleRemoveInfoBlock = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      infoBlocks: (prev.infoBlocks || []).filter((_, i) => i !== index).map((block, i) => ({
        ...block,
        index: i,
      })),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const isNew = course.id === 'new';
      const url = isNew ? '/api/admin/courses' : `/api/admin/courses/${course.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al guardar curso');
      }

      const result = await response.json();

      toast({
        title: isNew ? 'Curso creado' : 'Curso guardado',
        description: isNew
          ? 'El curso se ha creado correctamente'
          : 'Los cambios se han guardado correctamente',
      });

      if (isNew && result.id) {
        router.push(`/admin/cursos-online/${result.id}`);
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error('Error guardando curso:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo guardar el curso',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 space-y-6">
        {/* Datos Básicos */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Datos Básicos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título *
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug || ''}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción Corta
              </label>
              <textarea
                value={formData.shortDescription || ''}
                onChange={(e) => handleChange('shortDescription', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SEO Description
              </label>
              <textarea
                value={formData.seoDescription || ''}
                onChange={(e) => handleChange('seoDescription', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={formData.status || 'draft'}
                onChange={(e) => handleChange('status', e.target.value as 'publish' | 'draft')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Borrador</option>
                <option value="publish">Publicado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagen Principal (Media ID)
              </label>
              <input
                type="number"
                value={formData.thumbnailMediaId || ''}
                onChange={(e) => handleChange('thumbnailMediaId', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              {formData.thumbnailMediaId && (
                <MediaImage
                  mediaId={formData.thumbnailMediaId}
                  alt="Imagen del curso"
                  width={200}
                  height={200}
                  className="mt-2"
                  showId={true}
                />
              )}
            </div>
          </div>
        </section>

        {/* Lecciones */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Clases</h2>
            <button
              onClick={handleAddLesson}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Agregar Clase
            </button>
          </div>
          <div className="space-y-4">
            {(formData.lessons || []).map((lesson, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Clase {index + 1}</h3>
                  <button
                    onClick={() => handleRemoveLesson(index)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título
                    </label>
                    <input
                      type="text"
                      value={lesson.title}
                      onChange={(e) => handleLessonChange(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duración
                    </label>
                    <input
                      type="text"
                      value={lesson.duration || ''}
                      onChange={(e) => handleLessonChange(index, 'duration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Video URL
                    </label>
                    <input
                      type="url"
                      value={lesson.videoUrl}
                      onChange={(e) => handleLessonChange(index, 'videoUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña del Video
                    </label>
                    <input
                      type="text"
                      value={lesson.videoPassword || ''}
                      onChange={(e) => handleLessonChange(index, 'videoPassword', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <RichTextEditor
                      value={lesson.descriptionHtml}
                      onChange={(value) => handleLessonChange(index, 'descriptionHtml', value)}
                      placeholder="Escribe la descripción de la clase aquí..."
                    />
                  </div>
                </div>
              </div>
            ))}
            {(!formData.lessons || formData.lessons.length === 0) && (
              <p className="text-sm text-gray-500 text-center py-4">
                No hay clases. Haz clic en "Agregar Clase" para comenzar.
              </p>
            )}
          </div>
        </section>

        {/* Bloques de Información */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Información Útil</h2>
            <button
              onClick={handleAddInfoBlock}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Agregar Bloque
            </button>
          </div>
          <div className="space-y-4">
            {(formData.infoBlocks || []).map((block, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Bloque {index + 1}</h3>
                  <button
                    onClick={() => handleRemoveInfoBlock(index)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título
                    </label>
                    <input
                      type="text"
                      value={block.title}
                      onChange={(e) => handleInfoBlockChange(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contenido
                    </label>
                    <RichTextEditor
                      value={block.contentHtml}
                      onChange={(value) => handleInfoBlockChange(index, 'contentHtml', value)}
                      placeholder="Escribe el contenido del bloque aquí..."
                    />
                  </div>
                </div>
              </div>
            ))}
            {(!formData.infoBlocks || formData.infoBlocks.length === 0) && (
              <p className="text-sm text-gray-500 text-center py-4">
                No hay bloques de información. Haz clic en "Agregar Bloque" para comenzar.
              </p>
            )}
          </div>
        </section>

        {/* Botón Guardar */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}


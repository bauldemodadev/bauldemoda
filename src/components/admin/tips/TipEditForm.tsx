'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Save } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';
import MediaImage from '@/components/admin/MediaImage';

interface Tip {
  id: string;
  title?: string;
  slug?: string;
  shortDescription?: string;
  contentHtml?: string;
  category?: string;
  coverMediaId?: number | string | null;
  downloadMediaId?: number | string | null;
  seoDescription?: string;
  status?: 'publish' | 'draft';
}

interface TipEditFormProps {
  tip: Tip;
}

export default function TipEditForm({ tip }: TipEditFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Tip>(tip);

  const handleChange = (field: keyof Tip, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const isNew = tip.id === 'new';
      const url = isNew ? '/api/admin/tips' : `/api/admin/tips/${tip.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al guardar tip');
      }

      const result = await response.json();

      toast({
        title: isNew ? 'Tip creado' : 'Tip guardado',
        description: isNew
          ? 'El tip se ha creado correctamente'
          : 'Los cambios se han guardado correctamente',
      });

      if (isNew && result.id) {
        router.push(`/admin/tips/${result.id}`);
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error('Error guardando tip:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo guardar el tip',
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <input
                type="text"
                value={formData.category || ''}
                onChange={(e) => handleChange('category', e.target.value)}
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
                Imagen de Portada (Media ID o URL)
              </label>
              <input
                type="text"
                value={formData.coverMediaId || ''}
                onChange={(e) => {
                  const value = e.target.value.trim();
                  if (!value) {
                    handleChange('coverMediaId', null);
                  } else if (value.startsWith('http://') || value.startsWith('https://')) {
                    // Es una URL
                    handleChange('coverMediaId', value);
                  } else {
                    // Intentar parsear como número (ID)
                    const numValue = parseInt(value, 10);
                    handleChange('coverMediaId', !isNaN(numValue) && numValue > 0 ? numValue : value);
                  }
                }}
                placeholder="Ej: 123 o https://ejemplo.com/imagen.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              {formData.coverMediaId && (
                <MediaImage
                  mediaId={formData.coverMediaId}
                  alt="Imagen de portada"
                  width={200}
                  height={200}
                  className="mt-2"
                  showId={true}
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Archivo Descargable (Media ID o URL)
              </label>
              <input
                type="text"
                value={formData.downloadMediaId || ''}
                onChange={(e) => {
                  const value = e.target.value.trim();
                  if (!value) {
                    handleChange('downloadMediaId', null);
                  } else if (value.startsWith('http://') || value.startsWith('https://')) {
                    // Es una URL
                    handleChange('downloadMediaId', value);
                  } else {
                    // Intentar parsear como número (ID)
                    const numValue = parseInt(value, 10);
                    handleChange('downloadMediaId', !isNaN(numValue) && numValue > 0 ? numValue : value);
                  }
                }}
                placeholder="Ej: 123 o https://ejemplo.com/archivo.pdf"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Contenido */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contenido</h2>
          <div className="space-y-4">
            <div>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contenido Completo
              </label>
              <RichTextEditor
                value={formData.contentHtml || ''}
                onChange={(value) => handleChange('contentHtml', value)}
                placeholder="Escribe el contenido completo del tip aquí..."
              />
            </div>
            <div>
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


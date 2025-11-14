'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Save } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface Tip {
  id: string;
  title?: string;
  slug?: string;
  shortDescription?: string;
  contentHtml?: string;
  category?: string;
  coverMediaId?: number | null;
  downloadMediaId?: number | null;
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={formData.status || 'draft'}
                onChange={(e) => handleChange('status', e.target.value as 'publish' | 'draft')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="draft">Borrador</option>
                <option value="publish">Publicado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Media ID
              </label>
              <input
                type="number"
                value={formData.coverMediaId || ''}
                onChange={(e) => handleChange('coverMediaId', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Download Media ID
              </label>
              <input
                type="number"
                value={formData.downloadMediaId || ''}
                onChange={(e) => handleChange('downloadMediaId', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>
        </section>

        {/* Botón Guardar */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}


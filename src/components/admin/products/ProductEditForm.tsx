'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Save } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';
import MediaImage from '@/components/admin/MediaImage';

interface Product {
  id: string;
  name?: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  priceText?: string;
  localPriceNumber?: number | null;
  durationText?: string;
  locationText?: string;
  detailsHtml?: string;
  category?: string;
  subcategory?: string | null;
  tipoMadera?: string;
  sede?: string | null;
  status?: 'publish' | 'draft';
  stockStatus?: string;
  thumbnailMediaId?: number | string | null;
  galleryMediaIds?: (number | string)[];
  sku?: string | null;
}

interface ProductEditFormProps {
  product: Product;
}

export default function ProductEditForm({ product }: ProductEditFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Product>(product);

  const handleChange = (field: keyof Product, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const isNew = product.id === 'new';
      const url = isNew ? '/api/admin/products' : `/api/admin/products/${product.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al guardar producto');
      }

      const result = await response.json();

      toast({
        title: isNew ? 'Producto creado' : 'Producto guardado',
        description: isNew 
          ? 'El producto se ha creado correctamente'
          : 'Los cambios se han guardado correctamente',
      });

      if (isNew && result.id) {
        router.push(`/admin/productos/${result.id}`);
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error('Error guardando producto:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo guardar el producto',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm" style={{ fontFamily: 'var(--font-poppins)' }}>
      <div className="p-6 sm:p-8 space-y-8">
        {/* Datos Básicos */}
        <section>
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Datos Básicos</h2>
            <p className="text-sm text-gray-500 mt-1">Información principal del producto</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E9ABBD]/20 focus:border-[#D44D7D] transition-all duration-200 text-sm"
                style={{ fontFamily: 'var(--font-poppins)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug || ''}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E9ABBD]/20 focus:border-[#D44D7D] transition-all duration-200 text-sm font-mono"
                style={{ fontFamily: 'var(--font-poppins)' }}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E9ABBD]/20 focus:border-[#D44D7D]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subcategoría
              </label>
              <input
                type="text"
                value={formData.subcategory || ''}
                onChange={(e) => handleChange('subcategory', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E9ABBD]/20 focus:border-[#D44D7D]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sede
              </label>
              <select
                value={formData.sede || ''}
                onChange={(e) => handleChange('sede', e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E9ABBD]/20 focus:border-[#D44D7D]"
              >
                <option value="">Seleccionar...</option>
                <option value="ciudad-jardin">Ciudad Jardín</option>
                <option value="almagro">Almagro</option>
                <option value="online">Online</option>
                <option value="mixto">Mixto</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={formData.status || 'draft'}
                onChange={(e) => handleChange('status', e.target.value as 'publish' | 'draft')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E9ABBD]/20 focus:border-[#D44D7D]"
              >
                <option value="draft">Borrador</option>
                <option value="publish">Publicado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Status
              </label>
              <select
                value={formData.stockStatus || 'instock'}
                onChange={(e) => handleChange('stockStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E9ABBD]/20 focus:border-[#D44D7D]"
              >
                <option value="instock">En Stock</option>
                <option value="outofstock">Sin Stock</option>
                <option value="onbackorder">Pedido</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU
              </label>
              <input
                type="text"
                value={formData.sku || ''}
                onChange={(e) => handleChange('sku', e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E9ABBD]/20 focus:border-[#D44D7D]"
              />
            </div>
          </div>
        </section>

        {/* Comercial */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Comercial</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio (texto)
              </label>
              <input
                type="text"
                value={formData.priceText || ''}
                onChange={(e) => handleChange('priceText', e.target.value)}
                placeholder="Ej: $5000 en efectivo, $6000 otros medios"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E9ABBD]/20 focus:border-[#D44D7D]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio Numérico (local)
              </label>
              <input
                type="number"
                value={formData.localPriceNumber || ''}
                onChange={(e) => handleChange('localPriceNumber', e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E9ABBD]/20 focus:border-[#D44D7D]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duración
              </label>
              <input
                type="text"
                value={formData.durationText || ''}
                onChange={(e) => handleChange('durationText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E9ABBD]/20 focus:border-[#D44D7D]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lugar
              </label>
              <input
                type="text"
                value={formData.locationText || ''}
                onChange={(e) => handleChange('locationText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E9ABBD]/20 focus:border-[#D44D7D]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Madera
              </label>
              <input
                type="text"
                value={formData.tipoMadera || ''}
                onChange={(e) => handleChange('tipoMadera', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E9ABBD]/20 focus:border-[#D44D7D]"
              />
            </div>
          </div>
        </section>

        {/* Medios */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Medios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagen Principal (Media ID o URL)
              </label>
              <input
                type="text"
                value={formData.thumbnailMediaId || ''}
                onChange={(e) => {
                  const value = e.target.value.trim();
                  if (!value) {
                    handleChange('thumbnailMediaId', null);
                  } else if (value.startsWith('http://') || value.startsWith('https://')) {
                    // Es una URL
                    handleChange('thumbnailMediaId', value);
                  } else {
                    // Intentar parsear como número (ID)
                    const numValue = parseInt(value, 10);
                    handleChange('thumbnailMediaId', !isNaN(numValue) && numValue > 0 ? numValue : value);
                  }
                }}
                placeholder="Ej: 123 o https://ejemplo.com/imagen.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E9ABBD]/20 focus:border-[#D44D7D] mb-2"
              />
              {formData.thumbnailMediaId && (
                <MediaImage
                  mediaId={formData.thumbnailMediaId}
                  alt="Imagen principal"
                  width={200}
                  height={200}
                  className="mt-2"
                  showId={true}
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Galería (Media IDs o URLs separados por comas)
              </label>
              <input
                type="text"
                value={formData.galleryMediaIds?.map(id => String(id)).join(', ') || ''}
                onChange={(e) => {
                  const values = e.target.value
                    .split(',')
                    .map((val) => val.trim())
                    .filter((val) => val.length > 0)
                    .map((val) => {
                      // Si es una URL, mantenerla como string
                      if (val.startsWith('http://') || val.startsWith('https://')) {
                        return val;
                      }
                      // Intentar parsear como número (ID)
                      const numValue = parseInt(val, 10);
                      return !isNaN(numValue) && numValue > 0 ? numValue : val;
                    });
                  handleChange('galleryMediaIds', values);
                }}
                placeholder="Ej: 123, 456, https://ejemplo.com/imagen.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E9ABBD]/20 focus:border-[#D44D7D] mb-2"
              />
              {formData.galleryMediaIds && formData.galleryMediaIds.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {formData.galleryMediaIds.map((mediaId, index) => (
                    <MediaImage
                      key={index}
                      mediaId={mediaId}
                      alt={`Imagen ${index + 1}`}
                      width={100}
                      height={100}
                      showId={true}
                    />
                  ))}
                </div>
              )}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E9ABBD]/20 focus:border-[#D44D7D]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción Completa
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E9ABBD]/20 focus:border-[#D44D7D]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detalles del Taller
              </label>
              <RichTextEditor
                value={formData.detailsHtml || ''}
                onChange={(value) => handleChange('detailsHtml', value)}
                placeholder="Escribe los detalles del taller aquí..."
              />
            </div>
          </div>
        </section>

        {/* Botón Guardar */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="group flex items-center gap-2.5 px-6 py-3 bg-[#E9ABBD] text-white rounded-lg shadow-md shadow-[#D44D7D]/20 hover:shadow-lg hover:shadow-[#D44D7D]/30 hover:bg-[#D44D7D] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm active:scale-95"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}


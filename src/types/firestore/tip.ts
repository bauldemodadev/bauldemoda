/**
 * Tipos Firestore para la colección 'tips'
 */

import { Timestamp } from 'firebase-admin/firestore';

/**
 * Tip/Artículo en Firestore
 */
export interface Tip {
  // Identificadores
  id: string;                     // docId
  wpId: number;                    // wp:post_id
  slug: string;                    // wp:post_name

  // Información básica
  title: string;                  // <title>
  shortDescription: string;        // meta: descripcion_corta
  contentHtml: string;            // content:encoded (HTML completo)
  
  // Categorización
  category: string;                // category principal (nicename o texto)

  // Medios
  coverMediaId: number | null;     // meta: imagen_portada
  downloadMediaId?: number | null; // meta: archivo_descargable (opcional)

  // SEO
  seoDescription: string;          // _yoast_wpseo_metadesc

  // Estado
  status: 'draft' | 'publish';

  // Fechas
  createdAt: Timestamp;
  updatedAt: Timestamp;
}


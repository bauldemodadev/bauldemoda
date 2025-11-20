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
  coverMediaId: number | string | null;     // meta: imagen_portada (ID WP o URL)
  downloadMediaId?: number | string | null; // meta: archivo_descargable (ID WP o URL, opcional)

  // SEO
  seoDescription: string;          // _yoast_wpseo_metadesc

  // Estado
  status: 'draft' | 'publish';

  // Fechas
  createdAt: Timestamp;
  updatedAt: Timestamp;
}


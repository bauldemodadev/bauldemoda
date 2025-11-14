/**
 * Tipos Firestore para la colección 'onlineCourses'
 */

import { Timestamp } from 'firebase-admin/firestore';

/**
 * Lección/clase de un curso online
 */
export interface OnlineCourseLesson {
  index: number;
  title: string;                  // clases_n_titulo
  descriptionHtml: string;        // clases_n_contenido (HTML)
  videoUrl: string;               // clases_n_link_video
  videoPassword?: string;         // clases_n_contrasena_de_video
  duration?: string;              // clases_n_duracion
}

/**
 * Bloque de información útil del curso
 */
export interface OnlineCourseInfoBlock {
  index: number;
  title: string;                  // informacion_util_n_titulo
  contentHtml: string;            // informacion_util_n_contenido (HTML)
}

/**
 * Curso online en Firestore
 */
export interface OnlineCourse {
  // Identificadores
  id: string;                     // docId
  wpId: number;                   // wp:post_id
  slug: string;                   // wp:post_name

  // Información básica
  title: string;                  // meta: titulo o <title>
  shortDescription: string;       // meta: descripcion_corta
  seoDescription: string;         // _yoast_wpseo_metadesc

  // Medios
  thumbnailMediaId: number | null; // meta: imagen_principal

  // Estado
  status: 'draft' | 'publish';

  // Relaciones
  relatedProductWpId?: number | null;  // si en WP hay un meta que referencie producto
  relatedProductId?: string | null;    // referencia final a products (opcional, se puede completar después)

  // Contenido
  lessons: OnlineCourseLesson[];
  infoBlocks: OnlineCourseInfoBlock[];

  // Fechas
  createdAt: Timestamp;
  updatedAt: Timestamp;
}


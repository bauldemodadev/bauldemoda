/**
 * API Route para obtener imágenes desde WordPress por mediaId
 * 
 * Intenta obtener la imagen desde:
 * 1. WordPress REST API (wp-json/wp/v2/media/{id})
 * 2. URL directa de wp-content/uploads (si se conoce el patrón)
 */

import { NextRequest, NextResponse } from 'next/server';

const WORDPRESS_BASE_URL = 'https://bauldemoda.com.ar';

/**
 * Intenta obtener la URL de una imagen desde WordPress por mediaId
 */
async function getWordPressImageUrl(mediaId: number): Promise<string | null> {
  try {
    // Opción 1: Intentar obtener desde la API REST de WordPress
    const apiUrl = `${WORDPRESS_BASE_URL}/wp-json/wp/v2/media/${mediaId}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
      // Timeout de 5 segundos
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      const data = await response.json();
      
      // Intentar diferentes campos donde puede estar la URL
      if (data?.source_url) {
        return data.source_url;
      }
      if (data?.media_details?.sizes?.full?.source_url) {
        return data.media_details.sizes.full.source_url;
      }
      if (data?.media_details?.sizes?.large?.source_url) {
        return data.media_details.sizes.large.source_url;
      }
      if (data?.media_details?.sizes?.medium?.source_url) {
        return data.media_details.sizes.medium.source_url;
      }
      if (data?.guid?.rendered) {
        return data.guid.rendered;
      }
      if (data?.link) {
        return data.link;
      }
    } else {
      console.warn(`API WordPress retornó ${response.status} para mediaId ${mediaId}`);
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.warn(`Timeout al obtener imagen ${mediaId} desde WordPress`);
    } else {
      console.warn(`Error al obtener imagen ${mediaId} desde API WordPress:`, error.message);
    }
  }

  // Opción 2: Intentar construir URL directa (puede no funcionar si la imagen fue movida)
  // WordPress generalmente guarda imágenes en /wp-content/uploads/YYYY/MM/
  // Pero sin conocer la fecha exacta, no podemos construir la URL con certeza
  // Retornamos null para que se use un placeholder
  return null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const mediaId = parseInt(params.id, 10);

    if (isNaN(mediaId) || mediaId <= 0) {
      return NextResponse.json(
        { error: 'Media ID inválido' },
        { status: 400 }
      );
    }

    // Intentar obtener la URL de la imagen
    const imageUrl = await getWordPressImageUrl(mediaId);

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Imagen no encontrada', url: null },
        { status: 404 }
      );
    }

    // Retornar la URL de la imagen
    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error('Error obteniendo imagen:', error);
    return NextResponse.json(
      { error: 'Error al obtener imagen' },
      { status: 500 }
    );
  }
}


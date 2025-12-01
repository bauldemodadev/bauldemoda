/**
 * API Route: Detalle de curso online
 * GET /api/online-courses/[id]
 * 
 * Busca por ID o slug
 */

import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { getOnlineCourseByIdFromFirestore } from '@/lib/firestore/onlineCourses';
import { Timestamp } from 'firebase-admin/firestore';
import type { OnlineCourse } from '@/types/firestore/onlineCourse';

// OPTIMIZADO: Cache con revalidación (cursos individuales cambian poco)
export const revalidate = 300;

/**
 * Serializa un curso online para el frontend
 */
function serializeCourse(course: any): any {
  const serialized = { ...course };
  
  if (serialized.createdAt instanceof Timestamp) {
    serialized.createdAt = serialized.createdAt.toDate().toISOString();
  }
  if (serialized.updatedAt instanceof Timestamp) {
    serialized.updatedAt = serialized.updatedAt.toDate().toISOString();
  }
  
  return serialized;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const slugOrId = params.id;
    const db = getAdminDb();

    let course: OnlineCourse | null = null;

    // Intentar buscar por ID primero (si parece un ID de Firestore)
    if (slugOrId.length === 20) {
      try {
        course = await getOnlineCourseByIdFromFirestore(slugOrId);
      } catch (error) {
        // Si falla, continuar con búsqueda por slug
      }
    }

    // Si no se encontró por ID, buscar por slug
    if (!course) {
      const snapshot = await db
        .collection('onlineCourses')
        .where('slug', '==', slugOrId)
        .where('status', '==', 'publish')
        .limit(1)
        .get();

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data() as Omit<OnlineCourse, 'id'>;
        course = {
          id: doc.id,
          ...data,
        };
      }
    }
    
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    
    return NextResponse.json(serializeCourse(course));
  } catch (error) {
    console.error('Error fetching online course:', error);
    return NextResponse.json({ error: 'Failed to fetch online course' }, { status: 500 });
  }
}


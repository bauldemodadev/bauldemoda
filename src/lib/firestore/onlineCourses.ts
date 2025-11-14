/**
 * Funciones helper para leer cursos online desde Firestore
 */

import { getAdminDb } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';
import type { OnlineCourse } from '@/types/firestore';

/**
 * Convierte Timestamps a objetos serializables para JSON
 */
function convertTimestampsToISO(data: any): any {
  if (!data) return data;
  
  const converted = { ...data };
  
  if (converted.createdAt instanceof Timestamp) {
    converted.createdAt = converted.createdAt.toDate().toISOString();
  }
  if (converted.updatedAt instanceof Timestamp) {
    converted.updatedAt = converted.updatedAt.toDate().toISOString();
  }
  
  return converted;
}

/**
 * Obtiene todos los cursos online activos (status === 'publish') desde Firestore
 */
export async function getAllOnlineCoursesFromFirestore(): Promise<OnlineCourse[]> {
  try {
    const db = getAdminDb();
    const snapshot = await db
      .collection('onlineCourses')
      .where('status', '==', 'publish')
      .get();

    const courses: OnlineCourse[] = [];
    snapshot.forEach((doc) => {
      try {
        const data = doc.data() as OnlineCourse;
        const converted = convertTimestampsToISO(data);
        courses.push({ ...converted, id: doc.id });
      } catch (error) {
        console.error(`Error transformando curso ${doc.id}:`, error);
        // Continuar con el siguiente curso
      }
    });

    return courses;
  } catch (error) {
    console.error('Error en getAllOnlineCoursesFromFirestore:', error);
    throw error;
  }
}

/**
 * Obtiene un curso online por ID desde Firestore
 */
export async function getOnlineCourseByIdFromFirestore(id: string): Promise<OnlineCourse | null> {
  try {
    const db = getAdminDb();
    const doc = await db.collection('onlineCourses').doc(id).get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data() as OnlineCourse;
    const converted = convertTimestampsToISO(data);
    return { ...converted, id: doc.id };
  } catch (error) {
    console.error(`Error en getOnlineCourseByIdFromFirestore para ${id}:`, error);
    throw error;
  }
}


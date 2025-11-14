/**
 * Funciones helper para leer cursos online desde Firestore
 */

import { getAdminDb } from '@/lib/firebase/admin';
import type { OnlineCourse } from '@/types/firestore';

/**
 * Obtiene todos los cursos online activos (status === 'publish') desde Firestore
 */
export async function getAllOnlineCoursesFromFirestore(): Promise<OnlineCourse[]> {
  const db = getAdminDb();
  const snapshot = await db
    .collection('onlineCourses')
    .where('status', '==', 'publish')
    .get();

  const courses: OnlineCourse[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data() as OnlineCourse;
    courses.push({ ...data, id: doc.id });
  });

  return courses;
}

/**
 * Obtiene un curso online por ID desde Firestore
 */
export async function getOnlineCourseByIdFromFirestore(id: string): Promise<OnlineCourse | null> {
  const db = getAdminDb();
  const doc = await db.collection('onlineCourses').doc(id).get();

  if (!doc.exists) {
    return null;
  }

  const data = doc.data() as OnlineCourse;
  return { ...data, id: doc.id };
}


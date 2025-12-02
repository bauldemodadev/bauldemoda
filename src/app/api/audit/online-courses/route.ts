/**
 * API: Auditar Cursos Online en Firestore
 * 
 * GET /api/audit/online-courses
 * Lista todos los cursos online con sus IDs, títulos, lecciones, etc.
 */

import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';

export async function GET() {
  try {
    const db = getAdminDb();
    
    // Obtener todos los cursos online
    const snapshot = await db.collection('onlineCourses').get();
    
    const courses: any[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      courses.push({
        id: doc.id,
        wpId: data.wpId,
        slug: data.slug,
        title: data.title,
        shortDescription: data.shortDescription || '',
        status: data.status,
        totalLessons: data.lessons?.length || 0,
        relatedProductId: data.relatedProductId,
        relatedProductWpId: data.relatedProductWpId,
      });
    });

    // Ordenar por ID
    courses.sort((a, b) => {
      const numA = parseInt(a.id);
      const numB = parseInt(b.id);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.id.localeCompare(b.id);
    });

    return NextResponse.json({
      success: true,
      total: courses.length,
      courses,
    });

  } catch (error) {
    console.error('Error auditando cursos:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}


/**
 * API Route: Listado de cursos online
 * GET /api/online-courses
 */

import { NextResponse } from 'next/server';
import { getAllOnlineCoursesFromFirestore } from '@/lib/firestore/onlineCourses';

// OPTIMIZADO: Cache con revalidación
export const revalidate = 300;

export async function GET(request: Request) {
  try {
    const courses = await getAllOnlineCoursesFromFirestore();
    return NextResponse.json(courses);
  } catch (error) {
    console.error('❌ Error fetching online courses:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { 
        error: 'Failed to fetch online courses',
        details: error instanceof Error ? error.message : String(error),
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      },
      { status: 500 }
    );
  }
}


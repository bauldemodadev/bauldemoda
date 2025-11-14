/**
 * API Route: Listado de cursos online
 * GET /api/online-courses
 */

import { NextResponse } from 'next/server';
import { getAllOnlineCoursesFromFirestore } from '@/lib/firestore/onlineCourses';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const courses = await getAllOnlineCoursesFromFirestore();
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching online courses:', error);
    return NextResponse.json({ error: 'Failed to fetch online courses' }, { status: 500 });
  }
}


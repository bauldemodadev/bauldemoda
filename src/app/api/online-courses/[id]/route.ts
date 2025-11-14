/**
 * API Route: Detalle de curso online
 * GET /api/online-courses/[id]
 */

import { NextResponse } from 'next/server';
import { getOnlineCourseByIdFromFirestore } from '@/lib/firestore/onlineCourses';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id;
    const course = await getOnlineCourseByIdFromFirestore(courseId);
    
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    
    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching online course:', error);
    return NextResponse.json({ error: 'Failed to fetch online course' }, { status: 500 });
  }
}


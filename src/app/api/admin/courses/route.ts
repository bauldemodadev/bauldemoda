import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { requireAdminAuth } from '@/lib/admin/auth';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    await requireAdminAuth();
    
    const db = getAdminDb();
    const data = await request.json();

    // Limpiar campos undefined
    const cleanedData = { ...data };
    if (cleanedData.lessons) {
      cleanedData.lessons = cleanedData.lessons.map((lesson: any) => {
        const clean: any = { ...lesson };
        if (clean.videoPassword === undefined) delete clean.videoPassword;
        if (clean.duration === undefined) delete clean.duration;
        return clean;
      });
    }
    if (cleanedData.infoBlocks) {
      cleanedData.infoBlocks = cleanedData.infoBlocks.map((block: any) => {
        const clean: any = { ...block };
        if (clean.imageUrl === undefined || clean.imageUrl === '') clean.imageUrl = null;
        return clean;
      });
    }
    if (cleanedData.thumbnailUrl === undefined || cleanedData.thumbnailUrl === '') {
      cleanedData.thumbnailUrl = null;
    }

    const now = Timestamp.now();
    const newCourse = {
      ...cleanedData,
      wpId: 0,
      createdAt: now,
      updatedAt: now,
    };

    const { id, ...courseData } = newCourse;
    const docRef = await db.collection('onlineCourses').add(courseData);

    return NextResponse.json({ id: docRef.id, success: true });
  } catch (error) {
    console.error('Error creando curso:', error);
    return NextResponse.json(
      { error: 'Error al crear curso' },
      { status: 500 }
    );
  }
}


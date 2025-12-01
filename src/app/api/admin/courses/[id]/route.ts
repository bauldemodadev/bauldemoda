import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { requireAdminAuth } from '@/lib/admin/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdminAuth();
    
    const db = getAdminDb();
    const courseId = params.id;

    await db.collection('onlineCourses').doc(courseId).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error eliminando curso:', error);
    return NextResponse.json(
      { error: 'Error al eliminar curso' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdminAuth();
    
    const db = getAdminDb();
    const courseId = params.id;
    const data = await request.json();

    // Limpiar campos undefined de lessons e infoBlocks
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

    await db.collection('onlineCourses').doc(courseId).update({
      ...cleanedData,
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error actualizando curso:', error);
    return NextResponse.json(
      { error: 'Error al actualizar curso' },
      { status: 500 }
    );
  }
}


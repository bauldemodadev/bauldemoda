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
    const tipId = params.id;

    await db.collection('tips').doc(tipId).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error eliminando tip:', error);
    return NextResponse.json(
      { error: 'Error al eliminar tip' },
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
    const tipId = params.id;
    const data = await request.json();

    // Limpiar campos undefined
    const cleanedData = { ...data };
    if (cleanedData.downloadMediaId === undefined) delete cleanedData.downloadMediaId;

    await db.collection('tips').doc(tipId).update({
      ...cleanedData,
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error actualizando tip:', error);
    return NextResponse.json(
      { error: 'Error al actualizar tip' },
      { status: 500 }
    );
  }
}


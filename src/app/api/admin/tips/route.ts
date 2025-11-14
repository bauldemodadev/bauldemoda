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
    if (cleanedData.downloadMediaId === undefined) delete cleanedData.downloadMediaId;

    const now = Timestamp.now();
    const newTip = {
      ...cleanedData,
      wpId: 0,
      createdAt: now,
      updatedAt: now,
    };

    const { id, ...tipData } = newTip;
    const docRef = await db.collection('tips').add(tipData);

    return NextResponse.json({ id: docRef.id, success: true });
  } catch (error) {
    console.error('Error creando tip:', error);
    return NextResponse.json(
      { error: 'Error al crear tip' },
      { status: 500 }
    );
  }
}


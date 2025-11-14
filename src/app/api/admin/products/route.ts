import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { requireAdminAuth } from '@/lib/admin/auth';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    await requireAdminAuth();
    
    const db = getAdminDb();
    const data = await request.json();

    // Crear nuevo producto
    const now = Timestamp.now();
    const newProduct = {
      ...data,
      wpId: 0, // Se puede actualizar después
      createdAt: now,
      updatedAt: now,
    };

    // Remover id si viene en los datos
    const { id, ...productData } = newProduct;

    const docRef = await db.collection('products').add(productData);

    return NextResponse.json({ id: docRef.id, success: true });
  } catch (error) {
    console.error('Error creando producto:', error);
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    );
  }
}


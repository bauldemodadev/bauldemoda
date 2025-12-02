/**
 * API: Crear/Actualizar Perfil de Usuario
 * 
 * POST /api/auth/create-profile
 * Crea o actualiza el perfil del usuario en Firestore collection 'customers'
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    const { uid, email, name } = await request.json();

    if (!uid || !email) {
      return NextResponse.json(
        { error: 'UID y email son requeridos' },
        { status: 400 }
      );
    }

    const db = getAdminDb();

    // Verificar si ya existe un perfil para este UID
    const customerRef = db.collection('customers').doc(uid);
    const customerDoc = await customerRef.get();

    if (customerDoc.exists) {
      // Actualizar perfil existente solo si es necesario
      const existingData = customerDoc.data();
      const updates: any = {
        updatedAt: Timestamp.now(),
      };

      // Solo actualizar campos si están vacíos o cambiaron
      if (name && !existingData?.name) {
        updates.name = name;
      }
      if (email && existingData?.email !== email) {
        updates.email = email;
      }

      if (Object.keys(updates).length > 1) { // Más que solo updatedAt
        await customerRef.update(updates);
      }

      return NextResponse.json({
        success: true,
        message: 'Perfil actualizado',
        isNew: false
      });
    }

    // Crear nuevo perfil
    await customerRef.set({
      email,
      name: name || '',
      phone: '',
      dni: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'AR',
      },
      enrolledCourses: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({
      success: true,
      message: 'Perfil creado exitosamente',
      isNew: true
    });

  } catch (error) {
    console.error('Error creando perfil:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}


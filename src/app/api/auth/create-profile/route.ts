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

    // IMPORTANTE: Usar UID como ID del documento (no crear nuevos)
    const customerRef = db.collection('customers').doc(uid);
    const customerDoc = await customerRef.get();

    if (customerDoc.exists) {
      // Ya existe, no hacer nada (evitar actualizaciones innecesarias)
      console.log(`Perfil ya existe para UID: ${uid}, no se crea duplicado`);
      
      return NextResponse.json({
        success: true,
        message: 'Perfil ya existe',
        isNew: false,
        action: 'skipped' // Indica que no se hizo nada
      });
    }

    // SOLO crear si NO existe
    console.log(`Creando nuevo perfil para UID: ${uid}, email: ${email}`);
    
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
      isNew: true,
      action: 'created'
    });

  } catch (error) {
    console.error('Error en create-profile:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}


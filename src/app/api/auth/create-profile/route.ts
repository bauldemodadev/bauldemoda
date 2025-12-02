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
    
    // Normalizar email (Firebase Auth lo guarda en minúsculas)
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Verificar si YA existe un customer con este UID
    const customerRef = db.collection('customers').doc(uid);
    const customerDoc = await customerRef.get();

    if (customerDoc.exists) {
      console.log(`Perfil ya existe para UID: ${uid}, no se crea duplicado`);
      
      return NextResponse.json({
        success: true,
        message: 'Perfil ya existe',
        isNew: false,
        action: 'skipped'
      });
    }

    // 2. Buscar si existe un customer ANTIGUO con este email (puede tener ID = email)
    const existingCustomerSnapshot = await db.collection('customers')
      .where('email', '==', normalizedEmail)
      .limit(1)
      .get();

    if (!existingCustomerSnapshot.empty) {
      // Ya existe un customer con este email (usuario antiguo)
      // Copiar sus datos al nuevo UID y eliminar el viejo
      const oldCustomerDoc = existingCustomerSnapshot.docs[0];
      const oldCustomerData = oldCustomerDoc.data();
      
      console.log(`Migrando perfil existente ${oldCustomerDoc.id} → ${uid}`);
      
      // Crear nuevo documento con UID correcto, preservando datos antiguos
      await customerRef.set({
        email: normalizedEmail,
        name: oldCustomerData.name || name || '',
        phone: oldCustomerData.phone || '',
        dni: oldCustomerData.dni || '',
        address: oldCustomerData.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'AR',
        },
        enrolledCourses: oldCustomerData.enrolledCourses || [],
        createdAt: oldCustomerData.createdAt || Timestamp.now(),
        updatedAt: Timestamp.now(),
        migratedFrom: oldCustomerDoc.id, // Registro de auditoría
      });
      
      // Eliminar el documento viejo
      await oldCustomerDoc.ref.delete();
      
      return NextResponse.json({
        success: true,
        message: 'Perfil migrado desde cuenta antigua',
        isNew: false,
        action: 'migrated',
        oldId: oldCustomerDoc.id,
        newId: uid
      });
    }

    // 3. SOLO si NO existe ningún customer, crear uno nuevo
    console.log(`Creando nuevo perfil para UID: ${uid}, email: ${normalizedEmail}`);
    
    await customerRef.set({
      email: normalizedEmail,
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


/**
 * API Route: Listado de Clientes
 * GET /api/customers
 */

import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';
import type { Customer } from '@/types/firestore/customer';

const USE_FIRESTORE = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function serializeCustomer(customer: any): any {
  const serialized = { ...customer };
  
  if (serialized.createdAt instanceof Timestamp) {
    serialized.createdAt = serialized.createdAt.toDate().toISOString();
  }
  if (serialized.lastOrderAt instanceof Timestamp) {
    serialized.lastOrderAt = serialized.lastOrderAt.toDate().toISOString();
  }
  if (serialized.enrolledCourses) {
    serialized.enrolledCourses = serialized.enrolledCourses.map((enrollment: any) => {
      if (enrollment.accessFrom instanceof Timestamp) {
        enrollment.accessFrom = enrollment.accessFrom.toDate().toISOString();
      }
      if (enrollment.accessTo instanceof Timestamp) {
        enrollment.accessTo = enrollment.accessTo.toDate().toISOString();
      }
      return enrollment;
    });
  }
  
  return serialized;
}

export async function GET(request: Request) {
  try {
    if (!USE_FIRESTORE) {
      return NextResponse.json(
        { error: 'Firestore no está habilitado' },
        { status: 400 }
      );
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);
    const search = url.searchParams.get('search'); // Buscar por nombre o email

    const db = getAdminDb();
    let query = db.collection('customers').orderBy('createdAt', 'desc');

    // Búsqueda básica (Firestore no soporta búsqueda full-text, esto es limitado)
    // En producción, considerar usar Algolia o similar
    const snapshot = await query.limit(limit).offset(offset).get();

    let customers: Customer[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as Omit<Customer, 'id'>;
      
      // Asegurar que las estadísticas tengan valores por defecto para evitar NaN
      const customer = {
        id: doc.id,
        totalOrders: data.totalOrders || 0,
        totalSpent: data.totalSpent || 0,
        enrolledCourses: data.enrolledCourses || [],
        tags: data.tags || [],
        ...data,
      };

      // Filtrar por búsqueda si existe
      if (search) {
        const searchLower = search.toLowerCase();
        const matches =
          customer.name.toLowerCase().includes(searchLower) ||
          customer.email.toLowerCase().includes(searchLower);
        if (!matches) return;
      }

      customers.push(customer);
    });

    // Si hay búsqueda, reordenar por relevancia (simple)
    if (search) {
      customers.sort((a, b) => {
        const searchLower = search.toLowerCase();
        const aName = a.name.toLowerCase().indexOf(searchLower);
        const bName = b.name.toLowerCase().indexOf(searchLower);
        if (aName !== -1 && bName !== -1) return aName - bName;
        if (aName !== -1) return -1;
        if (bName !== -1) return 1;
        return 0;
      });
    }

    return NextResponse.json({
      customers: customers.map(serializeCustomer),
      pagination: {
        total: customers.length, // Aproximado, en producción calcular mejor
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    return NextResponse.json(
      {
        error: 'Error al obtener clientes',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!USE_FIRESTORE) {
      return NextResponse.json(
        { error: 'Firestore no está habilitado' },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log('📥 POST /api/customers - Body recibido:', JSON.stringify(body, null, 2));
    
    const { email, nombre, telefono, dni, uid } = body;

    if (!email || !nombre) {
      console.warn('⚠️ POST /api/customers - Datos incompletos:', { email, nombre });
      return NextResponse.json(
        { error: 'Email y nombre son requeridos' },
        { status: 400 }
      );
    }

    // Limpiar y validar datos
    const cleanEmail = (email || '').trim();
    const cleanNombre = (nombre || '').trim();
    const cleanTelefono = telefono ? (telefono || '').trim() : undefined;
    const cleanDni = dni ? (dni || '').trim() : undefined;
    const cleanUid = uid ? (uid || '').trim() : undefined;

    if (!cleanEmail || !cleanNombre) {
      console.warn('⚠️ POST /api/customers - Datos incompletos después de limpiar:', { email: cleanEmail, nombre: cleanNombre });
      return NextResponse.json(
        { error: 'Email y nombre son requeridos y no pueden estar vacíos' },
        { status: 400 }
      );
    }

    console.log('🔄 POST /api/customers - Llamando a upsertCustomer con:', {
      uid: cleanUid || null,
      email: cleanEmail,
      name: cleanNombre,
      phone: cleanTelefono || undefined,
      dni: cleanDni || undefined,
    });

    // Usar la función upsertCustomer de firestore/customers
    const { upsertCustomer } = await import('@/lib/firestore/customers');
    
    const customer = await upsertCustomer({
      uid: cleanUid || undefined,
      email: cleanEmail,
      name: cleanNombre,
      phone: cleanTelefono,
      dni: cleanDni,
      totalOrders: 0,
      totalSpent: 0,
      tags: [],
      enrolledCourses: [],
    });

    console.log('✅ POST /api/customers - Cliente creado/actualizado exitosamente:', customer.id);

    return NextResponse.json({
      success: true,
      data: serializeCustomer(customer),
    });
  } catch (error) {
    console.error('Error creando/actualizando cliente:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      {
        error: 'Error al crear/actualizar el cliente',
        details: error instanceof Error ? error.message : String(error),
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined,
      },
      { status: 500 }
    );
  }
}


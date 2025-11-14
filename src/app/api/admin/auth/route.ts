/**
 * API Route para manejar autenticación del panel admin
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminAuth } from '@/lib/admin/auth';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 400 });
    }

    // Crear respuesta con cookie
    const response = NextResponse.json({ success: true });
    
    // Guardar token en cookie httpOnly usando la respuesta
    response.cookies.set('firebase-auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error en /api/admin/auth:', error);
    return NextResponse.json({ error: 'Error al guardar token' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const email = await verifyAdminAuth();
    
    if (email) {
      return NextResponse.json({ authenticated: true, email });
    }
    
    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (error) {
    console.error('Error verificando autenticación:', error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('firebase-auth-token');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar token:', error);
    return NextResponse.json({ error: 'Error al cerrar sesión' }, { status: 500 });
  }
}


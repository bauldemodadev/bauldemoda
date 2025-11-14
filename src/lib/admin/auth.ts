/**
 * Utilidades de autenticación para el panel admin
 */

import { getAdminAuth } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Email del admin principal
const ADMIN_EMAIL = 'admin@admin.com';

/**
 * Verifica si el usuario actual es admin
 * @param email Email del usuario
 * @returns true si es admin
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  return email === ADMIN_EMAIL;
}

/**
 * Obtiene el token de Firebase Auth desde las cookies
 */
async function getAuthToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('firebase-auth-token')?.value;
    return token || null;
  } catch (error) {
    console.error('Error obteniendo token de cookies:', error);
    return null;
  }
}

/**
 * Verifica la autenticación del admin en el servidor
 * @returns Email del admin si está autenticado, null si no
 */
export async function verifyAdminAuth(): Promise<string | null> {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      return null;
    }

    // Verificar el token con Firebase Admin
    const adminAuth = getAdminAuth();
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    // Verificar que el email sea el admin
    if (isAdminEmail(decodedToken.email)) {
      return decodedToken.email || null;
    }

    return null;
  } catch (error) {
    console.error('Error verificando autenticación admin:', error);
    return null;
  }
}

/**
 * Middleware para proteger rutas admin
 * Redirige a /admin/login si no está autenticado
 */
export async function requireAdminAuth() {
  const email = await verifyAdminAuth();
  
  if (!email) {
    redirect('/admin/login');
  }
  
  return email;
}


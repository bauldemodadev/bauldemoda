/**
 * Utilidades de autenticación para el panel admin
 */

import { getAdminAuth } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Emails de administradores
const ADMIN_EMAILS = [
  'admin@admin.com',
  'almagro@admin.com',
  'ciudadjardin@admin.com',
];

/**
 * Verifica si el usuario actual es admin
 * @param email Email del usuario
 * @returns true si es admin
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
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
      console.log('Admin auth: No token found');
      return null;
    }

    // Verificar el token con Firebase Admin
    const adminAuth = getAdminAuth();
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    // Verificar que el email sea uno de los admins permitidos
    if (isAdminEmail(decodedToken.email)) {
      console.log('Admin auth: Authenticated as', decodedToken.email);
      return decodedToken.email || null;
    }

    console.log('Admin auth: Email is not admin:', decodedToken.email);
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
  try {
    const email = await verifyAdminAuth();
    
    if (!email) {
      console.log('Admin auth: Redirecting to login');
      redirect('/admin/login');
    }
    
    return email;
  } catch (error) {
    // Si hay un error (incluyendo redirect), re-lanzarlo
    // redirect() lanza un error especial que Next.js maneja
    console.error('Admin auth: Error in requireAdminAuth:', error);
    throw error;
  }
}


/**
 * Firebase Admin SDK - Inicialización para uso en servidor (API Routes, scripts)
 * 
 * Este módulo inicializa Firebase Admin SDK que se usa en:
 * - Scripts de migración
 * - API Routes que requieren permisos administrativos
 * - Operaciones batch de escritura/lectura
 * 
 * IMPORTANTE: Solo funciona en servidor (Node.js), no en el navegador
 */

import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Variables para almacenar las instancias (singleton pattern)
let adminApp: App | null = null;
let adminDb: Firestore | null = null;

/**
 * Inicializa Firebase Admin SDK
 * 
 * Soporta dos formas de configuración:
 * 1. Service Account JSON completo (FIREBASE_SERVICE_ACCOUNT_JSON)
 * 2. Campos individuales (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)
 */
function initializeAdmin(): { adminApp: App; adminDb: Firestore } {
  // Si ya está inicializado, retornar instancias existentes
  if (adminApp && adminDb) {
    return { adminApp, adminDb };
  }

  // Verificar si ya hay una app inicializada
  const existingApps = getApps();
  if (existingApps.length > 0) {
    adminApp = existingApps[0];
    adminDb = getFirestore(adminApp);
    return { adminApp, adminDb };
  }

  console.log('🔧 Inicializando Firebase Admin...');
  
  // Intentar obtener credenciales desde Service Account JSON
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  
  let credential;
  
  if (serviceAccountJson) {
    try {
      // Si viene como string JSON, parsearlo
      let serviceAccount: any;
      if (typeof serviceAccountJson === 'string') {
        // Parsear el JSON
        serviceAccount = JSON.parse(serviceAccountJson);
        // Asegurar que los \n en private_key se conviertan a saltos de línea reales
        if (serviceAccount.private_key && typeof serviceAccount.private_key === 'string') {
          serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }
      } else {
        serviceAccount = serviceAccountJson;
      }
      
      credential = cert(serviceAccount);
    } catch (error) {
      console.error('❌ Error al parsear FIREBASE_SERVICE_ACCOUNT_JSON:', error);
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON inválido');
    }
  } else {
    // Fallback: usar campos individuales
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        'Firebase Admin: Se requiere FIREBASE_SERVICE_ACCOUNT_JSON o ' +
        'FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY'
      );
    }

    credential = cert({
      projectId,
      clientEmail,
      privateKey,
    });
  }

  // Inicializar la app
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) {
      throw new Error('FIREBASE_PROJECT_ID o NEXT_PUBLIC_FIREBASE_PROJECT_ID no está definido');
    }
    
    console.log(`✅ Inicializando Firebase Admin con projectId: ${projectId}`);
    adminApp = initializeApp({
      credential,
      projectId,
    });

    // Obtener instancia de Firestore
    adminDb = getFirestore(adminApp);
    console.log('✅ Firebase Admin inicializado correctamente');

    return { adminApp, adminDb };
  } catch (error) {
    console.error('❌ Error al inicializar Firebase Admin:', error);
    throw error;
  }
}

/**
 * Obtiene la instancia de Firebase Admin App
 * Inicializa si es necesario
 */
export function getAdminApp(): App {
  if (!adminApp) {
    initializeAdmin();
  }
  if (!adminApp) {
    throw new Error('No se pudo inicializar Firebase Admin App');
  }
  return adminApp;
}

/**
 * Obtiene la instancia de Firestore Admin
 * Inicializa si es necesario
 * 
 * Esta es la instancia que DEBE usarse en:
 * - Scripts de migración
 * - API Routes que requieren permisos administrativos
 */
export function getAdminDb(): Firestore {
  try {
    if (!adminDb) {
      initializeAdmin();
    }
    if (!adminDb) {
      const error = new Error('No se pudo inicializar Firebase Admin Firestore. Verifica las variables de entorno FIREBASE_SERVICE_ACCOUNT_JSON o FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY');
      console.error('❌ Error inicializando Firebase Admin:', error);
      throw error;
    }
    return adminDb;
  } catch (error) {
    console.error('❌ Error en getAdminDb:', error);
    throw error;
  }
}

// Exportar también como adminDb para compatibilidad directa
export { adminDb };

// Inicializar automáticamente si estamos en servidor
if (typeof window === 'undefined') {
  try {
    initializeAdmin();
  } catch (error) {
    // No lanzar error aquí para permitir que el proyecto funcione
    // sin Admin SDK si no está configurado aún
    console.warn('⚠️ Firebase Admin SDK no inicializado. Esto es normal si aún no has configurado las credenciales.');
    console.warn('   Para scripts de migración, configura FIREBASE_SERVICE_ACCOUNT_JSON o las variables individuales.');
  }
}


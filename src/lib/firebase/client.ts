/**
 * Firebase Client SDK - Inicialización para uso en el frontend
 * 
 * Este módulo inicializa Firebase solo en el cliente (navegador)
 * y evita múltiples inicializaciones.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * Valida que la configuración de Firebase sea válida
 */
const isValidConfig = (cfg: Record<string, any>): boolean => {
  return Boolean(cfg.apiKey && cfg.authDomain && cfg.projectId && cfg.appId);
};

// Variables para almacenar las instancias (singleton pattern)
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let auth: Auth | null = null;

/**
 * Inicializa Firebase solo en el cliente y si hay configuración válida
 * Evita múltiples inicializaciones usando getApps()
 */
if (typeof window !== 'undefined' && isValidConfig(firebaseConfig)) {
  // Si ya hay una app inicializada, usar esa; sino, inicializar nueva
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);
}

export { app, db, storage, auth };


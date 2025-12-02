"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from '@/lib/firebase/client'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged, 
  signOut as fbSignOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth'

export interface User { 
  uid: string; 
  email: string | null;
  emailVerified?: boolean;
  displayName?: string | null;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Track processed UIDs para evitar procesar múltiples veces
  const [processedUsers, setProcessedUsers] = useState<Set<string>>(() => {
    // Cargar desde localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('processedUsers');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    }
    return new Set();
  });

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase Auth no está inicializado. Revisa tus variables de entorno.');
    const cred = await signInWithEmailAndPassword(auth, email, password);
    
    // Solo procesar si no lo hemos hecho antes
    if (!processedUsers.has(cred.user.uid)) {
      // Vincular órdenes antiguas automáticamente (solo primera vez)
      await linkLegacyOrders(cred.user.uid, email);
      
      // Marcar como procesado
      setProcessedUsers(prev => new Set(prev).add(cred.user.uid));
    }
    
    setUser({ 
      uid: cred.user.uid, 
      email: cred.user.email,
      emailVerified: cred.user.emailVerified,
      displayName: cred.user.displayName
    });
  }

  const signUp = async (email: string, password: string, name: string) => {
    if (!auth) throw new Error('Firebase Auth no está inicializado. Revisa tus variables de entorno.');
    
    // Crear usuario en Firebase Auth
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    
    // Actualizar perfil con nombre
    await updateProfile(cred.user, { displayName: name });
    
    // 🔕 EMAIL DE VERIFICACIÓN DESHABILITADO TEMPORALMENTE
    // Para habilitar, descomenta la siguiente línea:
    // await sendEmailVerification(cred.user);
    
    // Crear perfil en Firestore (esto usa UID como ID, no duplica)
    await createUserProfile(cred.user.uid, email, name);
    
    // Vincular órdenes antiguas automáticamente 🎯
    await linkLegacyOrders(cred.user.uid, email);
    
    // Marcar como procesado
    setProcessedUsers(prev => new Set(prev).add(cred.user.uid));
    
    setUser({ 
      uid: cred.user.uid, 
      email: cred.user.email,
      emailVerified: cred.user.emailVerified,
      displayName: name
    });
  }

  const signInWithGoogle = async () => {
    if (!auth) throw new Error('Firebase Auth no está inicializado. Revisa tus variables de entorno.');
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const cred = await signInWithPopup(auth, provider);
    
    // Solo procesar si no lo hemos hecho antes
    if (!processedUsers.has(cred.user.uid)) {
      // Primero crear/verificar perfil (usa UID como ID, no duplica)
      await createUserProfile(cred.user.uid, cred.user.email || '', cred.user.displayName || '');
      
      // Luego vincular órdenes antiguas (solo primera vez)
      await linkLegacyOrders(cred.user.uid, cred.user.email || '');
      
      // Marcar como procesado
      setProcessedUsers(prev => new Set(prev).add(cred.user.uid));
    }
    
    setUser({ 
      uid: cred.user.uid, 
      email: cred.user.email,
      emailVerified: cred.user.emailVerified,
      displayName: cred.user.displayName
    });
  }

  const signOut = async () => {
    if (!auth) {
      setUser(null);
      return;
    }
    await fbSignOut(auth);
    setUser(null);
    
    // Limpiar cache de usuarios procesados (opcional - permite reprocesar al volver a loguear)
    // Si quieres que se vuelva a vincular al re-loguear, descomenta las siguientes líneas:
    // setProcessedUsers(new Set());
    // localStorage.removeItem('processedUsers');
  }

  const resetPassword = async (email: string) => {
    if (!auth) throw new Error('Firebase Auth no está inicializado.');
    await sendPasswordResetEmail(auth, email);
  }

  const sendVerificationEmail = async () => {
    if (!auth?.currentUser) throw new Error('No hay usuario autenticado.');
    await sendEmailVerification(auth.currentUser);
  }

  const updateUserProfile = async (displayName: string) => {
    if (!auth?.currentUser) throw new Error('No hay usuario autenticado.');
    await updateProfile(auth.currentUser, { displayName });
    setUser(prev => prev ? { ...prev, displayName } : null);
  }

  // Función auxiliar para vincular órdenes antiguas
  const linkLegacyOrders = async (uid: string, email: string) => {
    try {
      await fetch('/api/auth/link-legacy-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, email }),
      });
    } catch (error) {
      console.error('Error vinculando órdenes antiguas:', error);
      // No lanzar error para no bloquear el login
    }
  }

  // Función auxiliar para crear perfil de usuario
  const createUserProfile = async (uid: string, email: string, name: string) => {
    try {
      await fetch('/api/auth/create-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, email, name }),
      });
    } catch (error) {
      console.error('Error creando perfil:', error);
      // No lanzar error para no bloquear el login
    }
  }

  // Guardar processedUsers en localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('processedUsers', JSON.stringify(Array.from(processedUsers)));
    }
  }, [processedUsers]);

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser({ 
          uid: u.uid, 
          email: u.email,
          emailVerified: u.emailVerified,
          displayName: u.displayName
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      isLoading, 
      signIn, 
      signUp,
      signInWithGoogle, 
      signOut,
      resetPassword,
      sendVerificationEmail,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 
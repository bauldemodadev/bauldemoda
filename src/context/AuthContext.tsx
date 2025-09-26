"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from '@/lib/firebase'
import { signInWithEmailAndPassword, onAuthStateChanged, signOut as fbSignOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

export interface User { uid: string; email: string | null }

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase Auth no está inicializado. Revisa tus variables de entorno.');
    const cred = await signInWithEmailAndPassword(auth, email, password)
    setUser({ uid: cred.user.uid, email: cred.user.email })
  }

  const signInWithGoogle = async () => {
    if (!auth) throw new Error('Firebase Auth no está inicializado. Revisa tus variables de entorno.');
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    const cred = await signInWithPopup(auth, provider)
    setUser({ uid: cred.user.uid, email: cred.user.email })
  }

  const signOut = async () => {
    if (!auth) {
      setUser(null)
      return
    }
    await fbSignOut(auth)
    setUser(null)
  }

  useEffect(() => {
    if (!auth) {
      setIsLoading(false)
      return
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUser({ uid: u.uid, email: u.email })
      else setUser(null)
      setIsLoading(false)
    })
    return () => unsub()
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, signIn, signInWithGoogle, signOut }}>
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
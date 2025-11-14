'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, Mail, Lock, Loader2 } from 'lucide-react';
import Image from 'next/image';

const ADMIN_EMAIL = 'admin@admin.com';
const ADMIN_PASSWORD = 'admin2025+!';

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasNonAdminSession, setHasNonAdminSession] = useState(false);
  const [nonAdminEmail, setNonAdminEmail] = useState<string | null>(null);

  // Detectar si hay una sesión de Firebase activa que no sea admin
  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email !== ADMIN_EMAIL) {
        // Hay un usuario logueado pero no es admin
        setHasNonAdminSession(true);
        setNonAdminEmail(user.email);
        
        // Cerrar la sesión del usuario no admin
        try {
          if (auth) {
            await signOut(auth);
            toast({
              variant: 'default',
              title: 'Sesión cerrada',
              description: 'Se cerró tu sesión de usuario. El panel de administración requiere credenciales específicas.',
            });
          }
        } catch (error) {
          console.error('Error cerrando sesión:', error);
        }
      } else {
        setHasNonAdminSession(false);
        setNonAdminEmail(null);
      }
    });

    return () => unsubscribe();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!auth) {
        throw new Error('Firebase Auth no está inicializado');
      }

      // Autenticar con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // Verificar que sea el admin
      if (userCredential.user.email !== ADMIN_EMAIL) {
        await auth.signOut();
        throw new Error('Este email no tiene permisos de administrador. Solo el administrador autorizado puede acceder.');
      }

      // Guardar token en cookie
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }),
        credentials: 'include', // Asegurar que las cookies se incluyan
      });

      if (!response.ok) {
        throw new Error('Error al guardar token de autenticación');
      }

      // Verificar que la cookie esté disponible antes de redirigir
      let retries = 0;
      const maxRetries = 5;
      let cookieAvailable = false;

      while (retries < maxRetries && !cookieAvailable) {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        try {
          const verifyResponse = await fetch('/api/admin/auth', {
            method: 'GET',
            credentials: 'include',
            cache: 'no-store',
          });

          if (verifyResponse.ok) {
            const data = await verifyResponse.json();
            if (data.email === 'admin@admin.com') {
              cookieAvailable = true;
            }
          }
        } catch (error) {
          console.error('Error verificando cookie:', error);
        }

        retries++;
      }

      if (!cookieAvailable) {
        // Si después de varios intentos la cookie no está disponible, 
        // redirigir de todos modos (podría ser un problema de timing)
        console.warn('Cookie no verificada completamente, redirigiendo de todos modos');
      }

      toast({
        title: 'Inicio de sesión exitoso',
        description: 'Bienvenido al panel de administración',
      });

      // Usar window.location para forzar recarga completa
      // Esto asegura que la cookie esté disponible cuando el servidor renderice la página
      window.location.href = '/admin';
    } catch (error: any) {
      console.error('Error en login:', error);
      toast({
        variant: 'destructive',
        title: 'Error de autenticación',
        description: error.message || 'Credenciales incorrectas',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-pink-50/30 to-gray-100 p-4">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[#E9ABBD] opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-[#E9ABBD] opacity-10 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Card principal */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header con logo */}
          <div className="bg-gradient-to-br from-[#E9ABBD] to-[#D44D7D] p-8 pb-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative w-48 h-20">
                <Image
                  src="/logo.svg"
                  alt="Baúl de Moda"
                  fill
                  className="object-contain drop-shadow-lg"
                  style={{ filter: 'brightness(0) invert(1)' }}
                  priority
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Panel de Administración
            </h1>
            <p className="text-white/90 text-sm">
              Acceso exclusivo para administradores
            </p>
          </div>

          {/* Contenido del formulario */}
          <div className="p-8 space-y-6">
            {/* Mensaje si había una sesión no admin */}
            {hasNonAdminSession && nonAdminEmail && (
              <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-4 transition-all duration-300 ease-in-out">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-amber-900">
                      Sesión de usuario cerrada
                    </p>
                    <p className="mt-1 text-sm text-amber-800">
                      Detectamos una sesión activa con <strong>{nonAdminEmail}</strong>. 
                      El panel de administración requiere credenciales específicas de administrador.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Campo Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E9ABBD] focus:border-[#E9ABBD] transition-all duration-200 text-gray-900 placeholder-gray-400"
                    placeholder="admin@admin.com"
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E9ABBD] focus:border-[#E9ABBD] transition-all duration-200 text-gray-900 placeholder-gray-400"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Botón de envío */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  backgroundColor: isLoading ? '#E9ABBD' : '#E9ABBD',
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg text-white font-semibold text-base transition-all duration-200 hover:bg-[#D44D7D] focus:outline-none focus:ring-2 focus:ring-[#E9ABBD] focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <span>Iniciar sesión</span>
                )}
              </button>
            </form>

            {/* Footer decorativo */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-center text-gray-500">
                Protegido por autenticación segura
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


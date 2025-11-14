'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle } from 'lucide-react';

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
          await signOut(auth);
          toast({
            variant: 'default',
            title: 'Sesión cerrada',
            description: 'Se cerró tu sesión de usuario. El panel de administración requiere credenciales específicas.',
          });
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
      });

      if (!response.ok) {
        throw new Error('Error al guardar token de autenticación');
      }

      // Esperar un momento para asegurar que la cookie esté disponible
      await new Promise(resolve => setTimeout(resolve, 100));

      toast({
        title: 'Inicio de sesión exitoso',
        description: 'Bienvenido al panel de administración',
      });

      // Refrescar el router para que Next.js reconozca la nueva cookie
      router.refresh();
      
      // Usar window.location para forzar recarga completa y que el servidor tenga la cookie
      // Pequeño delay para asegurar que el refresh se complete
      setTimeout(() => {
        window.location.href = '/admin';
      }, 150);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Panel de Administración
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Inicia sesión con credenciales de administrador
          </p>
        </div>

        {/* Mensaje si había una sesión no admin */}
        {hasNonAdminSession && nonAdminEmail && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">
                  Sesión de usuario cerrada
                </p>
                <p className="mt-1 text-sm text-yellow-700">
                  Detectamos una sesión activa con <strong>{nonAdminEmail}</strong>. 
                  El panel de administración requiere credenciales específicas de administrador.
                </p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


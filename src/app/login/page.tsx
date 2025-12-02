"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import AuthModal from "@/components/auth/AuthModal";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams?.get("redirect") || null;

  const handleClose = () => {
    // Si hay redirect, ir ahí, sino volver atrás
    if (redirectParam) {
      router.replace(decodeURIComponent(redirectParam));
    } else {
      router.replace('/');
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("Inicio de sesión exitoso");
      
      // Redirigir: redirect param > home
      const target = redirectParam ? decodeURIComponent(redirectParam) : '/';
      
      // Usar replace para evitar volver atrás al login
      setTimeout(() => {
        router.replace(target);
      }, 500);
      
    } catch (error: any) {
      console.error("Error signing in:", error);
      
      if (error.code === 'auth/user-not-found') {
        toast.error("No existe una cuenta con este email");
      } else if (error.code === 'auth/wrong-password') {
        toast.error("Contraseña incorrecta");
      } else if (error.code === 'auth/invalid-email') {
        toast.error("Email inválido");
      } else if (error.code === 'auth/too-many-requests') {
        toast.error("Demasiados intentos fallidos. Intenta más tarde.");
      } else {
        toast.error("Error al iniciar sesión. Por favor intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Inicio de sesión con Google exitoso");
      
      // Redirigir: redirect param > home
      const target = redirectParam ? decodeURIComponent(redirectParam) : '/';
      
      setTimeout(() => {
        router.replace(target);
      }, 500);
      
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("No se pudo iniciar sesión con Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthModal onClose={handleClose}>
      <div className="p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/" onClick={(e) => { e.preventDefault(); handleClose(); }}>
            <Image 
              src="/logo.svg" 
              alt="Baúl de Moda" 
              width={120} 
              height={40}
              className="cursor-pointer"
            />
          </Link>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido</h1>
          <p className="text-gray-600">
            Accede a tu cuenta de Baúl de Moda
          </p>
        </div>

        {/* Formulario de email/password */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E9ABBD] focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E9ABBD] focus:border-transparent"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link 
              href="/forgot-password" 
              className="text-sm font-semibold text-[#E9ABBD] hover:text-[#D44D7D]"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E9ABBD] hover:bg-[#D44D7D] text-white font-semibold py-3"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">O continúa con</span>
          </div>
        </div>

        {/* Google Sign In */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full border-2 border-gray-300 hover:bg-gray-50 py-3"
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {loading ? "Iniciando sesión..." : "Continuar con Google"}
        </Button>

        {/* Link a registro */}
        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{" "}
          <Link 
            href={redirectParam ? `/register?redirect=${redirectParam}` : "/register"} 
            className="font-semibold text-[#E9ABBD] hover:text-[#D44D7D]"
          >
            Regístrate gratis
          </Link>
        </p>
      </div>
    </AuthModal>
  );
} 
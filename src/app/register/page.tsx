"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Mail, Lock, User, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams?.get("redirect") || null;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecial: false,
  });

  // Validación de contraseña en tiempo real
  const validatePassword = (password: string) => {
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    validatePassword(newPassword);
  };

  const isPasswordStrong = Object.values(passwordStrength).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.name.trim()) {
      toast.error("Por favor ingresa tu nombre");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Por favor ingresa tu email");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Por favor ingresa un email válido");
      return;
    }

    if (!isPasswordStrong) {
      toast.error("La contraseña no cumple con los requisitos de seguridad");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      await signUp(formData.email, formData.password, formData.name);
      
      toast.success(
        "¡Cuenta creada exitosamente! Tus compras antiguas se han vinculado automáticamente.",
        { duration: 5000 }
      );

      // Redirigir después de registro exitoso
      const target = redirectParam ? decodeURIComponent(redirectParam) : "/account";
      router.push(target);
    } catch (error: any) {
      console.error("Error en registro:", error);
      
      // Mensajes de error específicos
      if (error.code === 'auth/email-already-in-use') {
        toast.error("Este email ya está registrado. ¿Olvidaste tu contraseña?");
      } else if (error.code === 'auth/invalid-email') {
        toast.error("Email inválido");
      } else if (error.code === 'auth/weak-password') {
        toast.error("La contraseña es demasiado débil");
      } else {
        toast.error("Error al crear la cuenta. Por favor intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Registro con Google exitoso");
      const target = redirectParam ? decodeURIComponent(redirectParam) : "/account";
      router.push(target);
    } catch (error) {
      console.error("Error signing up with Google:", error);
      toast.error("No se pudo registrar con Google.");
    } finally {
      setLoading(false);
    }
  };

  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className={`flex items-center gap-2 text-sm ${met ? 'text-green-600' : 'text-gray-500'}`}>
      {met ? (
        <CheckCircle2 className="w-4 h-4" />
      ) : (
        <XCircle className="w-4 h-4" />
      )}
      <span>{text}</span>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8 shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/">
            <Image 
              src="/logo.svg" 
              alt="Baúl de Moda" 
              width={120} 
              height={40}
              className="cursor-pointer"
            />
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Cuenta</h1>
          <p className="text-gray-600">
            Únete a Baúl de Moda y accede a todos nuestros cursos
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre completo *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E9ABBD] focus:border-transparent"
                placeholder="Juan Pérez"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E9ABBD] focus:border-transparent"
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handlePasswordChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E9ABBD] focus:border-transparent"
                placeholder="••••••••"
                required
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

          {/* Requisitos de contraseña */}
          {formData.password && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-gray-700 mb-2">Requisitos de contraseña:</p>
              <PasswordRequirement met={passwordStrength.hasMinLength} text="Mínimo 8 caracteres" />
              <PasswordRequirement met={passwordStrength.hasUpperCase} text="Una mayúscula" />
              <PasswordRequirement met={passwordStrength.hasLowerCase} text="Una minúscula" />
              <PasswordRequirement met={passwordStrength.hasNumber} text="Un número" />
              <PasswordRequirement met={passwordStrength.hasSpecial} text="Un carácter especial (!@#$...)" />
            </div>
          )}

          {/* Confirmar Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar contraseña *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E9ABBD] focus:border-transparent"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Botón de registro */}
          <Button
            type="submit"
            disabled={loading || !isPasswordStrong}
            className="w-full bg-[#E9ABBD] hover:bg-[#D44D7D] text-white font-semibold py-3"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creando cuenta...
              </>
            ) : (
              "Crear cuenta"
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
          {loading ? "Registrando..." : "Registrarse con Google"}
        </Button>

        {/* Link a login */}
        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <Link 
            href={redirectParam ? `/login?redirect=${redirectParam}` : "/login"} 
            className="font-semibold text-[#E9ABBD] hover:text-[#D44D7D]"
          >
            Inicia sesión
          </Link>
        </p>
      </Card>
    </main>
  );
}


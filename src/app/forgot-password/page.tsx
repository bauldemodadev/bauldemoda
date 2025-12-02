"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import AuthModal from "@/components/auth/AuthModal";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();
  const router = useRouter();

  const handleClose = () => {
    router.push('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Por favor ingresa tu email");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Por favor ingresa un email válido");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setEmailSent(true);
      toast.success("Email enviado exitosamente. Revisa tu bandeja de entrada.");
    } catch (error: any) {
      console.error("Error enviando email:", error);
      
      if (error.code === 'auth/user-not-found') {
        toast.error("No existe una cuenta con este email");
      } else if (error.code === 'auth/invalid-email') {
        toast.error("Email inválido");
      } else {
        toast.error("Error al enviar el email. Por favor intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
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

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              ¡Email Enviado!
            </h1>
            
            <p className="text-gray-600 mb-2">
              Hemos enviado un link de recuperación a:
            </p>
            <p className="text-[#E9ABBD] font-semibold mb-6">
              {email}
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-blue-900 mb-2">
                <strong>Pasos a seguir:</strong>
              </p>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Revisa tu bandeja de entrada</li>
                <li>Busca un email de Firebase</li>
                <li>Haz clic en el link de recuperación</li>
                <li>Ingresa tu nueva contraseña</li>
              </ol>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              No recibiste el email? Revisa tu carpeta de spam o{" "}
              <button
                onClick={() => setEmailSent(false)}
                className="text-[#E9ABBD] hover:text-[#D44D7D] font-semibold"
              >
                intenta de nuevo
              </button>
            </p>

            <Link href="/login">
              <Button className="w-full bg-[#E9ABBD] hover:bg-[#D44D7D] text-white font-semibold">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al login
              </Button>
            </Link>
          </div>
        </div>
      </AuthModal>
    );
  }

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

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="text-gray-600">
            No te preocupes, te enviaremos instrucciones para recuperarla
          </p>
        </div>

        {/* Info para usuarios antiguos */}
        <div className="bg-[#E9ABBD]/10 border border-[#E9ABBD]/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            <strong>¿Compraste antes de diciembre 2024?</strong><br />
            Si eres un cliente antiguo, usa tu email para recuperar tu cuenta y acceder a tu historial de compras.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E9ABBD] hover:bg-[#D44D7D] text-white font-semibold py-3"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar link de recuperación"
            )}
          </Button>
        </form>

        {/* Link a login */}
        <div className="mt-6 text-center">
          <Link 
            href="/login" 
            className="inline-flex items-center text-sm font-semibold text-[#E9ABBD] hover:text-[#D44D7D]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al login
          </Link>
        </div>

        {/* Link a registro */}
        <p className="mt-4 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{" "}
          <Link 
            href="/register" 
            className="font-semibold text-[#E9ABBD] hover:text-[#D44D7D]"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </AuthModal>
  );
}


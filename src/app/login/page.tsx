"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams?.get("redirect") || null;

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Inicio de sesión con Google exitoso");
      const target = redirectParam ? decodeURIComponent(redirectParam) : "/account";
      router.push(target);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("No se pudo iniciar sesión con Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4 py-4">
      <div className="w-full max-w-md mb-60">
        {/* Logo y branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-2xl shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Accede a tu cuenta de Baúl de Moda
          </p>
        </div>

        {/* Card de login */}
        <Card className="relative overflow-hidden border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
          {/* Gradiente decorativo superior */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-400 via-gray-600 to-black" />
          
          <div className="p-8 space-y-8">
            {/* Botón de Google */}
            <Button 
              type="button" 
              variant="outline" 
              size="lg"
              className="w-full h-16 text-lg font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" 
              onClick={handleGoogle} 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin mr-3" />
              ) : (
                <div className="mr-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
              )}
              {loading ? "Iniciando sesión..." : "Continuar con Google"}
            </Button>

            {/* Información legal */}
            <div className="text-center">
              <p className="text-sm text-gray-500 leading-relaxed">
                Al continuar, aceptas nuestros{" "}
                <a href="/terms" className="text-black hover:text-gray-700 font-medium transition-colors">
                  Términos de Servicio
                </a>{" "}
                y{" "}
                <a href="/privacy" className="text-black hover:text-gray-700 font-medium transition-colors">
                  Política de Privacidad
                </a>
              </p>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            © 2025 Baúl de Moda. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </main>
  );
} 
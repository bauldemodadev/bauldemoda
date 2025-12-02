"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { AlertCircle, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmailVerificationBanner() {
  const { user, sendVerificationEmail } = useAuth();
  const [loading, setLoading] = useState(false);

  // No mostrar si no hay usuario o si ya está verificado
  if (!user || user.emailVerified) {
    return null;
  }

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      await sendVerificationEmail();
      toast.success("Email de verificación enviado. Revisa tu bandeja de entrada.");
    } catch (error: any) {
      console.error("Error enviando email:", error);
      
      if (error.code === 'auth/too-many-requests') {
        toast.error("Demasiados intentos. Espera unos minutos.");
      } else {
        toast.error("Error al enviar el email. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-yellow-50 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-900">
                Por favor verifica tu email
              </p>
              <p className="text-xs text-yellow-700">
                Te hemos enviado un link de verificación a <strong>{user.email}</strong>
              </p>
            </div>
          </div>
          
          <Button
            onClick={handleResendEmail}
            disabled={loading}
            size="sm"
            variant="outline"
            className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Reenviar email
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}


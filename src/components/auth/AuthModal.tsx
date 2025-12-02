"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface AuthModalProps {
  children: React.ReactNode;
  onClose?: () => void;
}

export default function AuthModal({ children, onClose }: AuthModalProps) {
  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay opaco */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Contenido del modal */}
      <div className="relative z-10 w-full max-w-md">
        {/* Botón cerrar (si se proporciona onClose) */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-8 h-8" />
          </button>
        )}
        
        {/* Card del formulario */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}


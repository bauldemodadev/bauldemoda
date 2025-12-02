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

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Solo cerrar si se hace click en el overlay, no en el contenido
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay opaco que cubre todo */}
      <div 
        className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm"
        onClick={handleOverlayClick}
      />
      
      {/* Modal centrado */}
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
        <div className="relative w-full max-w-md pointer-events-auto">
          {/* Botón cerrar */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors bg-black/30 hover:bg-black/50 rounded-full p-2"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>
          )}
          
          {/* Card del formulario */}
          <div className="bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}


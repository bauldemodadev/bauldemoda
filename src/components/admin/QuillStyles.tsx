'use client';

import { useEffect } from 'react';

/**
 * Componente para cargar los estilos de Quill solo en el cliente
 */
export default function QuillStyles() {
  useEffect(() => {
    // Cargar CSS de Quill dinámicamente
    if (typeof window !== 'undefined') {
      import('react-quill/dist/quill.snow.css');
    }
  }, []);

  return null;
}


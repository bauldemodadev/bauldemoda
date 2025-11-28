/**
 * Hook para manejar el checkout directo de cursos presenciales
 * Maneja la lógica de autenticación y redirección
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Product } from '@/types/product';
import { 
  isPresentialCourse, 
  getCourseCampus 
} from '@/lib/utils/productHelpers';
import { 
  preparePresentialCourseCheckout,
  savePresentialCourseForCheckout 
} from '@/lib/utils/presentialCourseCheckout';

/**
 * Hook para manejar la compra directa de cursos presenciales
 * 
 * Flujo:
 * 1. Verifica si el usuario está logueado
 * 2. Si NO está logueado → redirige a login con redirect al curso
 * 3. Si SÍ está logueado → prepara checkout directo y redirige
 */
export function usePresentialCourseCheckout() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Maneja la compra directa de un curso presencial
   * 
   * @param product - El producto curso presencial
   * @param selectedDate - Fecha seleccionada (opcional, puede venir del modal)
   * @param selectedTime - Hora seleccionada (opcional, puede venir del modal)
   */
  const handleBuyNowPresentialCourse = async (
    product: Product,
    selectedDate?: string,
    selectedTime?: string
  ) => {
    // Validar que sea un curso presencial
    if (!isPresentialCourse(product)) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Este producto no es un curso presencial.',
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Verificar autenticación
      if (!user || authLoading) {
        // Si no está logueado, redirigir a login con redirect
        const currentPath = window.location.pathname;
        const redirectUrl = `${currentPath}?presentialCheckout=true&productId=${product.id}`;
        
        if (selectedDate && selectedTime) {
          // Si ya se seleccionó fecha/hora, guardarla temporalmente
          sessionStorage.setItem('presentialCourseSelection', JSON.stringify({
            productId: product.id,
            selectedDate,
            selectedTime,
          }));
        }
        
        router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
        return;
      }

      // Usuario logueado: preparar checkout directo
      const checkoutData = preparePresentialCourseCheckout(
        product,
        selectedDate,
        selectedTime
      );

      if (!checkoutData) {
        throw new Error('Error al preparar el checkout');
      }

      // Guardar datos para el checkout
      savePresentialCourseForCheckout(checkoutData);

      // Redirigir al checkout
      router.push('/checkout?type=presential');
      
      toast({
        title: 'Redirigiendo al pago',
        description: `Procesando compra de ${product.name}...`,
      });
    } catch (error) {
      console.error('Error en checkout directo:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Hubo un error al procesar la compra. Por favor, intenta nuevamente.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleBuyNowPresentialCourse,
    isProcessing,
    isAuthenticated: !!user && !authLoading,
  };
}


/**
 * Utilidades para manejar el checkout directo de cursos presenciales
 * Los cursos presenciales NO se agregan al carrito, van directo al checkout
 */

import { Product } from '@/types/product';
import { isPresentialCourse, getCourseCampus } from './productHelpers';

export interface PresentialCourseCheckoutData {
  product: Product;
  selectedDate?: string;
  selectedTime?: string;
  sede: 'almagro' | 'ciudad-jardin';
  type: 'curso_presencial';
}

/**
 * Prepara los datos del curso presencial para el checkout directo
 * Esta función crea una "orden temporal" que se guarda en localStorage
 * y se usa en el flujo de checkout
 */
export function preparePresentialCourseCheckout(
  product: Product,
  selectedDate?: string,
  selectedTime?: string
): PresentialCourseCheckoutData | null {
  if (!isPresentialCourse(product)) {
    console.error('El producto no es un curso presencial');
    return null;
  }

  const sede = getCourseCampus(product);
  if (!sede) {
    console.error('No se pudo determinar la sede del curso');
    return null;
  }

  // Usar el precio correcto: basePrice > localPriceNumber > price
  const productPrice = product.basePrice ?? 
                      product.localPriceNumber ?? 
                      product.price;

  const checkoutData: PresentialCourseCheckoutData = {
    product: {
      ...product,
      price: productPrice,
    },
    selectedDate,
    selectedTime,
    sede,
    type: 'curso_presencial',
  };

  return checkoutData;
}

/**
 * Guarda los datos del curso presencial en localStorage para el checkout
 * También guarda el carrito de checkout con el formato esperado
 */
export function savePresentialCourseForCheckout(checkoutData: PresentialCourseCheckoutData): void {
  const { product, selectedDate, selectedTime, sede } = checkoutData;

  // Crear el item del carrito en el formato esperado por el checkout
  const checkoutItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 1,
    totalPrice: product.price,
    srcUrl: product.srcUrl,
    image: product.images?.[0] || product.srcUrl || '/placeholder.png',
    discount: { percentage: 0, amount: 0 },
    slug: product.name.split(" ").join("-"),
    productId: product.id,
    selectedDate,
    selectedTime,
    sede,
    type: 'curso_presencial' as const,
  };

  // Guardar en checkout_cart (formato esperado por el checkout)
  localStorage.setItem('checkout_cart', JSON.stringify([checkoutItem]));
  
  // Guardar metadata adicional para el checkout
  localStorage.setItem('checkout_metadata', JSON.stringify({
    type: 'curso_presencial',
    sede,
    isDirectCheckout: true,
  }));

  // Limpiar el carrito normal si tiene items (los cursos presenciales no se mezclan)
  const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
  if (currentCart.length > 0) {
    localStorage.setItem('cart', JSON.stringify([]));
    window.dispatchEvent(new Event('cartUpdate'));
  }
}

/**
 * Obtiene la metadata del checkout si existe
 */
export function getCheckoutMetadata(): {
  type?: string;
  sede?: 'almagro' | 'ciudad-jardin';
  isDirectCheckout?: boolean;
} | null {
  try {
    const metadata = localStorage.getItem('checkout_metadata');
    return metadata ? JSON.parse(metadata) : null;
  } catch {
    return null;
  }
}

/**
 * Limpia la metadata del checkout después de completar el proceso
 */
export function clearCheckoutMetadata(): void {
  localStorage.removeItem('checkout_metadata');
}


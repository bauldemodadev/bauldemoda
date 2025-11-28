/**
 * Helpers para identificar y manejar tipos de productos
 * Especialmente para diferenciar cursos presenciales de otros productos
 */

import { Product } from '@/types/product';

/**
 * Determina si un producto es un curso presencial
 * Un curso presencial tiene sede "almagro" o "ciudad-jardin"
 * y NO es un curso online (que estaría en la colección "onlineCourses")
 */
export function isPresentialCourse(product: Product): boolean {
  if (!product) return false;
  
  // Verificar por sede
  const sede = product.sede;
  if (sede === 'almagro' || sede === 'ciudad-jardin') {
    return true;
  }
  
  // Verificar por categoría/subcategoría como fallback
  const category = product.category?.toLowerCase() || '';
  const subcategory = product.subcategory?.toLowerCase() || '';
  const locationText = product.locationText?.toLowerCase() || '';
  
  const hasPresencialKeyword = 
    category.includes('presencial') ||
    subcategory.includes('presencial') ||
    locationText.includes('presencial') ||
    locationText.includes('ciudad jardín') ||
    locationText.includes('almagro');
  
  // Si tiene keywords de presencial pero NO es online, es presencial
  if (hasPresencialKeyword && sede !== 'online') {
    return true;
  }
  
  return false;
}

/**
 * Obtiene la sede del curso presencial
 * Retorna "almagro" | "ciudad-jardin" | null
 */
export function getCourseCampus(product: Product): 'almagro' | 'ciudad-jardin' | null {
  if (!isPresentialCourse(product)) {
    return null;
  }
  
  const sede = product.sede;
  if (sede === 'almagro' || sede === 'ciudad-jardin') {
    return sede;
  }
  
  // Fallback: buscar en locationText o category
  const locationText = product.locationText?.toLowerCase() || '';
  const category = product.category?.toLowerCase() || '';
  
  if (locationText.includes('almagro') || category.includes('almagro')) {
    return 'almagro';
  }
  
  if (locationText.includes('ciudad jardín') || locationText.includes('ciudad jardin') || category.includes('ciudad-jardin')) {
    return 'ciudad-jardin';
  }
  
  // Default a ciudad-jardin si no se puede determinar
  return 'ciudad-jardin';
}

/**
 * Determina si un producto puede ser agregado al carrito estándar
 * Los cursos presenciales NO pueden ser agregados al carrito
 */
export function canAddToCart(product: Product): boolean {
  return !isPresentialCourse(product);
}

/**
 * Verifica si el carrito contiene algún curso presencial
 */
export function cartHasPresentialCourse(cartItems: any[]): boolean {
  return cartItems.some(item => {
    // Si el item tiene información de sede, verificar directamente
    if (item.sede === 'almagro' || item.sede === 'ciudad-jardin') {
      return true;
    }
    // Si no, intentar verificar por nombre o categoría (menos confiable)
    const name = item.name?.toLowerCase() || '';
    return name.includes('presencial') || name.includes('almagro') || name.includes('ciudad jardín');
  });
}


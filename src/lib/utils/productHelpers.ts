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

/**
 * Determina si un producto es digital/servicio (no requiere retiro físico)
 * Incluye: cursos online, gift cards, servicios digitales, etc.
 */
export function isDigitalProduct(product: Product | any): boolean {
  if (!product) return false;
  
  // 1. Verificar por sede "online"
  if (product.sede === 'online') {
    return true;
  }
  
  // 2. Verificar por categoría/subcategoría
  const category = product.category?.toLowerCase() || '';
  const subcategory = product.subcategory?.toLowerCase() || '';
  const name = product.name?.toLowerCase() || product.title?.toLowerCase() || '';
  
  // Keywords que indican producto digital
  const digitalKeywords = [
    'online',
    'virtual',
    'digital',
    'gift card',
    'giftcard',
    'tarjeta de regalo',
    'curso online',
    'taller online',
    'servicio',
    'asesoría',
    'consultoría'
  ];
  
  const isDigital = digitalKeywords.some(keyword => 
    category.includes(keyword) || 
    subcategory.includes(keyword) || 
    name.includes(keyword)
  );
  
  return isDigital;
}

/**
 * Determina si un item del carrito es digital
 */
export function isDigitalCartItem(item: any): boolean {
  // Verificar si es un curso online por tipo
  if (item.type === 'onlineCourse') {
    return true;
  }
  
  // Verificar por sede
  if (item.sede === 'online') {
    return true;
  }
  
  // Verificar por categoría/nombre
  return isDigitalProduct(item);
}

/**
 * Verifica si todo el carrito contiene solo productos digitales
 */
export function isAllDigitalCart(cartItems: any[]): boolean {
  if (!cartItems || cartItems.length === 0) return false;
  return cartItems.every(item => isDigitalCartItem(item));
}

/**
 * Verifica si el carrito tiene al menos un producto digital
 */
export function hasDigitalProducts(cartItems: any[]): boolean {
  return cartItems.some(item => isDigitalCartItem(item));
}

/**
 * Verifica si el carrito tiene productos que requieren retiro físico
 */
export function hasPhysicalProducts(cartItems: any[]): boolean {
  return cartItems.some(item => !isDigitalCartItem(item));
}

/**
 * Lista de IDs de cursos gratuitos
 */
export const FREE_COURSE_IDS = ['6655', '5015'];

/**
 * Verifica si un producto es un curso gratuito
 */
export function isFreeCourse(productOrId: Product | any | string): boolean {
  const id = typeof productOrId === 'string' ? productOrId : (productOrId?.id || productOrId?.productId);
  return FREE_COURSE_IDS.includes(id);
}

/**
 * Verifica si el carrito contiene solo cursos gratuitos
 */
export function isAllFreeCourses(cartItems: any[]): boolean {
  if (!cartItems || cartItems.length === 0) return false;
  return cartItems.every(item => isFreeCourse(item.id || item.productId));
}


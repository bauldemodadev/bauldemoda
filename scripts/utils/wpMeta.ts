/**
 * Utilidades para extraer metadatos de WordPress
 */

/**
 * Item de metadato de WordPress
 */
export interface WpMetaItem {
  ['wp:meta_key']: string;
  ['wp:meta_value']: any;
}

/**
 * Extrae metadatos de un array de items de WordPress
 * 
 * @param metaArr - Array de items de metadatos de WordPress
 * @returns Objeto con los metadatos como clave-valor
 */
export function extractMeta(metaArr: WpMetaItem[] | WpMetaItem | undefined): Record<string, any> {
  const meta: Record<string, any> = {};
  
  if (!metaArr) {
    return meta;
  }
  
  // Normalizar a array
  const items = Array.isArray(metaArr) ? metaArr : [metaArr];
  
  for (const m of items) {
    if (!m || typeof m !== 'object') continue;
    
    const key = m['wp:meta_key'];
    const value = m['wp:meta_value'];
    
    if (key && value !== undefined && value !== null) {
      meta[key] = value;
    }
  }
  
  return meta;
}

/**
 * Extrae categorías de un item de WordPress
 * 
 * @param categoryItem - Item de categoría (puede ser array u objeto)
 * @returns Array de nombres de categorías
 */
export function extractCategories(categoryItem: any): string[] {
  if (!categoryItem) {
    return [];
  }
  
  if (Array.isArray(categoryItem)) {
    return categoryItem.map(cat => {
      if (typeof cat === 'string') return cat;
      if (typeof cat === 'object' && cat['@_nicename']) return cat['@_nicename'];
      if (typeof cat === 'object' && cat['#text']) return cat['#text'];
      return String(cat);
    }).filter(Boolean);
  }
  
  if (typeof categoryItem === 'string') {
    return [categoryItem];
  }
  
  if (typeof categoryItem === 'object') {
    const nicename = categoryItem['@_nicename'] || categoryItem['#text'];
    return nicename ? [nicename] : [];
  }
  
  return [];
}

/**
 * Parsea un número desde un string, retornando null si no es válido
 */
export function parseNumber(value: any): number | null {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  }
  return null;
}

/**
 * Parsea un array de IDs desde un string CSV
 */
export function parseIdArray(value: any): number[] {
  if (Array.isArray(value)) {
    return value.map(parseNumber).filter((n): n is number => n !== null);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map(s => s.trim())
      .map(parseNumber)
      .filter((n): n is number => n !== null);
  }
  return [];
}


/**
 * Utilidades para manejar direcciones de retiro en sucursal
 */

// Direcciones predeterminadas por sede
export const PICKUP_LOCATIONS = {
  'ciudad-jardin': {
    name: 'Ciudad Jardín',
    address: 'Av. Dr. Ricardo Balbín 2950, local 33',
    shopping: 'Shopping Paradise',
    zone: 'Zona Oeste',
  },
  'almagro': {
    name: 'Almagro',
    address: 'Castro y Agrelo',
    shopping: '',
    zone: 'Capital Federal',
  },
} as const;

/**
 * Obtiene la información de ubicación para mostrar en el checkout
 * 
 * @param locationText - Texto de ubicación del producto (opcional)
 * @param sede - Sede del producto: 'almagro' | 'ciudad-jardin' | null (opcional)
 * @returns Información formateada de la ubicación
 */
export function getPickupLocationInfo(
  locationText?: string | null,
  sede?: 'almagro' | 'ciudad-jardin' | null
): string {
  // Si hay locationText personalizado, usarlo
  if (locationText && locationText.trim()) {
    const locationLower = locationText.toLowerCase().trim();
    
    // Si el locationText menciona "almagro" o "ciudad jardín", usar dirección predeterminada
    if (locationLower.includes('almagro')) {
      const loc = PICKUP_LOCATIONS['almagro'];
      return `${loc.name}: ${loc.address}, ${loc.zone}`;
    }
    
    if (locationLower.includes('ciudad jardín') || locationLower.includes('ciudad jardin')) {
      const loc = PICKUP_LOCATIONS['ciudad-jardin'];
      return `${loc.name}: ${loc.address}, ${loc.shopping}, ${loc.zone}`;
    }
    
    // Si no coincide con las sedes predeterminadas, usar el texto tal cual
    return locationText;
  }
  
  // Si hay sede pero no locationText, usar dirección predeterminada
  if (sede && (sede === 'almagro' || sede === 'ciudad-jardin')) {
    const loc = PICKUP_LOCATIONS[sede];
    if (sede === 'ciudad-jardin') {
      return `${loc.name}: ${loc.address}, ${loc.shopping}, ${loc.zone}`;
    } else {
      return `${loc.name}: ${loc.address}, ${loc.zone}`;
    }
  }
  
  // Si no hay información, retornar null para mostrar ambas direcciones
  return '';
}

/**
 * Obtiene todas las ubicaciones de retiro para mostrar en el checkout
 * Útil cuando hay múltiples productos con diferentes sedes
 * 
 * @param items - Array de items del carrito con información de sede/locationText
 * @returns Array de strings con las ubicaciones únicas
 */
export function getUniquePickupLocations(
  items: Array<{ sede?: 'almagro' | 'ciudad-jardin' | null; locationText?: string | null }>
): string[] {
  const locations = new Set<string>();
  
  items.forEach(item => {
    const locationInfo = getPickupLocationInfo(item.locationText, item.sede);
    if (locationInfo) {
      locations.add(locationInfo);
    }
  });
  
  // Si no se encontraron ubicaciones específicas, mostrar ambas predeterminadas
  if (locations.size === 0) {
    const ciudadJardin = PICKUP_LOCATIONS['ciudad-jardin'];
    const almagro = PICKUP_LOCATIONS['almagro'];
    return [
      `${ciudadJardin.name}: ${ciudadJardin.address}, ${ciudadJardin.shopping}, ${ciudadJardin.zone}`,
      `${almagro.name}: ${almagro.address}, ${almagro.zone}`,
    ];
  }
  
  return Array.from(locations);
}

/**
 * Obtiene las direcciones formateadas para mostrar en lista
 * 
 * @param items - Array de items del carrito
 * @returns Array de strings con las direcciones formateadas
 */
export function getFormattedPickupLocations(
  items: Array<{ sede?: 'almagro' | 'ciudad-jardin' | null; locationText?: string | null }>
): string[] {
  const uniqueLocations = getUniquePickupLocations(items);
  
  // Si hay ubicaciones específicas, retornarlas
  if (uniqueLocations.length > 0) {
    return uniqueLocations;
  }
  
  // Si no, retornar ambas predeterminadas
  const ciudadJardin = PICKUP_LOCATIONS['ciudad-jardin'];
  const almagro = PICKUP_LOCATIONS['almagro'];
  return [
    `${ciudadJardin.name}: ${ciudadJardin.address}, ${ciudadJardin.shopping}, ${ciudadJardin.zone}`,
    `${almagro.name}: ${almagro.address}, ${almagro.zone}`,
  ];
}


/**
 * Utilidades para detectar el país del usuario
 * y determinar si necesita pago en USD con PayPal
 */

/**
 * Detecta si el usuario está fuera de Argentina
 * Usa varios métodos para determinar la ubicación
 */
export async function isInternationalUser(): Promise<boolean> {
  // 1. Verificar si ya está guardado en localStorage
  const cached = localStorage.getItem('isInternational');
  if (cached !== null) {
    return cached === 'true';
  }

  try {
    // 2. Intentar detectar por IP usando un servicio gratuito
    const response = await fetch('https://ipapi.co/json/', {
      cache: 'force-cache'
    });
    
    if (response.ok) {
      const data = await response.json();
      const isInternational = data.country_code !== 'AR';
      
      // Guardar en localStorage por 24 horas
      localStorage.setItem('isInternational', String(isInternational));
      localStorage.setItem('isInternational_timestamp', String(Date.now()));
      
      return isInternational;
    }
  } catch (error) {
    console.error('Error detectando país:', error);
  }

  // 3. Fallback: detectar por timezone
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const argentinaTimezones = [
      'America/Argentina/Buenos_Aires',
      'America/Argentina/Cordoba',
      'America/Argentina/Salta',
      'America/Argentina/Jujuy',
      'America/Argentina/Tucuman',
      'America/Argentina/Catamarca',
      'America/Argentina/La_Rioja',
      'America/Argentina/San_Juan',
      'America/Argentina/Mendoza',
      'America/Argentina/San_Luis',
      'America/Argentina/Rio_Gallegos',
      'America/Argentina/Ushuaia',
    ];
    
    const isArgentina = argentinaTimezones.includes(timezone);
    return !isArgentina;
  } catch (error) {
    console.error('Error detectando timezone:', error);
  }

  // Por defecto, asumir que es Argentina
  return false;
}

/**
 * Obtiene el país del usuario
 */
export async function getUserCountry(): Promise<string> {
  try {
    const response = await fetch('https://ipapi.co/json/', {
      cache: 'force-cache'
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.country_name || 'Unknown';
    }
  } catch (error) {
    console.error('Error obteniendo país:', error);
  }

  return 'Argentina'; // Fallback
}

/**
 * Limpia el caché de detección de país
 */
export function clearCountryCache(): void {
  localStorage.removeItem('isInternational');
  localStorage.removeItem('isInternational_timestamp');
}

/**
 * Verifica si el caché de país está expirado (más de 24 horas)
 */
export function isCountryCacheExpired(): boolean {
  const timestamp = localStorage.getItem('isInternational_timestamp');
  if (!timestamp) return true;
  
  const age = Date.now() - parseInt(timestamp);
  const maxAge = 24 * 60 * 60 * 1000; // 24 horas
  
  return age > maxAge;
}


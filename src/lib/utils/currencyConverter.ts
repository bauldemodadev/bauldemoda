/**
 * Utilidades para conversión de moneda ARS a USD
 */

// Tipo de cambio por defecto (actualizar periódicamente)
const DEFAULT_EXCHANGE_RATE = 1000; // 1 USD = 1000 ARS (aproximado)

/**
 * Obtiene el tipo de cambio actual de una API
 */
export async function getExchangeRate(): Promise<number> {
  // 1. Intentar obtener de localStorage (caché de 1 hora)
  const cached = localStorage.getItem('exchangeRate');
  const cacheTimestamp = localStorage.getItem('exchangeRate_timestamp');
  
  if (cached && cacheTimestamp) {
    const age = Date.now() - parseInt(cacheTimestamp);
    const maxAge = 60 * 60 * 1000; // 1 hora
    
    if (age < maxAge) {
      return parseFloat(cached);
    }
  }

  try {
    // 2. Intentar obtener de nuestra API (si existe)
    const response = await fetch('/api/exchange-rate');
    if (response.ok) {
      const data = await response.json();
      const rate = data.rate || DEFAULT_EXCHANGE_RATE;
      
      // Guardar en cache
      localStorage.setItem('exchangeRate', String(rate));
      localStorage.setItem('exchangeRate_timestamp', String(Date.now()));
      
      return rate;
    }
  } catch (error) {
    console.error('Error obteniendo tipo de cambio:', error);
  }

  // 3. Fallback: usar tasa por defecto
  return DEFAULT_EXCHANGE_RATE;
}

/**
 * Convierte ARS a USD
 */
export async function convertARStoUSD(amountARS: number): Promise<number> {
  const rate = await getExchangeRate();
  const usd = amountARS / rate;
  
  // Redondear a 2 decimales
  return Math.ceil(usd * 100) / 100;
}

/**
 * Formatea un monto en USD
 */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formatea un monto en ARS
 */
export function formatARS(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Limpia el caché del tipo de cambio
 */
export function clearExchangeRateCache(): void {
  localStorage.removeItem('exchangeRate');
  localStorage.removeItem('exchangeRate_timestamp');
}


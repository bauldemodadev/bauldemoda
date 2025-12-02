/**
 * API: Tipo de Cambio ARS/USD
 * 
 * Retorna el tipo de cambio actual para convertir pesos a dólares
 * En producción, esto debería conectarse a una API de tipos de cambio real
 */

import { NextResponse } from 'next/server';

// Tipo de cambio por defecto (actualizar manualmente o desde variable de entorno)
const DEFAULT_RATE = parseFloat(process.env.USD_EXCHANGE_RATE || '1000');

export async function GET() {
  try {
    // En producción, podrías obtener de una API externa como:
    // - https://api.exchangerate-api.com/v4/latest/USD
    // - https://api.bluelytics.com.ar/v2/latest
    // - Dolar Blue API, etc.
    
    // Por ahora, retornamos el valor configurado
    return NextResponse.json({
      rate: DEFAULT_RATE,
      currency: 'USD',
      lastUpdated: new Date().toISOString(),
      source: 'manual'
    });
  } catch (error) {
    console.error('Error obteniendo tipo de cambio:', error);
    
    return NextResponse.json({
      rate: DEFAULT_RATE,
      currency: 'USD',
      lastUpdated: new Date().toISOString(),
      source: 'fallback'
    });
  }
}


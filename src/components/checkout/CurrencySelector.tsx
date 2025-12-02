/**
 * Componente: Selector de Moneda
 * 
 * Detecta automáticamente si el usuario es internacional
 * y permite cambiar entre ARS y USD
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, DollarSign } from 'lucide-react';
import { isInternationalUser, getUserCountry } from '@/lib/utils/countryDetection';
import { convertARStoUSD, formatUSD, formatARS } from '@/lib/utils/currencyConverter';

interface CurrencySelectorProps {
  amountARS: number;
  onCurrencyChange?: (currency: 'ARS' | 'USD', amount: number) => void;
}

export default function CurrencySelector({ amountARS, onCurrencyChange }: CurrencySelectorProps) {
  const [isInternational, setIsInternational] = useState(false);
  const [currency, setCurrency] = useState<'ARS' | 'USD'>('ARS');
  const [amountUSD, setAmountUSD] = useState(0);
  const [userCountry, setUserCountry] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    detectUserLocation();
  }, []);

  useEffect(() => {
    if (currency === 'USD') {
      convertAmount();
    }
  }, [currency, amountARS]);

  const detectUserLocation = async () => {
    setLoading(true);
    try {
      const isInt = await isInternationalUser();
      const country = await getUserCountry();
      
      setIsInternational(isInt);
      setUserCountry(country);
      
      // Si es internacional, cambiar automáticamente a USD
      if (isInt) {
        setCurrency('USD');
      }
    } catch (error) {
      console.error('Error detectando ubicación:', error);
    } finally {
      setLoading(false);
    }
  };

  const convertAmount = async () => {
    const usd = await convertARStoUSD(amountARS);
    setAmountUSD(usd);
    
    if (onCurrencyChange) {
      onCurrencyChange('USD', usd);
    }
  };

  const handleCurrencyToggle = (newCurrency: 'ARS' | 'USD') => {
    setCurrency(newCurrency);
    
    if (onCurrencyChange) {
      const amount = newCurrency === 'USD' ? amountUSD : amountARS;
      onCurrencyChange(newCurrency, amount);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  // Solo mostrar si el usuario es internacional o quiere ver en USD
  if (!isInternational && currency === 'ARS') {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-50 border border-blue-200 rounded-lg p-4"
    >
      <div className="flex items-start gap-3">
        <Globe className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 mb-1">
            Pago Internacional Detectado
          </h3>
          <p className="text-sm text-blue-700 mb-3">
            {userCountry && `Detectamos que estás en ${userCountry}. `}
            Puedes pagar en dólares a través de PayPal.
          </p>
          
          {/* Toggle de moneda */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => handleCurrencyToggle('ARS')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currency === 'ARS'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              ARS (Pesos)
            </button>
            <button
              onClick={() => handleCurrencyToggle('USD')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currency === 'USD'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              USD (Dólares)
            </button>
          </div>

          {/* Mostrar conversión */}
          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total en {currency}:</span>
              <span className="text-lg font-bold text-gray-900">
                {currency === 'USD' ? formatUSD(amountUSD) : formatARS(amountARS)}
              </span>
            </div>
            {currency === 'USD' && (
              <p className="text-xs text-gray-500 mt-1">
                Precio original: {formatARS(amountARS)}
              </p>
            )}
          </div>

          {currency === 'USD' && (
            <div className="mt-3 flex items-center gap-2 text-sm text-blue-700">
              <DollarSign className="w-4 h-4" />
              <p>El pago se procesará en dólares a través de PayPal</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}


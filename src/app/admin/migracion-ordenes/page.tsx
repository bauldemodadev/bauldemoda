"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, AlertCircle, Loader2, Database, FileText } from 'lucide-react';

interface MigrationStats {
  totalOrders: number;
  successfulInserts: number;
  skippedDuplicates: number;
  errors: number;
  customersCreated: number;
  customersExisting: number;
  errorDetails?: string[];
}

export default function MigracionOrdenesPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDryRun, setIsDryRun] = useState(true);
  const [source, setSource] = useState<'almagro' | 'ciudad-jardin' | 'both'>('both');
  const [result, setResult] = useState<{
    success: boolean;
    stats?: MigrationStats;
    message?: string;
    error?: string;
  } | null>(null);

  const handleMigrate = async () => {
    setIsProcessing(true);
    setResult(null);

    try {
      const response = await fetch('/api/migrate-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dryRun: isDryRun,
          source,
          skipDuplicates: true,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Database className="w-8 h-8 text-[#E9ABBD]" />
            Migración de Órdenes a Firestore
          </h1>
          <p className="text-gray-600">
            Importa órdenes históricas desde archivos JSON a Firestore
          </p>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6"
        >
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Archivos a Migrar</h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• <strong>Almagro</strong>: 126 órdenes</li>
                <li>• <strong>Ciudad Jardín</strong>: 468 órdenes</li>
                <li>• <strong>Total</strong>: 594 órdenes</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 mb-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuración</h2>
          
          {/* Modo */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Modo de Ejecución
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  checked={isDryRun}
                  onChange={() => setIsDryRun(true)}
                  className="w-4 h-4 text-[#E9ABBD] focus:ring-[#E9ABBD]"
                />
                <div>
                  <span className="font-medium text-gray-900">🧪 Dry-Run (Simulación)</span>
                  <p className="text-sm text-gray-600">No escribe en Firestore, solo muestra resultados</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  checked={!isDryRun}
                  onChange={() => setIsDryRun(false)}
                  className="w-4 h-4 text-[#E9ABBD] focus:ring-[#E9ABBD]"
                />
                <div>
                  <span className="font-medium text-gray-900">✍️ Migración Real</span>
                  <p className="text-sm text-gray-600">Escribe las órdenes en Firestore</p>
                </div>
              </label>
            </div>
          </div>

          {/* Origen */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Sede de Origen
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className="flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  value="almagro"
                  checked={source === 'almagro'}
                  onChange={(e) => setSource(e.target.value as any)}
                  className="w-4 h-4 text-[#E9ABBD] focus:ring-[#E9ABBD]"
                />
                <span className="font-medium">Almagro</span>
              </label>
              <label className="flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  value="ciudad-jardin"
                  checked={source === 'ciudad-jardin'}
                  onChange={(e) => setSource(e.target.value as any)}
                  className="w-4 h-4 text-[#E9ABBD] focus:ring-[#E9ABBD]"
                />
                <span className="font-medium">Ciudad Jardín</span>
              </label>
              <label className="flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  value="both"
                  checked={source === 'both'}
                  onChange={(e) => setSource(e.target.value as any)}
                  className="w-4 h-4 text-[#E9ABBD] focus:ring-[#E9ABBD]"
                />
                <span className="font-medium">Ambas</span>
              </label>
            </div>
          </div>

          {/* Warning si es migración real */}
          {!isDryRun && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-1">⚠️ Advertencia</h4>
                  <p className="text-sm text-yellow-800">
                    Estás a punto de realizar una migración <strong>REAL</strong>. 
                    Las órdenes se escribirán en Firestore. Se recomienda hacer un dry-run primero.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botón de acción */}
          <button
            onClick={handleMigrate}
            disabled={isProcessing}
            className="w-full py-3 px-6 bg-[#E9ABBD] text-white rounded-lg font-semibold hover:bg-[#D44D7D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                {isDryRun ? 'Simular Migración' : 'Ejecutar Migración'}
              </>
            )}
          </button>
        </motion.div>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg shadow-md p-6 ${
              result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className="flex items-start gap-3 mb-4">
              {result.success ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600" />
              )}
              <div className="flex-1">
                <h3 className={`text-lg font-semibold mb-1 ${
                  result.success ? 'text-green-900' : 'text-red-900'
                }`}>
                  {result.success ? '✅ Proceso Completado' : '❌ Error en el Proceso'}
                </h3>
                <p className={`text-sm ${
                  result.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.message || result.error}
                </p>
              </div>
            </div>

            {/* Stats */}
            {result.stats && (
              <div className="bg-white rounded-lg p-4 mt-4">
                <h4 className="font-semibold text-gray-900 mb-3">📊 Estadísticas</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Órdenes</p>
                    <p className="text-2xl font-bold text-gray-900">{result.stats.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Insertadas</p>
                    <p className="text-2xl font-bold text-green-600">{result.stats.successfulInserts}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duplicadas</p>
                    <p className="text-2xl font-bold text-yellow-600">{result.stats.skippedDuplicates}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Errores</p>
                    <p className="text-2xl font-bold text-red-600">{result.stats.errors}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Clientes Creados</p>
                    <p className="text-2xl font-bold text-blue-600">{result.stats.customersCreated}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Clientes Existentes</p>
                    <p className="text-2xl font-bold text-gray-600">{result.stats.customersExisting}</p>
                  </div>
                </div>

                {/* Error details */}
                {result.stats.errorDetails && result.stats.errorDetails.length > 0 && (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg">
                    <h5 className="font-semibold text-red-900 mb-2">Detalles de Errores:</h5>
                    <ul className="text-sm text-red-700 space-y-1 max-h-40 overflow-y-auto">
                      {result.stats.errorDetails.map((error, idx) => (
                        <li key={idx}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}


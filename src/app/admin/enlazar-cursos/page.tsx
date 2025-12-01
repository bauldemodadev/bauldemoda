"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface VerificacionResult {
  resumen: {
    totalProductosEnPagina: number;
    productosEncontrados: number;
    productosNoEncontrados: number;
    totalCursosOnline: number;
    conRelacionDirecta: number;
    conRelacionPorSlug: number;
    conRelacionPorWpId: number;
    sinRelacion: number;
    cursosSinRelacion: number;
  };
  productosNoEncontrados: string[];
  relaciones: {
    directa: any[];
    porSlug: any[];
    porWpId: any[];
    sinRelacion: any[];
  };
  cursosOnline: any[];
  cursosSinRelacion: any[];
}

interface EnlaceResult {
  resumen: {
    totalProductos: number;
    productosEncontrados: number;
    productosNoEncontrados: number;
    totalCursosOnline: number;
    coincidenciasEncontradas: number;
    productosAActualizar: number;
    productosActualizados: number;
    cursosActualizados: number;
    productosSinCoincidencia: number;
    dryRun: boolean;
  };
  coincidenciasPorMetodo: Record<string, number>;
  coincidencias: any[];
  productosSinCoincidencia: any[];
}

export default function EnlazarCursosPage() {
  const [verificacion, setVerificacion] = useState<VerificacionResult | null>(null);
  const [enlace, setEnlace] = useState<EnlaceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ejecutarVerificacion = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/verificar-cursos-online');
      if (!response.ok) throw new Error('Error al verificar');
      const data = await response.json();
      setVerificacion(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const ejecutarEnlace = async (dryRun: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/enlazar-productos-cursos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dryRun }),
      });
      if (!response.ok) throw new Error('Error al enlazar');
      const data = await response.json();
      setEnlace(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Enlazar Productos con Cursos Online</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Paso 1: Verificación */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Paso 1: Verificación Inicial</h2>
          <p className="text-gray-600 mb-4">
            Verifica el estado actual de las relaciones entre productos y cursos online.
          </p>
          <Button
            onClick={ejecutarVerificacion}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Verificando...' : 'Ejecutar Verificación'}
          </Button>

          {verificacion && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded">
                  <div className="text-sm text-gray-600">Productos en página</div>
                  <div className="text-2xl font-bold">{verificacion.resumen.totalProductosEnPagina}</div>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <div className="text-sm text-gray-600">Con relación directa</div>
                  <div className="text-2xl font-bold">{verificacion.resumen.conRelacionDirecta}</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded">
                  <div className="text-sm text-gray-600">Con relación por slug</div>
                  <div className="text-2xl font-bold">{verificacion.resumen.conRelacionPorSlug}</div>
                </div>
                <div className="bg-red-50 p-4 rounded">
                  <div className="text-sm text-gray-600">Sin relación</div>
                  <div className="text-2xl font-bold">{verificacion.resumen.sinRelacion}</div>
                </div>
              </div>

              {verificacion.productosNoEncontrados.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
                  <div className="font-semibold mb-2">Productos no encontrados:</div>
                  <ul className="list-disc list-inside">
                    {verificacion.productosNoEncontrados.map(id => (
                      <li key={id}>{id}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Paso 2: Enlace */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Paso 2: Enlazar Productos con Cursos</h2>
          <p className="text-gray-600 mb-4">
            Busca coincidencias y actualiza las relaciones entre productos y cursos online.
          </p>
          
          <div className="flex gap-4 mb-4">
            <Button
              onClick={() => ejecutarEnlace(true)}
              disabled={loading}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {loading ? 'Ejecutando...' : 'Dry-Run (Solo Verificación)'}
            </Button>
            <Button
              onClick={() => ejecutarEnlace(false)}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Ejecutando...' : 'Ejecutar Real (Actualizar Firestore)'}
            </Button>
          </div>

          {enlace && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded">
                  <div className="text-sm text-gray-600">Coincidencias encontradas</div>
                  <div className="text-2xl font-bold">{enlace.resumen.coincidenciasEncontradas}</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded">
                  <div className="text-sm text-gray-600">Productos a actualizar</div>
                  <div className="text-2xl font-bold">{enlace.resumen.productosAActualizar}</div>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <div className="text-sm text-gray-600">Productos actualizados</div>
                  <div className="text-2xl font-bold">{enlace.resumen.productosActualizados}</div>
                </div>
                <div className="bg-purple-50 p-4 rounded">
                  <div className="text-sm text-gray-600">Cursos actualizados</div>
                  <div className="text-2xl font-bold">{enlace.resumen.cursosActualizados}</div>
                </div>
              </div>

              {Object.keys(enlace.coincidenciasPorMetodo).length > 0 && (
                <div className="bg-gray-50 p-4 rounded">
                  <div className="font-semibold mb-2">Coincidencias por método:</div>
                  <ul className="list-disc list-inside">
                    {Object.entries(enlace.coincidenciasPorMetodo).map(([metodo, count]) => (
                      <li key={metodo}>
                        {metodo}: {count as number}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {enlace.productosSinCoincidencia.length > 0 && (
                <div className="bg-red-50 border border-red-200 p-4 rounded">
                  <div className="font-semibold mb-2">Productos sin coincidencia:</div>
                  <ul className="list-disc list-inside">
                    {enlace.productosSinCoincidencia.map((p: any) => (
                      <li key={p.id}>
                        {p.name} (ID: {p.id})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {enlace.resumen.dryRun && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
                  <div className="font-semibold">⚠️ Modo Dry-Run</div>
                  <div className="text-sm">No se realizaron cambios en Firestore. Ejecuta en modo real para actualizar.</div>
                </div>
              )}

              {!enlace.resumen.dryRun && enlace.resumen.productosActualizados > 0 && (
                <div className="bg-green-50 border border-green-200 p-4 rounded">
                  <div className="font-semibold">✅ Actualización completada</div>
                  <div className="text-sm">
                    {enlace.resumen.productosActualizados} productos y {enlace.resumen.cursosActualizados} cursos actualizados.
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}


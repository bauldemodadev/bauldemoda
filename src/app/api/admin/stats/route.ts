/**
 * API Route: Estadísticas del Dashboard
 * GET /api/admin/stats
 * 
 * Retorna estadísticas del dashboard, opcionalmente filtradas por sede
 */

import { NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/firestore/stats';
import { verifyAdminAuth } from '@/lib/admin/auth';
import { getAdminSede } from '@/lib/firestore/stats';

const USE_FIRESTORE = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';

// OPTIMIZADO: Cache corto (1 minuto) para datos de dashboard que cambian poco
export const revalidate = 60;

export async function GET(request: Request) {
  try {
    if (!USE_FIRESTORE) {
      return NextResponse.json(
        { error: 'Firestore no está habilitado' },
        { status: 400 }
      );
    }

    // Verificar autenticación
    const email = await verifyAdminAuth();
    if (!email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Obtener parámetros del query string
    const { searchParams } = new URL(request.url);
    const sedeParam = searchParams.get('sede');
    const period = searchParams.get('period') || 'month';
    const customDateFrom = searchParams.get('dateFrom');
    const customDateTo = searchParams.get('dateTo');
    
    // Determinar la sede del admin
    const adminSede = getAdminSede(email);
    
    // Si el admin tiene una sede específica y no se especificó un filtro, usar su sede por defecto
    // Si se especificó 'global', usar null (todas las sedes)
    let sede: 'almagro' | 'ciudad-jardin' | null = null;
    
    if (sedeParam === 'global') {
      // Admin global o admin de sede viendo estadísticas globales
      sede = null;
    } else if (sedeParam === 'almagro' || sedeParam === 'ciudad-jardin') {
      // Filtro específico solicitado
      sede = sedeParam;
    } else if (adminSede) {
      // Admin de sede sin filtro específico, usar su sede por defecto
      sede = adminSede;
    } else {
      // Admin global sin filtro, mostrar todo
      sede = null;
    }

    // Calcular rango de fechas basado en el período
    let dateFrom: Date;
    let dateTo: Date = new Date(); // Hasta ahora

    if (period === 'custom' && customDateFrom && customDateTo) {
      dateFrom = new Date(customDateFrom);
      dateTo = new Date(customDateTo);
      // Ajustar dateTo al final del día
      dateTo.setHours(23, 59, 59, 999);
    } else if (period === 'today') {
      dateFrom = new Date();
      dateFrom.setHours(0, 0, 0, 0);
    } else if (period === 'week') {
      dateFrom = new Date();
      dateFrom.setDate(dateFrom.getDate() - 7);
      dateFrom.setHours(0, 0, 0, 0);
    } else { // 'month' por defecto
      dateFrom = new Date();
      dateFrom.setDate(1); // Primer día del mes
      dateFrom.setHours(0, 0, 0, 0);
    }

    console.log('Stats API - Período:', period, 'Desde:', dateFrom, 'Hasta:', dateTo);

    // Obtener estadísticas con rango de fechas
    const stats = await getDashboardStats(sede, dateFrom, dateTo);

    return NextResponse.json({
      stats,
      sede,
      adminSede,
      isGlobal: sede === null,
      period,
      dateFrom: dateFrom.toISOString(),
      dateTo: dateTo.toISOString(),
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return NextResponse.json(
      {
        error: 'Error al obtener estadísticas',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}


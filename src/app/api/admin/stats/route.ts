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

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

    // Obtener parámetro de sede del query string
    const { searchParams } = new URL(request.url);
    const sedeParam = searchParams.get('sede') as 'almagro' | 'ciudad-jardin' | null;
    
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

    // Obtener estadísticas
    const stats = await getDashboardStats(sede);

    return NextResponse.json({
      stats,
      sede,
      adminSede,
      isGlobal: sede === null,
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


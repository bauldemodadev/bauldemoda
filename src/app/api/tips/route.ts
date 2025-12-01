/**
 * API Route: Listado de tips (OPTIMIZADO: con paginación)
 * GET /api/tips?limit=15&cursor=...
 */

import { NextResponse } from 'next/server';
import { getAllTipsFromFirestore, getTipsPage } from '@/lib/firestore/tips';

// OPTIMIZADO: Cache con revalidación cada 5 minutos
export const revalidate = 300;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit');
    const cursor = url.searchParams.get('cursor');
    const all = url.searchParams.get('all');

    // Si se solicita explícitamente "all" sin limit, usar función legacy (compatibilidad)
    if (all === '1' && !limit) {
      const tips = await getAllTipsFromFirestore();
      return NextResponse.json(tips);
    }

    // Usar paginación optimizada
    const limitNum = limit ? parseInt(limit, 10) : 15;
    const result = await getTipsPage({ 
      limit: limitNum, 
      cursor: cursor || undefined 
    });

    return NextResponse.json({
      items: result.tips,
      nextCursor: result.nextCursor,
      hasMore: result.hasMore,
    });
  } catch (error) {
    console.error('❌ Error fetching tips:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch tips',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}


/**
 * API Route: Listado de tips
 * GET /api/tips
 */

import { NextResponse } from 'next/server';
import { getAllTipsFromFirestore } from '@/lib/firestore/tips';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const tips = await getAllTipsFromFirestore();
    return NextResponse.json(tips);
  } catch (error) {
    console.error('❌ Error fetching tips:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { 
        error: 'Failed to fetch tips',
        details: error instanceof Error ? error.message : String(error),
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      },
      { status: 500 }
    );
  }
}


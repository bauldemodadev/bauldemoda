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
    console.error('Error fetching tips:', error);
    return NextResponse.json({ error: 'Failed to fetch tips' }, { status: 500 });
  }
}


/**
 * API Route: Detalle de tip
 * GET /api/tips/[id]
 */

import { NextResponse } from 'next/server';
import { getTipByIdFromFirestore } from '@/lib/firestore/tips';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tipId = params.id;
    const tip = await getTipByIdFromFirestore(tipId);
    
    if (!tip) {
      return NextResponse.json({ error: 'Tip not found' }, { status: 404 });
    }
    
    return NextResponse.json(tip);
  } catch (error) {
    console.error('Error fetching tip:', error);
    return NextResponse.json({ error: 'Failed to fetch tip' }, { status: 500 });
  }
}


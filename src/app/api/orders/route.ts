/**
 * API Route: Listado de Órdenes
 * GET /api/orders
 * 
 * Retorna listado de órdenes con filtros opcionales
 */

import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';
import type { Order, OrderStatus, PaymentStatus, PaymentMethod } from '@/types/firestore/order';

const USE_FIRESTORE = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';

// OPTIMIZADO: Cache corto (30 segundos) para listados de órdenes en admin
export const revalidate = 30;

/**
 * Convierte Timestamps a objetos serializables
 */
function serializeOrder(order: any): any {
  const serialized = { ...order };
  
  if (serialized.createdAt instanceof Timestamp) {
    serialized.createdAt = serialized.createdAt.toDate().toISOString();
  }
  if (serialized.updatedAt instanceof Timestamp) {
    serialized.updatedAt = serialized.updatedAt.toDate().toISOString();
  }
  
  return serialized;
}

export async function GET(request: Request) {
  try {
    if (!USE_FIRESTORE) {
      return NextResponse.json(
        { error: 'Firestore no está habilitado' },
        { status: 400 }
      );
    }

    const url = new URL(request.url);
    const status = url.searchParams.get('status') as OrderStatus | null;
    const paymentStatus = url.searchParams.get('paymentStatus') as PaymentStatus | null;
    const paymentMethod = url.searchParams.get('paymentMethod') as PaymentMethod | null;
    const customerId = url.searchParams.get('customerId');
    const sede = url.searchParams.get('sede'); // Filtro por sede
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    console.log('Orders API - Parámetros:', { status, paymentStatus, paymentMethod, customerId, sede, limit, offset });

    const db = getAdminDb();
    
    // OPTIMIZADO: Para evitar problemas con índices compuestos,
    // hacemos una estrategia de filtrado en dos pasos:
    // 1. Query simple en Firestore (solo filtros básicos)
    // 2. Filtrado adicional en memoria
    
    let allOrders: any[] = [];
    
    try {
      if (sede) {
        // Si hay filtro de sede, obtener órdenes filtradas por sede
        // y luego ordenar en memoria
        console.log('Filtrando por sede:', sede);
        const sedeQuery = db.collection('orders')
          .where('metadata.sede', '==', sede)
          .limit(500); // Limitar a 500 para evitar problemas de memoria
        
        const sedeSnapshot = await sedeQuery.get();
        console.log('Órdenes encontradas con sede:', sedeSnapshot.size);
        
        allOrders = sedeSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
      } else {
        // Sin filtro de sede, obtener órdenes ordenadas
        const baseQuery = db.collection('orders')
          .orderBy('createdAt', 'desc')
          .limit(500);
        
        const baseSnapshot = await baseQuery.get();
        console.log('Órdenes encontradas sin filtro de sede:', baseSnapshot.size);
        
        allOrders = baseSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
      }
    } catch (queryError) {
      console.error('Error en query principal, intentando fallback:', queryError);
      // Fallback: query simple sin filtros
      const fallbackQuery = db.collection('orders').limit(500);
      const fallbackSnapshot = await fallbackQuery.get();
      allOrders = fallbackSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    }

    // Aplicar filtros adicionales en memoria
    let filteredOrders = allOrders;

    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }
    if (paymentStatus) {
      filteredOrders = filteredOrders.filter(order => order.paymentStatus === paymentStatus);
    }
    if (paymentMethod) {
      filteredOrders = filteredOrders.filter(order => order.paymentMethod === paymentMethod);
    }
    if (customerId) {
      filteredOrders = filteredOrders.filter(order => order.customerId === customerId);
    }

    // Ordenar por fecha en memoria (más recientes primero)
    filteredOrders.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });

    // Aplicar paginación en memoria
    const total = filteredOrders.length;
    const paginatedOrders = filteredOrders.slice(offset, offset + limit);

    // Serializar órdenes
    const orders: Order[] = paginatedOrders.map(order => ({
      id: order.id,
      ...serializeOrder(order),
    }));

    console.log('Órdenes después de filtros y paginación:', orders.length);

    return NextResponse.json({
      orders,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + orders.length < total,
      },
    });
  } catch (error) {
    console.error('Error obteniendo órdenes:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      {
        error: 'Error al obtener órdenes',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}


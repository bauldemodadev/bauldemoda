/**
 * Funciones helper para obtener estadísticas desde Firestore
 */

import { getAdminDb } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';
import type { Query, CollectionReference } from 'firebase-admin/firestore';
import type { Order } from '@/types/firestore/order';

export interface DashboardStats {
  // Ventas
  totalSales: number;
  totalRevenue: number;
  pendingOrders: number;
  approvedOrders: number;
  rejectedOrders: number;
  
  // Productos
  totalProducts: number;
  topProducts: Array<{
    productId: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  
  // Órdenes recientes
  recentOrders: number;
  
  // Métodos de pago
  paymentMethods: {
    mp: number;
    cash: number;
    transfer: number;
    other: number;
  };
  
  // Por período
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
}

/**
 * Obtiene estadísticas del dashboard (OPTIMIZADO: queries filtradas por fecha)
 * @param sede - 'almagro' | 'ciudad-jardin' | null para filtrar por sede
 */
export async function getDashboardStats(sede: 'almagro' | 'ciudad-jardin' | null = null): Promise<DashboardStats> {
  try {
    const db = getAdminDb();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const todayTimestamp = Timestamp.fromDate(today);
    const weekAgoTimestamp = Timestamp.fromDate(weekAgo);
    const monthAgoTimestamp = Timestamp.fromDate(monthAgo);
    const dayAgoTimestamp = Timestamp.fromDate(dayAgo);

    // Helper para construir query base con filtros
    const buildOrdersQuery = (filters: { 
      dateFrom?: Date; 
      status?: Order['status'];
      paymentMethod?: Order['paymentMethod'];
    } = {}) => {
      let query: Query | CollectionReference = db.collection('orders');
      
      if (sede) {
        query = query.where('metadata.sede', '==', sede) as Query;
      }
      
      if (filters.dateFrom) {
        const dateTimestamp = Timestamp.fromDate(filters.dateFrom);
        query = (query as Query).where('createdAt', '>=', dateTimestamp) as Query;
      }
      
      if (filters.status) {
        query = (query as Query).where('status', '==', filters.status) as Query;
      }
      
      if (filters.paymentMethod) {
        query = (query as Query).where('paymentMethod', '==', filters.paymentMethod) as Query;
      }
      
      return query as Query;
    };

    // Queries paralelas para estadísticas por período (filtradas por fecha en Firestore)
    const [
      allOrdersSnapshot,
      todayOrdersSnapshot,
      weekOrdersSnapshot,
      monthOrdersSnapshot,
      recentOrdersSnapshot,
      pendingOrdersSnapshot,
      approvedOrdersSnapshot,
      rejectedOrdersSnapshot,
      mpOrdersSnapshot,
      cashOrdersSnapshot,
      transferOrdersSnapshot,
      otherOrdersSnapshot,
    ] = await Promise.all([
      buildOrdersQuery().get(),
      buildOrdersQuery({ dateFrom: today }).get(),
      buildOrdersQuery({ dateFrom: weekAgo }).get(),
      buildOrdersQuery({ dateFrom: monthAgo }).get(),
      buildOrdersQuery({ dateFrom: dayAgo }).get(),
      buildOrdersQuery({ status: 'pending' }).get(),
      buildOrdersQuery({ status: 'approved' }).get(),
      buildOrdersQuery({ status: 'rejected' }).get(),
      buildOrdersQuery({ paymentMethod: 'mp' }).get(),
      buildOrdersQuery({ paymentMethod: 'cash' }).get(),
      buildOrdersQuery({ paymentMethod: 'transfer' }).get(),
      buildOrdersQuery({ paymentMethod: 'other' }).get(),
    ]);

    // Convertir snapshots a arrays de órdenes
    const allOrders = allOrdersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Order & { id: string }));

    const todayOrders = todayOrdersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Order & { id: string }));

    const weekOrders = weekOrdersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Order & { id: string }));

    const monthOrders = monthOrdersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Order & { id: string }));

    // Calcular estadísticas
    const totalSales = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const weekRevenue = weekOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const monthRevenue = monthOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    const pendingOrders = pendingOrdersSnapshot.size;
    const approvedOrders = approvedOrdersSnapshot.size;
    const rejectedOrders = rejectedOrdersSnapshot.size;

    // Métodos de pago
    const paymentMethods = {
      mp: mpOrdersSnapshot.size,
      cash: cashOrdersSnapshot.size,
      transfer: transferOrdersSnapshot.size,
      other: otherOrdersSnapshot.size,
    };

    // Productos más vendidos (usar todas las órdenes aprobadas, pero limitar a las más recientes)
    // Para optimizar, podríamos limitar a órdenes del último mes
    const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
    
    monthOrders.forEach(order => {
      if (order.status === 'approved' && order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          if (item.type === 'product' && item.productId) {
            const productId = item.productId;
            if (!productSales[productId]) {
              productSales[productId] = {
                name: item.name || 'Producto sin nombre',
                quantity: 0,
                revenue: 0,
              };
            }
            productSales[productId].quantity += item.quantity || 0;
            productSales[productId].revenue += item.total || 0;
          }
        });
      }
    });

    const topProducts = Object.entries(productSales)
      .map(([productId, data]) => ({
        productId,
        ...data,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    // Órdenes recientes (últimas 24 horas)
    const recentOrders = recentOrdersSnapshot.size;

    // Obtener total de productos (usar count para eficiencia)
    let productsQuery: Query = db.collection('products').where('status', '==', 'publish');
    if (sede) {
      productsQuery = productsQuery.where('sede', '==', sede);
    }
    const productsSnapshot = await productsQuery.count().get();
    const totalProducts = productsSnapshot.data().count;

    return {
      totalSales,
      totalRevenue,
      pendingOrders,
      approvedOrders,
      rejectedOrders,
      totalProducts,
      topProducts,
      recentOrders,
      paymentMethods,
      todayRevenue,
      weekRevenue,
      monthRevenue,
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    throw error;
  }
}

/**
 * Determina la sede del admin según su email
 */
export function getAdminSede(email: string | null): 'almagro' | 'ciudad-jardin' | null {
  if (!email) return null;
  
  if (email === 'almagro@admin.com') {
    return 'almagro';
  }
  if (email === 'ciudadjardin@admin.com') {
    return 'ciudad-jardin';
  }
  if (email === 'admin@admin.com') {
    return null; // Admin global
  }
  
  return null;
}


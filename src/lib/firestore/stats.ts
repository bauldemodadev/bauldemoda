/**
 * Funciones helper para obtener estadísticas desde Firestore
 */

import { getAdminDb } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';
import type { Query, CollectionReference } from 'firebase-admin/firestore';

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
 * Obtiene estadísticas del dashboard
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

    const todayTimestamp = Timestamp.fromDate(today);
    const weekAgoTimestamp = Timestamp.fromDate(weekAgo);
    const monthAgoTimestamp = Timestamp.fromDate(monthAgo);

    // Query base de órdenes
    let ordersQuery: Query | CollectionReference = db.collection('orders');
    
    // Si hay filtro por sede, aplicar filtro
    if (sede) {
      ordersQuery = ordersQuery.where('metadata.sede', '==', sede) as Query;
    }

    // Obtener todas las órdenes (o filtradas por sede)
    const allOrdersSnapshot = await ordersQuery.get();
    const allOrders = allOrdersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filtrar órdenes por fecha en memoria (ya que Firestore no permite múltiples where en diferentes campos)
    const todayOrders = allOrders.filter(order => {
      const createdAt = order.createdAt instanceof Timestamp 
        ? order.createdAt.toDate() 
        : new Date(order.createdAt);
      return createdAt >= today;
    });

    const weekOrders = allOrders.filter(order => {
      const createdAt = order.createdAt instanceof Timestamp 
        ? order.createdAt.toDate() 
        : new Date(order.createdAt);
      return createdAt >= weekAgo;
    });

    const monthOrders = allOrders.filter(order => {
      const createdAt = order.createdAt instanceof Timestamp 
        ? order.createdAt.toDate() 
        : new Date(order.createdAt);
      return createdAt >= monthAgo;
    });

    // Calcular estadísticas
    const totalSales = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const weekRevenue = weekOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const monthRevenue = monthOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    const pendingOrders = allOrders.filter(o => o.status === 'pending').length;
    const approvedOrders = allOrders.filter(o => o.status === 'approved').length;
    const rejectedOrders = allOrders.filter(o => o.status === 'rejected').length;

    // Métodos de pago
    const paymentMethods = {
      mp: allOrders.filter(o => o.paymentMethod === 'mp').length,
      cash: allOrders.filter(o => o.paymentMethod === 'cash').length,
      transfer: allOrders.filter(o => o.paymentMethod === 'transfer').length,
      other: allOrders.filter(o => o.paymentMethod === 'other').length,
    };

    // Productos más vendidos
    const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
    
    allOrders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
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
    const recentOrders = allOrders.filter(order => {
      const createdAt = order.createdAt instanceof Timestamp 
        ? order.createdAt.toDate() 
        : new Date(order.createdAt);
      const hoursAgo = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      return hoursAgo <= 24;
    }).length;

    // Obtener total de productos
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


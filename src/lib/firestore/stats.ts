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

    // OPTIMIZADO: Para evitar errores de índices compuestos en Firestore,
    // hacemos una query simple filtrando solo por sede (si existe) y luego filtramos en memoria
    let baseQuery: Query | CollectionReference = db.collection('orders');
    
    if (sede) {
      baseQuery = baseQuery.where('metadata.sede', '==', sede) as Query;
    }
    
    // Obtener todas las órdenes una sola vez y filtrar en memoria
    const allOrdersSnapshot = await baseQuery.get();
    const allOrders = allOrdersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Order & { id: string }));

    // Filtrar en memoria por diferentes criterios
    const todayOrders = allOrders.filter(order => {
      const orderDate = order.createdAt?.toDate() || new Date(0);
      return orderDate >= today;
    });

    const weekOrders = allOrders.filter(order => {
      const orderDate = order.createdAt?.toDate() || new Date(0);
      return orderDate >= weekAgo;
    });

    const monthOrders = allOrders.filter(order => {
      const orderDate = order.createdAt?.toDate() || new Date(0);
      return orderDate >= monthAgo;
    });

    const recentOrders = allOrders.filter(order => {
      const orderDate = order.createdAt?.toDate() || new Date(0);
      return orderDate >= dayAgo;
    });

    const pendingOrders = allOrders.filter(order => order.status === 'pending');
    const approvedOrders = allOrders.filter(order => order.status === 'approved');
    const rejectedOrders = allOrders.filter(order => order.status === 'rejected');

    const mpOrders = allOrders.filter(order => order.paymentMethod === 'mp');
    const cashOrders = allOrders.filter(order => order.paymentMethod === 'cash');
    const transferOrders = allOrders.filter(order => order.paymentMethod === 'transfer');
    const otherOrders = allOrders.filter(order => order.paymentMethod === 'other');

    // Calcular estadísticas
    const totalSales = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const weekRevenue = weekOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const monthRevenue = monthOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // Métodos de pago
    const paymentMethods = {
      mp: mpOrders.length,
      cash: cashOrders.length,
      transfer: transferOrders.length,
      other: otherOrders.length,
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
      pendingOrders: pendingOrders.length,
      approvedOrders: approvedOrders.length,
      rejectedOrders: rejectedOrders.length,
      totalProducts,
      topProducts,
      recentOrders: recentOrders.length,
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


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
 * @param dateFrom - Fecha desde (opcional, por defecto inicio del mes)
 * @param dateTo - Fecha hasta (opcional, por defecto ahora)
 */
export async function getDashboardStats(
  sede: 'almagro' | 'ciudad-jardin' | null = null,
  dateFrom?: Date,
  dateTo?: Date
): Promise<DashboardStats> {
  try {
    const db = getAdminDb();
    const now = new Date();
    
    // Si no se proporciona dateFrom, usar inicio del mes actual
    if (!dateFrom) {
      dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFrom.setHours(0, 0, 0, 0);
    }
    
    // Si no se proporciona dateTo, usar ahora
    if (!dateTo) {
      dateTo = now;
    }
    
    console.log('getDashboardStats - Rango de fechas:', {
      dateFrom: dateFrom.toISOString(),
      dateTo: dateTo.toISOString(),
      sede,
    });
    
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
    // hacemos una query simple y luego filtramos en memoria
    console.log('Obteniendo órdenes para estadísticas, sede:', sede || 'global');
    
    let allOrdersSnapshot;
    
    try {
      if (sede) {
        // Con filtro de sede, ordenar por createdAt
        const sedeQuery = db.collection('orders')
          .where('metadata.sede', '==', sede)
          .orderBy('createdAt', 'desc')
          .limit(2000);
        allOrdersSnapshot = await sedeQuery.get();
      } else {
        // Sin filtro de sede (global), solo ordenar por createdAt
        // Esto requiere un índice simple en createdAt (que debería existir por defecto)
        const globalQuery = db.collection('orders')
          .orderBy('createdAt', 'desc')
          .limit(2000);
        allOrdersSnapshot = await globalQuery.get();
      }
    } catch (queryError) {
      console.error('Error en query de órdenes, intentando sin ordenamiento:', queryError);
      // Fallback: sin ordenamiento, solo con límite
      let fallbackQuery: Query | CollectionReference = db.collection('orders');
      if (sede) {
        fallbackQuery = fallbackQuery.where('metadata.sede', '==', sede) as Query;
      }
      allOrdersSnapshot = await (fallbackQuery as Query).limit(2000).get();
    }
    
    console.log('Órdenes obtenidas:', allOrdersSnapshot.size);
    const allOrders = allOrdersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      } as Order & { id: string };
    });

    // Helper para convertir createdAt a Date de forma segura
    const getOrderDate = (order: any): Date => {
      try {
        if (!order.createdAt) return new Date(0);
        
        // Si es un Timestamp de Firestore, usar toDate()
        if (typeof order.createdAt.toDate === 'function') {
          return order.createdAt.toDate();
        }
        
        // Si es una fecha en formato string
        if (typeof order.createdAt === 'string') {
          return new Date(order.createdAt);
        }
        
        // Si tiene _seconds (formato Timestamp serializado)
        if (order.createdAt._seconds) {
          return new Date(order.createdAt._seconds * 1000);
        }
        
        return new Date(0);
      } catch (error) {
        console.error('Error convirtiendo fecha de orden:', order.id, error);
        return new Date(0);
      }
    };

    // Filtrar órdenes por el rango de fechas especificado
    const filteredOrders = allOrders.filter(order => {
      const orderDate = getOrderDate(order);
      return orderDate >= dateFrom! && orderDate <= dateTo!;
    });

    console.log('Órdenes en el rango de fechas:', filteredOrders.length);

    // Filtrar por sub-períodos para los widgets de "Hoy", "Semana", "Mes"
    const todayOrders = filteredOrders.filter(order => {
      const orderDate = getOrderDate(order);
      return orderDate >= today;
    });

    const weekOrders = filteredOrders.filter(order => {
      const orderDate = getOrderDate(order);
      return orderDate >= weekAgo;
    });

    const monthOrders = filteredOrders.filter(order => {
      const orderDate = getOrderDate(order);
      return orderDate >= monthAgo;
    });

    const recentOrders = filteredOrders.filter(order => {
      const orderDate = getOrderDate(order);
      return orderDate >= dayAgo;
    });

    const pendingOrders = filteredOrders.filter(order => order.status === 'pending');
    const approvedOrders = filteredOrders.filter(order => order.status === 'approved');
    const rejectedOrders = filteredOrders.filter(order => order.status === 'rejected');

    const mpOrders = filteredOrders.filter(order => order.paymentMethod === 'mp');
    const cashOrders = filteredOrders.filter(order => order.paymentMethod === 'cash');
    const transferOrders = filteredOrders.filter(order => order.paymentMethod === 'transfer');
    const otherOrders = filteredOrders.filter(order => order.paymentMethod === 'other');

    // Calcular estadísticas basadas en las órdenes filtradas por fecha
    const totalSales = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
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

    // Productos más vendidos (usar órdenes aprobadas del período filtrado)
    const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
    
    filteredOrders.forEach(order => {
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
    console.error('Sede solicitada:', sede);
    
    // Proporcionar más detalles del error
    if (error instanceof Error) {
      console.error('Mensaje de error:', error.message);
      console.error('Stack trace:', error.stack);
    }
    
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


/**
 * Script: Contar Órdenes con Cursos Online
 * 
 * Analiza cuántas órdenes contienen al menos un curso online
 */

import * as fs from 'fs';
import * as path from 'path';

interface OrderItem {
  type: string;
  courseId?: string;
  name: string;
}

interface OrderJSON {
  id: string;
  items: OrderItem[];
}

const almagroPath = path.join(__dirname, '../public/firebase_orders_2025_almagro_v2_corrected.json');
const ciudadJardinPath = path.join(__dirname, '../public/firebase_orders_2025_ciudad_jardin_v2_corrected.json');

console.log('📊 ANÁLISIS DE ÓRDENES CON CURSOS ONLINE\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const almagroOrders: OrderJSON[] = JSON.parse(fs.readFileSync(almagroPath, 'utf-8'));
const ciudadJardinOrders: OrderJSON[] = JSON.parse(fs.readFileSync(ciudadJardinPath, 'utf-8'));

const countOnlineCourseOrders = (orders: OrderJSON[]) => {
  let ordersWithCourses = 0;
  let totalCourseItems = 0;
  const courseIds = new Set<string>();

  orders.forEach(order => {
    let hasCourse = false;
    
    order.items.forEach(item => {
      if (item.type === 'onlineCourse') {
        hasCourse = true;
        totalCourseItems++;
        if (item.courseId) {
          courseIds.add(item.courseId);
        }
      }
    });

    if (hasCourse) {
      ordersWithCourses++;
    }
  });

  return { ordersWithCourses, totalCourseItems, uniqueCourseIds: courseIds.size };
};

const almagroStats = countOnlineCourseOrders(almagroOrders);
const ciudadJardinStats = countOnlineCourseOrders(ciudadJardinOrders);

console.log('🏫 ALMAGRO:');
console.log(`   Total órdenes: ${almagroOrders.length}`);
console.log(`   Órdenes con cursos online: ${almagroStats.ordersWithCourses}`);
console.log(`   Total items de cursos: ${almagroStats.totalCourseItems}`);
console.log(`   Cursos únicos: ${almagroStats.uniqueCourseIds}\n`);

console.log('🏫 CIUDAD JARDÍN:');
console.log(`   Total órdenes: ${ciudadJardinOrders.length}`);
console.log(`   Órdenes con cursos online: ${ciudadJardinStats.ordersWithCourses}`);
console.log(`   Total items de cursos: ${ciudadJardinStats.totalCourseItems}`);
console.log(`   Cursos únicos: ${ciudadJardinStats.uniqueCourseIds}\n`);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 TOTAL GENERAL:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log(`   Total órdenes: ${almagroOrders.length + ciudadJardinOrders.length}`);
console.log(`   Órdenes con cursos online: ${almagroStats.ordersWithCourses + ciudadJardinStats.ordersWithCourses}`);
console.log(`   Total items de cursos: ${almagroStats.totalCourseItems + ciudadJardinStats.totalCourseItems}`);
console.log(`   Cursos únicos combinados: ${almagroStats.uniqueCourseIds + ciudadJardinStats.uniqueCourseIds}\n`);

const percentage = ((almagroStats.ordersWithCourses + ciudadJardinStats.ordersWithCourses) / (almagroOrders.length + ciudadJardinOrders.length) * 100).toFixed(1);
console.log(`   Porcentaje de órdenes con cursos: ${percentage}%\n`);


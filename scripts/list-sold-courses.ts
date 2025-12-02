/**
 * Script: Listar Cursos Online Vendidos
 * 
 * Muestra los 12 cursos únicos que fueron vendidos
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

const almagroOrders: OrderJSON[] = JSON.parse(fs.readFileSync(almagroPath, 'utf-8'));
const ciudadJardinOrders: OrderJSON[] = JSON.parse(fs.readFileSync(ciudadJardinPath, 'utf-8'));
const allOrders = [...almagroOrders, ...ciudadJardinOrders];

// Recolectar cursos vendidos
const soldCourses = new Map<string, { name: string; count: number }>();

allOrders.forEach(order => {
  order.items.forEach(item => {
    if (item.type === 'onlineCourse' && item.courseId) {
      if (!soldCourses.has(item.courseId)) {
        soldCourses.set(item.courseId, { name: item.name, count: 0 });
      }
      soldCourses.get(item.courseId)!.count++;
    }
  });
});

// Ordenar por cantidad vendida
const sortedCourses = Array.from(soldCourses.entries())
  .sort((a, b) => b[1].count - a[1].count);

console.log('📚 CURSOS ONLINE VENDIDOS (Con IDs Corregidos)\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

sortedCourses.forEach(([ courseId, data], idx) => {
  console.log(`${idx + 1}. ID: ${courseId}`);
  console.log(`   Nombre: ${data.name}`);
  console.log(`   Vendidos: ${data.count} unidades\n`);
});

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`Total: ${soldCourses.size} cursos únicos vendidos`);
console.log(`Total items: ${Array.from(soldCourses.values()).reduce((sum, c) => sum + c.count, 0)}\n`);


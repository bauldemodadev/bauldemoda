/**
 * Script para extraer el catálogo completo de productos con IDs y nombres
 * Organizado por categorías: cursos online, presenciales (Almagro y Ciudad Jardín), productos y servicios
 */

// Usar fetch para llamar a la API pública en lugar de Firebase Admin
// Esto evita problemas con credenciales en scripts locales

// IDs de todas las categorías
const CATALOG_IDS = {
  cursosOnline: {
    masterClassGratuita: ["6655", "5015"],
    enPromo: ["1155", "1159", "10483"],
    paraComenzar: ["0L5wz3t9FJXLPehXpVUk", "10483"],
    intensivosIndumentaria: ["9556", "1925", "1155", "992", "1217", "2073", "1783"],
    intensivosLenceria: ["2036", "1159", "986", "1794", "3316"],
    intensivosCarteras: ["1256", "1134"],
    paraAlumnos: ["11567", "1134"],
    paraRegalar: ["3833", "6361", "6360", "1492"],
  },
  cursosPresencialesCiudadJardin: {
    intensivos: ["415", "11751", "8987"],
    regulares: ["50", "71"],
    baulPuertasAbiertas: ["5492"],
  },
  cursosPresencialesAlmagro: {
    intensivos: ["11240", "11751", "139"],
    regulares: ["144", "150", "148"],
  },
  productosYServicios: {
    revistas: [
      "5566", "5560", "5198", "5197", "4814", "4358", "4349", "4337", "4343",
      "4328", "4322", "4316", "4310", "4304", "4297", "4291", "4285", "4280",
      "4274", "4268", "4262", "4256", "4250", "4244", "4237", "4231", "4225",
      "4218", "4211", "847"
    ],
    giftCards: ["3833", "6361", "6360", "1492"],
  },
};

// Obtener todos los IDs únicos
function getAllUniqueIds(): string[] {
  const allIds = new Set<string>();
  
  Object.values(CATALOG_IDS).forEach(category => {
    Object.values(category).forEach(ids => {
      ids.forEach(id => allIds.add(id));
    });
  });
  
  return Array.from(allIds);
}

interface ProductData {
  id: string;
  name: string;
  price?: number;
  category?: string;
  sede?: string;
}

async function fetchProductsByIds(ids: string[]): Promise<Map<string, ProductData>> {
  const productsMap = new Map<string, ProductData>();

  // Usar la API pública de productos en lotes
  const batchSize = 50; // La API acepta múltiples IDs separados por coma
  
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    const idsParam = batch.join(',');
    
    try {
      // Llamar a la API local (debe estar corriendo el servidor de desarrollo)
      const response = await fetch(`http://localhost:3000/api/products?ids=${idsParam}`);
      
      if (!response.ok) {
        console.warn(`⚠️  Error en batch ${i}-${i + batchSize}: ${response.status}`);
        continue;
      }
      
      const products = await response.json();
      
      // Procesar productos recibidos
      if (Array.isArray(products)) {
        products.forEach((product: any) => {
          productsMap.set(product.id, {
            id: product.id,
            name: product.name || 'Sin nombre',
            price: product.price || 0,
            category: product.category || '',
            sede: product.sede || '',
          });
        });
      }
    } catch (error) {
      console.error(`❌ Error fetching batch ${i}-${i + batchSize}:`, error);
    }
  }

  return productsMap;
}

function buildCatalogWithNames(productsMap: Map<string, ProductData>) {
  const catalog: any = {
    cursosOnline: {},
    cursosPresencialesCiudadJardin: {},
    cursosPresencialesAlmagro: {},
    productosYServicios: {},
  };

  // Cursos Online
  Object.entries(CATALOG_IDS.cursosOnline).forEach(([section, ids]) => {
    catalog.cursosOnline[section] = ids.map(id => ({
      id,
      name: productsMap.get(id)?.name || `[ID: ${id} - No encontrado]`,
      price: productsMap.get(id)?.price || 0,
    }));
  });

  // Cursos Presenciales Ciudad Jardín
  Object.entries(CATALOG_IDS.cursosPresencialesCiudadJardin).forEach(([section, ids]) => {
    catalog.cursosPresencialesCiudadJardin[section] = ids.map(id => ({
      id,
      name: productsMap.get(id)?.name || `[ID: ${id} - No encontrado]`,
      price: productsMap.get(id)?.price || 0,
    }));
  });

  // Cursos Presenciales Almagro
  Object.entries(CATALOG_IDS.cursosPresencialesAlmagro).forEach(([section, ids]) => {
    catalog.cursosPresencialesAlmagro[section] = ids.map(id => ({
      id,
      name: productsMap.get(id)?.name || `[ID: ${id} - No encontrado]`,
      price: productsMap.get(id)?.price || 0,
    }));
  });

  // Productos y Servicios
  Object.entries(CATALOG_IDS.productosYServicios).forEach(([section, ids]) => {
    catalog.productosYServicios[section] = ids.map(id => ({
      id,
      name: productsMap.get(id)?.name || `[ID: ${id} - No encontrado]`,
      price: productsMap.get(id)?.price || 0,
    }));
  });

  return catalog;
}

async function main() {
  console.log('🔍 Extrayendo catálogo de productos...\n');

  try {
    // 1. Obtener todos los IDs únicos
    const allIds = getAllUniqueIds();
    console.log(`📦 Total de productos únicos: ${allIds.length}\n`);

    // 2. Fetch de productos desde Firestore
    console.log('⏳ Consultando Firestore...');
    const productsMap = await fetchProductsByIds(allIds);
    console.log(`✅ Productos encontrados: ${productsMap.size}/${allIds.length}\n`);

    // 3. Construir catálogo con nombres
    const catalog = buildCatalogWithNames(productsMap);

    // 4. Guardar en archivo JSON
    const fs = require('fs');
    const path = require('path');
    const outputPath = path.join(__dirname, '../public/product-catalog.json');
    
    fs.writeFileSync(outputPath, JSON.stringify(catalog, null, 2), 'utf-8');
    console.log(`✅ Catálogo guardado en: ${outputPath}\n`);

    // 5. Mostrar resumen
    console.log('📊 RESUMEN DEL CATÁLOGO:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n📚 CURSOS ONLINE:');
    Object.entries(catalog.cursosOnline).forEach(([section, products]: [string, any]) => {
      console.log(`  - ${section}: ${products.length} cursos`);
    });

    console.log('\n🏫 CURSOS PRESENCIALES - CIUDAD JARDÍN:');
    Object.entries(catalog.cursosPresencialesCiudadJardin).forEach(([section, products]: [string, any]) => {
      console.log(`  - ${section}: ${products.length} cursos`);
    });

    console.log('\n🏫 CURSOS PRESENCIALES - ALMAGRO:');
    Object.entries(catalog.cursosPresencialesAlmagro).forEach(([section, products]: [string, any]) => {
      console.log(`  - ${section}: ${products.length} cursos`);
    });

    console.log('\n🛍️ PRODUCTOS Y SERVICIOS:');
    Object.entries(catalog.productosYServicios).forEach(([section, products]: [string, any]) => {
      console.log(`  - ${section}: ${products.length} items`);
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 6. Detectar productos no encontrados
    const notFound = allIds.filter(id => !productsMap.has(id));
    if (notFound.length > 0) {
      console.log('⚠️  PRODUCTOS NO ENCONTRADOS EN FIRESTORE:');
      notFound.forEach(id => console.log(`  - ID: ${id}`));
      console.log('');
    }

    console.log('✅ Proceso completado exitosamente!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();


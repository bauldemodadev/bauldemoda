# 🔍 AUDITORÍA: Sistema de Productos - Baúl de Moda

## 📋 RESUMEN EJECUTIVO

El proyecto actualmente **depende completamente de una API externa** para obtener productos. Todos los datos de productos se obtienen mediante llamadas HTTP a un backend externo configurado mediante variables de entorno.

### **Estado Actual**
```
┌─────────────────────────────────────────────────┐
│  FRONTEND → API Routes → API Externa → Productos │
│         (100% dependiente de API externa)        │
└─────────────────────────────────────────────────┘
```

**Características:**
- ✅ API externa funcionando (endpoint `/precios`)
- ⚠️ Archivos de datos locales existentes pero **NO utilizados** en producción
- ⚠️ Múltiples puntos de transformación de datos (mapeo API → Product)
- ❌ Sin fallback si la API externa falla
- ❌ Sin cacheo efectivo (todas las peticiones con `no-store`)

### **Resumen de Dependencias**

| Componente | Dependencia | Estado |
|------------|-------------|--------|
| FilterContext | `/api/products` | ⚠️ Crítico |
| ProductListSec | `/api/products?ids=...` | ⚠️ Crítico |
| API Routes | `api.get/post('/precios')` | ⚠️ Crítico |
| productService | `api.get/post('/precios')` | ⚠️ Medio |
| useProducts (SWR) | `/api/products` | ⚠️ Bajo |

### **Archivos de Datos Locales**
- `src/data/products.mjs` - ❌ NO utilizado
- `src/data/products.js` - ❌ NO utilizado
- `src/data/alcoholic-products.mjs` - ❓ No verificado
- `src/data/combos.mjs` - ❓ No verificado
- `src/loadProducts.mjs` - ⚠️ Solo para migración a Firebase

---

## 🏗️ ARQUITECTURA ACTUAL

### 1. **Flujo de Datos Principal**

```
Frontend (Next.js)
    ↓
FilterContext / Componentes
    ↓
/api/products (Next.js API Route)
    ↓
lib/api.ts (Cliente HTTP)
    ↓
API Externa (NEXT_PUBLIC_API_BASE)
    ↓
Endpoint: /precios
    ↓
Transformación: mapPrecioToProduct()
    ↓
Tipo: Product (TypeScript)
```

### 2. **Puntos de Entrada de Productos**

#### A. **FilterContext** (`src/context/FilterContext.tsx`)
- **Línea 106-138**: Carga inicial de productos
- **Endpoint usado**: `/api/products` (sin parámetros o con `?all=1`)
- **Método**: `fetch()` con `cache: 'no-store'`
- **Uso**: Contexto global para toda la aplicación

#### B. **ProductListSec** (`src/components/common/ProductListSec.tsx`)
- **Uso**: Componente que recibe `productIds` como prop
- **Endpoint**: `/api/products?ids=id1,id2,id3`
- **Ejemplo en homepage**: 
  ```tsx
  <ProductListSec 
    title="Ciudad Jardín" 
    productIds={["M2eaBFE4haP9wNZlU2VH", "O1gikBervfIpQjDiCNwL", ...]} 
  />
  ```

#### C. **Hooks personalizados** (`src/lib/hooks/useProducts.ts`)
- **useProducts()**: Obtiene todos los productos
- **useProduct(id)**: Obtiene un producto por ID
- **Tecnología**: SWR (stale-while-revalidate)
- **Endpoints**: `/api/products` y `/api/products/[id]`

#### D. **Servicios** (`src/services/productService.ts`)
- **getProductById()**: POST a `/precios` con body `{ items: [{ id, cantidad: 1 }] }`
- **getAllProducts()**: GET a `/precios?all=1`

---

## 🔌 API EXTERNA - DETALLES TÉCNICOS

### **Configuración**
- **Variable de entorno**: `NEXT_PUBLIC_API_BASE` o `NEXT_PUBLIC_API_BASE_URL`
- **Valor por defecto**: `https://bauldemoda.vercel.app` (en algunos archivos)
- **Ubicación del código**: `src/lib/api.ts` (líneas 5-13)

### **Endpoints Utilizados**

#### 1. **GET `/precios?all=1`**
- **Propósito**: Obtener todos los productos
- **Respuesta esperada**: 
  ```typescript
  {
    items: Array<{
      producto: { id, nombre, descripcion, imagenes, precio, categorias, ... },
      pricing: { precioUnitario, ... }
    }>
  }
  ```
- **Usado en**: 
  - `src/app/api/products/route.ts` (línea 91, 147)
  - `src/services/productService.ts` (línea 52)
  - `src/firebase/fetchProducts.ts` (línea 4)

#### 2. **POST `/precios`**
- **Body**: 
  ```typescript
  {
    items: Array<{ id: string, cantidad: number }>
  }
  ```
- **Propósito**: Obtener precios calculados para productos específicos
- **Usado en**:
  - `src/app/api/products/route.ts` (líneas 104, 117, 126)
  - `src/app/api/products/[id]/route.ts` (línea 75)
  - `src/services/productService.ts` (línea 40)

#### 3. **GET `/precios?codigo=...&nombre=...`** (Fallback)
- **Propósito**: Búsqueda por código o nombre (compatibilidad)
- **Usado en**: `src/app/api/products/route.ts` (línea 140)

---

## 📊 ESTRUCTURA DE DATOS

### **Tipo Product (TypeScript)**
**Archivo**: `src/types/product.ts`

```typescript
export interface Product {
  id: string;                    // ID único del producto
  active: boolean;                // Si está activo/publicado
  category: string;               // Categoría principal
  createdAt: Date;                 // Fecha de creación
  description: string;            // Descripción del producto
  tipoMadera?: string;             // Opcional: tipo de madera
  discount: {                     // Información de descuento
    amount: number;                // Monto del descuento
    percentage: number;            // Porcentaje de descuento
  };
  featuredBrand: boolean;          // Marca destacada
  freeShipping: boolean;          // Envío gratis
  images: string[];               // Array de URLs de imágenes
  name: string;                   // Nombre del producto
  newArrival: boolean;            // Producto nuevo
  price: number;                  // Precio final
  promos: Array<{                 // Promociones
    cantidad: number;
    descuento: number;
    precioFinal: number;
  }>;
  rating: number;                  // Calificación (0-5)
  sales: number;                   // Ventas realizadas
  specialOffer: boolean;           // Oferta especial
  srcUrl: string;                 // URL principal de imagen
  stock: number;                   // Stock disponible
  subcategory: string;             // Subcategoría
  title: string;                   // Título del producto
  updatedAt: string;               // Fecha de actualización (ISO string)
}
```

### **Estructura de la API Externa**

La API externa devuelve datos en formato diferente, que se transforman mediante `mapPrecioToProduct()`:

```typescript
// Formato API Externa
{
  producto: {
    id: string,
    nombre: string,
    descripcion: string,
    imagenes: string[] | images: string[],
    precio: {
      normal: number,
      rebajado: number
    },
    categorias: string[] | categoria: string,
    subCategoria?: string | subcategoria?: string,
    tipoMadera?: string,
    inventario?: number | stockDisponible?: number | stock?: number,
    publicado: boolean,  // Para filtrar activos
    newArrival?: boolean,
    featuredBrand?: boolean
  },
  pricing: {
    precioUnitario: number,
    categoria?: string,
    unidad?: string
  }
}
```

---

## 🔄 FUNCIONES DE TRANSFORMACIÓN

### **mapPrecioToProduct()** - Ubicaciones

#### 1. **`src/app/api/products/route.ts`** (líneas 16-74)
- **Versión más completa** con lógica de descuentos
- Calcula `discount.amount` y `discount.percentage`
- Maneja múltiples formatos de imágenes
- Normaliza categorías y subcategorías

#### 2. **`src/app/api/products/[id]/route.ts`** (líneas 15-66)
- **Versión simplificada** para productos individuales
- Misma lógica básica pero menos validaciones

#### 3. **`src/services/productService.ts`** (líneas 4-36)
- **Versión diferente** con lógica de precios alternativa
- Usa `precioUnitarioFinal`, `precioUnitarioBase`, `valorVenta`
- **⚠️ INCONSISTENCIA**: Esta versión no calcula descuentos correctamente

### **Problemas Identificados**
1. **Código duplicado**: 3 versiones de `mapPrecioToProduct()` con lógicas diferentes
2. **Inconsistencias**: Cálculo de precios y descuentos varía entre archivos
3. **Mantenibilidad**: Cambios requieren actualizar múltiples lugares

---

## 📁 ARCHIVOS DE DATOS LOCALES (NO UTILIZADOS)

### **Archivos Existentes**

#### 1. **`src/data/products.mjs`** y **`src/data/products.js`**
- **Contenido**: Array de productos en formato `Product`
- **Estado**: ⚠️ **NO se importa ni usa en ningún componente**
- **Propósito original**: Parece ser datos de ejemplo o backup
- **Líneas**: ~392 productos definidos

#### 2. **`src/data/alcoholic-products.mjs`**
- **Estado**: ⚠️ **No verificado su uso**

#### 3. **`src/data/combos.mjs`**
- **Estado**: ⚠️ **No verificado su uso**

#### 4. **`src/loadProducts.mjs`**
- **Propósito**: Script para cargar productos a Firebase
- **Estado**: ⚠️ **Solo para migración/importación, no para uso en runtime**
- **Firebase config**: Hardcodeado (líneas 10-18)

#### 5. **`src/script.mjs`**
- **Propósito**: Similar a `loadProducts.mjs`
- **Estado**: ⚠️ **Solo para migración**

### **Conclusión sobre Archivos Locales**
- ❌ **No se usan en producción**
- ❌ **No se importan en componentes**
- ✅ **Podrían servir como base para migración**

---

## 🎯 COMPONENTES QUE CONSUMEN PRODUCTOS

### **Componentes Principales**

1. **FilterContext** (`src/context/FilterContext.tsx`)
   - Estado global de productos
   - Filtrado y ordenamiento
   - Extracción de categorías/subcategorías
   - **Endpoint**: `/api/products` (sin parámetros o `?all=1`)
   - **Método**: `fetch()` con `cache: 'no-store'`

2. **ProductListSec** (`src/components/common/ProductListSec.tsx`)
   - Muestra lista de productos por IDs
   - Usado en homepage con IDs hardcodeados
   - **Endpoint**: `/api/products?ids=id1,id2,id3`
   - **Líneas 38-62**: Fetch asíncrono de productos
   - **Acepta**: `productIds` (array) o `data` (Product[]) como props
   - **Ejemplo en homepage**:
     ```tsx
     <ProductListSec 
       title="Ciudad Jardín" 
       productIds={["M2eaBFE4haP9wNZlU2VH", "O1gikBervfIpQjDiCNwL", ...]} 
     />
     ```

3. **ProductGrid** (`src/components/shop-page/ProductGrid.tsx`)
   - Grid de productos para tienda
   - Recibe productos como prop

4. **Filters** (`src/components/shop-page/filters/index.tsx`)
   - Filtros de productos usando FilterContext
   - Usa `useFilter()` hook del contexto

5. **Páginas de Shop**:
   - `src/app/shop/page.tsx` - Página principal de tienda
   - `src/app/shop/categoria/productos-servicios/page.tsx` - Categoría específica
   - `src/app/shop/categoria/cursos-*.tsx` - Varias páginas de cursos

---

## 🔍 ANÁLISIS DE DEPENDENCIAS

### **Dependencias Externas Identificadas**

1. **API Externa** (`NEXT_PUBLIC_API_BASE`)
   - **Endpoint crítico**: `/precios`
   - **Métodos**: GET y POST
   - **Sin fallback**: Si la API falla, la app no muestra productos

2. **Firebase** (solo para scripts de migración)
   - **No usado en runtime**
   - Configuración en `loadProducts.mjs` y `script.mjs`

### **Variables de Entorno Requeridas**

```bash
NEXT_PUBLIC_API_BASE=https://bauldemoda.vercel.app/api
# o
NEXT_PUBLIC_API_BASE_URL=https://bauldemoda.vercel.app/api

NEXT_PUBLIC_API_USE_PROXY=true  # Por defecto true
```

---

## ⚠️ PROBLEMAS Y RIESGOS IDENTIFICADOS

### **1. Dependencia Total de API Externa**
- ❌ Sin conexión a API = Sin productos
- ❌ Sin fallback a datos locales
- ❌ Latencia en cada carga de página

### **2. Código Duplicado**
- ❌ 3 versiones de `mapPrecioToProduct()`
- ❌ Lógica inconsistente entre versiones
- ❌ Dificulta mantenimiento

### **3. Datos Locales No Utilizados**
- ⚠️ Archivos de datos existen pero no se usan
- ⚠️ Oportunidad perdida de optimización

### **4. Transformación en Múltiples Capas**
- ⚠️ Transformación en API routes
- ⚠️ Transformación en servicios
- ⚠️ Posible transformación en componentes

### **5. Falta de Validación**
- ⚠️ No hay validación de estructura de datos de API
- ⚠️ Manejo de errores básico

### **6. Cache y Performance**
- ⚠️ `cache: 'no-store'` en todas las peticiones
- ⚠️ Sin estrategia de cacheo
- ⚠️ Re-fetch en cada render

---

## 📈 RECOMENDACIONES PARA MIGRACIÓN

### **Fase 1: Preparación**
1. ✅ Consolidar `mapPrecioToProduct()` en un solo archivo
2. ✅ Crear schema de validación para Product
3. ✅ Exportar datos actuales de API a JSON local

### **Fase 2: Implementación Local**
1. ✅ Crear sistema de almacenamiento local (JSON, SQLite, o base de datos)
2. ✅ Migrar datos de API externa a formato local
3. ✅ Crear API routes locales que lean de datos locales

### **Fase 3: Migración Gradual**
1. ✅ Mantener API externa como fallback inicialmente
2. ✅ Implementar sistema híbrido (local + fallback)
3. ✅ Migrar componentes uno por uno

### **Fase 4: Desacoplamiento**
1. ✅ Remover dependencia de API externa
2. ✅ Implementar sistema de actualización de datos local
3. ✅ Optimizar carga y cacheo

---

## 📝 ARCHIVOS CLAVE PARA MIGRACIÓN

### **Archivos a Modificar**
1. `src/lib/api.ts` - Cliente HTTP (remover o adaptar)
2. `src/app/api/products/route.ts` - API route principal
3. `src/app/api/products/[id]/route.ts` - API route individual
4. `src/services/productService.ts` - Servicio de productos
5. `src/context/FilterContext.tsx` - Contexto global
6. `src/types/product.ts` - Tipos TypeScript (mantener)

### **Archivos a Crear**
1. `src/lib/products/localStorage.ts` - Almacenamiento local
2. `src/lib/products/transform.ts` - Transformación unificada
3. `src/data/products.json` - Datos de productos (o base de datos)
4. `src/lib/products/validator.ts` - Validación de datos

---

## 🎯 PRÓXIMOS PASOS SUGERIDOS

1. **Decidir formato de almacenamiento**:
   - JSON estático
   - Base de datos (SQLite, PostgreSQL, etc.)
   - Sistema de archivos

2. **Exportar datos actuales**:
   - Script para descargar todos los productos de API
   - Guardar en formato local

3. **Crear sistema de gestión**:
   - CRUD para productos locales
   - Sistema de sincronización (si se necesita)

4. **Implementar migración gradual**:
   - Empezar con lectura local
   - Mantener API como fallback
   - Remover API cuando esté estable

---

---

## 📦 DEPENDENCIAS DEL PROYECTO

### **Tecnologías Clave**
- **Next.js**: 14.2.7
- **React**: 18
- **TypeScript**: 5
- **SWR**: 2.3.3 (para cacheo y revalidación)
- **Firebase**: 11.6.0 (solo para scripts de migración, no runtime)

### **Librerías de UI**
- Radix UI (componentes)
- Framer Motion (animaciones)
- Tailwind CSS (estilos)

---

## 🔗 DIAGRAMA DE FLUJO ACTUAL

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │ FilterContext│    │ProductListSec│    │  useProducts  │  │
│  │              │    │              │    │   (SWR)      │  │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘  │
│         │                   │                    │          │
│         └───────────────────┴────────────────────┘          │
│                            │                                 │
│                            ▼                                 │
│              ┌─────────────────────────┐                    │
│              │  /api/products (Routes) │                    │
│              │  - route.ts             │                    │
│              │  - [id]/route.ts        │                    │
│              └─────────────┬───────────┘                    │
│                            │                                 │
│                            ▼                                 │
│              ┌─────────────────────────┐                    │
│              │   lib/api.ts            │                    │
│              │   (Cliente HTTP)        │                    │
│              └─────────────┬───────────┘                    │
└────────────────────────────┼─────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              API EXTERNA (Backend)                          │
│         NEXT_PUBLIC_API_BASE/api/precios                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  GET  /precios?all=1          → Lista todos                │
│  POST /precios {items: [...]} → Precios calculados         │
│  GET  /precios?codigo=...     → Búsqueda (fallback)        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Transformación  │
                    │ mapPrecioToProduct│
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Tipo Product   │
                    │  (TypeScript)   │
                    └─────────────────┘
```

---

## 📊 ESTADÍSTICAS DE CÓDIGO

### **Archivos Relacionados con Productos**
- **API Routes**: 2 archivos (`route.ts`, `[id]/route.ts`)
- **Servicios**: 1 archivo (`productService.ts`)
- **Hooks**: 1 archivo (`useProducts.ts`)
- **Contextos**: 1 archivo (`FilterContext.tsx`)
- **Componentes**: ~10+ archivos que consumen productos
- **Tipos**: 1 archivo (`product.ts`)
- **Datos locales**: 5 archivos (NO utilizados)

### **Líneas de Código Aproximadas**
- Transformación de datos: ~200 líneas (duplicadas)
- API Routes: ~240 líneas
- Contexto: ~424 líneas
- Componentes: ~500+ líneas

---

## ⚡ PUNTOS CRÍTICOS DE MIGRACIÓN

### **1. FilterContext** ⚠️ CRÍTICO
- **Archivo**: `src/context/FilterContext.tsx`
- **Líneas**: 106-138
- **Acción**: Cambiar `fetch('/api/products')` a lectura local
- **Impacto**: ALTO - Afecta toda la aplicación

### **2. ProductListSec** ⚠️ CRÍTICO
- **Archivo**: `src/components/common/ProductListSec.tsx`
- **Líneas**: 38-62
- **Acción**: Cambiar `fetch('/api/products?ids=...')` a lectura local
- **Impacto**: ALTO - Usado en homepage

### **3. API Routes** ⚠️ CRÍTICO
- **Archivos**: 
  - `src/app/api/products/route.ts`
  - `src/app/api/products/[id]/route.ts`
- **Acción**: Reemplazar llamadas a `api.get/post()` con lectura local
- **Impacto**: ALTO - Todas las rutas dependen de esto

### **4. Servicios** ⚠️ MEDIO
- **Archivo**: `src/services/productService.ts`
- **Acción**: Adaptar funciones para leer de fuente local
- **Impacto**: MEDIO - Algunos componentes lo usan

### **5. Hooks SWR** ⚠️ BAJO
- **Archivo**: `src/lib/hooks/useProducts.ts`
- **Acción**: Mantener estructura, cambiar fetcher
- **Impacto**: BAJO - SWR puede seguir funcionando con datos locales

---

**Fecha de Auditoría**: Diciembre 2024
**Versión del Proyecto**: Next.js 14.2.7
**Auditor**: AI Assistant


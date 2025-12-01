# Revisión: IDs de Productos vs Slugs de Cursos Online

## 📋 Objetivo

Verificar que todos los IDs de productos listados en la página de cursos online (`/shop/categoria/cursos-online`) tengan una correspondencia correcta con los slugs de cursos online en la colección `onlineCourses` de Firestore.

---

## 📦 IDs de Productos en la Página

### Lista Completa (23 IDs únicos)

```
6655, 5015, 1155, 1159, 10483, 0L5wz3t9FJXLPehXpVUk, 9556, 1925, 992, 
1217, 2073, 1783, 2036, 986, 1794, 3316, 1256, 1134, 11567, 
3833, 6361, 6360, 1492
```

### Organizados por Sección

#### MasterClass Gratuita
- `6655`
- `5015`

#### En Promo
- `1155`
- `1159`
- `10483`

#### Para Comenzar
- `0L5wz3t9FJXLPehXpVUk` ⚠️ **ID de Firestore (no numérico)**
- `10483` (duplicado)

#### Intensivos Indumentaria
- `9556`
- `1925`
- `1155` (duplicado)
- `992`
- `1217`
- `2073`
- `1783`

#### Intensivos Lencería
- `2036`
- `1159` (duplicado)
- `986`
- `1794`
- `3316`

#### Intensivos Carteras
- `1256`
- `1134`

#### Para Alumnos
- `11567`
- `1134` (duplicado)

#### Para Regalar
- `3833`
- `6361`
- `6360`
- `1492`

---

## 🔍 Verificación Requerida

### 1. Verificar Productos en Firestore

Para cada ID de producto, verificar:
- ✅ Que el producto exista en la colección `products`
- ✅ Que tenga el campo `relatedCourseId` si corresponde a un curso online
- ✅ Que el `relatedCourseId` apunte a un curso online válido

**Query sugerida:**
```typescript
// Obtener productos por IDs
const productIds = [
  "6655", "5015", "1155", "1159", "10483", "0L5wz3t9FJXLPehXpVUk",
  "9556", "1925", "992", "1217", "2073", "1783", "2036", "986",
  "1794", "3316", "1256", "1134", "11567", "3833", "6361", "6360", "1492"
];

const products = await getProductsByIdsFromFirestore(productIds);
```

### 2. Verificar Cursos Online en Firestore

Obtener todos los cursos online y verificar:
- ✅ Que cada curso tenga un `slug` único
- ✅ Que los `slug` coincidan con los IDs de productos o `relatedCourseId`

**Query sugerida:**
```typescript
const onlineCourses = await getAllOnlineCoursesFromFirestore();
// Filtrar solo cursos con status === 'publish'
```

### 3. Comparar Relaciones

Para cada producto, verificar tres tipos de relación:

#### A. Relación Directa (`relatedCourseId`)
```typescript
if (product.relatedCourseId) {
  const curso = onlineCourses.find(c => c.id === product.relatedCourseId);
  // Verificar que el curso existe
}
```

#### B. Relación por Slug
```typescript
// Si el ID del producto coincide con el slug del curso
const curso = onlineCourses.find(c => c.slug === product.id);
```

#### C. Relación por wpId
```typescript
// Si el producto tiene wpId y el curso tiene relatedProductWpId
const curso = onlineCourses.find(
  c => c.relatedProductWpId === product.wpId
);
```

---

## 📊 Checklist de Verificación

### Productos
- [ ] Todos los productos existen en Firestore
- [ ] Productos con `relatedCourseId` tienen un curso válido
- [ ] Productos sin `relatedCourseId` pero que deberían tenerlo

### Cursos Online
- [ ] Todos los cursos tienen `slug` único
- [ ] Los `slug` coinciden con IDs de productos o `relatedCourseId`
- [ ] Cursos con `relatedProductId` apuntan a productos válidos
- [ ] Cursos con `relatedProductWpId` apuntan a productos válidos

### Coincidencias
- [ ] Cada producto de la página tiene un curso online relacionado
- [ ] Cada curso online relacionado tiene un producto correspondiente
- [ ] No hay cursos huérfanos (sin producto relacionado)
- [ ] No hay productos sin curso (si deberían tenerlo)

---

## 🛠️ Script de Verificación

Se ha creado un script en `scripts/verificar-cursos-online.ts` que realiza esta verificación automáticamente.

### Ejecutar el Script

**Requisitos:**
- Variables de entorno de Firebase configuradas:
  - `FIREBASE_SERVICE_ACCOUNT_JSON` (recomendado)
  - O `FIREBASE_PROJECT_ID` + `FIREBASE_CLIENT_EMAIL` + `FIREBASE_PRIVATE_KEY`

**Comando:**
```bash
npx tsx scripts/verificar-cursos-online.ts
```

**El script mostrará:**
1. Lista de productos encontrados/no encontrados
2. Lista de cursos online disponibles
3. Relaciones encontradas (directa, por slug, por wpId)
4. Productos sin relación
5. Recomendaciones de acciones

---

## ⚠️ Problemas Detectados

### 1. ID No Numérico
- **ID:** `0L5wz3t9FJXLPehXpVUk`
- **Sección:** Para Comenzar
- **Problema:** Es un ID de Firestore (docId), no un ID numérico de WordPress
- **Acción:** Verificar que este producto existe y tiene `relatedCourseId`

### 2. IDs Duplicados
Los siguientes IDs aparecen en múltiples secciones:
- `1155`: En Promo + Intensivos Indumentaria
- `1159`: En Promo + Intensivos Lencería
- `10483`: En Promo + Para Comenzar
- `1134`: Intensivos Carteras + Para Alumnos

**Nota:** Esto es intencional si el mismo producto aparece en múltiples categorías.

---

## 💡 Recomendaciones

### 1. Establecer Relaciones Explícitas

Para cada producto que corresponde a un curso online:
- Agregar `relatedCourseId` al producto
- Agregar `relatedProductId` al curso online

**Ejemplo:**
```typescript
// En products collection
{
  id: "6655",
  name: "MasterClass Gratuita",
  relatedCourseId: "curso-masterclass-123"  // ← Agregar esto
}

// En onlineCourses collection
{
  id: "curso-masterclass-123",
  slug: "masterclass-gratuita",
  relatedProductId: "6655"  // ← Agregar esto
}
```

### 2. Validar en Checkout

Cuando un usuario compra un producto con `relatedCourseId`:
- Verificar que el curso existe
- Crear item de tipo `'onlineCourse'` en la orden
- Procesar inscripción en el webhook

### 3. Validar en Frontend

En la página de detalle del producto:
- Si tiene `relatedCourseId`, mostrar link al curso
- Verificar que el curso existe antes de mostrar el link

### 4. Documentar Relaciones

Mantener un documento o script que liste todas las relaciones:
- Producto ID → Curso Online ID
- Producto ID → Curso Online Slug
- Producto wpId → Curso Online relatedProductWpId

---

## 📝 Notas Adicionales

### Estructura de Datos Esperada

**Product (products collection):**
```typescript
{
  id: string;                    // ID del producto
  wpId?: number;                 // ID de WordPress
  name: string;
  relatedCourseId?: string | null;  // ← Debe apuntar a onlineCourses.id
  // ...
}
```

**OnlineCourse (onlineCourses collection):**
```typescript
{
  id: string;                    // ID del curso
  slug: string;                   // Slug único
  wpId: number;                   // ID de WordPress
  relatedProductId?: string | null;      // ← Debe apuntar a products.id
  relatedProductWpId?: number | null;   // ← Debe apuntar a products.wpId
  // ...
}
```

### Flujo de Acceso

Cuando un usuario compra un producto con `relatedCourseId`:
1. Se crea una orden con el producto
2. En el webhook, se busca el `relatedCourseId`
3. Se crea un item de tipo `'onlineCourse'` en la orden
4. Se procesa la inscripción en `customer.enrolledCourses`
5. El usuario puede acceder al curso desde `/mis-cursos`

---

## 🔗 Archivos Relacionados

- **Página de cursos online:** `src/app/shop/categoria/cursos-online/page.tsx`
- **API de cursos:** `src/app/api/courses/my-courses/route.ts`
- **API de checkout:** `src/app/api/checkout/route.ts`
- **Helpers de productos:** `src/lib/firestore/products.ts`
- **Helpers de cursos:** `src/lib/firestore/onlineCourses.ts`
- **Script de verificación:** `scripts/verificar-cursos-online.ts`

---

## ✅ Próximos Pasos

1. **Ejecutar el script de verificación** (requiere credenciales de Firebase)
2. **Revisar los resultados** y identificar productos sin relación
3. **Actualizar productos** agregando `relatedCourseId` donde falte
4. **Actualizar cursos online** agregando `relatedProductId` donde falte
5. **Validar en checkout** que las relaciones funcionen correctamente
6. **Probar flujo completo** de compra y acceso al curso

---

**Última actualización:** $(date)
**Responsable:** Sistema de verificación automática


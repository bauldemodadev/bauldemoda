# 📦 Catálogo de Productos - Baúl de Moda

Este documento describe el catálogo completo de productos organizados por categorías.

## 📋 Archivos Generados

### 1. `public/product-ids-catalog.json`
JSON básico con todos los IDs organizados por categoría. Los nombres son **placeholders genéricos**.

**Ubicación**: `/public/product-ids-catalog.json`

### 2. `public/product-catalog.json` (Generado por script)
JSON completo con IDs y **nombres reales** extraídos desde Firestore.

**Para generar**: Ejecuta el script de extracción (ver abajo)

---

## 🚀 Cómo Extraer el Catálogo Completo

Para obtener los nombres reales de todos los productos desde Firestore:

```bash
npm run extract-catalog
```

Este comando:
1. ✅ Lee todos los IDs del catálogo
2. ✅ Consulta Firestore para obtener datos reales
3. ✅ Genera `public/product-catalog.json` con nombres reales
4. ✅ Muestra un resumen en consola
5. ✅ Detecta productos no encontrados

---

## 📊 Estructura del Catálogo

### 🎓 Cursos Online
**Total**: 29 cursos únicos

#### Secciones:
- **MasterClass Gratuita** (2 cursos) - IDs: `6655`, `5015` ✨ GRATIS
- **En Promo** (3 cursos)
- **Para Comenzar** (2 cursos)
- **Intensivos Indumentaria** (7 cursos)
- **Intensivos Lencería** (5 cursos)
- **Intensivos Carteras** (2 cursos)
- **Para Alumnos** (2 cursos)
- **Para Regalar** (4 cursos)

**Características**:
- `sede`: `"online"`
- `type`: `"onlineCourse"`
- `category`: `"cursos-online"`

---

### 🏫 Cursos Presenciales - Ciudad Jardín
**Total**: 6 cursos

#### Secciones:
- **Intensivos** (3 cursos) - IDs: `415`, `11751`, `8987`
- **Regulares** (2 cursos) - IDs: `50`, `71`
- **Baúl a Puertas Abiertas** (1 curso) - ID: `5492`

**Características**:
- `sede`: `"ciudad-jardin"`
- `type`: `"product"`
- `metadata.orderType`: `"curso_presencial"`

---

### 🏫 Cursos Presenciales - Almagro
**Total**: 6 cursos

#### Secciones:
- **Intensivos** (3 cursos) - IDs: `11240`, `11751`, `139`
- **Regulares** (3 cursos) - IDs: `144`, `150`, `148`

**Características**:
- `sede`: `"almagro"`
- `type`: `"product"`
- `metadata.orderType`: `"curso_presencial"`

---

### 🛍️ Productos y Servicios
**Total**: 34 items

#### Secciones:
- **Revistas** (30 items) - Editoriales de Baúl de Moda
- **Gift Cards** (4 items) - IDs: `3833`, `6361`, `6360`, `1492`

**Características**:
- `type`: `"product"`
- Sin `sede` específica (pueden retirarse en cualquier sede)

---

## 🔑 IDs Especiales

### Cursos Gratuitos
```json
{
  "freeCourseIds": ["6655", "5015"]
}
```

Estos cursos:
- ✅ No requieren pago
- ✅ Usan checkout especial (`FreeCourseCheckout.tsx`)
- ✅ Se registran automáticamente en Firestore
- ✅ `totalAmount: 0`

### Curso Compartido (Almagro y Ciudad Jardín)
```json
{
  "sharedCourseId": "11751"
}
```

Este curso aparece en ambas sedes.

---

## 📁 Estructura JSON Completa

### Ejemplo: Cursos Online

```json
{
  "cursosOnline": {
    "masterClassGratuita": [
      {
        "id": "6655",
        "name": "MasterClass Gratuita - Introducción a la Costura",
        "price": 0
      },
      {
        "id": "5015",
        "name": "MasterClass Gratuita - Técnicas Básicas",
        "price": 0
      }
    ],
    "intensivosIndumentaria": [
      {
        "id": "9556",
        "name": "Intensivo: Pantalón Básico",
        "price": 35000
      }
      // ... más cursos
    ]
  }
}
```

### Ejemplo: Cursos Presenciales

```json
{
  "cursosPresencialesCiudadJardin": {
    "intensivos": [
      {
        "id": "415",
        "name": "Intensivo Mi Primer Jean",
        "price": 85000,
        "sede": "ciudad-jardin"
      }
    ]
  }
}
```

### Ejemplo: Productos y Servicios

```json
{
  "productosYServicios": {
    "revistas": [
      {
        "id": "5566",
        "name": "Revista Baúl de Moda - Edición 50",
        "price": 4500
      }
    ],
    "giftCards": [
      {
        "id": "3833",
        "name": "Gift Card $5000",
        "price": 5000
      }
    ]
  }
}
```

---

## 🛠️ Uso en el Código

### Importar IDs desde el catálogo

```typescript
// Importar el catálogo completo
import productCatalog from '@/public/product-catalog.json';

// Acceder a cursos online gratuitos
const freeCourses = productCatalog.cursosOnline.masterClassGratuita;

// Acceder a cursos presenciales de Almagro
const almagroIntensivos = productCatalog.cursosPresencialesAlmagro.intensivos;

// Acceder a gift cards
const giftCards = productCatalog.productosYServicios.giftCards;
```

### Verificar si un ID es curso gratuito

```typescript
import { FREE_COURSE_IDS } from '@/lib/utils/productHelpers';

const isFreeCourse = FREE_COURSE_IDS.includes(productId);
```

---

## 📝 Notas Importantes

1. **IDs Duplicados**: Algunos IDs aparecen en múltiples secciones (ej: `11751` en Almagro y Ciudad Jardín, `1155` en múltiples secciones online)
2. **Nombres Reales**: Para obtener nombres reales, siempre ejecuta `npm run extract-catalog` antes de usar el catálogo
3. **Actualización**: Si agregas/eliminas productos en Firestore, actualiza los archivos:
   - `src/app/shop/categoria/cursos-online/page.tsx`
   - `src/app/shop/categoria/cursos-almagro/page.tsx`
   - `src/app/shop/categoria/cursos-ciudad-jardin/page.tsx`
   - `src/app/shop/categoria/productos-servicios/page.tsx`
   - Luego ejecuta el script de extracción nuevamente

---

## 🎯 Para la Migración

Este catálogo es útil para:
1. ✅ Validar que los productos en `firebase_orders_2025_*.json` existan
2. ✅ Autocompletar `productId` en items de órdenes
3. ✅ Clasificar órdenes por tipo (online, presencial, productos)
4. ✅ Asignar metadata correcta (`sede`, `orderType`, etc.)

---

## 📞 Contacto

Si encuentras productos faltantes o errores en el catálogo, actualiza los archivos de categorías y ejecuta el script de nuevo.

**Total productos únicos**: 94


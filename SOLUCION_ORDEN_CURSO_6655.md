# Solución: Orden con Producto 6655 (Curso Online)

## 🔍 Problema Identificado

Compraste el producto **ID: 6655** (que debería ser un curso online), pero el customer no tiene el curso en `enrolledCourses`.

### Estado Actual del Customer

```
Customer ID: qmDY2Dtgj7gnbrByedVFBxLi2BZ2
Email: almagro@admin.com
enrolledCourses: [] (vacío o sin contenido)
```

### ¿Qué Debería Tener?

El customer debería tener en `enrolledCourses`:

```typescript
{
  enrolledCourses: [
    {
      courseId: "ID_DEL_CURSO_ONLINE",  // ← FALTA ESTO
      productId: "6655",                 // ← Referencia al producto
      orderId: "ID_DE_LA_ORDEN",        // ← Referencia a la orden
      accessFrom: Timestamp,             // ← Fecha de acceso
      accessTo: null                     // ← null = acceso permanente
    }
  ]
}
```

---

## 🔧 Soluciones Implementadas

### 1. Checkout Mejorado ✅

**Archivo:** `src/app/api/checkout/route.ts`

**Cambio:** Ahora el checkout detecta automáticamente si un producto tiene `relatedCourseId` y lo convierte a un item de tipo `'onlineCourse'` en la orden.

**Antes:**
- Producto con `relatedCourseId` → Se guardaba como `type: 'product'`
- Webhook no procesaba → No se agregaba a `enrolledCourses`

**Ahora:**
- Producto con `relatedCourseId` → Se convierte automáticamente a `type: 'onlineCourse'`
- Webhook procesa correctamente → Se agrega a `enrolledCourses`

### 2. API para Procesar Órdenes Existentes ✅

**Archivo:** `src/app/api/admin/procesar-orden-curso/route.ts`

**Endpoint:** `POST /api/admin/procesar-orden-curso`

**Función:** Procesa una orden existente que tiene un producto con `relatedCourseId` y agrega el curso al `enrolledCourses` del customer.

---

## 🚀 Cómo Solucionar tu Orden Actual

### Opción 1: Usar la API (Recomendado)

**Paso 1:** Encuentra el ID de tu orden

Busca en Firestore la colección `orders` donde:
- `customerId === "qmDY2Dtgj7gnbrByedVFBxLi2BZ2"`
- `items` contiene un item con `productId === "6655"`

**Paso 2:** Ejecuta la API

```bash
POST /api/admin/procesar-orden-curso
Content-Type: application/json

{
  "orderId": "ID_DE_TU_ORDEN"
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "orderId": "...",
  "customerId": "qmDY2Dtgj7gnbrByedVFBxLi2BZ2",
  "resumen": {
    "totalItems": 1,
    "procesados": 1,
    "errores": 0
  },
  "resultados": [
    {
      "item": {...},
      "producto": {
        "id": "6655",
        "name": "..."
      },
      "curso": {
        "id": "...",
        "title": "..."
      },
      "procesado": true
    }
  ]
}
```

### Opción 2: Actualizar Manualmente en Firestore

Si prefieres hacerlo manualmente:

**Paso 1:** Verifica que el producto 6655 tenga `relatedCourseId`

En Firestore, ve a `products/6655` y verifica:
- Si tiene `relatedCourseId`, anota ese valor
- Si NO tiene `relatedCourseId`, primero necesitas enlazarlo (usar `/admin/enlazar-cursos`)

**Paso 2:** Agrega el curso al customer

En Firestore, ve a `customers/qmDY2Dtgj7gnbrByedVFBxLi2BZ2` y agrega a `enrolledCourses`:

```json
{
  "courseId": "ID_DEL_CURSO_ONLINE",
  "productId": "6655",
  "orderId": "ID_DE_TU_ORDEN",
  "accessFrom": "2025-12-01T14:57:03.000Z",  // Usa la fecha de lastOrderAt
  "accessTo": null
}
```

---

## ✅ Verificación

Después de procesar la orden, verifica:

1. **Customer tiene el curso:**
   - Ve a `customers/qmDY2Dtgj7gnbrByedVFBxLi2BZ2`
   - Verifica que `enrolledCourses` tenga un elemento con `courseId`

2. **API de mis cursos funciona:**
   ```bash
   GET /api/courses/my-courses?email=almagro@admin.com
   ```
   - Debe retornar el curso en la lista

3. **Frontend muestra el curso:**
   - Accede a `/mis-cursos` con el usuario
   - Debe aparecer el curso en la lista

---

## 🔄 Para Futuras Compras

Con los cambios implementados:

1. **Checkout automático:**
   - Si compras un producto con `relatedCourseId`, se convierte automáticamente a `type: 'onlineCourse'`
   - No necesitas hacer nada manual

2. **Webhook procesa correctamente:**
   - Cuando el pago se aprueba, el webhook detecta items de tipo `'onlineCourse'`
   - Agrega automáticamente el curso a `enrolledCourses`

3. **Acceso inmediato:**
   - El curso aparece en `/mis-cursos` automáticamente
   - Puedes acceder al contenido sin pasos adicionales

---

## 📝 Checklist

- [ ] Verificar que producto 6655 tenga `relatedCourseId` en Firestore
- [ ] Si no tiene, ejecutar `/admin/enlazar-cursos` para enlazarlo
- [ ] Encontrar el ID de la orden con producto 6655
- [ ] Ejecutar `/api/admin/procesar-orden-curso` con el orderId
- [ ] Verificar que el customer tenga el curso en `enrolledCourses`
- [ ] Probar `/mis-cursos` para confirmar que aparece
- [ ] Probar acceso al curso en `/cursos-online/[slug]`

---

## 🐛 Troubleshooting

### Error: "Producto no tiene relatedCourseId"

**Solución:** 
1. Ve a `/admin/enlazar-cursos`
2. Ejecuta el enlace de productos con cursos
3. Esto agregará `relatedCourseId` al producto 6655
4. Luego ejecuta nuevamente `/api/admin/procesar-orden-curso`

### Error: "Curso no encontrado"

**Solución:**
1. Verifica que el `relatedCourseId` del producto apunte a un curso válido
2. Verifica que el curso exista en la colección `onlineCourses`
3. Si el curso no existe, créalo primero

### Error: "Orden no encontrada"

**Solución:**
1. Verifica que el `orderId` sea correcto
2. Verifica que la orden exista en la colección `orders`
3. Verifica que la orden tenga `customerId === "qmDY2Dtgj7gnbrByedVFBxLi2BZ2"`

---

**Última actualización:** $(date)
**Estado:** ✅ Soluciones implementadas, listo para ejecutar


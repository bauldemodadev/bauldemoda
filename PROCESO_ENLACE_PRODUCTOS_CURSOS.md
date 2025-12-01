# Proceso: Enlazar Productos con Cursos Online

## 📋 Objetivo

Establecer relaciones bidireccionales entre los productos listados en la página de cursos online y los cursos online en Firestore, asegurando que:

1. Cada producto tenga `relatedCourseId` apuntando al curso online correspondiente
2. Cada curso online tenga `relatedProductId` apuntando al producto correspondiente

---

## 🔄 Proceso Paso a Paso

### Paso 1: Verificación Inicial

**Objetivo:** Ver el estado actual de las relaciones

**Método 1: API (Recomendado)**
```bash
GET /api/admin/verificar-cursos-online
```

**Método 2: Script Local**
```bash
npx tsx scripts/verificar-cursos-online.ts
```

**Resultado esperado:**
- Lista de productos encontrados/no encontrados
- Lista de cursos online disponibles
- Relaciones existentes (directa, por slug, por wpId)
- Productos sin relación

---

### Paso 2: Búsqueda de Coincidencias

El sistema busca coincidencias usando 4 métodos (en orden de prioridad):

#### 1. Relación Directa (`relatedCourseId`)
- Si el producto ya tiene `relatedCourseId`, verifica que el curso existe
- ✅ **Prioridad más alta** - Si existe, se usa esta relación

#### 2. Coincidencia por Slug
- Compara `product.id === course.slug`
- Útil cuando el ID del producto coincide con el slug del curso

#### 3. Coincidencia por wpId
- Compara `product.wpId === course.relatedProductWpId`
- Útil cuando hay relación por IDs de WordPress

#### 4. Coincidencia por Nombre
- Normaliza y compara nombres de producto y curso
- Busca coincidencia exacta o parcial (mínimo 10 caracteres)
- ⚠️ **Menos confiable** - Requiere revisión manual

---

### Paso 3: Ejecutar Enlace

**Método 1: API (Recomendado para producción)**

**Dry-run (solo verificación):**
```bash
POST /api/admin/enlazar-productos-cursos
Content-Type: application/json

{
  "dryRun": true
}
```

**Ejecución real:**
```bash
POST /api/admin/enlazar-productos-cursos
Content-Type: application/json

{
  "dryRun": false
}
```

**Método 2: Script Local**

**Dry-run (solo verificación):**
```bash
npx tsx scripts/enlazar-productos-cursos-online.ts
```

**Ejecución real:**
```bash
DRY_RUN=false npx tsx scripts/enlazar-productos-cursos-online.ts
```

---

### Paso 4: Actualización de Productos

Para cada producto con coincidencia encontrada:

```typescript
// Actualizar producto
db.collection('products').doc(productId).update({
  relatedCourseId: courseId,
  updatedAt: Timestamp.now(),
});
```

**Campos actualizados:**
- `relatedCourseId`: ID del curso online relacionado
- `updatedAt`: Fecha de actualización

---

### Paso 5: Actualización de Cursos Online

Para cada curso online con producto relacionado:

```typescript
// Actualizar curso online
db.collection('onlineCourses').doc(courseId).update({
  relatedProductId: productId,
  updatedAt: Timestamp.now(),
});
```

**Campos actualizados:**
- `relatedProductId`: ID del producto relacionado
- `updatedAt`: Fecha de actualización

**Nota:** Si un curso tiene múltiples productos relacionados, se usa el primero encontrado.

---

### Paso 6: Verificación Final

**Ejecutar nuevamente la verificación:**
```bash
GET /api/admin/verificar-cursos-online
```

**Verificar:**
- ✅ Todos los productos tienen `relatedCourseId`
- ✅ Todos los cursos online tienen `relatedProductId`
- ✅ No hay productos sin relación (si deberían tenerla)
- ✅ No hay cursos huérfanos

---

## 📊 Resultados Esperados

### Antes del Enlace

```
Productos con relación directa: 0-5
Productos con relación por slug: 0-10
Productos con relación por wpId: 0-5
Productos sin relación: 10-20
```

### Después del Enlace

```
Productos con relación directa: 15-23
Productos con relación por slug: 0-5
Productos con relación por wpId: 0-3
Productos sin relación: 0-5 (requieren revisión manual)
```

---

## ⚠️ Productos Sin Coincidencia

Si hay productos sin coincidencia, revisar manualmente:

1. **Verificar si el producto debería tener un curso online:**
   - Revisar el nombre y descripción del producto
   - Verificar si es realmente un curso online

2. **Buscar curso manualmente:**
   - Buscar en Firestore por nombre similar
   - Verificar si el curso existe pero con nombre diferente

3. **Crear curso si falta:**
   - Si el producto es un curso online pero no existe el curso, crearlo primero
   - Luego ejecutar el enlace nuevamente

4. **Actualizar manualmente:**
   ```typescript
   // En Firestore Console o script
   db.collection('products').doc('productId').update({
     relatedCourseId: 'courseId',
   });
   ```

---

## 🔍 Ejemplo de Ejecución

### 1. Verificación Inicial

```bash
curl http://localhost:3000/api/admin/verificar-cursos-online
```

**Resultado:**
```json
{
  "resumen": {
    "totalProductosEnPagina": 23,
    "productosEncontrados": 22,
    "conRelacionDirecta": 3,
    "sinRelacion": 19
  }
}
```

### 2. Ejecutar Enlace (Dry-run)

```bash
curl -X POST http://localhost:3000/api/admin/enlazar-productos-cursos \
  -H "Content-Type: application/json" \
  -d '{"dryRun": true}'
```

**Resultado:**
```json
{
  "resumen": {
    "coincidenciasEncontradas": 18,
    "productosAActualizar": 15,
    "productosActualizados": 0,
    "dryRun": true
  },
  "coincidencias": [...]
}
```

### 3. Ejecutar Enlace (Real)

```bash
curl -X POST http://localhost:3000/api/admin/enlazar-productos-cursos \
  -H "Content-Type: application/json" \
  -d '{"dryRun": false}'
```

**Resultado:**
```json
{
  "resumen": {
    "coincidenciasEncontradas": 18,
    "productosAActualizar": 15,
    "productosActualizados": 15,
    "cursosActualizados": 15,
    "dryRun": false
  }
}
```

### 4. Verificación Final

```bash
curl http://localhost:3000/api/admin/verificar-cursos-online
```

**Resultado esperado:**
```json
{
  "resumen": {
    "conRelacionDirecta": 18,
    "sinRelacion": 4
  }
}
```

---

## 🛠️ Troubleshooting

### Problema: No se encuentran coincidencias

**Causas posibles:**
1. Los nombres no coinciden exactamente
2. Los slugs no coinciden con los IDs
3. Los wpId no están relacionados

**Solución:**
- Revisar manualmente los productos sin coincidencia
- Actualizar manualmente las relaciones
- Ajustar el algoritmo de búsqueda si es necesario

### Problema: Coincidencias incorrectas

**Causas posibles:**
1. Nombres similares pero productos diferentes
2. Múltiples cursos con nombres similares

**Solución:**
- Revisar las coincidencias por "nombre parcial"
- Verificar manualmente antes de ejecutar
- Usar dry-run siempre primero

### Problema: Error al actualizar

**Causas posibles:**
1. Permisos de Firestore
2. Documentos no existen
3. Campos requeridos faltantes

**Solución:**
- Verificar permisos de Firebase Admin
- Verificar que los documentos existen
- Revisar logs de error

---

## 📝 Checklist de Ejecución

- [ ] Ejecutar verificación inicial
- [ ] Revisar productos sin coincidencia
- [ ] Ejecutar enlace en modo dry-run
- [ ] Revisar coincidencias encontradas
- [ ] Verificar que las coincidencias son correctas
- [ ] Ejecutar enlace en modo real
- [ ] Ejecutar verificación final
- [ ] Revisar productos que aún no tienen relación
- [ ] Actualizar manualmente si es necesario
- [ ] Documentar relaciones manuales

---

## 🔗 Archivos Relacionados

- **Script de enlace:** `scripts/enlazar-productos-cursos-online.ts`
- **API de enlace:** `src/app/api/admin/enlazar-productos-cursos/route.ts`
- **Script de verificación:** `scripts/verificar-cursos-online.ts`
- **API de verificación:** `src/app/api/admin/verificar-cursos-online/route.ts`
- **Documentación de revisión:** `REVISION_CURSOS_ONLINE.md`

---

## ✅ Próximos Pasos Después del Enlace

1. **Validar en Checkout:**
   - Verificar que productos con `relatedCourseId` crean items de tipo `'onlineCourse'`
   - Probar compra de un curso online

2. **Validar en Frontend:**
   - Verificar que `/mis-cursos` muestra los cursos correctos
   - Verificar que `/cursos-online/[slug]` funciona correctamente

3. **Monitorear:**
   - Revisar logs de errores
   - Verificar que no hay productos sin relación que deberían tenerla

---

**Última actualización:** $(date)
**Responsable:** Sistema de enlace automático


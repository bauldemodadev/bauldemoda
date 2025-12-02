# Cambios: Productos Digitales y Cursos Gratuitos

## Resumen de Cambios Implementados

### 1. Identificación Correcta de Productos Digitales en el Carrito

**Problema:** Los cursos online agregados al carrito no eran identificados correctamente como productos digitales, por lo que seguían mostrando opciones de pago en efectivo y transferencia.

**Solución:** Se modificó la función `manejarAgregarAlCarrito` en todos los componentes para incluir información de tipo de producto:

```typescript
const itemCarrito = {
  id: product.id,
  name: product.name,
  price: product.price,
  // ... otros campos
  
  // NUEVO: Información para identificar tipo de producto
  sede: 'online' as const,  // o product.sede
  category: product.category || 'cursos-online',
  type: 'onlineCourse' as const,  // o 'product'
};
```

**Archivos modificados:**
- `src/app/shop/categoria/cursos-online/page.tsx`
- `src/components/common/CourseListSec.tsx`
- `src/components/common/ProductListSec.tsx`
- `src/app/shop/product/[...slug]/page.tsx`

### 2. Flujo Especial para Cursos Gratuitos

**IDs de Cursos Gratuitos:**
- `6655` - MasterClass Gratuita
- `5015` - MasterClass Gratuita

**Nuevos componentes creados:**

#### `FreeCourseCheckout.tsx`
Componente especial para el checkout de cursos gratuitos que:
- Solicita solo información básica (nombre, email, teléfono)
- No requiere método de pago
- Crea una orden automáticamente aprobada con monto $0
- Redirige a la página de éxito

#### `free-course-registration` API
Endpoint que:
- Crea una orden en Firestore con `totalAmount: 0`
- Marca la orden como `status: 'approved'` y `paymentStatus: 'paid'`
- Usa `paymentMethod: 'other'` para cursos gratuitos
- Incluye metadata `isFree: true`

**Archivos creados:**
- `src/components/checkout/FreeCourseCheckout.tsx`
- `src/app/api/free-course-registration/route.ts`

#### Helpers en `productHelpers.ts`
```typescript
// IDs de cursos gratuitos
export const FREE_COURSE_IDS = ['6655', '5015'];

// Verificar si un producto es gratis
export function isFreeCourse(productOrId: Product | any | string): boolean

// Verificar si todo el carrito es gratis
export function isAllFreeCourses(cartItems: any[]): boolean
```

### 3. Modificación del Checkout Principal

El checkout (`/checkout/page.tsx`) ahora detecta:
1. Si todos los productos son cursos gratuitos → Muestra `FreeCourseCheckout`
2. Si hay cursos online/digitales → Oculta efectivo y transferencia
3. Si hay productos físicos → Muestra todas las opciones de pago

## Cómo Probar

### Prueba 1: Curso Online de Pago

1. Ir a `/shop/categoria/cursos-online`
2. Agregar un curso de pago al carrito (por ejemplo, ID 1155, 1159, etc.)
3. Ir al checkout
4. **Verificar:** Solo debe aparecer la opción "Mercado Pago"
5. **Verificar:** NO debe aparecer "Efectivo" ni "Transferencia"
6. **Verificar:** NO debe aparecer información de "Retiro en Sucursal"

### Prueba 2: Curso Gratuito

1. Ir a `/shop/categoria/cursos-online`
2. Agregar un curso GRATUITO al carrito (ID 6655 o 5015)
3. Ir al checkout
4. **Verificar:** Se muestra el formulario especial "Curso Gratuito"
5. **Verificar:** Solo pide: Nombre, Email, Teléfono (opcional)
6. **Verificar:** No pide método de pago
7. Completar el formulario y confirmar
8. **Verificar:** Se crea una orden con monto $0
9. **Verificar:** Redirige a /checkout/success

### Prueba 3: Mezcla de Productos

1. Agregar un curso online Y un producto físico al carrito
2. Ir al checkout
3. **Verificar:** Solo aparece "Mercado Pago"
4. **Verificar:** Muestra información de retiro SOLO para el producto físico
5. **Verificar:** Muestra sección especial de "Productos Digitales"

### Prueba 4: Producto Físico Solo

1. Agregar solo un producto físico al carrito
2. Ir al checkout
3. **Verificar:** Aparecen todas las opciones: MP, Efectivo, Transferencia
4. **Verificar:** Muestra información de retiro en sucursal

## Debugging

### Ver qué se guarda en el carrito

En la consola del navegador:
```javascript
// Ver el carrito completo
console.log(JSON.parse(localStorage.getItem('cart')));

// Ver solo los campos importantes
JSON.parse(localStorage.getItem('cart')).map(item => ({
  id: item.id,
  name: item.name,
  sede: item.sede,
  type: item.type,
  category: item.category
}));
```

### Verificar en el checkout

En `StepTwo.tsx`, la detección de productos digitales se hace así:
```typescript
const hasDigital = hasDigitalProducts(cart);  // true si hay productos digitales
const hasPhysical = hasPhysicalProducts(cart); // true si hay productos físicos
```

## Órdenes en Firestore

### Orden Normal (con pago)
```javascript
{
  customerId: "email@example.com",
  totalAmount: 15000,
  status: "pending",
  paymentStatus: "pending",
  paymentMethod: "mp",
  items: [{
    type: "onlineCourse",
    name: "Curso de Moldería",
    unitPrice: 15000,
    quantity: 1,
    total: 15000
  }]
}
```

### Orden Gratuita
```javascript
{
  customerId: "email@example.com",
  totalAmount: 0,
  status: "approved",      // ← Aprobada automáticamente
  paymentStatus: "paid",   // ← Marcada como pagada
  paymentMethod: "other",  // ← Método especial
  metadata: {
    isFree: true           // ← Marcador de curso gratis
  },
  items: [{
    type: "onlineCourse",
    name: "MasterClass Gratuita",
    unitPrice: 0,
    quantity: 1,
    total: 0
  }]
}
```

## Notas Importantes

1. **Cursos Gratuitos NO se mezclan:** Si intentas agregar un curso gratis con otros productos, se debe manejar en el carrito (puedes implementar validación adicional si es necesario).

2. **Email de Confirmación:** El endpoint de registro gratuito tiene un TODO para enviar el email. Debes implementar esto conectando con tu servicio de emails.

3. **IDs de Cursos Gratuitos:** Si agregas más cursos gratuitos, actualiza el array `FREE_COURSE_IDS` en `productHelpers.ts`.

4. **Caché del Carrito:** Si haces cambios, limpia el localStorage:
   ```javascript
   localStorage.removeItem('cart');
   localStorage.removeItem('checkout_cart');
   ```

## Checklist de Funcionalidades

✅ Cursos online NO muestran opción de efectivo/transferencia
✅ Cursos online NO muestran información de retiro
✅ Cursos gratuitos tienen checkout especial
✅ Cursos gratuitos crean orden $0 automáticamente aprobada
✅ Productos físicos mantienen todas las opciones
✅ Mezcla de digital/físico filtra correctamente
✅ Admin muestra información correcta según tipo
✅ Página de éxito adapta mensaje según tipo
✅ Mis pedidos adapta información según tipo

## Próximos Pasos

- [ ] Implementar envío de email para cursos gratuitos
- [ ] Agregar validación en el carrito para evitar mezclar gratis con pago
- [ ] Implementar acceso automático al curso en la plataforma
- [ ] Agregar analytics para trackear registros gratuitos


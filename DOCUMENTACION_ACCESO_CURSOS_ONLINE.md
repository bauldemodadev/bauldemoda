# Documentación: Sistema de Acceso a Cursos Online

## 📋 Índice

1. [Visión General](#visión-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Flujo de Compra y Acceso](#flujo-de-compra-y-acceso)
4. [Frontend - Páginas y Componentes](#frontend---páginas-y-componentes)
5. [Backend - APIs y Lógica](#backend---apis-y-lógica)
6. [Estructura de Datos](#estructura-de-datos)
7. [Verificación de Acceso](#verificación-de-acceso)
8. [Puntos Importantes](#puntos-importantes)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Visión General

El sistema permite que los usuarios compren cursos online y accedan a su contenido (lecciones, videos, materiales) después de que la compra sea aprobada y pagada. El acceso se gestiona mediante:

- **Inscripciones directas** en el perfil del cliente (`customer.enrolledCourses`)
- **Órdenes aprobadas** como fuente de respaldo para verificar acceso

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐
│   Usuario       │
│   Compra Curso  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Checkout API  │
│   Crea Orden    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Webhook MP     │
│  Procesa Pago   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  enrolledCourses│
│  en Customer    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  /mis-cursos    │
│  Lista Cursos   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ /cursos-online/ │
│   [slug]        │
│  Ver Contenido  │
└─────────────────┘
```

---

## 🔄 Flujo de Compra y Acceso

### 1. Compra del Curso

**Ubicación:** `src/app/api/checkout/route.ts`

Cuando un usuario compra un curso online:

1. El frontend envía al checkout un item con `type: 'onlineCourse'`
2. El backend crea una orden con:
   ```typescript
   {
     type: 'onlineCourse',
     courseId: "curso-123",
     name: "Curso de Costura",
     quantity: 1,
     // ...
   }
   ```
3. La orden se guarda en Firestore con `status: 'pending'` y `paymentStatus: 'pending'`

### 2. Procesamiento del Pago

**Ubicación:** `src/app/api/mercadopago/webhook/route.ts`

Cuando el pago se aprueba (webhook de MercadoPago):

1. Se actualiza la orden: `status: 'approved'`, `paymentStatus: 'paid'`
2. Se ejecuta `processCourseEnrollments()` que:
   - Busca items de tipo `'onlineCourse'` en la orden
   - Crea/actualiza `enrolledCourses` en el perfil del cliente
   - Establece fechas de acceso (`accessFrom`, `accessTo`)

### 3. Acceso al Contenido

**Paso 1: Listar Cursos (`/mis-cursos`)**

- Usuario accede a `/mis-cursos`
- Frontend llama a `/api/courses/my-courses?email={email}`
- Backend busca cursos desde:
  1. **`customer.enrolledCourses`** (fuente principal)
  2. **Órdenes aprobadas/pagadas** (backup)
- Se muestra lista de cursos disponibles

**Paso 2: Ver Contenido (`/cursos-online/[slug]`)**

- Usuario hace clic en "IR AL CURSO"
- La página verifica acceso llamando a `/api/courses/my-courses`
- Si tiene acceso: muestra lecciones, videos, información útil
- Si no tiene acceso: muestra mensaje de restricción

---

## 🎨 Frontend - Páginas y Componentes

### 1. Página "Mis Cursos" (`/mis-cursos`)

**Archivo:** `src/app/mis-cursos/page.tsx`

**Funcionalidad:**
- Lista todos los cursos online a los que el usuario tiene acceso
- Requiere autenticación (redirige a login si no está logueado)
- Muestra cards con imagen, título, descripción y botón "IR AL CURSO"

**Componentes:**
- `CourseCard`: Card individual de curso
- `MisCursosPage`: Componente principal

**Flujo:**
```typescript
useEffect(() => {
  // 1. Verificar autenticación
  if (!user?.email) {
    router.push('/login?redirect=/mis-cursos');
    return;
  }
  
  // 2. Cargar cursos
  fetch(`/api/courses/my-courses?email=${user.email}`)
    .then(res => res.json())
    .then(courses => setCourses(courses));
}, [user]);
```

**Navegación:**
- Cada card tiene un botón "IR AL CURSO" que lleva a `/cursos-online/{slug}`

### 2. Página de Detalle del Curso (`/cursos-online/[slug]`)

**Archivo:** `src/app/cursos-online/[slug]/page.tsx`

**Funcionalidad:**
- Muestra el contenido completo del curso
- Verifica acceso antes de mostrar contenido
- Renderiza lecciones, videos, información útil

**Componentes:**
- `LessonCard`: Card expandible para cada lección
- `OnlineCourseDetailPage`: Componente principal

**Verificación de Acceso:**
```typescript
useEffect(() => {
  const checkAccess = async () => {
    if (!user?.email) {
      setHasAccess(false);
      return;
    }

    const response = await fetch(
      `/api/courses/my-courses?email=${encodeURIComponent(user.email)}`
    );
    const courses = await response.json();
    
    // Verificar si el curso actual está en la lista
    const hasCourse = courses.some(
      (c: SerializedOnlineCourse) => 
        c.slug === courseSlug || c.id === courseSlug
    );
    
    setHasAccess(hasCourse);
  };

  checkAccess();
}, [user, courseSlug]);
```

**Estados:**
- `loading`: Cargando curso
- `checkingAccess`: Verificando acceso
- `hasAccess`: Usuario tiene acceso
- `error`: Error al cargar

**Contenido Mostrado:**
1. **Hero Section**: Título, descripción, imagen
2. **Lecciones**: Cards expandibles con:
   - Video embebido (iframe)
   - Contraseña del video (si aplica)
   - Descripción HTML
3. **Información Útil**: Bloques de información adicional
4. **Comunidad Baúl**: Links a grupos y recursos

---

## 🔧 Backend - APIs y Lógica

### 1. API: Mis Cursos (`/api/courses/my-courses`)

**Archivo:** `src/app/api/courses/my-courses/route.ts`

**Endpoint:** `GET /api/courses/my-courses?email={email}`

**Parámetros:**
- `email` (query param, requerido): Email del usuario

**Respuesta:**
```typescript
[
  {
    id: "curso-123",
    wpId: 123,
    slug: "curso-costura",
    title: "Curso de Costura",
    shortDescription: "Aprende costura desde cero",
    thumbnailMediaId: 456,
    status: "publish",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  },
  // ...
]
```

**Lógica de Búsqueda:**

1. **Buscar Cliente:**
   ```typescript
   const customer = await getCustomerByEmail(normalizedEmail);
   ```

2. **Obtener Cursos desde `enrolledCourses`:**
   ```typescript
   if (customer?.enrolledCourses) {
     for (const enrollment of customer.enrolledCourses) {
       // Verificar si el acceso aún es válido
       if (!accessTo || accessTo > now) {
         const course = await getOnlineCourseByIdFromFirestore(
           enrollment.courseId
         );
         if (course && course.status === 'publish') {
           enrolledCourses.push(course);
         }
       }
     }
   }
   ```

3. **Obtener Cursos desde Órdenes (Backup):**
   ```typescript
   const orders = await getOrdersByCustomerIdOrEmail(
     customer?.id,
     normalizedEmail
   );
   
   const paidOrders = orders.filter(
     order => order.status === 'approved' && 
              order.paymentStatus === 'paid'
   );
   
   for (const order of paidOrders) {
     for (const item of order.items) {
       if (item.type === 'onlineCourse' && item.courseId) {
         const course = await getOnlineCourseByIdFromFirestore(
           item.courseId
         );
         if (course && course.status === 'publish') {
           enrolledCourses.push(course);
         }
       }
     }
   }
   ```

**Cache:**
- `revalidate = 60` (1 minuto de cache)

**Optimizaciones:**
- Usa `Set` para evitar duplicados (`courseIdsSeen`)
- Solo incluye cursos con `status === 'publish'`
- Verifica fechas de expiración de acceso

### 2. API: Detalle del Curso (`/api/online-courses/[id]`)

**Archivo:** `src/app/api/online-courses/[id]/route.ts`

**Endpoint:** `GET /api/online-courses/{id}`

**Parámetros:**
- `id` (path param): ID o slug del curso

**Respuesta:**
```typescript
{
  id: "curso-123",
  wpId: 123,
  slug: "curso-costura",
  title: "Curso de Costura",
  shortDescription: "...",
  description: "...",
  thumbnailMediaId: 456,
  lessons: [
    {
      index: 1,
      title: "Introducción",
      descriptionHtml: "...",
      videoUrl: "https://...",
      videoPassword: "abc123",
      duration: "30 min"
    },
    // ...
  ],
  infoBlocks: [
    {
      index: 1,
      title: "Materiales",
      contentHtml: "..."
    },
    // ...
  ],
  status: "publish",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

### 3. Checkout API (`/api/checkout`)

**Archivo:** `src/app/api/checkout/route.ts`

**Endpoint:** `POST /api/checkout`

**Body:**
```typescript
{
  customer: {
    email: "usuario@example.com",
    name: "Juan Pérez",
    phone: "+5491112345678"
  },
  items: [
    {
      type: 'onlineCourse',
      id: "curso-123",
      quantity: 1
    }
  ],
  paymentMethod: 'mp' | 'cash' | 'transfer' | 'other'
}
```

**Procesamiento:**
1. Crea/actualiza cliente
2. Obtiene curso desde Firestore
3. Crea item de orden:
   ```typescript
   {
     type: 'onlineCourse',
     courseId: item.id,
     name: course.title,
     quantity: 1,
     unitPrice: 0,  // TODO: Agregar precio si es necesario
     total: 0
   }
   ```
4. Guarda orden en Firestore

### 4. Webhook MercadoPago (`/api/mercadopago/webhook`)

**Archivo:** `src/app/api/mercadopago/webhook/route.ts`

**Endpoint:** `POST /api/mercadopago/webhook`

**Función `processCourseEnrollments()`:**
```typescript
async function processCourseEnrollments(
  orderId: string, 
  customerId: string
) {
  // 1. Obtener orden
  const order = await getOrderById(orderId);
  
  // 2. Buscar items de tipo 'onlineCourse'
  const courseItems = order.items.filter(
    item => item.type === 'onlineCourse' && item.courseId
  );
  
  // 3. Para cada curso, crear inscripción
  for (const item of courseItems) {
    const enrollment = {
      courseId: item.courseId,
      accessFrom: Timestamp.now(),
      accessTo: null,  // null = acceso permanente
      enrolledAt: Timestamp.now()
    };
    
    // 4. Agregar a customer.enrolledCourses
    await updateCustomerEnrollments(customerId, enrollment);
  }
}
```

---

## 💾 Estructura de Datos

### Customer (Firestore Collection: `customers`)

```typescript
{
  id: "customer-123",
  email: "usuario@example.com",
  name: "Juan Pérez",
  phone: "+5491112345678",
  enrolledCourses: [
    {
      courseId: "curso-123",
      accessFrom: Timestamp,      // Fecha desde cuando tiene acceso
      accessTo: Timestamp | null,  // null = acceso permanente
      enrolledAt: Timestamp       // Fecha de inscripción
    }
  ],
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Order (Firestore Collection: `orders`)

```typescript
{
  id: "order-123",
  customerId: "customer-123",
  customerSnapshot: {
    email: "usuario@example.com",
    name: "Juan Pérez"
  },
  items: [
    {
      type: 'onlineCourse',
      courseId: "curso-123",
      name: "Curso de Costura",
      quantity: 1,
      unitPrice: 0,
      total: 0,
      imageUrl: "https://..."
    }
  ],
  status: 'approved' | 'pending' | 'cancelled',
  paymentStatus: 'paid' | 'pending' | 'failed',
  totalAmount: 0,
  paymentMethod: 'mp' | 'cash' | 'transfer' | 'other',
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### OnlineCourse (Firestore Collection: `onlineCourses`)

```typescript
{
  id: "curso-123",
  wpId: 123,
  slug: "curso-costura",
  title: "Curso de Costura",
  shortDescription: "Aprende costura desde cero",
  description: "Descripción completa...",
  thumbnailMediaId: 456,
  lessons: [
    {
      index: 1,
      title: "Introducción",
      descriptionHtml: "<p>...</p>",
      videoUrl: "https://vimeo.com/...",
      videoPassword: "abc123",
      duration: "30 min"
    }
  ],
  infoBlocks: [
    {
      index: 1,
      title: "Materiales",
      contentHtml: "<p>...</p>"
    }
  ],
  status: 'publish' | 'draft',
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Product (Firestore Collection: `products`)

```typescript
{
  id: "product-123",
  name: "Curso de Costura",
  // ...
  relatedCourseId: "curso-123"  // Link opcional a onlineCourses
}
```

---

## 🔐 Verificación de Acceso

### Frontend (Página de Detalle)

**Ubicación:** `src/app/cursos-online/[slug]/page.tsx`

```typescript
// 1. Verificar si usuario está logueado
if (!user?.email) {
  setHasAccess(false);
  return;
}

// 2. Obtener cursos del usuario
const response = await fetch(
  `/api/courses/my-courses?email=${encodeURIComponent(user.email)}`
);
const courses = await response.json();

// 3. Verificar si el curso actual está en la lista
const hasCourse = courses.some(
  (c: SerializedOnlineCourse) => 
    c.slug === courseSlug || c.id === courseSlug
);

// 4. Mostrar contenido o mensaje de restricción
if (!hasAccess) {
  return <AccessDeniedMessage />;
}
```

### Backend (API)

**Ubicación:** `src/app/api/courses/my-courses/route.ts`

La API verifica acceso de dos formas:

1. **Desde `enrolledCourses`:**
   - Verifica que el curso esté en la lista
   - Verifica que `accessTo` no haya expirado (si existe)
   - Verifica que el curso tenga `status === 'publish'`

2. **Desde Órdenes:**
   - Busca órdenes con `status === 'approved'` y `paymentStatus === 'paid'`
   - Busca items con `type === 'onlineCourse'` y `courseId`
   - Verifica que el curso tenga `status === 'publish'`

---

## ⚠️ Puntos Importantes

### 1. Relación Product → Course

Los productos pueden tener un campo `relatedCourseId` que los vincula a un curso online:

```typescript
// En Product
{
  id: "product-123",
  name: "Curso de Costura",
  relatedCourseId: "curso-123"  // Link al curso online
}
```

**Nota:** Actualmente, el checkout no usa automáticamente `relatedCourseId`. Si un producto tiene `relatedCourseId`, debería crearse un item de tipo `'onlineCourse'` en el checkout.

### 2. Verificación de Acceso

- **Frontend:** Se verifica en la página de detalle antes de mostrar contenido
- **Backend:** La API `/api/courses/my-courses` solo devuelve cursos a los que el usuario tiene acceso

**Recomendación:** Agregar verificación de acceso también en el backend para la API de detalle del curso (`/api/online-courses/[id]`).

### 3. Cache

- `/api/courses/my-courses`: `revalidate = 60` (1 minuto)
- `/api/online-courses/[id]`: `revalidate = 300` (5 minutos)

### 4. Fechas de Acceso

- `accessFrom`: Fecha desde cuando tiene acceso (default: fecha de inscripción)
- `accessTo`: Fecha hasta cuando tiene acceso (`null` = acceso permanente)

**Nota:** Actualmente, todos los cursos tienen acceso permanente (`accessTo: null`). Si se implementan cursos con acceso temporal, se debe verificar esta fecha.

### 5. Estados del Curso

Solo se muestran cursos con `status === 'publish'`. Los cursos con `status === 'draft'` no aparecen en la lista.

---

## 🐛 Troubleshooting

### Problema: Usuario compró curso pero no aparece en `/mis-cursos`

**Posibles causas:**

1. **Orden no está aprobada/pagada:**
   - Verificar que `order.status === 'approved'` y `order.paymentStatus === 'paid'`
   - Revisar webhook de MercadoPago

2. **`enrolledCourses` no se actualizó:**
   - Verificar que `processCourseEnrollments()` se ejecutó correctamente
   - Revisar logs del webhook

3. **Email no coincide:**
   - Verificar que el email usado en la compra sea el mismo que el del login
   - La API normaliza emails: `email.toLowerCase().trim()`

4. **Curso no existe o está en draft:**
   - Verificar que el curso existe en Firestore
   - Verificar que `course.status === 'publish'`

**Solución:**
- Revisar logs de `/api/courses/my-courses`
- Verificar orden en Firestore
- Verificar `customer.enrolledCourses`

### Problema: Usuario tiene acceso pero no puede ver contenido

**Posibles causas:**

1. **Slug/ID no coincide:**
   - Verificar que el `slug` o `id` del curso coincida con el usado en la URL
   - La verificación usa: `c.slug === courseSlug || c.id === courseSlug`

2. **Cache:**
   - El cache puede estar mostrando datos antiguos
   - Esperar 1 minuto o limpiar cache

**Solución:**
- Verificar que el curso esté en la respuesta de `/api/courses/my-courses`
- Verificar que el `slug` o `id` coincida

### Problema: Webhook no procesa inscripciones

**Posibles causas:**

1. **Webhook no se ejecuta:**
   - Verificar que MercadoPago esté enviando webhooks
   - Revisar logs del servidor

2. **Error en `processCourseEnrollments()`:**
   - Verificar logs del webhook
   - Verificar que el curso existe en Firestore

**Solución:**
- Revisar logs del webhook
- Ejecutar manualmente `processCourseEnrollments()` si es necesario

---

## 📝 Notas Adicionales

### Mejoras Futuras

1. **Verificación de acceso en backend:**
   - Agregar middleware o verificación en `/api/online-courses/[id]` para rechazar requests sin acceso

2. **Acceso temporal:**
   - Implementar lógica para cursos con `accessTo` definido
   - Mostrar fecha de expiración en la UI

3. **Relación Product → Course automática:**
   - Modificar checkout para usar `relatedCourseId` automáticamente

4. **Notificaciones:**
   - Enviar email cuando se otorga acceso a un curso
   - Notificar cuando el acceso está por expirar

5. **Analytics:**
   - Trackear visualizaciones de lecciones
   - Trackear progreso del usuario

---

## 🔗 Referencias

- **Frontend:**
  - `src/app/mis-cursos/page.tsx`
  - `src/app/cursos-online/[slug]/page.tsx`

- **Backend:**
  - `src/app/api/courses/my-courses/route.ts`
  - `src/app/api/online-courses/[id]/route.ts`
  - `src/app/api/checkout/route.ts`
  - `src/app/api/mercadopago/webhook/route.ts`

- **Tipos:**
  - `src/types/firestore/customer.ts`
  - `src/types/firestore/order.ts`
  - `src/types/firestore/onlineCourse.ts`

- **Helpers:**
  - `src/lib/firestore/customers.ts`
  - `src/lib/firestore/orders.ts`
  - `src/lib/firestore/onlineCourses.ts`


Quiero que actúes como un senior full-stack engineer especializado en:
- Next.js 14 (App Router)
- React 18
- TypeScript
- Firebase (Auth + Firestore + Admin SDK)
- Integraciones con Mercado Pago
- Migraciones desde WordPress (XML de exportación)

Voy a describirte el contexto completo del proyecto y luego quiero que sigas LOS PASOS que te doy, en orden, proponiendo y escribiendo el código necesario.

IMPORTANTE:
- No inventes estructuras que contradigan estas instrucciones.
- Antes de tocar archivos, detecta si ya existen versiones y proponé un refactor en lugar de duplicar lógica.
- Preferí siempre código tipado (TypeScript), módulos bien aislados y funciones reutilizables.
- Cuando implementes algo, indicá claramente qué archivos crear/modificar.

────────────────────────
1. CONTEXTO DEL PROYECTO
────────────────────────

Proyecto: E-commerce + Academia de “Baúl de Moda”.

Situación actual:
- Existe un proyecto en Next.js que hoy:
  - Usa API Routes internas que a su vez consumen una API externa (`/precios`, GET y POST).
  - Tiene código duplicado para transformar datos de la API externa a un tipo `Product` (varias `mapPrecioToProduct`).
  - Usa contextos, hooks y componentes (FilterContext, ProductList, etc.) que se apoyan en `/api/products`.
- Además, hay un WordPress/WooCommerce viejo del que se exportaron 3 archivos XML:
  - `productos.xml`       → Productos / talleres (post_type `product`).
  - `cursos_online.xml`   → Cursos online (post_type `cursos_online`).
  - `tips.xml`            → Tips/artículos con HTML, imágenes y archivos descargables (post_type `tips`).

Objetivo general:
- Unificar TODO en un solo proyecto Next.js + Firebase, sin depender de la API externa.
- Tener:
  - Front de e-commerce (presencial + online).
  - Front de cursos online (acceso a contenido).
  - Panel admin interno en el mismo proyecto.
  - Firestore como única fuente de verdad para:
    - `products`
    - `onlineCourses`
    - `tips`
    - `customers`
    - `orders`
- Migrar el contenido actual de WordPress (los 3 XML) a Firestore mediante scripts automáticos.

Stack y librerías recomendadas:
- Next.js 14 App Router.
- React 18.
- TypeScript.
- Tailwind + componentes UI (pueden ser shadcn/ui, pero no obligatorio).
- Firebase JS SDK (cliente) para front.
- Firebase Admin SDK para scripts de migración y algunas API Routes si hace falta.
- `fast-xml-parser` o similar para parsear XML en los scripts de migración.

────────────────────────
2. MODELO DE DATOS FIRESTORE
────────────────────────

Quiero que estructures Firestore con las siguientes colecciones y campos base (en TypeScript). Más adelante podés extender, pero esta es la base.

2.1. products (talleres / productos Woo)

Colección: `products`

Documento tipo:

```ts
export interface Product {
  id: string;               // docId en Firestore
  wpId: number;             // id original de WordPress (wp:post_id)
  slug: string;             // wp:post_name
  name: string;             // <title>
  shortDescription: string; // meta: descripcion_corta
  durationText: string;     // meta: duracion (texto libre)
  priceText: string;        // meta: precio (texto tipo "x en efectivo, y otros medios")
  locationText: string;     // meta: lugar
  detailsHtml: string;      // meta: detalles_del_taller (HTML completo)
  thumbnailMediaId: number | null;  // meta: imagen_principal (ID WP)
  galleryMediaIds: number[];        // meta: _product_image_gallery CSV IDs
  sku: string | null;              // meta: _sku
  stockStatus: 'instock' | 'outofstock' | 'onbackorder';
  category: string;                // derivado de product_cat
  subcategory: string | null;
  sede: 'ciudad-jardin' | 'almagro' | 'online' | 'mixto' | null; // derivado de categorías / lógica
  status: 'draft' | 'publish';     // wp:status
  localPriceNumber?: number | null;        // opcional, si parseamos número
  internacionalPriceNumber?: number | null;// opcional
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;

  relatedCourseId?: string | null; // link opcional a onlineCourses
}

2.2. onlineCourses (cursos online)
Colección: onlineCourses
Documento tipo:
export interface OnlineCourseLesson {
  index: number;
  title: string;             // clases_n_titulo
  descriptionHtml: string;   // clases_n_contenido (HTML)
  videoUrl: string;          // clases_n_link_video
  videoPassword?: string;    // clases_n_contrasena_de_video
  duration?: string;         // clases_n_duracion
}

export interface OnlineCourseInfoBlock {
  index: number;
  title: string;             // informacion_util_n_titulo
  contentHtml: string;       // informacion_util_n_contenido (HTML)
}

export interface OnlineCourse {
  id: string;                          // docId
  wpId: number;                        // wp:post_id
  slug: string;                        // wp:post_name
  title: string;                       // meta: titulo o <title>
  shortDescription: string;            // meta: descripcion_corta
  seoDescription: string;              // _yoast_wpseo_metadesc
  thumbnailMediaId: number | null;     // meta: imagen_principal
  status: 'draft' | 'publish';
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;

  relatedProductWpId?: number | null;  // si en WP hay un meta que referencie producto
  relatedProductId?: string | null;    // referencia final a products (opcional, se puede completar después)

  lessons: OnlineCourseLesson[];
  infoBlocks: OnlineCourseInfoBlock[];
}

2.3. tips
Colección: tips
Documento tipo:
export interface Tip {
  id: string;               // docId
  wpId: number;             // wp:post_id
  slug: string;             // wp:post_name
  title: string;            // <title>
  shortDescription: string; // meta: descripcion_corta
  contentHtml: string;      // content:encoded (HTML completo)
  category: string;         // category principal (nicename o texto)
  coverMediaId: number | null;       // meta: imagen_portada
  downloadMediaId?: number | null;   // meta: archivo_descargable
  seoDescription: string;            // _yoast_wpseo_metadesc
  status: 'draft' | 'publish';
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

2.4. customers
Colección: customers
export interface CustomerCourseEnrollment {
  courseId: string;          // ref a onlineCourses
  productId?: string;        // ref a products si aplica
  orderId: string;           // ref a orders
  accessFrom: FirebaseFirestore.Timestamp;
  accessTo?: FirebaseFirestore.Timestamp | null;
}

export interface Customer {
  id: string;                // docId (si tiene Firebase Auth, igual al uid)
  uid?: string;              // Firebase Auth uid
  email: string;
  name: string;
  phone?: string;
  createdAt: FirebaseFirestore.Timestamp;
  lastOrderAt?: FirebaseFirestore.Timestamp;
  totalOrders: number;
  totalSpent: number;
  tags: string[];            // "online", "presencial", etc.
  enrolledCourses: CustomerCourseEnrollment[];
}

2.5. orders (ventas / pedidos)
Colección: orders
export type OrderStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'refunded';

export type PaymentMethod =
  | 'mp'
  | 'transfer'
  | 'cash'
  | 'other';

export interface OrderItem {
  type: 'product' | 'onlineCourse';
  productId?: string;
  courseId?: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface OrderCustomerSnapshot {
  name: string;
  email: string;
  phone?: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;

  mpPaymentId?: string;
  mpPreferenceId?: string;
  externalReference?: string;

  customerId: string;                     // ref a customers
  customerSnapshot: OrderCustomerSnapshot;

  items: OrderItem[];
  totalAmount: number;
  currency: 'ARS';

  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

────────────────────────
 3. FASE 1 · LIMPIEZA Y PREPARACIÓN DEL PROYECTO NEXT
 ────────────────────────
Objetivo: dejar la base del proyecto limpia antes de conectar Firestore.
Tareas que quiero que realices:
Detectar todas las funciones mapPrecioToProduct o equivalentes:


En API Routes (src/app/api/products/route.ts, src/app/api/products/[id]/route.ts, etc.).


En src/services/productService.ts o similares.


En otros módulos donde se transformen datos de la API externa.


Crear un módulo único:


Archivo sugerido: src/lib/products/transform.ts.


Exportar desde ahí una sola función genérica:

 import { Product } from "@/types/product";

export function mapExternalPrecioToProduct(raw: any): Product {
  // Implementación consolidada
}


Reemplazar todas las implementaciones duplicadas para que usen esta función común.


Asegurar que el tipo Product esté definido en un único archivo:


Archivo sugerido: src/types/product.ts.


Que la definición coincida o sea compatible con el modelo de Firestore Product que definí más arriba (se puede ampliar luego con campos de migración).


Dejar claro un punto de configuración:


Variable de entorno para indicar si usamos API externa o Firestore:


USE_FIRESTORE=true|false


Donde sea posible:

 const USE_FIRESTORE = process.env.NEXT_PUBLIC_USE_FIRESTORE === "true";


────────────────────────
 4. FASE 2 · CONFIGURACIÓN FIREBASE (CLIENTE + ADMIN)
 ────────────────────────
Tareas:
Crear módulo de inicialización Firebase (cliente) para front:


Archivo: src/lib/firebase/client.ts


Configuración clásica con initializeApp, getAuth, getFirestore.


Evitar inicializar dos veces.


Crear módulo de inicialización Firebase Admin:


Archivo: src/lib/firebase/admin.ts


Usar variables de entorno para credenciales (service account JSON o campos individuales).


Exportar adminApp y adminDb (instancia de Firestore de Admin SDK).


Asegurar que:


Scripts de migración usarán SIEMPRE adminDb.


API Routes “server-side” que manipulen muchas escrituras/lecturas deben usar preferentemente adminDb.


────────────────────────
 5. FASE 3 · TIPOS TS Y CONVERTERS FIRESTORE
 ────────────────────────
Crear tipos TypeScript para:


Product


OnlineCourse, OnlineCourseLesson, OnlineCourseInfoBlock


Tip


Customer, CustomerCourseEnrollment


Order, OrderItem, etc.


Guardarlos en carpeta:


src/types/firestore/*.ts o similar.


(Opcional pero recomendado):


Crear FirestoreDataConverters para cada tipo en:


src/lib/firestore/converters.ts


Ejemplo:

 import { FirestoreDataConverter } from "firebase-admin/firestore";
import { Product } from "@/types/firestore/product";

export const productConverter: FirestoreDataConverter<Product> = {
  toFirestore(product: Product): FirebaseFirestore.DocumentData {
    return { ...product };
  },
  fromFirestore(
    snapshot: FirebaseFirestore.QueryDocumentSnapshot
  ): Product {
    const data = snapshot.data();
    return { id: snapshot.id, ...data } as Product;
  },
};


────────────────────────
 6. FASE 4 · SCRIPTS DE MIGRACIÓN DESDE XML A FIRESTORE
 ────────────────────────
Quiero 3 scripts Node/TS separados (o uno paramétrico) para migrar:
productos.xml → colección products


cursos_online.xml → colección onlineCourses


tips.xml → colección tips


Requisitos generales:
Usar fast-xml-parser (u otra lib sólida) para parsear el XML a JSON.


Asumir que los archivos XML estarán en una carpeta, ej: /scripts/data/.


Usar adminDb del módulo src/lib/firebase/admin.ts.


Hacer escritura en batch (batch write o bien en chunks de tamaño razonable).


Loguear resumen al final: cuántos docs se crearon / actualizados.


6.1. Función utilitaria para lectura y parseo de XML:
Crear helper en scripts/utils/xml.ts (o similar) que:


Lea un archivo XML.


Lo parsee a JSON con configuración adecuada (no perder CDATA).


Devuelva la lista de items: json.rss.channel.item.


6.2. Helper extractMeta:
Todos los postmeta vienen como array de { "wp:meta_key": "...", "wp:meta_value": "..." }.


Crear función genérica:


interface WpMetaItem {
  ["wp:meta_key"]: string;
  ["wp:meta_value"]: any;
}

export function extractMeta(metaArr: WpMetaItem[]): Record<string, any> {
  const meta: Record<string, any> = {};
  for (const m of metaArr ?? []) {
    const key = m["wp:meta_key"];
    const value = m["wp:meta_value"];
    meta[key] = value;
  }
  return meta;
}

6.3. Script: productos.xml → products
Archivo sugerido: scripts/migrate-products.ts.


Pasos:


Parsear productos.xml.


Filtrar items donde wp:post_type === "product".


Para cada item:


Extraer metas con extractMeta.


Construir objeto Product respetando el modelo definido.


Lógica puntual:


shortDescription ← meta descripcion_corta.


durationText ← meta duracion.


priceText ← meta precio.


locationText ← meta lugar.


detailsHtml ← meta detalles_del_taller.


thumbnailMediaId ← número de imagen_principal o null.


galleryMediaIds ← meta._product_image_gallery split(',').


sku ← meta _sku o null.


stockStatus ← meta _stock_status (default 'instock').


category / subcategory:


Leer item.category, que puede ser array o un solo objeto.


Tomar la primera categoría principal como category.


status ← 'publish' si wp:status es 'publish', sino 'draft'.


createdAt / updatedAt:


Desde wp:post_date y wp:post_modified (convertir a Timestamp).


Guardar cada producto en:


products/{wpId} (usar el wpId como docId inicial para tracabilidad).


6.4. Script: cursos_online.xml → onlineCourses
Archivo sugerido: scripts/migrate-online-courses.ts.


Pasos:


Parsear cursos_online.xml.


Filtrar items donde wp:post_type === "cursos_online".


Para cada item:


Extraer metas con extractMeta.


Construir arrays lessons e infoBlocks leyendo metas tipo:


clases_0_titulo, clases_0_contenido, clases_0_link_video, clases_0_contrasena_de_video, clases_0_duracion, etc.


clases_1_*, clases_2_*, etc., hasta que no existan más claves.


informacion_util_0_titulo, informacion_util_0_contenido, etc.


Construir objeto OnlineCourse:


wpId, slug, title, shortDescription, seoDescription…


thumbnailMediaId desde meta imagen_principal.


status desde wp:status.


createdAt / updatedAt desde fechas WP.


relatedProductWpId si existe algún meta que relacione.


lessons & infoBlocks con sus índices.


Guardar cada curso en:


onlineCourses/{wpId}.


6.5. Script: tips.xml → tips
Archivo sugerido: scripts/migrate-tips.ts.


Pasos:


Parsear tips.xml.


Filtrar items donde wp:post_type === "tips".


Para cada item:


Extraer metas.


Tomar:


title ← <title>.


shortDescription ← meta descripcion_corta.


contentHtml ← content:encoded (cuidar CDATA).


category ← primer item.category (puede ser array u objeto).


coverMediaId ← número de meta imagen_portada.


downloadMediaId ← número de meta archivo_descargable (opcional).


seoDescription ← _yoast_wpseo_metadesc.


status + fechas.


Guardar cada tip en:


tips/{wpId}.


6.6. Ejecución de scripts
Pensar estos scripts como comandos Node:


ts-node scripts/migrate-products.ts


ts-node scripts/migrate-online-courses.ts


ts-node scripts/migrate-tips.ts


Asegurarse de:


Manejar límite de writes por batch (500 docs).


Loguear claramente cuántos documentos se procesaron.


────────────────────────
 7. FASE 5 · API ROUTES: LEER DESDE FIRESTORE
 ────────────────────────
Objetivo: que el front (incluyendo FilterContext, ProductListSec, etc.) lea desde Firestore usando /api/products como capa de acceso.
Tareas:
Reescribir /api/products (route.ts) para que:


Use un flag USE_FIRESTORE.


Si USE_FIRESTORE === true, lea desde Firestore:


Sin query params → devolver todos los productos activos (status publish).


Con ?ids=... → devolver sólo los productos con esos IDs.


Mantener los tipos de respuesta compatibles con el tipo Product del front.


Reescribir /api/products/[id]:


Que lea el documento products/{id} en Firestore.


Devuelva un Product.


Mantener compatibilidad temporal:


Si USE_FIRESTORE === false, seguir usando la API externa con mapExternalPrecioToProduct.


Esto permite un rollout gradual.


Crear API Routes básicas para:


/api/online-courses (listado).


/api/online-courses/[id] (detalle).


/api/tips y /api/tips/[id].


────────────────────────
 8. FASE 6 · PANEL ADMIN (SECCIONES Y FORMULARIOS)
 ────────────────────────
Objetivo: construir un panel admin dentro del mismo proyecto.
Estructura sugerida (App Router):
src/app/
  admin/
    layout.tsx     // layout base admin (sidebar, header, etc.)
    page.tsx       // dashboard simple (stats)
    productos/
      page.tsx     // listado
      [id]/
        page.tsx   // editar
    cursos-online/
      page.tsx
      [id]/
        page.tsx
    tips/
      page.tsx
      [id]/
        page.tsx
    clientes/
      page.tsx
      [id]/
        page.tsx
    ventas/
      page.tsx
      [id]/
        page.tsx

8.1. Middleware de auth admin
Implementar un middleware (o server component de layout) que:


Verifique un token de Firebase Auth.


Chequee un custom claim isAdmin: true o una lista de emails permitidos.


Redirija a /login si no tiene permisos.


8.2. Sección Productos
Vista listado:


Tabla con columnas:


Nombre


Sede / categoría


Estado (publish/draft)


StockStatus


Fecha de actualización


Botón “Nuevo producto”.


Vista edición/creación:


Form dividido en bloques:


Datos base:


Nombre, slug, estado, categoría, subcategoría, sede.


Comercial:


Precio (texto), duración (texto), lugar.


Contenido:


Descripción corta.


Detalles del taller (rich text editor → HTML).


Medios:


Thumbnail (subida a Storage o elección por URL).


Galería.


Guardar/actualizar documento en products.


8.3. Sección Cursos Online
Listado:


Título, estado, cantidad de clases, fecha de actualización.


Edición:


Datos básicos:


Título, slug, descripción corta, SEO description, estado.


Relación con products:


Select que liste productos para asociar (opcional).


Bloques “Clases”:


Lista reorderable de lessons[].


Cada item con campos:


Título


Duración


Video URL


Contraseña


Descripción (rich text, que se guarda como HTML).


Bloques “Información útil”:


Lista reorderable de infoBlocks[].


Cada item con título + contenido HTML.


8.4. Sección Tips
Listado:


Título, categoría, estado, fecha.


Edición:


Título, slug, categoría, descripción corta.


Contenido (rich text).


Imagen de portada.


Archivo descargable (opcional).


Estado (draft/publish).


8.5. Sección Clientes
Listado:


Nombre, email, tags, total ordenes, total gastado.


Detalle:


Datos del cliente.


Lista de orders vinculadas.


Lista de enrolledCourses.


8.6. Sección Ventas
Listado:


Fecha, cliente, total, estado de pago.


Detalle:


Datos del pago (Mercado Pago).


Items comprados.


Enlaces a cliente y, si corresponde, a acceso de curso online.


────────────────────────
 ────────────────────────
7. FASE 7 · COBROS + MERCADO PAGO (SIN ENVÍO, SÓLO RETIRO EN SUCURSAL)
────────────────────────

Objetivo de esta fase:
- Implementar un flujo de cobros claro y robusto que:
  - Evite compras duplicadas/confusas.
  - Soporte precios distintos según método de pago (efectivo vs otros medios).
  - Permita trabajar inicialmente con cuenta de Mercado Pago de prueba (sandbox) y luego cambiar a cuenta real sólo modificando variables de entorno.
  - No incluya lógica de envíos: en este proyecto el flujo es SIEMPRE **retiro en sucursal**, no se piden datos de envío ni se calculan costos de envío.

────────────────────────
7.1. AJUSTES EN EL MODELO DE PRODUCTO (PRECIOS POR MÉTODO)
────────────────────────

Extender el modelo `Product` en Firestore para soportar precios diferenciados por método de pago:

```ts
export interface Product {
  // ...campos ya definidos antes

  // Precio base de referencia (puede coincidir con otros si no hay diferencia)
  basePrice: number | null;

  // Precio en efectivo (sin IVA), usado cuando el usuario elige ese método
  cashPrice: number | null;

  // Precio para otros medios (tarjeta, Mercado Pago, etc., con IVA)
  otherMethodsPrice: number | null;

  // Opcional: precio internacional (si aplica)
  internationalPrice: number | null;

  // Estrategia de precios:
  // - "single": usa un solo precio (base/otherMethodsPrice)
  // - "dual": diferencia efectivo vs otros medios
  pricingMode: "single" | "dual";
}

Notas:
priceText (texto original) se puede seguir usando a nivel marketing; estos campos numéricos se usan en el cálculo real del checkout.


Si un producto no necesita doble precio, usar pricingMode = "single" y llenar sólo el precio principal.


────────────────────────
 7.2. FLUJO DE CHECKOUT · DISEÑO GENERAL (SIN ENVÍOS)
 ────────────────────────
El checkout debe:
Crear SIEMPRE un Order en Firestore primero:


Estado inicial: status: "pending", paymentStatus: "pending".


La orden tendrá:


Carrito (items).


Cliente.


paymentMethod elegido: "mp" | "cash" | "transfer".


totalAmount calculado según el método de pago.


No se guardan datos de envío (no hay direcciones, ni costos de envío). El flujo es siempre retiro en sucursal.


Luego, según método de pago:

 A) Método “Mercado Pago”:


Crear una Preferencia de pago en MP usando totalAmount calculado con el precio para “otros medios”.


Usar external_reference = orderId (ID de la orden en Firestore).


Guardar en la orden:


mpPreferenceId


externalReference


Redirigir al usuario a Mercado Pago.


El estado final de la orden se decide por WEBHOOK, no por confiar sólo en la URL de retorno.


B) Método “Efectivo en sucursal”:


No se crea pago en MP.


La orden queda con:


paymentMethod: "cash"


status: "pending"


paymentStatus: "pending"


Se muestra al usuario:


El monto a pagar en efectivo (usando cashPrice).


Instrucciones claras de retiro en sucursal (dirección, horarios, plazo de reserva, etc.).


Desde el panel admin, cuando el cliente paga en la sucursal:


Actualizar la orden a paymentStatus: "paid" y status: "approved".


C) Método “Transferencia” (si se utiliza):


Similar a efectivo pero con instrucciones de transferencia.


No se llama a Mercado Pago.


La orden se marca como pagada manualmente cuando se verifica la transferencia.


En el FRONT:


Debe mostrarse SIEMPRE el total según el método de pago seleccionado:


Si el usuario elige “Mercado Pago” → usar otherMethodsPrice.


Si elige “Efectivo” → usar cashPrice.


Si cambia de método, el total visible se actualiza en tiempo real.


No se presenta ninguna UI de envío (ni selector de envío, ni dirección). Sólo retiro en sucursal.


────────────────────────
 7.3. FLUJO MERCADO PAGO · EVITAR DUPLICADOS
 ────────────────────────
Para evitar compras duplicadas y confusión:
Relación 1:1 entre Orden y Preferencia MP:


Al confirmar checkout con método "mp":


Si la orden NO tiene mpPreferenceId:


Crear una nueva preferencia en MP.


Guardar mpPreferenceId y externalReference = orderId.


Si la orden YA tiene mpPreferenceId y paymentStatus sigue "pending":


No crear otra preferencia.


Reutilizar la preferencia existente (link o redirección).


En el FRONT:


Deshabilitar el botón “Pagar con Mercado Pago” mientras se está creando la preferencia.


Si el usuario recarga la página:


Volver a obtener la orden (por API).


Si hay mpPreferenceId y paymentStatus es "pending", reutilizar esa preferencia.


Webhook de Mercado Pago:


Endpoint: src/app/api/mercadopago/webhook/route.ts.


Pasos:


Recibir la notificación de MP.


Consultar el pago en MP (estado real).


Buscar la orden por external_reference (que contiene orderId).


Actualizar en Firestore:


mpPaymentId


status ("approved" | "rejected" | "cancelled" | "refunded")


paymentStatus ("paid" cuando corresponda).


Debe ser idempotente (repetir el mismo webhook no debe romper nada).


Página de resultado (“gracias”):


La página de retorno (success/failure) debe leer la orden desde Firestore usando orderId.


El estado mostrado al usuario debe basarse en los datos de Firestore, no sólo en query params de Mercado Pago.


────────────────────────
 7.4. MERCADO PAGO EN MODO PRUEBA (SANDBOX)
 ────────────────────────
Se debe soportar desde el inicio modo sandbox y preparar el cambio a producción sólo tocando variables de entorno.
Variables de entorno sugeridas:


MP_PUBLIC_KEY_SANDBOX


MP_ACCESS_TOKEN_SANDBOX


MP_PUBLIC_KEY_PROD


MP_ACCESS_TOKEN_PROD


MP_ENVIRONMENT="sandbox" | "production"


Crear módulo adaptador Mercado Pago:


Archivo: src/lib/payments/mercadopago.ts


Responsabilidades:


Elegir las credenciales según el valor de MP_ENVIRONMENT.


Exponer funciones:


createPreference(params) → devuelve preferenceId, initPoint, sandboxInitPoint.


getPaymentById(id) → consulta estado del pago.


La lógica de MP no debe dispersarse por varios archivos; debe centralizarse en este adaptador.


Cambio a producción:


Una vez probado todo con sandbox:


Sólo cambiar MP_ENVIRONMENT="production" y setear las variables de producción.


No modificar lógica de negocio ni endpoints.


────────────────────────
 7.5. API ROUTES PARA CHECKOUT Y MERCADO PAGO
 ────────────────────────
Implementar las siguientes rutas:
/api/checkout (POST)


Body esperado:


customer: datos del cliente (nombre, email, phone).


items: lista de productos/cursos con id y quantity.


paymentMethod: "mp" | "cash" | "transfer".


Pasos:


Leer los productos/cursos desde Firestore y calcular totalAmount según:


paymentMethod === "mp" → usar otherMethodsPrice.


paymentMethod === "cash" → usar cashPrice.


paymentMethod === "transfer" → puede usar el mismo valor que "mp", salvo que se defina otra estrategia.


Crear un documento Order en Firestore:


status: "pending", paymentStatus: "pending", paymentMethod, items, totalAmount.


Si paymentMethod === "mp":


Crear preferencia en Mercado Pago usando el adaptador.


Guardar mpPreferenceId y externalReference = orderId en la orden.


Devolver al front:


URL de pago (init_point / sandbox_init_point).


Si paymentMethod === "cash" o "transfer":


No llamar a Mercado Pago.


Devolver al front:


Datos de la orden.


Instrucciones de retiro en sucursal (texto configurable).


/api/mercadopago/webhook (POST)


Recibe notificaciones de MP.


Usa el adaptador para obtener detalles del pago.


Actualiza la orden en Firestore (estado + paymentStatus).


Si la orden pasa a pagada (paymentStatus: "paid"), luego se disparan las actualizaciones sobre customers y acceso a cursos online.


────────────────────────
 7.6. EMAILS / MENSAJES PARA EL USUARIO (SIN ENVÍO)
 ────────────────────────
Ajustar (o dejar preparado) el envío de emails / mensajes automáticos:
Para pagos con Mercado Pago:


Email al aprobarse el pago (una vez que el webhook actualiza la orden).


Contenido sugerido:


Resumen de compra.


Método de pago (Mercado Pago).


Sucursal de retiro y condiciones (no hay envío).


En caso de curso online, instrucciones de acceso.


Para pagos en efectivo o transferencia:


Email con:


Monto a pagar según cashPrice (u otro número para transferencia).


Detalle de retiro en sucursal o datos de transferencia.


Plazo de reserva antes de cancelar la orden.


No se deben incluir mensajes genéricos tipo “en breve nos comunicaremos” sin información clara de próximos pasos.
────────────────────────
 7.7. RELACIÓN ORDERS ↔ CUSTOMERS ↔ ONLINE COURSES
 ────────────────────────
Cuando una orden pasa a paymentStatus: "paid":
Actualizar customers:


Crear el cliente si no existe (basado en email o uid).


Incrementar:


totalOrders


totalSpent


lastOrderAt.


Si en la orden hay ítems con type: "onlineCourse":


Agregar en customers.enrolledCourses:


courseId


productId (si corresponde)


orderId


accessFrom = ahora


accessTo opcional (si hay vencimiento de acceso).


────────────────────────
 7.8. RESUMEN DE IMPLEMENTACIÓN PARA ESTA FASE
 ────────────────────────
Implementar en este orden:
Extender Product para soportar precios diferenciados (basePrice, cashPrice, otherMethodsPrice, pricingMode).


Crear el adaptador de Mercado Pago (src/lib/payments/mercadopago.ts) con soporte sandbox/producción.


Implementar /api/checkout con:


Creación de Order.


Integración con Mercado Pago o flujo manual según paymentMethod.


Sin campos de envío (siempre retiro en sucursal).


Implementar /api/mercadopago/webhook con actualización de Order y Customer.


Ajustar el UI de checkout:


Selector de método de pago.


Re-cálculo del total según método.


Prevención de clics duplicados.


Sin UI de envío (ni costos ni direcciones).


Ajustar o dejar preparado el envío de emails/mensajes según cada tipo de pago.


────────────────────────
 10. FASE 8 · LIMPIEZA FINAL Y FLAGS
 ────────────────────────
Asegurarse de que:


Todos los lugares donde se usaba API externa ahora leen de Firestore si USE_FIRESTORE === true.


El código duplicado de transformación se eliminó y sólo queda una fuente de verdad.


El panel admin opera únicamente sobre Firestore.


Puedas correr los scripts de migración, verificar en Firestore y luego habilitar USE_FIRESTORE=true de forma definitiva.


────────────────────────
 ESTILO QUE QUIERO DE VOS (CURSOR)
 ────────────────────────
Antes de escribir código, describí brevemente qué vas a hacer en términos de archivos y funciones.


Luego escribí el código completo, con imports y exports correctos.


Tené en cuenta que todo esto se integrará en un proyecto existente de Next.js 14, por lo tanto:


Respetá el App Router y la estructura que ya haya; si algo choca, proponé el refactor.


Cuando haya decisiones dudosas (nombres de campos, estructuras, etc.), preferí seguir lo especificado en este prompt. Si no hay indicación, proponé una solución coherente y explícala.


Con todo esto, ayudame a:
Crear los tipos y módulos base (Firebase, Firestore, modelos).


Escribir los scripts de migración para los 3 XML.


Adaptar las API Routes para leer Firestore.


Construir el panel admin con las secciones indicadas.


Dejar lista la base para integrar Mercado Pago y orders.


Empecemos por la FASE 1: mostrame qué archivos vas a tocar/crear para unificar mapPrecioToProduct y centralizar el tipo Product, y luego escribí el código correspondiente.


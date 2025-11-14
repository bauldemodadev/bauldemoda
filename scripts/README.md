# Scripts de Migración XML → Firestore

Este directorio contiene los scripts para migrar datos desde archivos XML de WordPress a Firestore.

## 📋 Requisitos Previos

### 1. Instalar dependencias

```bash
npm install fast-xml-parser
npm install --save-dev @types/node ts-node
```

### 2. Configurar variables de entorno

Asegúrate de tener configurado `.env.local` con las credenciales de Firebase Admin (ver `CONFIGURACION_FIREBASE.md`).

## 🚀 Scripts Disponibles

### 1. Migrar Productos

```bash
npx ts-node scripts/migrate-products.ts
```

Migra productos desde `public/productos.xml` a la colección `products` en Firestore.

**Campos mapeados:**
- `wp:post_id` → `wpId` (usado como docId)
- `wp:post_name` → `slug`
- `title` → `name`
- Metadatos: `descripcion_corta`, `duracion`, `precio`, `lugar`, `detalles_del_taller`
- `imagen_principal` → `thumbnailMediaId`
- `_product_image_gallery` → `galleryMediaIds` (array)
- Categorías → `category`, `subcategory`, `sede`

### 2. Migrar Cursos Online

```bash
npx ts-node scripts/migrate-online-courses.ts
```

Migra cursos online desde `public/cursos_online.xml` a la colección `onlineCourses` en Firestore.

**Campos mapeados:**
- Metadatos `clases_N_*` → `lessons[]` (array de lecciones)
- Metadatos `informacion_util_N_*` → `infoBlocks[]` (array de bloques)
- `imagen_principal` → `thumbnailMediaId`
- `producto_relacionado` → `relatedProductWpId`

### 3. Migrar Tips

```bash
npx ts-node scripts/migrate-tips.ts
```

Migra tips desde `public/tips.xml` a la colección `tips` en Firestore.

**Campos mapeados:**
- `content:encoded` → `contentHtml` (preserva CDATA)
- `imagen_portada` → `coverMediaId`
- `archivo_descargable` → `downloadMediaId`
- `_yoast_wpseo_metadesc` → `seoDescription`

## 📁 Estructura

```
scripts/
├── utils/
│   ├── xml.ts          # Utilidades para parsear XML
│   └── wpMeta.ts       # Utilidades para extraer metadatos de WordPress
├── migrate-products.ts
├── migrate-online-courses.ts
├── migrate-tips.ts
└── README.md
```

## ⚙️ Características

- **Batch writes**: Los scripts procesan documentos en lotes de 500 (límite de Firestore)
- **Idempotencia**: Si un documento ya existe (por wpId), se actualiza en lugar de crear duplicado
- **Manejo de errores**: Continúa procesando aunque algunos items fallen
- **Logging detallado**: Muestra progreso y resumen al final
- **Preservación de CDATA**: El parser XML preserva contenido CDATA (HTML)

## 🔍 Verificación

Después de ejecutar los scripts, puedes verificar en Firebase Console:
- Colección `products`
- Colección `onlineCourses`
- Colección `tips`

Cada documento usa el `wpId` como ID del documento para facilitar la tracabilidad.

## ⚠️ Notas Importantes

1. **Backup**: Siempre haz backup de Firestore antes de ejecutar migraciones masivas
2. **Primera ejecución**: Los scripts crearán todos los documentos
3. **Re-ejecución**: Si vuelves a ejecutar, actualizará documentos existentes (por wpId)
4. **Límites**: Firestore tiene límites de escritura (20,000 operaciones por segundo), los scripts respetan estos límites con batch writes

## 🐛 Troubleshooting

### Error: "Cannot find module 'fast-xml-parser'"
```bash
npm install fast-xml-parser
```

### Error: "Firebase Admin SDK no inicializado"
Verifica que `.env.local` tenga `FIREBASE_SERVICE_ACCOUNT_JSON` configurado.

### Error: "No se encontró el canal RSS"
Verifica que los archivos XML estén en `public/` y tengan el formato correcto de WordPress export.


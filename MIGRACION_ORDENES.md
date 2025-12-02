# 🚀 Migración de Órdenes a Firestore

Esta guía explica cómo migrar las órdenes históricas desde archivos JSON a Firestore.

---

## 📋 Archivos a Migrar

- `public/firebase_orders_2025_almagro_v2.json` - **126 órdenes** de Almagro
- `public/firebase_orders_2025_ciudad_jardin_v2.json` - **468 órdenes** de Ciudad Jardín
- **Total**: 594 órdenes

---

## 🎯 Proceso de Migración

### 1️⃣ Dry-Run (Simulación) - RECOMENDADO

Primero, **siempre ejecuta en modo dry-run** para verificar que todo está correcto:

```bash
npm run migrate:dry-run
```

Este comando:
- ✅ Lee ambos archivos JSON
- ✅ Valida la estructura de cada orden
- ✅ Verifica si las órdenes ya existen
- ✅ Identifica qué customers se crearían
- ✅ Muestra un resumen completo
- ❌ **NO escribe nada en Firestore**

**Ejemplo de salida:**

```
🚀 MIGRACIÓN DE ÓRDENES A FIRESTORE

⚙️  CONFIGURACIÓN:
   - Modo: 🧪 DRY-RUN (sin escribir)
   - Saltar duplicados: ✅
   - Crear customers: ✅

📂 Leyendo archivos JSON...
   ✅ Almagro: 126 órdenes
   ✅ Ciudad Jardín: 468 órdenes
   📊 Total: 594 órdenes

🏫 MIGRANDO ÓRDENES DE ALMAGRO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[1/126] ✅ [DRY-RUN] Orden insertada: almagro-11748 (TEMIS GAUTIER)
[2/126] 👤 Cliente creado: regodenis@gmail.com
[2/126] ✅ [DRY-RUN] Orden insertada: almagro-11746 (Denís Rego)
...

📊 RESUMEN DE LA MIGRACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   📦 Total de órdenes: 594
   ✅ Insertadas exitosamente: 594
   ⏭️  Duplicadas (saltadas): 0
   ❌ Errores: 0
   👤 Clientes creados: 350
   👥 Clientes existentes: 244

🧪 MODO DRY-RUN: No se escribió nada en Firestore
```

---

### 2️⃣ Migración Real

Una vez verificado que todo está correcto en el dry-run:

```bash
npm run migrate:orders
```

⚠️ **IMPORTANTE**: Este comando **SÍ escribe en Firestore**. Asegúrate de:
- ✅ Haber revisado el dry-run
- ✅ Tener backup de Firestore (opcional pero recomendado)
- ✅ Estar en el proyecto correcto de Firebase

---

## 🔧 Características del Script

### ✅ Validación de Datos
- Valida estructura de cada orden
- Valida fechas ISO
- Verifica campos requeridos
- Detecta datos faltantes

### 🔄 Conversión Automática
- Convierte fechas ISO string → Firestore Timestamps
- Preserva todos los campos de metadata
- Mantiene IDs originales

### 👤 Gestión de Customers
- Verifica si el customer existe (por email)
- Si no existe, lo crea automáticamente
- Registra cuántos se crearon vs existentes

### 🛡️ Manejo de Duplicados
- Verifica si una orden ya existe antes de insertar
- Opción `SKIP_DUPLICATES: true` (por defecto)
- Si existe, la salta y continúa

### 📊 Progreso en Tiempo Real
- Muestra progreso: `[1/594]`, `[2/594]`, etc.
- Indica qué está haciendo en cada paso
- Resumen final con estadísticas

### ⚡ Performance
- Procesa en lotes de 10 órdenes
- Pausas pequeñas para no saturar Firestore
- Manejo robusto de errores (no se detiene si falla una)

---

## 📂 Estructura de Datos

### Orden en JSON (entrada):

```json
{
  "id": "almagro-11748",
  "status": "approved",
  "paymentStatus": "paid",
  "paymentMethod": "cash",
  "customerId": "temisgautier@gmail.com",
  "customerSnapshot": {
    "name": "TEMIS GAUTIER",
    "email": "temisgautier@gmail.com",
    "phone": "1126401813"
  },
  "items": [
    {
      "type": "product",
      "name": "Abc Costura - Miércoles 10hs",
      "productId": "139",
      "quantity": 1,
      "unitPrice": 94300.0,
      "total": 94300.0
    }
  ],
  "totalAmount": 94300.0,
  "currency": "ARS",
  "metadata": {
    "sede": "almagro",
    "orderType": "curso_presencial",
    "registrationSource": "legacy-web"
  },
  "externalReference": "11748",
  "createdAt": "2025-11-03T14:14:00Z",
  "updatedAt": "2025-11-03T14:14:00Z"
}
```

### Orden en Firestore (salida):

```typescript
{
  status: "approved",
  paymentStatus: "paid",
  paymentMethod: "cash",
  customerId: "temisgautier@gmail.com",
  customerSnapshot: {
    name: "TEMIS GAUTIER",
    email: "temisgautier@gmail.com",
    phone: "1126401813"
  },
  items: [...],
  totalAmount: 94300,
  currency: "ARS",
  metadata: {...},
  externalReference: "11748",
  createdAt: Timestamp(2025-11-03 14:14:00),  // ← Convertido
  updatedAt: Timestamp(2025-11-03 14:14:00)   // ← Convertido
}
```

---

## ⚙️ Configuración Avanzada

Puedes modificar el comportamiento editando `scripts/migrate-orders-to-firestore.ts`:

```typescript
const CONFIG = {
  DRY_RUN: false,           // true = no escribir
  SKIP_DUPLICATES: true,    // true = saltar si existe
  CREATE_CUSTOMERS: true,   // true = crear customers
  BATCH_SIZE: 10,          // Lote de procesamiento
};
```

---

## 🔍 Verificación Post-Migración

Después de la migración, verifica en Firebase Console:

### 1. Colección `orders`
```
📁 orders
  ├── almagro-11748
  ├── almagro-11746
  ├── ciudad-jardin-9734
  └── ...
```

### 2. Verificar cantidad
- Total esperado: **594 órdenes**
- Almagro: **126 órdenes**
- Ciudad Jardín: **468 órdenes**

### 3. Verificar fechas
- Las fechas deben ser tipo `timestamp`, no strings

### 4. Colección `customers`
- Deberían haberse creado los customers faltantes

---

## ❌ Manejo de Errores

### Si una orden falla:
- El script **continúa** con las siguientes
- Se registra el error en consola
- El resumen final indica cuántos errores hubo

### Errores comunes:
1. **Fecha inválida**: Revisa formato ISO en JSON
2. **Campo faltante**: Valida estructura del JSON
3. **Permisos Firebase**: Verifica credenciales

---

## 🆘 Troubleshooting

### Error: "Firebase Admin: Se requiere FIREBASE_SERVICE_ACCOUNT_JSON"

**Solución**: Configura las variables de entorno:

```bash
# Opción 1: JSON completo
export FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'

# Opción 2: Variables individuales
export FIREBASE_PROJECT_ID="tu-proyecto"
export FIREBASE_CLIENT_EMAIL="firebase-admin@..."
export FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
```

### Error: "Archivo no encontrado"

**Solución**: Verifica que los archivos existen en `public/`:
- `firebase_orders_2025_almagro_v2.json`
- `firebase_orders_2025_ciudad_jardin_v2.json`

### La migración se detiene

**Solución**: El script tiene reintentos automáticos. Si se detiene:
1. Revisa el último mensaje de error
2. Ejecuta de nuevo (saltará duplicados)
3. Verifica conexión a internet

---

## 📊 Estadísticas Esperadas

Basándose en análisis previo:

- **Total órdenes**: 594
- **Clientes únicos**: ~350-400 (estimado)
- **Órdenes Almagro**: 126
- **Órdenes Ciudad Jardín**: 468
- **Cursos presenciales**: Mayoría
- **Cursos online**: Algunos en Ciudad Jardín
- **Payment methods**:
  - Cash: ~60%
  - Transfer: ~35%
  - MP: ~5%

---

## 🔐 Seguridad

- ✅ Usa Firebase Admin SDK (credenciales seguras)
- ✅ No expone datos sensibles en logs
- ✅ Respeta reglas de seguridad de Firestore
- ✅ Dry-run primero para validar

---

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs del dry-run
2. Verifica estructura de JSON
3. Valida credenciales de Firebase
4. Ejecuta por lotes pequeños si es necesario

---

## ✅ Checklist de Migración

- [ ] Verificar archivos JSON existen
- [ ] Configurar credenciales Firebase
- [ ] Ejecutar `npm run migrate:dry-run`
- [ ] Revisar resumen del dry-run
- [ ] Backup de Firestore (opcional)
- [ ] Ejecutar `npm run migrate:orders`
- [ ] Verificar en Firebase Console
- [ ] Confirmar cantidad de órdenes
- [ ] Verificar customers creados

---

## 🎯 Próximos Pasos

Una vez migradas las órdenes:
1. ✅ Verifica datos en Firebase Console
2. ✅ Prueba consultas de órdenes en tu app
3. ✅ Verifica que los customers se muestran correctamente
4. ✅ Actualiza reportes/estadísticas si es necesario

---

**¡Listo para migrar! 🚀**


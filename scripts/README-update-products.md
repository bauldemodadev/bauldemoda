# Script de Actualización de Productos a Ciudad Jardín

Este script actualiza todos los productos en Firestore para que tengan `sede: 'ciudad-jardin'`.

## 📋 Requisitos

- Variables de entorno configuradas en `.env.local` (Firebase Admin)
- Node.js y npm instalados

## 🚀 Uso

### 1. Modo Dry-Run (Solo Lectura)

Primero ejecuta en modo dry-run para ver qué cambios se harían sin aplicarlos:

```bash
npx ts-node -r tsconfig-paths/register --project tsconfig.scripts.json scripts/update-products-ciudad-jardin.ts --dry-run
```

Este modo:
- ✅ Lee todos los productos
- ✅ Muestra un resumen detallado
- ✅ Indica cuántos productos se actualizarían
- ❌ **NO hace cambios reales** en Firestore

### 2. Aplicar Cambios Reales

Una vez que hayas revisado el resumen, ejecuta sin `--dry-run` para aplicar los cambios:

```bash
npx ts-node -r tsconfig-paths/register --project tsconfig.scripts.json scripts/update-products-ciudad-jardin.ts
```

⚠️ **ADVERTENCIA**: Este comando actualizará TODOS los productos a `sede: 'ciudad-jardin'`. El script esperará 5 segundos antes de continuar para que puedas cancelar con Ctrl+C si es necesario.

## 📊 Qué hace el script

1. **Lee todos los productos** de la colección `products` en Firestore
2. **Muestra un resumen** con:
   - Total de productos
   - Distribución por sede actual
   - Distribución por categoría
   - Distribución por status
   - Ejemplos de productos
3. **Actualiza** el campo `sede` a `'ciudad-jardin'` para todos los productos que no lo tengan ya
4. **Actualiza** el campo `updatedAt` con la fecha actual

## 🔍 Ejemplo de Salida

```
📖 Leyendo todos los productos de Firestore...

✅ Encontrados 108 productos en total

============================================================
📊 RESUMEN DE PRODUCTOS EN FIRESTORE
============================================================

📦 Total de productos: 108

🏢 Distribución por Sede:
   mixto               :  108 (100.0%)

📁 Distribución por Categoría:
   simple                        :   97 (89.8%)
   variable                      :   11 (10.2%)

📝 Distribución por Status:
   draft     :   57 (52.8%)
   publish   :   51 (47.2%)

============================================================

🔄 Iniciando actualización de productos...

   Procesados 100 productos...

============================================================
✅ ACTUALIZACIÓN COMPLETADA
============================================================

📊 Resultados:
   ✅ Actualizados: 108
   ⏭️  Omitidos (ya tienen ciudad-jardin): 0
   ❌ Errores: 0
```

## ⚠️ Notas Importantes

1. **Backup**: Siempre haz backup de Firestore antes de ejecutar actualizaciones masivas
2. **Idempotencia**: El script omite productos que ya tienen `sede: 'ciudad-jardin'`
3. **Batch writes**: Los cambios se aplican en lotes de 500 (límite de Firestore)
4. **Solo productos**: Este script NO afecta cursos online (están en otra colección)

## 🐛 Troubleshooting

### Error: "Cannot find module '@/lib/firebase/admin'"

Asegúrate de usar el comando completo con `tsconfig-paths`:
```bash
npx ts-node -r tsconfig-paths/register --project tsconfig.scripts.json scripts/update-products-ciudad-jardin.ts
```

### Error: "Firebase Admin SDK no inicializado"

Verifica que `.env.local` tenga `FIREBASE_SERVICE_ACCOUNT_JSON` configurado correctamente.


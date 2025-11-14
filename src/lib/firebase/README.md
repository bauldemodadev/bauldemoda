# Firebase Configuration

Este directorio contiene la configuración de Firebase para el proyecto.

## Estructura

- **`client.ts`**: Firebase Client SDK (para uso en frontend/navegador)
- **`admin.ts`**: Firebase Admin SDK (para uso en servidor/scripts)
- **`index.ts`**: Barrel export para facilitar imports

## Variables de Entorno Requeridas

### Para Firebase Client (Frontend)

Estas variables deben tener el prefijo `NEXT_PUBLIC_` para estar disponibles en el navegador:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id  # Opcional
```

### Para Firebase Admin (Servidor/Scripts)

Tienes dos opciones para configurar las credenciales:

#### Opción 1: Service Account JSON completo (Recomendado)

```env
FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}'
```

#### Opción 2: Campos individuales

```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Nota**: `FIREBASE_PRIVATE_KEY` debe incluir los `\n` literales o usar comillas dobles y escapar los saltos de línea.

## Uso

### En el Frontend (Cliente)

```typescript
import { app, db, storage, auth } from '@/lib/firebase/client';

// Usar db para leer/escribir desde componentes
const productsRef = collection(db, 'products');
```

### En API Routes o Scripts (Servidor)

```typescript
import { getAdminDb } from '@/lib/firebase/admin';

// Usar adminDb para operaciones administrativas
const adminDb = getAdminDb();
const productsRef = adminDb.collection('products');
```

## Instalación de Dependencias

Si aún no tienes `firebase-admin` instalado:

```bash
npm install firebase-admin
```

## Notas Importantes

1. **Client SDK** solo funciona en el navegador (no en servidor durante SSR)
2. **Admin SDK** solo funciona en servidor (no en navegador)
3. Las credenciales de Admin SDK son sensibles - **NUNCA** las expongas en el cliente
4. Para scripts de migración, **SIEMPRE** usa `getAdminDb()` del módulo admin


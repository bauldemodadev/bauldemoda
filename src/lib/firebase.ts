/**
 * @deprecated Este archivo está deprecado. Usa src/lib/firebase/client.ts en su lugar.
 * 
 * Este archivo se mantiene temporalmente para compatibilidad con imports existentes.
 * Se eliminará en una futura versión.
 * 
 * Para nuevo código, usa:
 * - import { app, db, storage, auth } from '@/lib/firebase/client' (frontend)
 * - import { getAdminDb } from '@/lib/firebase/admin' (servidor)
 */

// Re-exportar desde el nuevo módulo para mantener compatibilidad
export { app, db, storage, auth } from './firebase/client';
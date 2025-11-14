/**
 * Barrel export para módulos de Firebase
 * 
 * Exporta tanto el cliente como el admin para facilitar imports
 */

// Cliente (frontend)
export { app, db, storage, auth } from './client';

// Admin (servidor)
export { getAdminApp, getAdminDb, adminDb } from './admin';


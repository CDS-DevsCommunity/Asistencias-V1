// src/services/api/index.js
// Archivo central para re-exportar todos los servicios y configuraciones de la API.

export * from './auth';
export * from './escenarios';
export * from './tipos';
export * from './equipamientos';
export * from './eventoEscenarios';
export * from './eventos';
export { getAuthToken, getAuthHeaders } from './config.js';


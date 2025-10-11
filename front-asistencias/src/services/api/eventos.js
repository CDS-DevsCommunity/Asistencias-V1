// src/services/api/eventos.js
import apiRequest from './config';

/**
 * Servicio para la gestión de Eventos.
 */

// Listar todos los eventos
export const listarEventos = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return apiRequest(`/eventos/${queryString ? `?${queryString}` : ''}`);
};

// Crear un nuevo evento
export const crearEvento = (eventoData) => {
  return apiRequest('/eventos/', {
    method: 'POST',
    body: JSON.stringify(eventoData),
  });
};

// Obtener estadísticas de eventos
export const obtenerEstadisticasEventos = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return apiRequest(`/eventos/estadisticas/${queryString ? `?${queryString}` : ''}`);
};

// Obtener eventos próximos (usando el endpoint principal con filtro de fecha)
export const obtenerEventosProximos = (params = {}) => {
  // Filtrar eventos desde hoy en adelante
  const hoy = new Date().toISOString().split('T')[0];
  const filtros = { ...params, fecha_inicio: hoy };
  const queryString = new URLSearchParams(filtros).toString();
  return apiRequest(`/eventos/${queryString ? `?${queryString}` : ''}`);
};

// Obtener un evento específico por su ID
export const obtenerEvento = (id) => {
  return apiRequest(`/eventos/${id}/`);
};

// Actualizar un evento completamente
export const actualizarEvento = (id, eventoData) => {
  return apiRequest(`/eventos/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(eventoData),
  });
};

// Actualizar un evento parcialmente
export const actualizarEventoParcial = (id, eventoData) => {
  return apiRequest(`/eventos/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(eventoData),
  });
};

// Eliminar un evento
export const eliminarEvento = (id) => {
  return apiRequest(`/eventos/${id}/`, {
    method: 'DELETE',
  });
};

// Inscribir al usuario actual a un evento
export const inscribirEvento = (id) => {
  return apiRequest(`/eventos/${id}/inscribir/`, {
    method: 'POST',
    body: JSON.stringify({}), // El backend no espera un body, pero lo enviamos por consistencia
  });
};

// Cancelar la inscripción del usuario actual a un evento
export const cancelarInscripcion = (id) => {
  return apiRequest(`/eventos/${id}/cancelar_inscripcion/`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
};

// src/services/api/eventoEscenarios.js
import apiRequest from './config';

/**
 * Servicio para la gestión de la relación Evento-Escenario.
 */

// Listar todas las relaciones evento-escenario
export const listarEventoEscenarios = async (params = {}) => {
  const url = new URL(apiRequest.buildUrl('/evento-escenarios/'));
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  return apiRequest(url.pathname + url.search);
};

// Crear una nueva relación evento-escenario
export const crearEventoEscenario = async (data) => {
  return apiRequest('/evento-escenarios/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Obtener una relación específica por su ID
export const obtenerEventoEscenario = async (id) => {
  return apiRequest(`/evento-escenarios/${id}/`);
};

// Actualizar una relación completamente
export const actualizarEventoEscenario = async (id, data) => {
  return apiRequest(`/evento-escenarios/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// Actualizar una relación parcialmente
export const actualizarEventoEscenarioParcial = async (id, data) => {
  return apiRequest(`/evento-escenarios/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

// Eliminar una relación
export const eliminarEventoEscenario = async (id) => {
  return apiRequest(`/evento-escenarios/${id}/`, {
    method: 'DELETE',
  });
};

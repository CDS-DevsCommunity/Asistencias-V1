// src/services/api/tipos.js
import apiRequest from './config';

/**
 * Servicio para la gestión de Tipos de Evento.
 */

// Listar todos los tipos de evento
export const listarTiposEventos = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const url = `/tipos/${queryParams ? `?${queryParams}` : ''}`;
  return apiRequest(url);
};

// Crear un nuevo tipo de evento
export const crearTipoEvento = (tipoData) => {
  return apiRequest('/tipos/', {
    method: 'POST',
    body: JSON.stringify(tipoData),
  });
};

// Obtener un tipo de evento específico por su ID
export const obtenerTipoEvento = (id) => {
  return apiRequest(`/tipos/${id}/`);
};

// Actualizar un tipo de evento completamente
export const actualizarTipoEvento = (id, tipoData) => {
  return apiRequest(`/tipos/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(tipoData),
  });
};

// Actualizar un tipo de evento parcialmente
export const actualizarTipoEventoParcial = (id, tipoData) => {
  return apiRequest(`/tipos/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(tipoData),
  });
};

// Eliminar un tipo de evento
export const eliminarTipoEvento = (id) => {
  return apiRequest(`/tipos/${id}/`, {
    method: 'DELETE',
  });
};

// Función para obtener tipos de eventos activos (usada para dropdowns)
export const obtenerTiposEventosActivos = async () => {
  const response = await listarTiposEventos();
  return response.results || [];
};


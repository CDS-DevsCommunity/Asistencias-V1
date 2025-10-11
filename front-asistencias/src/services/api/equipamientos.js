// src/services/api/equipamientos.js
import apiRequest from './config';

/**
  Servicio para la gestión de equipamientos.
*/

// Listar todos los equipamientos (con paginación, búsqueda y ordenamiento)
export const listarEquipamientos = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const url = `/equipamientos/${queryParams ? `?${queryParams}` : ''}`;
  return apiRequest(url);
};

// Crear un nuevo equipamiento
export const crearEquipamiento = async (equipamientoData) => {
  return apiRequest('/equipamientos/', {
    method: 'POST',
    body: JSON.stringify(equipamientoData),
  });
};

// Obtener un equipamiento específico por su ID
export const obtenerEquipamiento = async (id) => {
  return apiRequest(`/equipamientos/${id}/`);
};

// Actualizar un equipamiento completamente
export const actualizarEquipamiento = async (id, equipamientoData) => {
  return apiRequest(`/equipamientos/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(equipamientoData),
  });
};

// Actualizar un equipamiento parcialmente
export const actualizarEquipamientoParcial = async (id, equipamientoData) => {
  return apiRequest(`/equipamientos/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(equipamientoData),
  });
};

// Eliminar un equipamiento
export const eliminarEquipamiento = async (id) => {
  return apiRequest(`/equipamientos/${id}/`, {
    method: 'DELETE',
  });
};

// Obtener préstamos de un equipamiento (extra)
export const obtenerPrestamosDeEquipamiento = async (id) => {
  return apiRequest(`/equipamientos/${id}/prestamos/`);
};

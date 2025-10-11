// src/services/api/escenarios.js
import apiRequest from './config';

/**
 * Servicio para la gestión de Escenarios.
 */

// Listar todos los escenarios (con paginación, búsqueda y ordenamiento)
export const listarEscenarios = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const url = `/escenarios/${queryParams ? `?${queryParams}` : ''}`;
  return apiRequest(url);
};

// Crear un nuevo escenario
export const crearEscenario = async (escenarioData) => {
  return apiRequest('/escenarios/', {
    method: 'POST',
    body: JSON.stringify(escenarioData),
  });
};

// Obtener un escenario específico por su ID
export const obtenerEscenario = async (id) => {
  return apiRequest(`/escenarios/${id}/`);
};

// Actualizar un escenario completamente
export const actualizarEscenario = async (id, escenarioData) => {
  return apiRequest(`/escenarios/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(escenarioData),
  });
};

// Actualizar un escenario parcialmente
export const actualizarEscenarioParcial = async (id, escenarioData) => {
  return apiRequest(`/escenarios/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(escenarioData),
  });
};

// Eliminar un escenario
export const eliminarEscenario = async (id) => {
  return apiRequest(`/escenarios/${id}/`, {
    method: 'DELETE',
  });
};

// Obtener escenarios disponibles para una fecha específica
export const obtenerEscenariosDisponibles = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const url = `/escenarios/disponibles/${queryParams ? `?${queryParams}` : ''}`;
  return apiRequest(url);
};

// Obtener eventos de un escenario específico
export const obtenerEventosDeEscenario = async (id) => {
  return apiRequest(`/escenarios/${id}/eventos/`);
};

// Función helper para validar datos de escenario antes de enviar
export const validarDatosEscenario = (datos) => {
  const errores = [];

  if (!datos.nombre || datos.nombre.trim().length === 0) {
    errores.push('El nombre del escenario es requerido');
  }

  if (!datos.ubicacion || datos.ubicacion.trim().length === 0) {
    errores.push('La ubicación del escenario es requerida');
  }

  if (!datos.capacidad || datos.capacidad <= 0) {
    errores.push('La capacidad debe ser un número mayor a 0');
  }

  if (!datos.area || datos.area <= 0) {
    errores.push('El área debe ser un número mayor a 0');
  }

  return errores;
};

// Función helper para formatear datos de escenario para mostrar
export const formatearDatosEscenario = (escenario) => {
  return {
    ...escenario,
    capacidad: parseInt(escenario.capacidad),
    area: parseFloat(escenario.area),
    created_at: escenario.created_at ? new Date(escenario.created_at) : null,
    updated_at: escenario.updated_at ? new Date(escenario.updated_at) : null,
  };
};

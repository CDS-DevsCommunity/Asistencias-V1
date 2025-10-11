// src/services/api/auth.js
import apiRequest from './config';

/**
 * Servicio para la gestión de autenticación de usuarios.
 */

// Registrar un nuevo usuario
export const registrarUsuario = async (userData) => {
  return apiRequest('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(userData),
    headers: { 'Content-Type': 'application/json' },
  });
};

// Iniciar sesión y obtener tokens
export const iniciarSesion = async (credentials) => {
  const response = await apiRequest('/auth/login/', {
    method: 'POST',
    body: JSON.stringify(credentials),
    headers: { 'Content-Type': 'application/json' },
  });

  // Guardar tokens y datos del usuario en localStorage
  if (response && response.access && response.refresh) {
    localStorage.setItem('access_token', response.access);
    localStorage.setItem('refresh_token', response.refresh);
    localStorage.setItem('user', JSON.stringify(response.user));
  }
  return response;
};

// Cerrar sesión
export const cerrarSesion = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  try {
    if (refreshToken) {
      await apiRequest('/auth/logout/', {
        method: 'POST',
        body: JSON.stringify({ refresh: refreshToken }),
      });
    }
  } catch (error) {
    console.error('Error al cerrar sesión en el backend, limpiando localmente:', error);
  } finally {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
};

// Obtener perfil del usuario autenticado
export const obtenerPerfil = async () => {
  return apiRequest('/auth/profile/');
};

// Actualizar perfil del usuario
export const actualizarPerfil = async (userData) => {
  return apiRequest('/auth/profile/update/', {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

// Verificar si el token es válido (opcional, útil para proteger rutas)
export const verificarToken = async () => {
  const token = localStorage.getItem('access_token');
  if (!token) return Promise.reject('No token found');
  return apiRequest('/auth/verify/', {
    method: 'POST',
    body: JSON.stringify({ token })
  });
};

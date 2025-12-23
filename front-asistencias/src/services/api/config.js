// services/api/config.js
// Configuración base para las peticiones API

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

// Función para obtener el token de autenticación
export const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

// Función para configurar headers comunes
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Función base para peticiones HTTP con manejo de errores
const apiRequest = async (url, options = {}) => {
  const config = {
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login'; 
        throw new Error('Sesión expirada o no autorizada.');
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
    }

    // Para métodos DELETE que pueden no devolver contenido
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error en petición a ${url}:`, error);
    throw error;
  }
};

// Adjuntamos el método buildUrl a la función apiRequest
apiRequest.buildUrl = (path) => {
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
  return `${baseUrl}${cleanPath}`;
};

export default apiRequest;

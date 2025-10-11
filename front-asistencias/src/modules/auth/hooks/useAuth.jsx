// src/modules/auth/hooks/useAuth.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { cerrarSesion as logoutService } from '../../../services/api/auth';

// 1. Crear el Contexto
const AuthContext = createContext(null);

// 2. Crear el Proveedor del Contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Comprobar si hay un usuario en localStorage al cargar la app
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('access_token');
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error al cargar datos de autenticación:', error);
      // Limpiar en caso de datos corruptos
      logoutService(); 
      setUser(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // Esta función será llamada desde la página de login
    setUser(userData.user);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await logoutService();
    setUser(null);
    setIsAuthenticated(false);
  };

  const authContextValue = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Crear el Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};

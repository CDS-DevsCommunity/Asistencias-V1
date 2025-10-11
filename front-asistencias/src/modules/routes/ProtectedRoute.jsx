// src/modules/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/hooks/useAuth';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Muestra un indicador de carga mientras se verifica la autenticación
    return <div>Verificando autenticación...</div>;
  }

  if (!isAuthenticated) {
    // Si no está autenticado, redirige al login, guardando la ubicación original
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Si está autenticado, renderiza el contenido de la ruta protegida
  return <Outlet />;
};

export default ProtectedRoute;

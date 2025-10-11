import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../auth/hooks/useAuth';
import ProtectedRoute from './ProtectedRoute';

const LoadingFallback = () => <div>Cargando...</div>;

// Carga diferida de los módulos
const AuthRoutes = lazy(() => import('../auth/route/AuthRoutes'));
const EventsPage = lazy(() => import('../../pages/EventsPage'));
const CreateEventPage = lazy(() => import('../../pages/CreateEventPage'));

const IndexRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Rutas de Autenticación (públicas) */}
            <Route path="/auth/*" element={<AuthRoutes />} />

            {/* Rutas Protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route path="/crear-evento" element={<CreateEventPage />} />
              {/* Aquí puedes añadir más rutas que requieran autenticación */}
            </Route>

            {/* Rutas Públicas */}
            <Route path="/" element={<EventsPage />} />

            {/* Ruta por defecto para cualquier otra URL */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default IndexRoutes;
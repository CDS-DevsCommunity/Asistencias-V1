import React from 'react'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
//import PublicRoute from './PublicRoute'
// import ProtectedRoute from './ProtectedRoute'
//import { AuthProvider } from '../auth/hooks/useAuth'

const LoadingFallback = () => <div>Cargando....</div>

// Carga diferida de los módulos
const AuthRoutes = lazy(() => import('./../auth/route/AuthRoutes'))
const EventsPage = lazy(() => import('../../pages/EventsPage'))
const CreateEventPage = lazy(() => import('../../pages/CreateEventPage'))

const IndexRoutes = () => {
    return (
        <BrowserRouter>
            {/*<AuthProvider> */}
            <Suspense fallback={<LoadingFallback />}>
                <Routes>

                    {/* Rutas públicas */}
                    {/* <Route element={<PublicRoute />}> */}
                    <Route path="/auth/*" element={<AuthRoutes />} />
                    {/* </Route> */}

                    {/* Rutas protegidas */}
                    {/* <Route element={<ProtectedRoute />}> */}
                    {/* <Route element={<PublicRoute />}>
                        <Route path="/dashboard/*" element={<DashboardRoutes />} />
                    </Route> */}

                    {/* Ruta por defecto */}
                                        <Route path="/" element={<EventsPage />} />
                    <Route path="/crear-evento" element={<CreateEventPage />} />

                    {/* Ruta por defecto */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
            {/* </AuthProvider> */}
        </BrowserRouter>
    )
}

export default IndexRoutes
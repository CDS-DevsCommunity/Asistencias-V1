import React from 'react'
import { Navigate, Route, Routes } from "react-router-dom"
import { lazy, Suspense } from "react"/* 
import LoginPage from './../pages/login/Login'
import RegisterPage from './../pages/registrarse/registrarse' */

const Login = lazy(() => import('../pages/login/Login'))
const Register = lazy(() => import('../pages/registro/Registrarse'))


// Componente de carga
const LoadingComponent = () => <div>Cargando...</div>;

const AuthRoutes = () => {
    return (
        <Routes>

            <Route path="login" element={
                <Suspense fallback={<LoadingComponent />}>
                    <Login />
                </Suspense>
            } />
            <Route path="registro" element={
                <Suspense fallback={<LoadingComponent />}>
                    <Register />
                </Suspense>
            } />


            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default AuthRoutes;
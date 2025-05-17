import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import FondoFormulario from '../../assets/luces-fondo-formulario.avif'
import Informacion from '../../components/informacion-general/Informacion'
import LogoCds from '../../assets/logo-cds 1.png'
import axios from 'axios'
import './login.css'

const Login = () => {
    const [email, setEmail] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');


    const logear = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/login', {
                email,
                password: contrasena,
            });
            console.log('Respuesta del servidor:', response);

        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setError('Error al conectar con el servidor. Inténtalo de nuevo.');
        }

    };
    return (
        <>
            <section className="pages-formulario-iniciar-sesion">
                <Informacion />
                <img src={FondoFormulario} alt="Fondoformulario" className='fondo-formulario-principal' />

                <div className="contendor-iniciar-sesion">
                    <article className='encabezado-formulario'>
                        <img src={LogoCds} alt="Logo de CDS" />
                        <h2>Iniciar Sesión</h2>
                        <p>Acceder a recursos exclusivos</p>
                    </article>

                    <form className="formulario-iniciar-sesion" onSubmit={logear}>
                        <label htmlFor="email-iniciar-sesion">Correo Electronico</label>
                        <input
                            type="email"
                            name="email"
                            id="email-iniciar-sesion"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                        <label htmlFor="password-iniciar-sesion">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            id="password-iniciar-sesion"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)} />
                        <Link to="/recuperarCuenta">¿Olvidaste tu contraseña?</Link>
                        <button type="submit">Ingresar</button>
                    </form>

                    {error && <p className="error">{error}</p>}

                    <footer className='informacion-footer'>
                        <p>¿No tienes cuenta? <Link to="/registro">Registrate</Link></p>
                    </footer>
                </div>


            </section>
        </>
    )
}

export default Login
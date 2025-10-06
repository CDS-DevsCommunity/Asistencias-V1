import React, { useState } from 'react';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import FondoFormulario from '../../../../assets/luces-fondo-formulario.avif';
import Informacion from '../../components/informacion-general/Informacion'
import LogoCds from '../../../../assets/logo-cds 1.png';
import './registrarse.css';

const Registrarse = () => {
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate()

    const registrar = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/register', {
                nombreCompleto,
                email,
                telefono,
                password: contrasena,
            });
            console.log('Respuesta del servidor:', response);
            navigate('/login')
        } catch (error) {
            console.error('Error al registrar el usuario:', error);
            setError('Error al conectar con el servidor. Inténtalo de nuevo.');
        }
    };

    return (
        <section className="pages-formulario-registro">
            <Informacion />
            <img src={FondoFormulario} alt="Fondoformulario" className="fondo-formulario-principal" />

            <div className="contendor-registro">
                <article className="encabezado-formulario">
                    <img src={LogoCds} alt="Logo de CDS" />
                    <h2>¡Regístrate!</h2>
                    <p>Únete a nuestra comunidad</p>
                </article>

                <form className="formulario-registro" onSubmit={registrar}>
                    <label htmlFor="nombre-completo">Nombre Completo</label>
                    <input
                        type="text"
                        name="nombre-completo"
                        id="nombre-completo"
                        value={nombreCompleto}
                        onChange={(e) => setNombreCompleto(e.target.value)}
                        required
                    />

                    <label htmlFor="email-registro">Correo Electrónico</label>
                    <input
                        type="email"
                        name="email"
                        id="email-registro"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor="telefono-registro">Teléfono</label>
                    <input
                        type="tel"
                        name="telefono"
                        id="telefono-registro"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        required
                    />

                    <label htmlFor="password-registro">Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        id="password-registro"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        required
                    />

                    {error && <p className="error">{error}</p>}

                    <button type="submit">Registrarse</button>
                </form>

                <footer className="informacion-footer">
                    <p>
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/auth/login">Inicia Sesión</Link>
                    </p>
                </footer>
            </div>
        </section>
    );
};

export default Registrarse;
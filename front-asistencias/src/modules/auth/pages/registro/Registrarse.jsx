import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registrarUsuario } from '../../../../services/api/auth';
import Informacion from '../../components/informacion-general/Informacion';
import LogoCds from '../../../../assets/logo-cds1.png';

const Registrarse = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password_confirm: '',
        first_name: '',
        last_name: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (formData.password !== formData.password_confirm) {
            setError('Las contraseñas no coinciden.');
            setLoading(false);
            return;
        }

        try {
            await registrarUsuario(formData);
            // Redirigir al login con un mensaje de éxito
            navigate('/auth/login', { 
                state: { message: '¡Registro exitoso! Ahora puedes iniciar sesión.' }
            });
        } catch (err) {
            const errorMessage = err.response?.data ? JSON.stringify(err.response.data) : err.message;
            setError(`Error al registrar: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="login-section relative flex justify-center md:justify-evenly items-center h-screen overflow-hidden text-white">
            <div className="hidden md:block">
                <Informacion />
            </div>

            <div className="bg-black/80 flex flex-col items-center lg:h-auto md:h-[95vh] h-[95%] min-w-[400px] max-w-[450px] rounded-2xl px-4 py-4 mx-4 md:mx-0">
                <article className="max-w-[300px] pt-2.5 flex flex-col items-center">
                    <img src={LogoCds} alt="Logo de CDS" className="w-20 h-auto" />
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent m-0">¡Regístrate!</h2>
                    <p className="text-lg m-0 text-gray-300 font-bold">Únete a nuestra comunidad</p>
                </article>

                <form className="p-2 rounded-lg w-full max-w-sm" onSubmit={handleSubmit}>
                    <label htmlFor="username" className="block text-base text-white font-bold mb-1">Nombre de Usuario</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mb-1 border-none rounded-md text-base bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                        disabled={loading}
                    />

                    <div className="flex gap-2 mb-1">
                        <div className="flex-1">
                            <label htmlFor="first_name" className="block text-base text-white font-bold mb-1">Nombre</label>
                            <input
                                type="text"
                                name="first_name"
                                id="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border-none rounded-md text-base bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="flex-1">
                            <label htmlFor="last_name" className="block text-base text-white font-bold mb-1">Apellido</label>
                            <input
                                type="text"
                                name="last_name"
                                id="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border-none rounded-md text-base bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <label htmlFor="email" className="block text-base text-white font-bold mb-1">Correo Electrónico</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mb-1 border-none rounded-md text-base bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                        disabled={loading}
                    />

                    <label htmlFor="password" className="block text-base text-white font-bold mb-1">Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mb-1 border-none rounded-md text-base bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                        disabled={loading}
                    />

                    <label htmlFor="password_confirm" className="block text-base text-white font-bold mb-1">Confirmar Contraseña</label>
                    <input
                        type="password"
                        name="password_confirm"
                        id="password_confirm"
                        value={formData.password_confirm}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mb-1 border-none rounded-md text-base bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                        disabled={loading}
                    />

                    {error && <p className="text-red-500 mt-2 text-sm text-center">{error}</p>}

                    <button type="submit" disabled={loading} className="w-full mt-2 px-3 py-2 border-none rounded-md bg-gradient-to-r from-pink-500 to-cyan-500 text-white text-base font-bold cursor-pointer transition-all duration-300 hover:brightness-75 disabled:opacity-50">
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>

                <footer className="w-full mt-2 text-center border-t border-gray-600 pt-2">
                    <p className="text-sm">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/auth/login" className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent hover:brightness-150 transition-all">
                            Inicia Sesión
                        </Link>
                    </p>
                </footer>
            </div>
        </section>
    );
};

export default Registrarse;
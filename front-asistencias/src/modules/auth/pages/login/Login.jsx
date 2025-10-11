import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { iniciarSesion } from '../../../../services/api/auth';
import Informacion from '../../components/informacion-general/Informacion';
import LogoCds from '../../../../assets/logo-cds1.png';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';
  const successMessage = location.state?.message;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.username || !formData.password) {
      setError('El nombre de usuario y la contraseña son requeridos.');
      setLoading(false);
      return;
    }

    try {
      const response = await iniciarSesion(formData);
      login(response);  
      navigate(from, { replace: true });    
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
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
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-600 to-purple-600 bg-clip-text text-transparent m-0">Iniciar Sesión</h2>
          <p className="text-lg m-0 text-gray-300 font-bold">Acceder a recursos exclusivos</p>
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

          <Link to="/recuperarCuenta" className="text-gray-300 text-sm font-bold hover:text-gray-100 transition-colors text-end block mb-2">
            ¿Olvidaste tu contraseña?
          </Link>

          <button type="submit" disabled={loading} className="w-full mt-2 px-3 py-2 border-none rounded-md bg-gradient-to-r from-pink-500 to-cyan-500 text-white text-base font-bold cursor-pointer transition-all duration-300 hover:brightness-75 disabled:opacity-50">
            {loading ? 'Iniciando...' : 'Entrar'}
          </button>
        </form>

        {error && <p className="text-red-500 mt-2 text-sm text-center">{error}</p>}

        <footer className="w-full mt-2 text-center border-t border-gray-600 pt-2">
          <p className="text-sm">
            ¿No tienes cuenta?{' '}
            <Link to="/auth/registro" className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent hover:brightness-150 transition-all">
              Regístrate
            </Link>
          </p>
        </footer>
      </div>
    </section>
  );
};

export default Login;
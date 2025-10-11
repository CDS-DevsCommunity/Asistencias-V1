import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../modules/auth/hooks/useAuth';
import logo from '../../assets/logo-cds1.png';
import ProfileDropdown from './ProfileDropdown';

const Header = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="Comunidad CDS" className="h-10" />
          </Link>
        </div>

        <div className="flex-grow flex justify-center px-4">
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Buscar eventos..."
              className="w-full bg-gray-100 border-2 border-gray-200 rounded-full py-2 px-4 text-gray-700 focus:outline-none focus:bg-white focus:border-purple-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          {isAuthenticated ? (
            <ProfileDropdown />
          ) : (
            <>
              <Link to="/auth/login" className="text-gray-600 hover:text-purple-600 mr-4">Iniciar sesión</Link>
              <Link to="/auth/registro" className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

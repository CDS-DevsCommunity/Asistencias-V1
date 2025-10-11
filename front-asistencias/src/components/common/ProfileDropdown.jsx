// src/components/common/ProfileDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../modules/auth/hooks/useAuth';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="flex items-center gap-2 focus:outline-none">
        <img 
          src={user.profile_picture || `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=random`}
          alt="Perfil"
          className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl z-20 py-2 border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="font-bold text-gray-800 truncate">{`${user.first_name} ${user.last_name}`}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>
          <Link 
            to="/perfil"
            className="block px-4 py-2 text-gray-800 hover:bg-indigo-50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Ver Perfil
          </Link>
          <Link
            to="/mis-eventos"
            className="block px-4 py-2 text-gray-800 hover:bg-indigo-50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Mis eventos
          </Link>
          <Link 
            to="/configuracion"
            className="block px-4 py-2 text-gray-800 hover:bg-indigo-50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Configuración
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;

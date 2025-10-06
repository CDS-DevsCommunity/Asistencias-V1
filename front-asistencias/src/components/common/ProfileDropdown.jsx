import React from 'react';
import { Link } from 'react-router-dom';

const ProfileDropdown = ({ user }) => {
  return (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-20">
      <div className="px-4 py-2 border-b">
        <p className="font-semibold text-gray-800">{user.name}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
      <Link to="/perfil" className="block px-4 py-2 text-gray-800 hover:bg-purple-100">Ver perfil</Link>
      <Link to="/configuracion" className="block px-4 py-2 text-gray-800 hover:bg-purple-100">Configuración</Link>
      <button
        onClick={() => {}}
        className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-purple-100"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default ProfileDropdown;

import React from 'react';

const EventDetailsSection = ({ formData, handleChange }) => {
  return (
        <div className="p-8 bg-white rounded-lg shadow space-y-6">
      <div>
        <label htmlFor="titulo" className="block text-xs font-medium text-gray-500">Título del evento</label>
        <input type="text" name="titulo" id="titulo" value={formData.titulo} onChange={handleChange} className="mt-1 block w-full bg-transparent border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-purple-500 text-lg text-gray-900 p-2" required />
      </div>
      <div>
        <label htmlFor="descripcion" className="block text-xs font-medium text-gray-500">Descripción</label>
        <textarea name="descripcion" id="descripcion" value={formData.descripcion} onChange={handleChange} rows="4" className="mt-1 block w-full border-2 border-gray-200 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-gray-900 p-2" required></textarea>
      </div>
    </div>
  );
};

export default EventDetailsSection;

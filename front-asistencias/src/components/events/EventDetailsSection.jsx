import React from 'react';

const EventDetailsSection = ({ formData, handleChange }) => {
  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg border border-blue-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">📋 Información del Evento</h2>
        <p className="text-gray-600">Proporciona los detalles básicos de tu evento</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="titulo" className="block text-sm font-semibold text-gray-700">
            🎯 Título del evento
          </label>
          <div className="relative">
            <input
              type="text"
              name="titulo"
              id="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Ej: Conferencia Anual de Tecnología 2024"
              className="w-full bg-white border-2 border-blue-200 rounded-lg p-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-blue-300 text-lg"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="descripcion" className="block text-sm font-semibold text-gray-700">
            📝 Descripción detallada
          </label>
          <div className="relative">
            <textarea
              name="descripcion"
              id="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="4"
              placeholder="Describe el propósito, objetivos y contenido de tu evento..."
              className="w-full bg-white border-2 border-blue-200 rounded-lg p-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-blue-300 resize-none"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsSection;

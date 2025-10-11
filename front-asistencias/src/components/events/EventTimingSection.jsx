import React from 'react';

const EventTimingSection = ({ formData, handleChange }) => {
  return (
    <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg border border-purple-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">⏰ Programación del Evento</h2>
        <p className="text-gray-600">Define la fecha, horario y ubicación de tu evento</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="space-y-2">
          <label htmlFor="fecha" className="block text-sm font-semibold text-gray-700">
            📅 Fecha del evento
          </label>
          <div className="relative">
            <input
              type="date"
              name="fecha"
              id="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className="w-full bg-white border-2 border-purple-200 rounded-lg p-3 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 hover:border-purple-300"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="hora_inicio" className="block text-sm font-semibold text-gray-700">
            🕐 Hora de inicio
          </label>
          <div className="relative">
            <input
              type="time"
              name="hora_inicio"
              id="hora_inicio"
              value={formData.hora_inicio}
              onChange={handleChange}
              className="w-full bg-white border-2 border-purple-200 rounded-lg p-3 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 hover:border-purple-300"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="hora_fin" className="block text-sm font-semibold text-gray-700">
            🕐 Hora de finalización
          </label>
          <div className="relative">
            <input
              type="time"
              name="hora_fin"
              id="hora_fin"
              value={formData.hora_fin}
              onChange={handleChange}
              className="w-full bg-white border-2 border-purple-200 rounded-lg p-3 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 hover:border-purple-300"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="direccion" className="block text-sm font-semibold text-gray-700">
          📍 Dirección o enlace virtual
        </label>
        <div className="relative">
          <input
            type="text"
            name="direccion"
            id="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Ej: Centro de Convenciones CDS o https://meet.google.com/..."
            className="w-full bg-white border-2 border-purple-200 rounded-lg p-3 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 hover:border-purple-300"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default EventTimingSection;

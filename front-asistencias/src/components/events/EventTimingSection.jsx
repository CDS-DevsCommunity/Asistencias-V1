import React from 'react';

const EventTimingSection = ({ formData, handleChange }) => {
  return (
        <div className="p-8 bg-white rounded-lg shadow space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="fecha" className="block text-xs font-medium text-gray-500">Fecha</label>
          <input type="date" name="fecha" id="fecha" value={formData.fecha} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border-2 border-gray-200 rounded-md p-2 text-gray-900" required />
        </div>
        <div>
          <label htmlFor="hora_inicio" className="block text-xs font-medium text-gray-500">Hora de inicio</label>
          <input type="time" name="hora_inicio" id="hora_inicio" value={formData.hora_inicio} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border-2 border-gray-200 rounded-md p-2 text-gray-900" required />
        </div>
        <div>
          <label htmlFor="hora_fin" className="block text-xs font-medium text-gray-500">Hora de fin</label>
          <input type="time" name="hora_fin" id="hora_fin" value={formData.hora_fin} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border-2 border-gray-200 rounded-md p-2 text-gray-900" required />
        </div>
      </div>
      <div>
        <label htmlFor="direccion" className="block text-xs font-medium text-gray-500">Dirección o enlace virtual</label>
        <input type="text" name="direccion" id="direccion" value={formData.direccion} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border-2 border-gray-200 rounded-md p-2 text-gray-900" required />
      </div>
    </div>
  );
};

export default EventTimingSection;

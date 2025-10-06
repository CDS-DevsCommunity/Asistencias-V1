import React from 'react';

const EventConfigSection = ({ formData, handleChange, handleEquipamientoChange, tipos, escenarios, equipamientos, onManageEscenarios }) => {
  return (
        <div className="p-8 bg-white rounded-lg shadow space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="tipo" className="block text-xs font-medium text-gray-500">Tipo de evento</label>
          <select name="tipo" id="tipo" value={formData.tipo} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border-2 border-gray-200 rounded-md p-2 text-gray-900" required>
            <option value="">Selecciona un tipo</option>
            {tipos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
          </select>
        </div>
        <div>
                    <div className="flex justify-between items-center">
            <label htmlFor="escenario" className="block text-xs font-medium text-gray-500">Escenario</label>
            <button type="button" onClick={onManageEscenarios} className="text-xs text-purple-600 hover:underline">Gestionar</button>
          </div>
          <select name="escenario" id="escenario" value={formData.escenario} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border-2 border-gray-200 rounded-md p-2 text-gray-900" required>
            <option value="">Selecciona un escenario</option>
            {escenarios.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="cupo_maximo" className="block text-xs font-medium text-gray-500">Cupo máximo</label>
          <input type="number" name="cupo_maximo" id="cupo_maximo" value={formData.cupo_maximo} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border-2 border-gray-200 rounded-md p-2 text-gray-900" required />
        </div>
      </div>
      <div>
        <label htmlFor="equipamientos" className="block text-xs font-medium text-gray-500">Equipamientos (Mantén Ctrl para seleccionar varios)</label>
        <select name="equipamientos" id="equipamientos" onChange={handleEquipamientoChange} multiple className="mt-1 block w-full bg-gray-50 border-2 border-gray-200 rounded-md p-2 h-32 text-gray-900">
          {equipamientos.map(eq => <option key={eq.id} value={eq.id}>{eq.nombre}</option>)}
        </select>
        <p className="text-xs text-gray-500 mt-1">Nota: La cantidad y descripción de cada equipamiento se debe añadir. Por ahora, se asigna cantidad 1.</p>
      </div>
    </div>
  );
};

export default EventConfigSection;

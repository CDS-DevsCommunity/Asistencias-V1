import React from 'react';

const EventConfigSection = ({ formData, handleChange, tipos, escenarios, onManageEscenarios, onManageEquipamientos, onRemoveEquipamiento }) => {
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
        <div className="flex justify-between items-center">
          <label className="block text-xs font-medium text-gray-500">Equipamientos Seleccionados</label>
          <button type="button" onClick={onManageEquipamientos} className="text-xs text-purple-600 hover:underline">Gestionar</button>
        </div>
        <div className="mt-2 space-y-2">
          {formData.equipamientos.length === 0 ? (
            <p className="text-sm text-gray-500">No se han añadido equipamientos.</p>
          ) : (
            formData.equipamientos.map((eq, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-100 rounded-md">
                <div>
                  <p className="font-semibold text-sm text-gray-800">{eq.nombre} (x{eq.cantidad})</p>
                  <p className="text-xs text-gray-600">{eq.descripcion}</p>
                </div>
                <button type="button" onClick={() => onRemoveEquipamiento(index)} className="text-red-500 text-xl">&times;</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EventConfigSection;

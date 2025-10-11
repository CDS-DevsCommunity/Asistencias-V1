import React from 'react';

const EventConfigSection = ({ formData, handleChange, tipos, escenarios, onManageEscenarios, onManageEquipamientos, onRemoveEquipamiento, onManageTipos }) => {
  return (
    <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg border border-green-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">⚙️ Configuración del Evento</h2>
        <p className="text-gray-600">Define el tipo, ubicación y recursos necesarios</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="tipo" className="block text-sm font-semibold text-gray-700">
              🏷️ Tipo de evento
            </label>
            <button
              type="button"
              onClick={onManageTipos}
              className="text-xs text-green-600 hover:text-green-700 font-semibold transition-colors"
            >
              Gestionar
            </button>
          </div>
          <div className="relative">
            <select
              name="tipo"
              id="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full bg-white border-2 border-green-200 rounded-lg p-3 text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 hover:border-green-300"
              required
            >
              <option value="">Selecciona un tipo</option>
              {tipos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="escenario" className="block text-sm font-semibold text-gray-700">
              🏢 Escenario
            </label>
            <button
              type="button"
              onClick={onManageEscenarios}
              className="text-xs text-green-600 hover:text-green-700 font-semibold transition-colors"
            >
              Gestionar
            </button>
          </div>
          <div className="relative">
            <select
              name="escenario"
              id="escenario"
              value={formData.escenario}
              onChange={handleChange}
              className="w-full bg-white border-2 border-green-200 rounded-lg p-3 text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 hover:border-green-300"
              required
            >
              <option value="">Selecciona un escenario</option>
              {escenarios.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="cupo_maximo" className="block text-sm font-semibold text-gray-700">
            👥 Cupo máximo
          </label>
          <div className="relative">
            <input
              type="number"
              name="cupo_maximo"
              id="cupo_maximo"
              value={formData.cupo_maximo}
              onChange={handleChange}
              placeholder="Ej: 100"
              className="w-full bg-white border-2 border-green-200 rounded-lg p-3 text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 hover:border-green-300"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-semibold text-gray-700">
            🔧 Equipamientos Seleccionados
          </label>
          <button
            type="button"
            onClick={onManageEquipamientos}
            className="text-xs text-green-600 hover:text-green-700 font-semibold transition-colors"
          >
            Gestionar
          </button>
        </div>

        <div className="space-y-3">
          {formData.equipamientos.length === 0 ? (
            <div className="text-center p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-sm text-gray-500">No se han añadido equipamientos al evento</p>
              <p className="text-xs text-gray-400 mt-1">Haz clic en "Gestionar" para añadir equipamientos</p>
            </div>
          ) : (
            formData.equipamientos.map((eq, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-white rounded-lg border-2 border-green-100 shadow-sm">
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-800">{eq.nombre}</p>
                  {eq.descripcion && <p className="text-xs text-gray-600 mt-1">{eq.descripcion}</p>}
                  {eq.cantidad && <p className="text-xs text-green-600 mt-1">Cantidad: {eq.cantidad}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveEquipamiento(index)}
                  className="text-red-500 hover:text-red-700 text-xl font-bold ml-3 transition-colors"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EventConfigSection;

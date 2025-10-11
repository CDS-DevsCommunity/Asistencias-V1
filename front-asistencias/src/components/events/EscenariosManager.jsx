import React, { useState, useEffect } from 'react';
import {
  listarEscenarios,
  crearEscenario,
  actualizarEscenario,
  eliminarEscenario,
} from '../../services/api';

// Formulario para crear/editar un escenario
const EscenarioForm = ({ escenario, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState(
    escenario || { nombre: '', ubicacion: '', descripcion: '', capacidad: '', area: '' }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Conversión de tipos antes de guardar
    const dataToSave = {
      ...formData,
      capacidad: parseInt(formData.capacidad, 10),
      area: parseFloat(formData.area),
    };
    onSave(dataToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-lg border border-purple-100 mt-4">
      <h4 className="text-xl font-bold text-gray-800">
        {escenario ? '✏️ Editar Escenario' : '✨ Nuevo Escenario'}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Nombre</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: Auditorio Principal" className="w-full p-3 bg-white border-2 border-purple-200 rounded-lg text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all" required />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Ubicación</label>
          <input type="text" name="ubicacion" value={formData.ubicacion} onChange={handleChange} placeholder="Ej: Edificio A, Piso 2" className="w-full p-3 bg-white border-2 border-purple-200 rounded-lg text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all" required />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Capacidad (personas)</label>
          <input type="number" name="capacidad" value={formData.capacidad} onChange={handleChange} placeholder="100" className="w-full p-3 bg-white border-2 border-purple-200 rounded-lg text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all" required min="1" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Área (m²)</label>
          <input type="number" step="0.01" name="area" value={formData.area} onChange={handleChange} placeholder="150.5" className="w-full p-3 bg-white border-2 border-purple-200 rounded-lg text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all" required min="1" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Descripción (opcional)</label>
        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Detalles adicionales del escenario" className="w-full p-3 bg-white border-2 border-purple-200 rounded-lg text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all" rows="3"></textarea>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button type="button" onClick={onCancel} disabled={loading} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold transition-colors disabled:opacity-50">Cancelar</button>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 font-semibold transition-all shadow-md disabled:opacity-50">
          {loading ? 'Guardando...' : '💾 Guardar Escenario'}
        </button>
      </div>
    </form>
  );
};

// Componente principal para la gestión de escenarios
const EscenariosManager = ({ onUpdate }) => {
  const [escenarios, setEscenarios] = useState([]);
  const [editingEscenario, setEditingEscenario] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarEscenarios();
  }, []);

  const cargarEscenarios = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await listarEscenarios();
      const escenariosList = response.results || [];
      setEscenarios(escenariosList);
      if (onUpdate) onUpdate(escenariosList);
    } catch (err) {
      setError('Error al cargar los escenarios.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (escenarioToSave) => {
    try {
      setLoading(true);
      setError('');
      await (escenarioToSave.id
        ? actualizarEscenario(escenarioToSave.id, escenarioToSave)
        : crearEscenario(escenarioToSave));
      
      await cargarEscenarios();
      setIsCreating(false);
      setEditingEscenario(null);
    } catch (err) {
      setError('Error al guardar el escenario.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este escenario?')) return;
    try {
      setLoading(true);
      setError('');
      await eliminarEscenario(id);
      await cargarEscenarios();
    } catch (err) {
      setError('Error al eliminar el escenario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">🏛️ Gestión de Escenarios</h3>
        <button onClick={() => { setIsCreating(true); setEditingEscenario(null); }} disabled={loading} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 font-semibold transition-all shadow-md disabled:opacity-50">
          + Añadir Escenario
        </button>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-red-600 text-sm">{error}</p></div>}
      {loading && !isCreating && !editingEscenario && (
        <div className="text-center p-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="mt-2 text-sm text-gray-600">Cargando escenarios...</p>
        </div>
      )}

      {(isCreating || editingEscenario) && (
        <EscenarioForm 
          escenario={editingEscenario}
          onSave={handleSave}
          onCancel={() => { setIsCreating(false); setEditingEscenario(null); }}
          loading={loading}
        />
      )}

      <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
        {!loading && escenarios.length === 0 ? (
          <div className="text-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500">No hay escenarios registrados</p>
          </div>
        ) : (
          escenarios.map(esc => (
            <div key={esc.id} className="flex justify-between items-center p-4 bg-white/90 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div>
                <p className="font-semibold text-gray-800">{esc.nombre}</p>
                <p className="text-sm text-gray-500">{esc.ubicacion} - Cap: {esc.capacidad} - Área: {esc.area} m²</p>
              </div>
              <div className="flex gap-2 ml-4">
                <button onClick={() => setEditingEscenario(esc)} disabled={loading} className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors disabled:opacity-50">✏️ Editar</button>
                <button onClick={() => handleDelete(esc.id)} disabled={loading} className="px-3 py-1 text-red-600 hover:text-red-800 text-sm font-semibold transition-colors disabled:opacity-50">🗑️ Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EscenariosManager;

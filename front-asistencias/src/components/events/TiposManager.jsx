// src/components/events/TiposManager.jsx
import React, { useState, useEffect } from 'react';
import NotificationModal from '../common/NotificationModal';
import {
  listarTiposEventos,
  crearTipoEvento,
  actualizarTipoEvento,
  eliminarTipoEvento,
} from '../../services/api';

// Formulario para crear/editar un Tipo de Evento
const TipoForm = ({ tipo, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState(
    tipo || { nombre: '', descripcion: '' }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl shadow-lg border border-cyan-100 mt-4">
      <h4 className="text-xl font-bold text-gray-800">
        {tipo ? '✏️ Editar Tipo de Evento' : '✨ Nuevo Tipo de Evento'}
      </h4>
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Nombre</label>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: Conferencia, Taller" className="w-full p-3 bg-white border-2 border-cyan-200 rounded-lg text-gray-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all" required />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Descripción (opcional)</label>
        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Detalles sobre este tipo de evento" className="w-full p-3 bg-white border-2 border-cyan-200 rounded-lg text-gray-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all" rows="3"></textarea>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button type="button" onClick={onCancel} disabled={loading} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold transition-colors disabled:opacity-50">Cancelar</button>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 font-semibold transition-all shadow-md disabled:opacity-50">
          {loading ? 'Guardando...' : '💾 Guardar Tipo'}
        </button>
      </div>
    </form>
  );
};

// Componente principal para la gestión de Tipos de Evento
const TiposManager = ({ onUpdate }) => {
  const [tipos, setTipos] = useState([]);
  const [editingTipo, setEditingTipo] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '', success: false });
  const [confirmationState, setConfirmationState] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  useEffect(() => {
    cargarTipos();
  }, []);

  const cargarTipos = async () => {
    try {
      setLoading(true);
      const response = await listarTiposEventos();
      const tiposList = response.results || [];
      setTipos(tiposList);
      if (onUpdate) onUpdate(tiposList);
    } catch (err) {
      console.error('Error al cargar tipos:', err);
      setModalState({ isOpen: true, title: 'Error', message: 'Error al cargar los tipos de evento.', success: false });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (tipoToSave) => {
    try {
      setLoading(true);
      const isUpdating = !!tipoToSave.id;
      await (isUpdating
        ? actualizarTipoEvento(tipoToSave.id, tipoToSave)
        : crearTipoEvento(tipoToSave));
      
      await cargarTipos();
      setIsCreating(false);
      setEditingTipo(null);
      setModalState({ isOpen: true, title: 'Éxito', message: `Tipo de evento ${isUpdating ? 'actualizado' : 'creado'} exitosamente.`, success: true });
    } catch (err) {
      console.error('Error al guardar tipo:', err);
      setModalState({ isOpen: true, title: 'Error', message: 'Error al guardar el tipo de evento.', success: false });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setConfirmationState({
      isOpen: true,
      title: 'Confirmar Eliminación',
      message: '¿Estás seguro de que quieres eliminar este tipo de evento?',
      onConfirm: () => proceedWithDelete(id)
    });
  };

  const proceedWithDelete = async (id) => {
    setConfirmationState({ isOpen: false });
    try {
      setLoading(true);
      await eliminarTipoEvento(id);
      await cargarTipos();
      setModalState({ isOpen: true, title: 'Éxito', message: 'Tipo de evento eliminado exitosamente.', success: true });
    } catch (err) {
      setModalState({ isOpen: true, title: 'Error', message: 'Error al eliminar el tipo de evento.', success: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <NotificationModal 
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        success={modalState.success}
        onCancel={() => setModalState({ isOpen: false })}
      />
      <NotificationModal 
        isOpen={confirmationState.isOpen}
        title={confirmationState.title}
        message={confirmationState.message}
        onConfirm={confirmationState.onConfirm}
        onCancel={() => setConfirmationState({ isOpen: false })}
      />
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">🏷️ Gestión de Tipos de Evento</h3>
        <button onClick={() => { setIsCreating(true); setEditingTipo(null); }} disabled={loading} className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 font-semibold transition-all shadow-md disabled:opacity-50">
          + Añadir Tipo
        </button>
      </div>

      {loading && !isCreating && !editingTipo && (
        <div className="text-center p-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
          <p className="mt-2 text-sm text-gray-600">Cargando tipos...</p>
        </div>
      )}

      {(isCreating || editingTipo) && (
        <TipoForm 
          tipo={editingTipo}
          onSave={handleSave}
          onCancel={() => { setIsCreating(false); setEditingTipo(null); }}
          loading={loading}
        />
      )}

      <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
        {!loading && tipos.length === 0 ? (
          <div className="text-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500">No hay tipos de evento registrados</p>
          </div>
        ) : (
          tipos.map(t => (
            <div key={t.id} className="flex justify-between items-center p-4 bg-white/90 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div>
                <p className="font-semibold text-gray-800">{t.nombre}</p>
                <p className="text-sm text-gray-500">{t.descripcion}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <button onClick={() => setEditingTipo(t)} disabled={loading} className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors disabled:opacity-50">✏️ Editar</button>
                <button onClick={() => handleDelete(t.id)} disabled={loading} className="px-3 py-1 text-red-600 hover:text-red-800 text-sm font-semibold transition-colors disabled:opacity-50">🗑️ Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TiposManager;

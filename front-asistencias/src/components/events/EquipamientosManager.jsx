import React, { useState, useEffect } from 'react';
import NotificationModal from '../common/NotificationModal';

import { 
  listarEquipamientos, 
  crearEquipamiento, 
  actualizarEquipamiento, 
  eliminarEquipamiento 
} from '../../services/api';

const EquipamientoForm = ({ equipamiento, onSave, onCancel, loading }) => {
  const [nombre, setNombre] = useState(equipamiento ? equipamiento.nombre : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    onSave({ ...equipamiento, nombre });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl shadow-lg border border-orange-100 mt-4">
      <h4 className="text-xl font-bold text-gray-800">
        {equipamiento ? '🔧 Editar Equipamiento' : '✨ Nuevo Equipamiento'}
      </h4>
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">🔩 Nombre del Equipamiento</label>
        <input 
          type="text" 
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Proyector HD, Micrófono inalámbrico"
          className="w-full p-3 bg-white border-2 border-orange-200 rounded-lg text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 hover:border-orange-300"
          required
        />
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button type="button" onClick={onCancel} disabled={loading} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold transition-colors">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 font-semibold transition-all duration-200 shadow-md">
          {loading ? 'Guardando...' : '💾 Guardar Equipamiento'}
        </button>
      </div>
    </form>
  );
};

const EquipamientosManager = ({ onAdd, onUpdate, onClose }) => {
  const [equipamientos, setEquipamientos] = useState([]);
  const [editingEquipamiento, setEditingEquipamiento] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '', success: false });
  const [confirmationState, setConfirmationState] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const [selectedEquipamientos, setSelectedEquipamientos] = useState({});

  const handleSelectionChange = (equipamientoId, cantidad) => {
    setSelectedEquipamientos(prev => {
      const newSelection = { ...prev };
      if (cantidad > 0) {
        newSelection[equipamientoId] = cantidad;
      } else {
        delete newSelection[equipamientoId];
      }
      return newSelection;
    });
  };

  const handleAddToEvent = () => {
    const equipamientosToAdd = Object.entries(selectedEquipamientos)
      .map(([id, cantidad]) => {
        const equipamiento = equipamientos.find(e => e.id === parseInt(id));
        return {
          equipamiento_id: equipamiento.id,
          nombre: equipamiento.nombre,
          cantidad: cantidad,
          descripcion: '',
        };
      });

    if (onAdd) {
      equipamientosToAdd.forEach(onAdd);
    }
    setSelectedEquipamientos({});
    if (onClose) onClose(); // Cierra el modal después de añadir
  };

  useEffect(() => {
    cargarEquipamientos();
  }, []);

  const cargarEquipamientos = async () => {
    try {
      setLoading(true);
      const response = await listarEquipamientos();
      const equipamientosList = response.results || [];
      setEquipamientos(equipamientosList);
      if (onUpdate) onUpdate(equipamientosList);
    } catch (err) {
      console.error('Error al cargar equipamientos:', err);
      setModalState({ isOpen: true, title: 'Error', message: 'Error al cargar los equipamientos.', success: false });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (equipamientoToSave) => {
    try {
      setLoading(true);
      const isUpdating = !!equipamientoToSave.id;
      await (isUpdating
        ? actualizarEquipamiento(equipamientoToSave.id, equipamientoToSave)
        : crearEquipamiento(equipamientoToSave));
      
      await cargarEquipamientos();
      setIsCreating(false);
      setEditingEquipamiento(null);
      setModalState({ isOpen: true, title: 'Éxito', message: `Equipamiento ${isUpdating ? 'actualizado' : 'creado'} exitosamente.`, success: true });
    } catch (err) {
      console.error('Error al guardar equipamiento:', err);
      setModalState({ isOpen: true, title: 'Error', message: 'Error al guardar el equipamiento.', success: false });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setConfirmationState({
      isOpen: true,
      title: 'Confirmar Eliminación',
      message: '¿Estás seguro de que quieres eliminar este equipamiento?',
      onConfirm: () => proceedWithDelete(id)
    });
  };

  const proceedWithDelete = async (id) => {
    setConfirmationState({ isOpen: false });
    try {
      setLoading(true);
      await eliminarEquipamiento(id);
      await cargarEquipamientos();
      setModalState({ isOpen: true, title: 'Éxito', message: 'Equipamiento eliminado exitosamente.', success: true });
    } catch (err) {
      setModalState({ isOpen: true, title: 'Error', message: 'Error al eliminar el equipamiento.', success: false });
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
        <h3 className="text-xl font-bold text-gray-800">🔧 Gestión de Equipamientos</h3>
        <button onClick={() => { setIsCreating(true); setEditingEquipamiento(null); }} disabled={loading} className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 font-semibold transition-all duration-200 shadow-md disabled:opacity-50">
          + Añadir Equipamiento
        </button>
      </div>

      {loading && !isCreating && !editingEquipamiento && (
        <div className="text-center p-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <p className="mt-2 text-sm text-gray-600">Cargando equipamientos...</p>
        </div>
      )}

      {(isCreating || editingEquipamiento) && (
        <EquipamientoForm 
          equipamiento={editingEquipamiento}
          onSave={handleSave}
          onCancel={() => { setIsCreating(false); setEditingEquipamiento(null); }}
          loading={loading}
        />
      )}

      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
        {!loading && equipamientos.length === 0 ? (
          <div className="text-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500">No hay equipamientos registrados</p>
          </div>
        ) : (
          equipamientos.map(eq => (
            <div key={eq.id} className="flex justify-between items-center p-3 bg-white/90 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <p className="font-semibold text-gray-800 flex-1">{eq.nombre}</p>
              <div className="flex items-center gap-2">
                <input 
                  type="number"
                  min="1"
                  placeholder="Cant."
                  className="w-20 p-1 border-2 border-orange-200 rounded-lg text-center text-gray-800"
                  onChange={(e) => handleSelectionChange(eq.id, parseInt(e.target.value, 10) || 0)}
                />
                <button onClick={() => setEditingEquipamiento(eq)} disabled={loading} className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors disabled:opacity-50">✏️</button>
                <button onClick={() => handleDelete(eq.id)} disabled={loading} className="px-3 py-1 text-red-600 hover:text-red-800 text-sm font-semibold transition-colors disabled:opacity-50">🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex justify-end mt-4">
        <button 
          onClick={handleAddToEvent} 
          disabled={Object.values(selectedEquipamientos).every(v => !v)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Añadir Seleccionados al Evento
        </button>
      </div>
    </div>
  );
};
export default EquipamientosManager;
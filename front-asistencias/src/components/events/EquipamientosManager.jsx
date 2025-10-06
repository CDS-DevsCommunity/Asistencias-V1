import React, { useState } from 'react';

// Componente para el formulario de creación/edición de equipamientos
const EquipamientoForm = ({ equipamiento, onSave, onCancel }) => {
  const [nombre, setNombre] = useState(equipamiento ? equipamiento.nombre : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...equipamiento, nombre });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-100 rounded-lg">
      <h4 className="text-lg font-semibold text-gray-800">{equipamiento ? 'Editar' : 'Nuevo'} Equipamiento</h4>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del equipamiento" className="w-full p-2 border rounded-md text-gray-900" required />
      <div className="flex justify-end gap-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Cancelar</button>
        <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">Guardar</button>
      </div>
    </form>
  );
};

// Componente principal para gestionar equipamientos
// Formulario para añadir un equipamiento seleccionado al evento
const AddToEventForm = ({ equipamientos, onAdd }) => {
  const [selected, setSelected] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [descripcion, setDescripcion] = useState('');

  const handleAdd = () => {
    const equipamiento = equipamientos.find(e => e.id === parseInt(selected));
    if (equipamiento) {
      onAdd({ 
        equipamiento_id: equipamiento.id, 
        nombre: equipamiento.nombre, // Añadimos el nombre para mostrarlo en la UI
        cantidad: parseInt(cantidad, 10) || 1,
        descripcion 
      });
      // Reset form
      setSelected('');
      setCantidad(1);
      setDescripcion('');
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg space-y-3 mb-6">
      <h4 className="text-lg font-semibold text-gray-800">Añadir Equipamiento al Evento</h4>
            <select value={selected} onChange={e => setSelected(e.target.value)} className="w-full p-2 border rounded-md text-gray-900">
        <option value="">Selecciona un equipamiento</option>
        {equipamientos.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
      </select>
            <input type="number" value={cantidad} onChange={e => setCantidad(e.target.value)} min="1" placeholder="Cantidad" className="w-full p-2 border rounded-md text-gray-900" />
            <input type="text" value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripción (opcional)" className="w-full p-2 border rounded-md text-gray-900" />
      <button onClick={handleAdd} disabled={!selected} className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400">Añadir al Evento</button>
    </div>
  );
};

const EquipamientosManager = ({ equipamientos: initialEquipamientos, onUpdate, onAddEquipamientoToEvent }) => {
  const [equipamientos, setEquipamientos] = useState(initialEquipamientos);
  const [editingEquipamiento, setEditingEquipamiento] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSave = (equipamientoToSave) => {
    let updatedEquipamientos;
    if (equipamientoToSave.id) { // Editando
      updatedEquipamientos = equipamientos.map(e => e.id === equipamientoToSave.id ? equipamientoToSave : e);
    } else { // Creando
      const newEquipamiento = { ...equipamientoToSave, id: Date.now() }; // Simular un nuevo ID
      updatedEquipamientos = [...equipamientos, newEquipamiento];
    }
    setEquipamientos(updatedEquipamientos);
    onUpdate(updatedEquipamientos);
    setEditingEquipamiento(null);
    setIsCreating(false);
  };

  const handleDelete = (id) => {
    const updatedEquipamientos = equipamientos.filter(e => e.id !== id);
    setEquipamientos(updatedEquipamientos);
    onUpdate(updatedEquipamientos);
  };

  return (
    <div>
      <AddToEventForm equipamientos={equipamientos} onAdd={onAddEquipamientoToEvent} />

      {/* Sección para gestionar la lista maestra de equipamientos */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">Lista Maestra de Equipamientos</h3>
          <button onClick={() => { setIsCreating(true); setEditingEquipamiento(null); }} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">+ Añadir a la Lista</button>
        </div>

        {(isCreating || editingEquipamiento) && (
          <EquipamientoForm 
            equipamiento={editingEquipamiento}
            onSave={handleSave}
            onCancel={() => { setIsCreating(false); setEditingEquipamiento(null); }}
          />
        )}

        <div className="space-y-3 max-h-60 overflow-y-auto p-1">
          {equipamientos.map(equipamiento => (
            <div key={equipamiento.id} className="flex justify-between items-center p-3 bg-white/80 rounded-lg border border-gray-200">
              <p className="font-semibold">{equipamiento.nombre}</p>
              <div className="space-x-2">
                <button onClick={() => { setEditingEquipamiento(equipamiento); setIsCreating(false); }} className="text-blue-500 hover:underline text-sm">Editar</button>
                <button onClick={() => handleDelete(equipamiento.id)} className="text-red-500 hover:underline text-sm">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EquipamientosManager;

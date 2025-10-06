import React, { useState } from 'react';

// Componente para el formulario de creación/edición de escenarios
const EscenarioForm = ({ escenario, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    escenario || { nombre: '', ubicacion: '', descripcion: '', capacidad: 0, area: 0 }
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
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-100 rounded-lg">
      <h4 className="text-lg font-semibold text-gray-800">{escenario ? 'Editar' : 'Nuevo'} Escenario</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" className="p-2 border rounded-md" required />
        <input type="text" name="ubicacion" value={formData.ubicacion} onChange={handleChange} placeholder="Ubicación" className="p-2 border rounded-md" required />
        <input type="number" name="capacidad" value={formData.capacidad} onChange={handleChange} placeholder="Capacidad" className="p-2 border rounded-md" required />
        <input type="number" name="area" value={formData.area} onChange={handleChange} placeholder="Área (m²)" className="p-2 border rounded-md" required />
      </div>
      <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Descripción" className="w-full p-2 border rounded-md" rows="3"></textarea>
      <div className="flex justify-end gap-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Cancelar</button>
        <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">Guardar</button>
      </div>
    </form>
  );
};

// Componente principal para gestionar escenarios
const EscenariosManager = ({ escenarios: initialEscenarios, onUpdate }) => {
  const [escenarios, setEscenarios] = useState(initialEscenarios);
  const [editingEscenario, setEditingEscenario] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSave = (escenarioToSave) => {
    let updatedEscenarios;
    if (escenarioToSave.id) { // Editando
      updatedEscenarios = escenarios.map(e => e.id === escenarioToSave.id ? escenarioToSave : e);
    } else { // Creando
      const newEscenario = { ...escenarioToSave, id: Date.now() }; // Simular un nuevo ID
      updatedEscenarios = [...escenarios, newEscenario];
    }
    setEscenarios(updatedEscenarios);
    onUpdate(updatedEscenarios); // Notificar al padre sobre la actualización
    setEditingEscenario(null);
    setIsCreating(false);
  };

  const handleDelete = (id) => {
    const updatedEscenarios = escenarios.filter(e => e.id !== id);
    setEscenarios(updatedEscenarios);
    onUpdate(updatedEscenarios);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Lista de Escenarios</h3>
        <button onClick={() => { setIsCreating(true); setEditingEscenario(null); }} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">+ Añadir Escenario</button>
      </div>

      {(isCreating || editingEscenario) && (
        <EscenarioForm 
          escenario={editingEscenario}
          onSave={handleSave}
          onCancel={() => { setIsCreating(false); setEditingEscenario(null); }}
        />
      )}

      <ul className="space-y-2">
        {escenarios.map(escenario => (
          <li key={escenario.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
            <div>
              <p className="font-semibold">{escenario.nombre}</p>
              <p className="text-sm text-gray-500">{escenario.ubicacion} - Capacidad: {escenario.capacidad}</p>
            </div>
            <div className="space-x-2">
              <button onClick={() => { setEditingEscenario(escenario); setIsCreating(false); }} className="text-blue-500 hover:underline">Editar</button>
              <button onClick={() => handleDelete(escenario.id)} className="text-red-500 hover:underline">Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EscenariosManager;

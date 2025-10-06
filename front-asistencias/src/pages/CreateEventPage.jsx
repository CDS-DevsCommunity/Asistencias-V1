import React, { useState } from 'react';
import Header from '../components/common/Header';
import EventDetailsSection from '../components/events/EventDetailsSection';
import EventTimingSection from '../components/events/EventTimingSection';
import EventConfigSection from '../components/events/EventConfigSection';
import Modal from '../components/common/Modal';
import EscenariosManager from '../components/events/EscenariosManager';

const staticTipos = [
  { id: 1, nombre: 'Conferencia', descripcion: 'Eventos de conferencias profesionales' },
  { id: 2, nombre: 'Workshop', descripcion: 'Talleres prácticos y educativos' },
  { id: 3, nombre: 'Reunión', descripcion: 'Reuniones de equipo o de trabajo' },
];

const staticEscenarios = [
  { id: 1, nombre: 'Auditorio Principal', ubicacion: 'Edificio A - Piso 2', capacidad: 200 },
  { id: 2, nombre: 'Sala de Reuniones B1', ubicacion: 'Edificio B - Piso 1', capacidad: 50 },
  { id: 3, nombre: 'Laboratorio de Innovación', ubicacion: 'Edificio C - Planta Baja', capacidad: 30 },
];

const staticEquipamientos = [
  { id: 1, nombre: 'Proyector HD' },
  { id: 2, nombre: 'Sistema de Audio' },
  { id: 3, nombre: 'Micrófono Inalámbrico' },
  { id: 4, nombre: 'Pizarra Digital' },
];

const CreateEventPage = () => {
  const [tipos] = useState(staticTipos);
    const [escenarios, setEscenarios] = useState(staticEscenarios);
  const [equipamientos] = useState(staticEquipamientos);
  const [isEscenariosModalOpen, setIsEscenariosModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    direccion: '',
    fecha: '',
    hora_inicio: '',
    hora_fin: '',
    cupo_maximo: 0,
    encargado: 'Admin User',
    tipo: '',
    escenario: '',
    equipamientos: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEquipamientoChange = (e) => {
    const { options } = e.target;
    const selectedEquipamientos = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedEquipamientos.push({ equipamiento_id: options[i].value, cantidad: 1, descripcion: '' });
      }
    }
    setFormData(prev => ({ ...prev, equipamientos: selectedEquipamientos }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        cupo_disponible: formData.cupo_maximo 
      };
      console.log("Enviando payload:", payload);
      // const response = await axios.post('/api/eventos/', payload, {
      //   headers: { 'Authorization': `Bearer ${token}` } 
      // });
      // console.log('Evento creado:', response.data);
    } catch (error) {
      console.error('Error al crear el evento:', error.response?.data || error.message);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Modal 
        isOpen={isEscenariosModalOpen} 
        onClose={() => setIsEscenariosModalOpen(false)} 
        title="Gestionar Escenarios"
      >
        <EscenariosManager 
          escenarios={escenarios}
          onUpdate={(updatedEscenarios) => {
            setEscenarios(updatedEscenarios);
          }}
        />
      </Modal>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800">Crear un nuevo evento</h1>
          </div>

          <EventDetailsSection formData={formData} handleChange={handleChange} />
          <EventTimingSection formData={formData} handleChange={handleChange} />
          <EventConfigSection 
            formData={formData} 
            handleChange={handleChange} 
                        handleEquipamientoChange={handleEquipamientoChange}
            onManageEscenarios={() => setIsEscenariosModalOpen(true)}
            tipos={tipos}
            escenarios={escenarios}
            equipamientos={equipamientos}
          />

          <div className="flex justify-end">
            <button type="submit" className="bg-purple-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-105">
              Crear evento
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateEventPage;

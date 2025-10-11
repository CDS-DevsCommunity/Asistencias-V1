import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import EventDetailsSection from '../components/events/EventDetailsSection';
import EventTimingSection from '../components/events/EventTimingSection';
import EventConfigSection from '../components/events/EventConfigSection';
import Modal from '../components/common/Modal';
import EscenariosManager from '../components/events/EscenariosManager';
import EquipamientosManager from '../components/events/EquipamientosManager';
import TiposManager from '../components/events/TiposManager';
import { useAuth } from '../modules/auth/hooks/useAuth';
import { obtenerTiposEventosActivos, crearEvento, listarEscenarios } from '../services/api';
import NotificationModal from '../components/common/NotificationModal';

const CreateEventPage = () => {
  const [escenarios, setEscenarios] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [isEscenariosModalOpen, setIsEscenariosModalOpen] = useState(false);
  const [isEquipamientosModalOpen, setIsEquipamientosModalOpen] = useState(false);
  const [isTiposModalOpen, setIsTiposModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '', success: false });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const [tiposResponse, escenariosResponse] = await Promise.all([
          obtenerTiposEventosActivos(),
          listarEscenarios(),
        ]);
        setTipos(tiposResponse || []);
        setEscenarios(escenariosResponse.results || []);
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
      }
    };
    cargarDatosIniciales();
  }, []);

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    direccion: '',
    fecha: '',
    hora_inicio: '',
    hora_fin: '',
    cupo_maximo: '',
    tipo: '',
    escenario: '',
    equipamientos: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRemoveEquipamiento = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      equipamientos: prev.equipamientos.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleAddEquipamiento = (equipamientoToAdd) => {
    setFormData(prev => {
      const isAlreadyAdded = prev.equipamientos.some(eq => eq.equipamiento_id === equipamientoToAdd.equipamiento_id);
      if (isAlreadyAdded) {
        return {
          ...prev,
          equipamientos: prev.equipamientos.map(eq =>
            eq.equipamiento_id === equipamientoToAdd.equipamiento_id ? equipamientoToAdd : eq
          ),
        };
      }
      return {
        ...prev,
        equipamientos: [...prev.equipamientos, equipamientoToAdd],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ['titulo', 'descripcion', 'direccion', 'fecha', 'hora_inicio', 'hora_fin', 'tipo', 'escenario'];
    const missingField = requiredFields.find(field => !formData[field]);
    if (missingField) {
      setModalState({ isOpen: true, title: 'Campo Requerido', message: `Por favor, completa el campo "${missingField}".`, success: false });
      return;
    }
    if (!formData.cupo_maximo || parseInt(formData.cupo_maximo, 10) <= 0) {
      setModalState({ isOpen: true, title: 'Error de Validación', message: 'El cupo máximo debe ser un número mayor a 0.', success: false });
      return;
    }
    if (new Date(`${formData.fecha}T${formData.hora_fin}`) <= new Date(`${formData.fecha}T${formData.hora_inicio}`)) {
      setModalState({ isOpen: true, title: 'Error de Horario', message: 'La hora de finalización debe ser posterior a la hora de inicio.', success: false });
      return;
    }

    setLoading(true);

    const payload = {
      ...formData,
      cupo_maximo: parseInt(formData.cupo_maximo, 10),
      cupo_disponible: parseInt(formData.cupo_maximo, 10),
      encargado: user.username,
      tipo: parseInt(formData.tipo, 10),
      escenario: parseInt(formData.escenario, 10),
      equipamientos: formData.equipamientos.map(eq => ({ equipamiento_id: eq.equipamiento_id, cantidad: eq.cantidad }))
    };

    try {
      const eventoCreado = await crearEvento(payload);
      setModalState({ 
        isOpen: true, 
        title: '¡Éxito!', 
        message: `El evento "${eventoCreado.titulo}" ha sido creado exitosamente.`,
        success: true,
      });
    } catch (error) {
      console.error('Error al crear el evento:', error.response?.data || error.message);
      setModalState({ 
        isOpen: true, 
        title: 'Error al Crear',
        message: 'Hubo un error al crear el evento. Por favor, revisa los datos e inténtalo de nuevo.',
        success: false 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <NotificationModal 
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        success={modalState.success}
        onCancel={() => {
          setModalState({ isOpen: false });
          if (modalState.success) {
            navigate('/', { replace: true });
          }
        }}
      />

      <Modal isOpen={isEscenariosModalOpen} onClose={() => setIsEscenariosModalOpen(false)} title="Gestionar Escenarios">
        <EscenariosManager onUpdate={setEscenarios} />
      </Modal>
      <Modal isOpen={isEquipamientosModalOpen} onClose={() => setIsEquipamientosModalOpen(false)} title="Gestionar Equipamientos">
        <EquipamientosManager 
          onAdd={handleAddEquipamiento} 
          selectedEquipamientos={formData.equipamientos}
          onClose={() => setIsEquipamientosModalOpen(false)}
        />
      </Modal>
      <Modal isOpen={isTiposModalOpen} onClose={() => setIsTiposModalOpen(false)} title="Gestionar Tipos de Evento">
        <TiposManager onUpdate={setTipos} />
      </Modal>

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
            onManageEquipamientos={() => setIsEquipamientosModalOpen(true)}
            onRemoveEquipamiento={handleRemoveEquipamiento}
            onManageEscenarios={() => setIsEscenariosModalOpen(true)}
            onManageTipos={() => setIsTiposModalOpen(true)}
            tipos={tipos}
            escenarios={escenarios}
          />

          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="bg-purple-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-105 disabled:opacity-50">
              {loading ? 'Creando evento...' : 'Crear evento'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateEventPage;

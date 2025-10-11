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

const CreateEventPage = () => {
  const [escenarios, setEscenarios] = useState([]);
  const [equipamientos, setEquipamientos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [isEscenariosModalOpen, setIsEscenariosModalOpen] = useState(false);
  const [isEquipamientosModalOpen, setIsEquipamientosModalOpen] = useState(false);
  const [isTiposModalOpen, setIsTiposModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(); // Obtener el usuario del contexto de autenticación
  const navigate = useNavigate(); // Hook para navegación

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const [tiposResponse, escenariosResponse] = await Promise.all([
          obtenerTiposEventosActivos(),
          listarEscenarios()
        ]);
        // La API de tipos devuelve un array directamente, mientras que escenarios devuelve un objeto con {results: [...]}
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
    cupo_maximo: 0,
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
      equipamientos: prev.equipamientos.filter((_, index) => index !== indexToRemove)
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
          )
        };
      }
      return {
        ...prev,
        equipamientos: [...prev.equipamientos, equipamientoToAdd]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación completa de campos obligatorios
    const requiredFields = ['titulo', 'descripcion', 'direccion', 'fecha', 'hora_inicio', 'hora_fin', 'tipo', 'escenario'];
    const missingField = requiredFields.find(field => !formData[field]);

    if (missingField) {
      alert(`Por favor, completa el campo "${missingField}".`);
      return;
    }

    if (!formData.cupo_maximo || parseInt(formData.cupo_maximo, 10) <= 0) {
      alert('El cupo máximo debe ser un número mayor a 0.');
      return;
    }

    // Validación de coherencia de horas
    if (formData.hora_fin <= formData.hora_inicio) {
      alert('La hora de finalización debe ser posterior a la hora de inicio.');
      return;
    }

    setLoading(true);

    const payload = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      direccion: formData.direccion,
      fecha: formData.fecha,             // "2025-12-12"
      hora_inicio: formData.hora_inicio, // "12:00"
      hora_fin: formData.hora_fin,       // "15:00"
      cupo_maximo: parseInt(formData.cupo_maximo, 10),
      cupo_disponible: parseInt(formData.cupo_maximo, 10), // 👈 igual al cupo máximo al crear
      encargado: user.username, // 👈 string, no id
      tipo: parseInt(formData.tipo, 10),
      escenario: parseInt(formData.escenario, 10),
      equipamientos: formData.equipamientos.map(eq => ({
        equipamiento_id: eq.equipamiento_id, // El backend espera 'equipamiento_id', no 'equipamiento'
        cantidad: eq.cantidad
      }))
    };

    try {
      const eventoCreado = await crearEvento(payload);
      alert(`¡Evento "${eventoCreado.titulo}" creado exitosamente!`);
      
      // Redirigir a la página principal después de crear el evento
      navigate('/', { replace: true });
      
    } catch (error) {
      console.log("Datos enviados:", payload);
      console.error('Error al crear el evento:', error.response?.data || error.message);
      alert('Hubo un error al crear el evento. Revisa la consola para más detalles.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Modal 
        isOpen={isEscenariosModalOpen} 
        onClose={() => setIsEscenariosModalOpen(false)} 
        title="Gestionar Escenarios"
      >
        <EscenariosManager onUpdate={setEscenarios} />
      </Modal>

      <Modal 
        isOpen={isEquipamientosModalOpen} 
        onClose={() => setIsEquipamientosModalOpen(false)} 
        title="Gestionar Equipamientos"
      >
        <EquipamientosManager 
          onUpdate={setEquipamientos} 
          onAdd={handleAddEquipamiento}
          onClose={() => setIsEquipamientosModalOpen(false)}
        />
      </Modal>

      <Modal 
        isOpen={isTiposModalOpen} 
        onClose={() => setIsTiposModalOpen(false)} 
        title="Gestionar Tipos de Evento"
      >
        <TiposManager onUpdate={setTipos} />
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
            onManageEquipamientos={() => setIsEquipamientosModalOpen(true)}
            onRemoveEquipamiento={handleRemoveEquipamiento}
            onManageEscenarios={() => setIsEscenariosModalOpen(true)}
            onManageTipos={() => setIsTiposModalOpen(true)}
            tipos={tipos}
            escenarios={escenarios}
            equipamientos={equipamientos}
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

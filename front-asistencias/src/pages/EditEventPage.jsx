import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NotificationModal from '../components/common/NotificationModal';
import Header from '../components/common/Header';
import EventDetailsSection from '../components/events/EventDetailsSection';
import EventTimingSection from '../components/events/EventTimingSection';
import EventConfigSection from '../components/events/EventConfigSection';
import Modal from '../components/common/Modal';
import EscenariosManager from '../components/events/EscenariosManager';
import EquipamientosManager from '../components/events/EquipamientosManager';
import TiposManager from '../components/events/TiposManager';
import { useAuth } from '../modules/auth/hooks/useAuth';
import { obtenerEvento, actualizarEvento, obtenerTiposEventosActivos, listarEscenarios } from '../services/api';

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState(null);
  const [tipos, setTipos] = useState([]);
  const [escenarios, setEscenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '', success: false });
  const [isEscenariosModalOpen, setIsEscenariosModalOpen] = useState(false);
  const [isEquipamientosModalOpen, setIsEquipamientosModalOpen] = useState(false);
  const [isTiposModalOpen, setIsTiposModalOpen] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [eventoData, tiposData, escenariosData] = await Promise.all([
          obtenerEvento(id),
          obtenerTiposEventosActivos(),
          listarEscenarios()
        ]);

        if (eventoData.encargado !== user.username) {
          setModalState({
            isOpen: true,
            title: 'Acceso Denegado',
            message: 'No tienes permiso para editar este evento.',
            success: false,
            onCancel: () => navigate('/mis-eventos')
          });
          return;
        }

        setFormData({
          ...eventoData,
          cupo_maximo: eventoData.cupo_maximo.toString(),
          tipo: eventoData.tipo.toString(),
          escenario: eventoData.escenario.toString(),
          equipamientos: eventoData.equipamientos_prestados.map(eq => ({
            equipamiento_id: eq.equipamiento,
            cantidad: eq.cantidad
          }))
        });
        setTipos(tiposData || []);
        setEscenarios(escenariosData.results || []);
      } catch (error) {
        console.error('Error al cargar los datos del evento:', error);
        setModalState({
          isOpen: true,
          title: 'Error de Carga',
          message: 'No se pudieron cargar los datos del evento.',
          success: false,
          onCancel: () => navigate('/mis-eventos')
        });
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    setLoading(true);

    const payload = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      direccion: formData.direccion,
      fecha: formData.fecha,
      hora_inicio: formData.hora_inicio,
      hora_fin: formData.hora_fin,
      cupo_maximo: parseInt(formData.cupo_maximo, 10),
      cupo_disponible: parseInt(formData.cupo_maximo, 10), // Se mantiene igual al cupo_maximo como en crear
      encargado: user.username,
      tipo: parseInt(formData.tipo, 10),
      escenario: parseInt(formData.escenario, 10),
      equipamientos: formData.equipamientos ? formData.equipamientos.map(eq => ({ 
        equipamiento_id: eq.equipamiento_id, 
        cantidad: eq.cantidad 
      })) : []
    };

    try {
      console.log('Payload enviado para actualizar:', payload); // Log para depuración
      await actualizarEvento(id, payload);
      setModalState({
        isOpen: true,
        title: '¡Éxito!',
        message: 'Evento actualizado exitosamente.',
        success: true,
      });
    } catch (error) {
      console.error('Error al actualizar el evento:', error.response?.data || error.message);
      console.log('Payload que causó el error:', payload); // Log adicional para depuración
      setModalState({
        isOpen: true,
        title: 'Error al Actualizar',
        message: 'Hubo un error al actualizar el evento. Por favor, revisa los datos.',
        success: false
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !formData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

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
          if (modalState.success || modalState.title === 'Acceso Denegado' || modalState.title === 'Error de Carga') {
            navigate('/mis-eventos');
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
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Editar Evento</h1>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-8">
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
            <button type="button" onClick={() => navigate('/mis-eventos')} className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg mr-4 hover:bg-gray-400">
              Cancelar
            </button>
            <button type="submit" className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700">
              Actualizar Evento
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditEventPage;

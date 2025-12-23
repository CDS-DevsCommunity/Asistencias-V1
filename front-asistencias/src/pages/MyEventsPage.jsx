import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NotificationModal from '../components/common/NotificationModal';
import Header from '../components/common/Header';
import { useAuth } from '../modules/auth/hooks/useAuth';
import { listarEventos, eliminarEvento } from '../services/api';

const MyEventsPage = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '', success: false });
  const [confirmationState, setConfirmationState] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  useEffect(() => {
    const cargarMisEventos = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const todosEventos = await listarEventos();
        const eventosFiltrados = todosEventos.results?.filter(
          evento => evento.encargado === user.username
        ) || [];
        setMyEvents(eventosFiltrados);
      } catch (error) {
        console.error('Error al cargar mis eventos:', error);
        setMyEvents([]);
      } finally {
        setLoading(false);
      }
    };

    cargarMisEventos();
  }, [user]);

  const handleEliminar = (eventoId) => {
    setConfirmationState({
      isOpen: true,
      title: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.',
      onConfirm: () => proceedWithEliminar(eventoId),
    });
  };

  const proceedWithEliminar = async (eventoId) => {
    setConfirmationState({ isOpen: false }); // Cierra el modal de confirmación
    try {
      await eliminarEvento(eventoId);
      setMyEvents(myEvents.filter(evento => evento.id !== eventoId));
      setModalState({ isOpen: true, title: 'Éxito', message: 'Evento eliminado exitosamente.', success: true });
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
      setModalState({ isOpen: true, title: 'Error', message: 'Hubo un error al eliminar el evento.', success: false });
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
        onCancel={() => setModalState({ isOpen: false })}
      />
      <NotificationModal 
        isOpen={confirmationState.isOpen}
        title={confirmationState.title}
        message={confirmationState.message}
        onConfirm={confirmationState.onConfirm}
        onCancel={() => setConfirmationState({ isOpen: false })}
      />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Mis Eventos</h1>
        
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="text-gray-500 mt-4">Cargando mis eventos...</p>
          </div>
        ) : myEvents.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-700">No has creado ningún evento</h2>
            <p className="text-gray-500 mt-2">¡Anímate a organizar algo!</p>
            <Link to="/crear-evento" className="mt-4 inline-block bg-purple-600 text-white font-bold py-2 px-4 rounded-full hover:bg-purple-700">
              + Crear Evento
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cupos</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myEvents.map(evento => (
                  <tr key={evento.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{evento.titulo}</div>
                      <div className="text-sm text-gray-500">{evento.escenario_nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(evento.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${evento.cupo_maximo - evento.cupo_disponible} / ${evento.cupo_maximo}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/editar-evento/${evento.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</Link>
                      <button onClick={() => handleEliminar(evento.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyEventsPage;

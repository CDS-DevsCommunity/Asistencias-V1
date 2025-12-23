import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import { listarEventos } from '../services/api/eventos';

const EventsPage = () => {
  const [activeTab, setActiveTab] = useState('proximos');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar eventos al montar el componente y cuando cambie la pestaña
  useEffect(() => {
    const cargarEventos = async () => {
      setLoading(true);
      try {
        // Siempre cargar todos los eventos y filtrar en el frontend
        const todosEventos = await listarEventos();
        const hoy = new Date().toISOString().split('T')[0];
        
        let eventosFiltrados;
        if (activeTab === 'proximos') {
          // Filtrar eventos desde hoy en adelante
          eventosFiltrados = todosEventos.results?.filter(evento => evento.fecha >= hoy) || [];
        } else {
          // Filtrar eventos anteriores a hoy
          eventosFiltrados = todosEventos.results?.filter(evento => evento.fecha < hoy) || [];
        }
        
        // Filtrar duplicados basados en título, fecha y hora de inicio
        const uniqueEvents = eventosFiltrados.filter((evento, index, self) =>
          index === self.findIndex(e => (
            e.titulo === evento.titulo && e.fecha === evento.fecha && e.hora_inicio === evento.hora_inicio
          ))
        );

        setEvents(uniqueEvents);
      } catch (error) {
        console.error('Error al cargar eventos:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    cargarEventos();
  }, [activeTab]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Eventos</h1>
          <div>
            <button
              onClick={() => setActiveTab('proximos')}
              className={`px-4 py-2 rounded-l-lg ${activeTab === 'proximos' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600'}`}>
              Próximos
            </button>
            <button
              onClick={() => setActiveTab('pasados')}
              className={`px-4 py-2 rounded-r-lg ${activeTab === 'pasados' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600'}`}>
              Pasados
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="text-gray-500 mt-4">Cargando eventos...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block bg-gray-200 p-8 rounded-full mb-4">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"></path></svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-700">
              {activeTab === 'proximos' ? 'Sin evento próximos' : 'Sin eventos pasados'}
            </h2>
            <p className="text-gray-500 mt-2">
              {activeTab === 'proximos' 
                ? 'No tienes eventos próximos. ¿Por qué no organizas uno?' 
                : 'No hay eventos pasados para mostrar.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((evento) => (
              <div key={evento.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {evento.imagen && (
                  <img 
                    src={evento.imagen} 
                    alt={evento.titulo}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      {evento.tipo_nombre}
                    </span>
                    <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                      evento.is_full 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      { evento.is_full ? 'Lleno' : `${evento.cupo_disponible} disponibles`}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{evento.titulo}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{evento.descripcion}</p>
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"></path>
                      </svg>
                      {new Date(evento.fecha).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {evento.hora_inicio} - { evento.hora_fin}
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      {evento.escenario_nombre}
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      {evento.encargado}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Cupo: { evento.cupo_maximo - evento.cupo_disponible}/{evento.cupo_maximo}
                      </span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${evento.attendance_percentage || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
            <Link to="/crear-evento">
                <button className="bg-purple-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-105">
                    + Crear evento
                </button>
            </Link>
        </div>
      </main>
    </div>
  );
};

export default EventsPage;

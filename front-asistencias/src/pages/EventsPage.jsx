import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';

const EventsPage = () => {
  const [activeTab, setActiveTab] = useState('proximos'); // 'proximos' o 'pasados'

  // Placeholder para la lista de eventos. De momento está vacía.
  const events = [];

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

        {events.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block bg-gray-200 p-8 rounded-full mb-4">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-700">Sin eventos próximos</h2>
            <p className="text-gray-500 mt-2">No tienes eventos próximos. ¿Por qué no organizas uno?</p>
          </div>
        ) : (
          <div>
            {/* Aquí se renderizará la lista de eventos */}
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

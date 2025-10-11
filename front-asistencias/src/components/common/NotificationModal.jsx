import React from 'react';

const NotificationModal = ({ isOpen, title, message, success, onConfirm, onCancel, confirmText = 'Confirmar', cancelText = 'Cancelar' }) => {
  if (!isOpen) return null;

  const titleColor = success ? 'text-green-600' : 'text-red-600';
  const icon = success ? (
    <svg className="w-12 h-12 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
  ) : (
    <svg className="w-12 h-12 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md text-center transform transition-all scale-95 animate-scale-in">
        {onConfirm ? (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        ) : icon}
        <h3 className={`text-2xl font-bold mt-4 ${onConfirm ? 'text-gray-900' : titleColor}`}>{title}</h3>
        <p className="text-gray-600 mt-2 mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          {onCancel && (
            <button onClick={onCancel} className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors">
              {cancelText}
            </button>
          )}
          <button onClick={onConfirm || onCancel} className={`${onConfirm ? 'bg-blue-600' : success ? 'bg-green-600' : 'bg-red-600'} text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity`}>
            {onConfirm ? confirmText : 'Aceptar'}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default NotificationModal;

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Toaster } from 'react-hot-toast';
//import { BrowserRouter } from 'react-router-dom';
//import { AuthProvider } from './contexts/AuthContext.jsx'; // ✅ important

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
 <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 10000,
          style: {
            background: '#1F2937', // gris foncé
            color: '#fff',
            borderRadius: '8px',
            padding: '12px 16px',
          },
          success: {
            icon: '✅', // icône succès
            style: {
              background: '#10B981',
              color: '#fff',
            },
          },
          error: {
            icon: '❌', // icône erreur
            style: {
              background: '#EF4444',
              color: '#fff',
            },
          },
          loading: {
            icon: '⏳', // icône chargement
            style: {
              background: '#3B82F6', // bleu
              color: '#fff',
            },
          },
        }}
      />
        <App />
  </React.StrictMode>
);

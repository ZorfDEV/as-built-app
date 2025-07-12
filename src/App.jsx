import AppRouter from './router.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import React from 'react';
import './index.css';
import 'leaflet/dist/leaflet.css';

export default function App() {
  return (
    <ErrorBoundary>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
    </ErrorBoundary>
  );
}


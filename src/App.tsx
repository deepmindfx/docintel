import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthProvider';
import { DataProvider } from './contexts/DataProvider';
import { ThemeProvider } from './contexts/ThemeProvider';
import { LoginPage } from './pages/LoginPage';
import { MainLayout } from './components/Layout/MainLayout';
import { useAuth } from './hooks/useAuth';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <MainLayout />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { Settings } from './components/settings/Settings';
import { Webhooks } from './components/webhooks/Webhooks';
import { ScoutPage } from './components/scout/ScoutPage';
import './index.css';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('scout');

  const renderPage = () => {
    switch (currentPage) {
      case 'scout':
        return <ScoutPage />;
      case 'dashboard':
        return <Dashboard />;
      case 'webhooks':
        return <Webhooks />;
      case 'settings':
        return <Settings />;
      default:
        return <ScoutPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0F1115]">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
    </div>
  );
}

function App() {
  return (
    <div className="dark">
      <AppProvider>
        <AppContent />
      </AppProvider>
    </div>
  );
}

export default App;

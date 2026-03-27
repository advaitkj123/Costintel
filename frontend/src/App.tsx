import { useState, useEffect } from 'react';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { OverviewPanel } from './components/dashboard/OverviewPanel';
import { AnomalyPanel } from './components/dashboard/AnomalyPanel';
import { ActionsPanel } from './components/dashboard/ActionsPanel';
import { AIInsightsPanel } from './components/dashboard/AIInsightsPanel';
import { SavingsPanel } from './components/dashboard/SavingsPanel';
import { SettingsPanel } from './components/dashboard/SettingsPanel';
import { LandingPage } from './components/landing/LandingPage';
import { AuthPage } from './components/auth/AuthPage';
import { isAuthenticated as checkAuth } from './services/auth';

type View = 'landing' | 'auth' | 'dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [view, setView] = useState<View>('landing');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sync auth state
  useEffect(() => {
    const alive = checkAuth();
    setIsAuthenticated(alive);
    
    // If we just authenticated but are on 'auth' or 'landing', push to dashboard
    if (alive && (view === 'auth')) {
      setView('dashboard');
    }
  }, [view]);

  const handleLoginSuccess = () => {
    console.log("[App] Login success handler triggered");
    setIsAuthenticated(true);
    setView('dashboard');
  };

  if (view === 'landing') {
    return (
      <LandingPage 
        onGetStarted={() => setView('auth')} 
      />
    );
  }

  if (view === 'auth') {
    return (
      <AuthPage 
        onLogin={handleLoginSuccess} 
        onBack={() => setView('landing')} 
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <OverviewPanel />;
      case 'anomalies':
        return <AnomalyPanel />;
      case 'insights':
        return <AIInsightsPanel />;
      case 'actions':
        return <ActionsPanel />;
      case 'savings':
        return <SavingsPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <OverviewPanel />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}

export default App;

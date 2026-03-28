import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { OverviewPanel } from './components/dashboard/OverviewPanel';
import { AnomalyPanel } from './components/dashboard/AnomalyPanel';
import { ActionsPanel } from './components/dashboard/ActionsPanel';
import { AIInsightsPanel } from './components/dashboard/AIInsightsPanel';
import { SavingsPanel } from './components/dashboard/SavingsPanel';
import { SettingsPanel } from './components/dashboard/SettingsPanel';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './pages/Auth/LoginPage';
import { SignupPage } from './pages/Auth/SignupPage';

function DashboardRoutes() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <OverviewPanel />;
      case 'anomalies': return <AnomalyPanel />;
      case 'insights': return <AIInsightsPanel />;
      case 'actions': return <ActionsPanel />;
      case 'savings': return <SavingsPanel />;
      case 'settings': return <SettingsPanel />;
      default: return <OverviewPanel />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Root Path - Always show Landing Page as requested */}
      <Route 
        path="/" 
        element={<LandingPage onGetStarted={() => user ? navigate('/dashboard') : navigate('/login')} />} 
      />

      {/* Legacy /landing route for compatibility */}
      <Route path="/landing" element={<Navigate to="/" replace />} />

      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected Dashboard Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardRoutes />
          </ProtectedRoute>
        } 
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;

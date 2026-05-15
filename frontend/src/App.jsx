import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

// Protected Pages
import DashboardPage from './pages/DashboardPage';
import ApplicationsPage from './pages/ApplicationsPage';
import KanbanPage from './pages/KanbanPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NetworkingPage from './pages/NetworkingPage';
import ResumeManagerPage from './pages/ResumeManagerPage';
import InterviewVaultPage from './pages/InterviewVaultPage';
import GoalsPage from './pages/GoalsPage';
import AIPage from './pages/AIPage';
import SettingsPage from './pages/SettingsPage';
import LinkedInCRMPage from './pages/LinkedInCRMPage';
import ResumeIntelligencePage from './pages/ResumeIntelligencePage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgba(15, 23, 42, 0.95)',
              color: '#e2e8f0',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(12px)',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/kanban" element={<KanbanPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/networking" element={<NetworkingPage />} />
            <Route path="/resume" element={<ResumeManagerPage />} />
            <Route path="/interview-vault" element={<InterviewVaultPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/ai" element={<AIPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/linkedin-crm" element={<LinkedInCRMPage />} />
            <Route path="/resume-intelligence" element={<ResumeIntelligencePage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

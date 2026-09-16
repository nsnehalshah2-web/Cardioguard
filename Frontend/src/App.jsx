import React from 'react';
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppShell from './components/layout/AppShell';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Signup from './pages/Signup';
import Assessment from './pages/Assessment';
import Dashboard from './pages/Dashboard';
import Simulator from './pages/Simulator';
import History from './pages/History';
import Insights from './pages/Insights';
import ModelInsights from './pages/ModelInsights';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import CheckIn from './pages/CheckIn';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const Router = import.meta.env.DEV || window.location.protocol === 'file:' ? BrowserRouter : HashRouter;

  return (
    <Router>
      <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/history" element={<History />} />
          <Route path="/insights" element={<Insights />} />
                    <Route path="/model-insights" element={<ModelInsights />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/check-in" element={<CheckIn />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
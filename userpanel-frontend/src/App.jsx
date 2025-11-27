import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AuthPage from './pages/AuthPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import LandingPage from './pages/LandingPage'
import DashboardLayout from './pages/DashboardLayout'
import DashboardHome from './pages/DashboardHome'
import PetsPage from './pages/PetsPage'
import AppointmentsPage from './pages/AppointmentsPage'
import VeterinariansPage from './pages/VeterinariansPage'
import SettingsPage from './pages/SettingsPage'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) return <div className="loading-screen">Loading...</div>
  if (!isAuthenticated) return <Navigate to="/" replace />
  
  return children
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/verify" element={<VerifyEmailPage />} />
          <Route path="/landing" element={
            <ProtectedRoute><LandingPage /></ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardLayout /></ProtectedRoute>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="pets" element={<PetsPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="veterinarians" element={<VeterinariansPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

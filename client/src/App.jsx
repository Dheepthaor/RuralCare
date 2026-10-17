import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { MainLayout } from './layouts/MainLayout';

// Pages
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { FacilityDetails } from './pages/FacilityDetails';
import { Doctors } from './pages/Doctors';
import { BookAppointment } from './pages/BookAppointment';
import { Emergency } from './pages/Emergency';
import { HealthInfo } from './pages/HealthInfo';
import { HealthArticleDetails } from './pages/HealthArticleDetails';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotFound } from './pages/NotFound';

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="services" element={<Services />} />
              <Route path="services/:id" element={<FacilityDetails />} />
              <Route path="doctors" element={<Doctors />} />
              <Route path="book/:doctorId" element={<BookAppointment />} />
              <Route path="emergency" element={<Emergency />} />
              <Route path="health-info" element={<HealthInfo />} />
              <Route path="health-info/:id" element={<HealthArticleDetails />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;

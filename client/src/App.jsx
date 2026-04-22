import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from './utils/auth';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PatientDoctorsPage from './pages/patient/DoctorsPage';
import PatientBookingsPage from './pages/patient/BookingsPage';
import DoctorDashboardPage from './pages/doctor/DashboardPage';
import DoctorAvailabilityPage from './pages/doctor/AvailabilityPage';

function ProtectedRoute({ requiredRole, children }) {
  if (!isAuthenticated()) return <Navigate to="/" replace />;
  if (requiredRole && getUserRole() !== requiredRole) return <Navigate to="/" replace />;
  return children;
}

function DashboardLayout() {
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile]     = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const sidebarWidth = isMobile ? 0 : collapsed ? '3.5rem' : '14rem';

  return (
    <>
      <Navbar
        onMenuClick={() => setMobileOpen(true)}
        isMobile={isMobile}
      />
      <div style={{ display: 'flex' }}>
        <Sidebar
          collapsed={collapsed}
          onCollapse={() => setCollapsed(c => !c)}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          isMobile={isMobile}
        />
        <main style={{
          marginLeft: sidebarWidth,
          flex: 1,
          padding: isMobile ? '1.25rem 1rem' : '2rem 2.5rem',
          minHeight: 'calc(100vh - 4rem)',
          transition: 'margin-left 0.25s ease',
          width: 0,
        }}>
          <Routes>
            <Route path="/patient/doctors"     element={<ProtectedRoute requiredRole="patient"><PatientDoctorsPage /></ProtectedRoute>} />
            <Route path="/patient/bookings"    element={<ProtectedRoute requiredRole="patient"><PatientBookingsPage /></ProtectedRoute>} />
            <Route path="/doctor/dashboard"    element={<ProtectedRoute requiredRole="doctor"><DoctorDashboardPage /></ProtectedRoute>} />
            <Route path="/doctor/availability" element={<ProtectedRoute requiredRole="doctor"><DoctorAvailabilityPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"               element={<LandingPage />} />
        <Route path="/:role/login"    element={<LoginPage />} />
        <Route path="/:role/register" element={<RegisterPage />} />
        <Route path="/*"              element={<DashboardLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

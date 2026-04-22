import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import PatientsPage from './pages/PatientsPage';
import DoctorsPage from './pages/DoctorsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import MedicalRecordsPage from './pages/MedicalRecordsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { isAuthenticated } from './utils/auth';

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

function DashboardLayout() {
  return (
    <>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ marginLeft: '14rem', flex: 1, padding: '2rem 2.5rem', minHeight: 'calc(100vh - 4rem)' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/patients" replace />} />
            <Route path="/patients"        element={<PatientsPage />} />
            <Route path="/doctors"         element={<DoctorsPage />} />
            <Route path="/appointments"    element={<AppointmentsPage />} />
            <Route path="/medical-records" element={<MedicalRecordsPage />} />
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
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/*"        element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

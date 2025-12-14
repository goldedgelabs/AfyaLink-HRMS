import './theme-d.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './utils/auth';
import SocketProvider from './utils/socket';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Notifications from './components/Notifications';
import AIChatWS from './components/AIChatWS';

// Dashboards
import SuperAdminDashboard from './pages/SuperAdmin/Dashboard';
import HospitalAdminDashboard from './pages/HospitalAdmin/Dashboard';
import DoctorDashboard from './pages/Doctor/Dashboard';
import PatientDashboard from './pages/Patient/Dashboard';

// SuperAdmin pages
import RBAC from './pages/SuperAdmin/RBAC';
import ML from './pages/SuperAdmin/ML';

// AI Pages
import MedicalAssistant from './pages/AI/MedicalAssistant';
import Chatbot from './pages/AI/Chatbot';
import Triage from './pages/AI/Triage';
import VoiceDictation from './pages/AI/VoiceDictation';

// Hospital Admin Pages
import Patients from './pages/HospitalAdmin/Patients';
import Financials from './pages/HospitalAdmin/Financials';
import Branches from './pages/HospitalAdmin/Branches';

// Doctor Pages
import Appointments from './pages/Doctor/Appointments';

// Lab Pages
import LabTests from './pages/LabTech/LabTests';
import Lab from './pages/LabTech/Lab';

// Pharmacy / Inventory
import Pharmacy from './pages/HospitalAdmin/Pharmacy';
import Inventory from './pages/HospitalAdmin/Inventory';

// Payments
import PaymentsPage from './pages/Payments/PaymentsPage';
import PaymentsPageFull from './pages/Payments/PaymentsFull';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import Analytics from './pages/Admin/Analytics';
import Reports from './pages/Admin/Reports';
import NotificationsPage from './pages/Admin/NotificationsPage';
import CRDTPatientEditor from './pages/Admin/CRDTPatientEditor';
import RealTimeIntegrations from './pages/Admin/RealTimeIntegrations';


// -------------------------
// Protected Route Wrapper
// -------------------------
function Protected({ children, roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <div>Access denied</div>;

  return children;
}


// -------------------------
// MAIN APP
// -------------------------
export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Navbar />
          <div className="app-grid">
            <Sidebar />

            <main className="main">
              <Notifications />

              <Routes>
                <Route path="/" element={<div>Welcome to AfyaLink HRMS</div>} />

                {/* Super Admin */}
                <Route
                  path="/superadmin"
                  element={
                    <Protected roles={['SuperAdmin']}>
                      <SuperAdminDashboard />
                    </Protected>
                  }
                />

                <Route
                  path="/superadmin/rbac"
                  element={
                    <Protected roles={['SuperAdmin']}>
                      <RBAC />
                    </Protected>
                  }
                />

                <Route
                  path="/superadmin/ml"
                  element={
                    <Protected roles={['SuperAdmin']}>
                      <ML />
                    </Protected>
                  }
                />

                {/* Hospital Admin */}
                <Route
                  path="/hospitaladmin"
                  element={
                    <Protected roles={['HospitalAdmin']}>
                      <HospitalAdminDashboard />
                    </Protected>
                  }
                />

                <Route
                  path="/hospitaladmin/patients"
                  element={
                    <Protected roles={['HospitalAdmin']}>
                      <Patients />
                    </Protected>
                  }
                />

                <Route
                  path="/hospitaladmin/financials"
                  element={
                    <Protected roles={['HospitalAdmin']}>
                      <Financials />
                    </Protected>
                  }
                />

                <Route
                  path="/hospitaladmin/branches"
                  element={
                    <Protected roles={['HospitalAdmin']}>
                      <Branches />
                    </Protected>
                  }
                />

                {/* Doctor */}
                <Route
                  path="/doctor"
                  element={
                    <Protected roles={['Doctor']}>
                      <DoctorDashboard />
                    </Protected>
                  }
                />

                <Route
                  path="/doctor/appointments"
                  element={
                    <Protected roles={['Doctor']}>
                      <Appointments />
                    </Protected>
                  }
                />

                {/* Lab */}
                <Route
                  path="/labtech/labs"
                  element={
                    <Protected roles={['LabTech']}>
                      <LabTests />
                    </Protected>
                  }
                />

                <Route
                  path="/lab"
                  element={
                    <Protected roles={['LabTech', 'Doctor']}>
                      <Lab />
                    </Protected>
                  }
                />

                {/* Patient */}
                <Route
                  path="/patient"
                  element={
                    <Protected roles={['Patient']}>
                      <PatientDashboard />
                    </Protected>
                  }
                />

                {/* AI Tools */}
                <Route
                  path="/ai/medical"
                  element={
                    <Protected roles={['Doctor', 'Nurse']}>
                      <MedicalAssistant />
                    </Protected>
                  }
                />

                <Route
                  path="/ai/chatbot"
                  element={
                    <Protected roles={['Patient']}>
                      <Chatbot />
                    </Protected>
                  }
                />

                <Route
                  path="/ai/triage"
                  element={
                    <Protected roles={['Doctor', 'Nurse']}>
                      <Triage />
                    </Protected>
                  }
                />

                <Route
                  path="/ai/voice"
                  element={
                    <Protected roles={['Doctor']}>
                      <VoiceDictation />
                    </Protected>
                  }
                />

                <Route
                  path="/ai/ws"
                  element={
                    <Protected roles={['Doctor', 'Nurse', 'Patient']}>
                      <AIChatWS />
                    </Protected>
                  }
                />

                {/* Admin */}
                <Route
                  path="/admin"
                  element={
                    <Protected roles={['SuperAdmin', 'HospitalAdmin']}>
                      <AdminDashboard />
                    </Protected>
                  }
                />

                <Route
                  path="/admin/realtime"
                  element={
                    <Protected roles={['SuperAdmin', 'HospitalAdmin']}>
                      <RealTimeIntegrations />
                    </Protected>
                  }
                />

                <Route
                  path="/admin/crdt-patients"
                  element={
                    <Protected roles={['SuperAdmin', 'HospitalAdmin']}>
                      <CRDTPatientEditor />
                    </Protected>
                  }
                />

                <Route
                  path="/admin/notifications"
                  element={
                    <Protected roles={['SuperAdmin', 'HospitalAdmin']}>
                      <NotificationsPage />
                    </Protected>
                  }
                />

                <Route
                  path="/analytics"
                  element={
                    <Protected roles={['SuperAdmin', 'HospitalAdmin']}>
                      <Analytics />
                    </Protected>
                  }
                />

                <Route
                  path="/reports"
                  element={
                    <Protected roles={['SuperAdmin', 'HospitalAdmin']}>
                      <Reports />
                    </Protected>
                  }
                />

                {/* Pharmacy / Inventory */}
                <Route
                  path="/pharmacy"
                  element={
                    <Protected roles={['Pharmacist', 'HospitalAdmin']}>
                      <Pharmacy />
                    </Protected>
                  }
                />

                <Route
                  path="/inventory"
                  element={
                    <Protected roles={['HospitalAdmin']}>
                      <Inventory />
                    </Protected>
                  }
                />

                {/* Payments */}
                <Route
                  path="/payments"
                  element={
                    <Protected roles={['HospitalAdmin', 'SuperAdmin', 'Patient']}>
                      <PaymentsPage />
                    </Protected>
                  }
                />

                <Route
                  path="/payments/full"
                  element={
                    <Protected roles={['HospitalAdmin', 'SuperAdmin', 'Patient']}>
                      <PaymentsPageFull />
                    </Protected>
                  }
                />

                {/* Not Found */}
                <Route path="*" element={<div>404 — Page not found</div>} />

              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}

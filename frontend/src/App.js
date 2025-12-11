import './theme-d.css';
import RealTimeIntegrations from './pages/Admin/RealTimeIntegrations';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './utils/auth';
import SocketProvider from './utils/socket';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SuperAdminDashboard from './pages/SuperAdmin/Dashboard';
import RBAC from './pages/SuperAdmin/RBAC';
import ML from './pages/SuperAdmin/ML';
import HospitalAdminDashboard from './pages/HospitalAdmin/Dashboard';
import DoctorDashboard from './pages/Doctor/Dashboard';
import PatientDashboard from './pages/Patient/Dashboard';
import AIChatWS from './components/AIChatWS';
import PaymentsPageFull from './pages/Payments/PaymentsFull';

import MedicalAssistant from './pages/AI/MedicalAssistant';
import Chatbot from './pages/AI/Chatbot';
import Triage from './pages/AI/Triage';
import VoiceDictation from './pages/AI/VoiceDictation';

import Patients from './pages/HospitalAdmin/Patients';
import Appointments from './pages/Doctor/Appointments';
import LabTests from './pages/LabTech/LabTests';
import Financials from './pages/HospitalAdmin/Financials';
import Notifications from './components/Notifications';

function Protected({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <div>Access denied</div>;
  return children;
}

export default function App(){
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
                <Route path="/superadmin" element={<Protected roles={['SuperAdmin']}><SuperAdminDashboard/></Protected>} />
                <Route path="/superadmin/rbac" element={<Protected roles={['SuperAdmin']}><RBAC/></Protected>} />
                <Route path="/superadmin/ml" element={<Protected roles={['SuperAdmin']}><ML/></Protected>} />
                <Route path="/hospitaladmin" element={<Protected roles={['HospitalAdmin']}><HospitalAdminDashboard/></Protected>} />
                <Route path="/hospitaladmin/patients" element={<Protected roles={['HospitalAdmin']}><Patients/></Protected>} />
                <Route path="/hospitaladmin/financials" element={<Protected roles={['HospitalAdmin']}><Financials/></Protected>} />
                <Route path="/doctor/appointments" element={<Protected roles={['Doctor']}><Appointments/></Protected>} />
                <Route path="/labtech/labs" element={<Protected roles={['LabTech']}><LabTests/></Protected>} />
                <Route path="/doctor" element={<Protected roles={['Doctor']}><DoctorDashboard/></Protected>} />
                <Route path="/patient" element={<Protected roles={['Patient']}><PatientDashboard/></Protected>} />
                
                <Route path="/ai/medical" element={<Protected roles={['Doctor','Nurse']}><MedicalAssistant/></Protected>} />
                <Route path="/ai/chatbot" element={<Protected roles={['Patient']}><Chatbot/></Protected>} />
                <Route path="/ai/triage" element={<Protected roles={['Doctor','Nurse']}><Triage/></Protected>} />
                <Route path="/ai/voice" element={<Protected roles={['Doctor']}><VoiceDictation/></Protected>} />

                
                <Route path="/admin" element={<Protected roles={['SuperAdmin','HospitalAdmin']}><AdminDashboard/></Protected>} />
                <Route path="/payments" element={<Protected roles={['HospitalAdmin','SuperAdmin','Patient']}><PaymentsPage/></Protected>} />
                <Route path="/analytics" element={<Protected roles={['HospitalAdmin','SuperAdmin']}><Analytics/></Protected>} />
                <Route path="/pharmacy" element={<Protected roles={['Pharmacist','HospitalAdmin']}><Pharmacy/></Protected>} />
                <Route path="/inventory" element={<Protected roles={['HospitalAdmin']}><Inventory/></Protected>} />
                <Route path="/lab" element={<Protected roles={['LabTech','Doctor']}><Lab/></Protected>} />
                <Route path="/branches" element={<Protected roles={['HospitalAdmin']}><Branches/></Protected>} />
                <Route path="/reports" element={<Protected roles={['HospitalAdmin','SuperAdmin']}><Reports/></Protected>} />
                <Route path="/admin/notifications" element={<Protected roles={['HospitalAdmin','SuperAdmin']}><NotificationsPage/></Protected>} />

                \n                <Route path="/ai/ws" element={<Protected roles={[\'Doctor\',\'Nurse\',\'Patient\']}><AIChatWS/></Protected>} />\n                <Route path="/payments/full" element={<Protected roles={[\'HospitalAdmin\',\'SuperAdmin\',\'Patient\']}><PaymentsPageFull/></Protected>} />\n                <Route path="/admin/realtime" element={<Protected roles={['HospitalAdmin','SuperAdmin']}><RealTimeIntegrations/></Protected>} />
                <Route path="/admin/crdt-patients" element={<Protected roles={['HospitalAdmin','SuperAdmin']}><CRDTPatientEditor/></Protected>} />
                <Route path="*" element={<div>Not found</div>} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}

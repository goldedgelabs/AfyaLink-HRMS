import "./theme-d.css";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./utils/auth";
import SocketProvider from "./utils/socket";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Notifications from "./components/Notifications";
import AIChatWS from "./components/AIChatWS";

// Auth pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// Dashboards
import SuperAdminDashboard from "./pages/SuperAdmin/Dashboard";
import HospitalAdminDashboard from "./pages/HospitalAdmin/Dashboard";
import DoctorDashboard from "./pages/Doctor/Dashboard";
import PatientDashboard from "./pages/Patient/Dashboard";

// SuperAdmin
import RBAC from "./pages/SuperAdmin/RBAC";
import ML from "./pages/SuperAdmin/ML";

// AI
import MedicalAssistant from "./pages/AI/MedicalAssistant";
import Chatbot from "./pages/AI/Chatbot";
import Triage from "./pages/AI/Triage";
import VoiceDictation from "./pages/AI/VoiceDictation";

// Hospital Admin
import Patients from "./pages/HospitalAdmin/Patients";
import Financials from "./pages/HospitalAdmin/Financials";
import Branches from "./pages/HospitalAdmin/Branches";

// Doctor
import Appointments from "./pages/Doctor/Appointments";

// Lab
import LabTests from "./pages/LabTech/LabTests";
import Lab from "./pages/LabTech/Lab";

// Pharmacy / Inventory
import Pharmacy from "./pages/HospitalAdmin/Pharmacy";
import Inventory from "./pages/HospitalAdmin/Inventory";

// Payments
import PaymentsPage from "./pages/Payments/PaymentsPage";
import PaymentsPageFull from "./pages/Payments/PaymentsFull";

// Admin
import AdminDashboard from "./pages/Admin/Dashboard";
import Analytics from "./pages/Admin/Analytics";
import Reports from "./pages/Admin/Reports";
import NotificationsPage from "./pages/Admin/NotificationsPage";
import CRDTPatientEditor from "./pages/Admin/CRDTPatientEditor";
import RealTimeIntegrations from "./pages/Admin/RealTimeIntegrations";

/* -------------------------
   Protected Route
------------------------- */
function Protected({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    return <div style={{ padding: 20 }}>⛔ Access denied</div>;
  }

  return children;
}

/* -------------------------
   Layout Wrapper
------------------------- */
function AppLayout({ children }) {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <div className="app-grid">
        {user && <Sidebar />}
        <main className="main">
          {user && <Notifications />}
          {children}
        </main>
      </div>
    </>
  );
}

/* -------------------------
   MAIN APP
------------------------- */
export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* App */}
            <Route
              path="/*"
              element={
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<div>Welcome to AfyaLink HRMS</div>} />

                    {/* Super Admin */}
                    <Route
                      path="/superadmin"
                      element={
                        <Protected roles={["superadmin"]}>
                          <SuperAdminDashboard />
                        </Protected>
                      }
                    />
                    <Route
                      path="/superadmin/rbac"
                      element={
                        <Protected roles={["superadmin"]}>
                          <RBAC />
                        </Protected>
                      }
                    />
                    <Route
                      path="/superadmin/ml"
                      element={
                        <Protected roles={["superadmin"]}>
                          <ML />
                        </Protected>
                      }
                    />

                    {/* Hospital Admin */}
                    <Route
                      path="/hospitaladmin"
                      element={
                        <Protected roles={["hospitaladmin"]}>
                          <HospitalAdminDashboard />
                        </Protected>
                      }
                    />
                    <Route
                      path="/hospitaladmin/patients"
                      element={
                        <Protected roles={["hospitaladmin"]}>
                          <Patients />
                        </Protected>
                      }
                    />
                    <Route
                      path="/hospitaladmin/financials"
                      element={
                        <Protected roles={["hospitaladmin"]}>
                          <Financials />
                        </Protected>
                      }
                    />
                    <Route
                      path="/hospitaladmin/branches"
                      element={
                        <Protected roles={["hospitaladmin"]}>
                          <Branches />
                        </Protected>
                      }
                    />

                    {/* Doctor */}
                    <Route
                      path="/doctor"
                      element={
                        <Protected roles={["doctor"]}>
                          <DoctorDashboard />
                        </Protected>
                      }
                    />
                    <Route
                      path="/doctor/appointments"
                      element={
                        <Protected roles={["doctor"]}>
                          <Appointments />
                        </Protected>
                      }
                    />

                    {/* Lab */}
                    <Route
                      path="/labtech/labs"
                      element={
                        <Protected roles={["labtech"]}>
                          <LabTests />
                        </Protected>
                      }
                    />
                    <Route
                      path="/lab"
                      element={
                        <Protected roles={["labtech", "doctor"]}>
                          <Lab />
                        </Protected>
                      }
                    />

                    {/* Patient */}
                    <Route
                      path="/patient"
                      element={
                        <Protected roles={["patient"]}>
                          <PatientDashboard />
                        </Protected>
                      }
                    />

                    {/* AI */}
                    <Route
                      path="/ai/medical"
                      element={
                        <Protected roles={["doctor", "nurse"]}>
                          <MedicalAssistant />
                        </Protected>
                      }
                    />
                    <Route
                      path="/ai/chatbot"
                      element={
                        <Protected roles={["patient"]}>
                          <Chatbot />
                        </Protected>
                      }
                    />
                    <Route
                      path="/ai/triage"
                      element={
                        <Protected roles={["doctor", "nurse"]}>
                          <Triage />
                        </Protected>
                      }
                    />
                    <Route
                      path="/ai/voice"
                      element={
                        <Protected roles={["doctor"]}>
                          <VoiceDictation />
                        </Protected>
                      }
                    />
                    <Route
                      path="/ai/ws"
                      element={
                        <Protected roles={["doctor", "nurse", "patient"]}>
                          <AIChatWS />
                        </Protected>
                      }
                    />

                    {/* Admin */}
                    <Route
                      path="/admin"
                      element={
                        <Protected roles={["superadmin", "hospitaladmin"]}>
                          <AdminDashboard />
                        </Protected>
                      }
                    />
                    <Route
                      path="/admin/realtime"
                      element={
                        <Protected roles={["superadmin", "hospitaladmin"]}>
                          <RealTimeIntegrations />
                        </Protected>
                      }
                    />
                    <Route
                      path="/admin/crdt-patients"
                      element={
                        <Protected roles={["superadmin", "hospitaladmin"]}>
                          <CRDTPatientEditor />
                        </Protected>
                      }
                    />
                    <Route
                      path="/admin/notifications"
                      element={
                        <Protected roles={["superadmin", "hospitaladmin"]}>
                          <NotificationsPage />
                        </Protected>
                      }
                    />

                    {/* Analytics / Reports */}
                    <Route
                      path="/analytics"
                      element={
                        <Protected roles={["superadmin", "hospitaladmin"]}>
                          <Analytics />
                        </Protected>
                      }
                    />
                    <Route
                      path="/reports"
                      element={
                        <Protected roles={["superadmin", "hospitaladmin"]}>
                          <Reports />
                        </Protected>
                      }
                    />

                    {/* Pharmacy / Inventory */}
                    <Route
                      path="/pharmacy"
                      element={
                        <Protected roles={["pharmacist", "hospitaladmin"]}>
                          <Pharmacy />
                        </Protected>
                      }
                    />
                    <Route
                      path="/inventory"
                      element={
                        <Protected roles={["hospitaladmin"]}>
                          <Inventory />
                        </Protected>
                      }
                    />

                    {/* Payments */}
                    <Route
                      path="/payments"
                      element={
                        <Protected roles={["hospitaladmin", "superadmin", "patient"]}>
                          <PaymentsPage />
                        </Protected>
                      }
                    />
                    <Route
                      path="/payments/full"
                      element={
                        <Protected roles={["hospitaladmin", "superadmin", "patient"]}>
                          <PaymentsPageFull />
                        </Protected>
                      }
                    />

                    {/* 404 */}
                    <Route path="*" element={<div>404 — Page not found</div>} />
                  </Routes>
                </AppLayout>
              }
            />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}

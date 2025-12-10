import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/auth';

export default function Sidebar(){
  const { user } = useAuth();
  const role = user?.role;

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>

          {/* SuperAdmin */}
          {role === 'SuperAdmin' && <>
            <li><Link to="/superadmin">SuperAdmin</Link></li>
            <li><Link to="/superadmin/rbac">RBAC</Link></li>
            <li><Link to="/superadmin/ml">ML</Link></li>
          </>}

          {/* HospitalAdmin */}
          {['SuperAdmin','HospitalAdmin'].includes(role) && <>
            <li><Link to="/hospitaladmin">HospitalAdmin</Link></li>
            <li><Link to="/hospitaladmin/patients">Patients</Link></li>
            <li><Link to="/hospitaladmin/financials">Financials</Link></li>
          </>}

          {/* Doctor */}
          {['Doctor'].includes(role) && <>
            <li><Link to="/doctor">Doctor</Link></li>
            <li><Link to="/doctor/appointments">Appointments</Link></li>
          </>}

          {/* LabTech */}
          {['LabTech'].includes(role) && <>
            <li><Link to="/labtech/labs">Lab Tests</Link></li>
          </>}

          {/* Patient */}
          {['Patient'].includes(role) && <>
            <li><Link to="/patient">Patient</Link></li>
            <li><Link to="/patient/appointments">My Appointments</Link></li>
          </>}
        </ul>
      </nav>
      <div className="sidebar-footer">AfyaLink • Secure</div>
    </aside>
  );
}

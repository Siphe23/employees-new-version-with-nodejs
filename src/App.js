import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';  // Admin Dashboard (Generic)
import GeneralAdmin from './components/GeneralAdmin';     // General Admin Dashboard
import SuperAdmin from './components/SuperAdmin';         // Super Admin Dashboard
import EmployeeForm from './components/EmployeeForm';
import LoginRegister from './components/LoginRegister';
import AdminRoles from './components/adminRoles'; 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Login-register" element={<LoginRegister />} />
        <Route path="/add-employee" element={<EmployeeForm />} />
        <Route path="/" element={<AdminDashboard />} /> {/* Make sure this route is properly defined */}
        <Route path="/general-admin" element={<GeneralAdmin />} />
        <Route path="/super-admin" element={<SuperAdmin />} />
        <Route path="/admin-roles" element={<AdminRoles />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

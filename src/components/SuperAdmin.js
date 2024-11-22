import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // To handle navigation
import EmployeeForm from './EmployeeForm'; // Assuming you have an EmployeeForm component
import GeneralAdminForm from './GeneralAdmin'; // Assuming you have a GeneralAdminForm component

function SuperAdmin() {
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showGeneralAdminForm, setShowGeneralAdminForm] = useState(false);
  const navigate = useNavigate();  // For programmatic navigation

  // Logout function
  const handleLogout = () => {
    // Remove idToken and uid from localStorage
    localStorage.removeItem('idToken');
    localStorage.removeItem('uid');

    // Redirect to login page
    navigate('/Login-register');
  };

  // Toggle visibility for the employee form
  const handleAddEmployeeClick = () => {
    setShowEmployeeForm(!showEmployeeForm);
  };

  // Toggle visibility for the general admin form
  const handleAddGeneralAdminClick = () => {
    setShowGeneralAdminForm(!showGeneralAdminForm);
  };

  return (
    <div>
      <h1>Super Admin Dashboard</h1>

      <div>
        <button onClick={handleAddEmployeeClick}>Add Employee</button>
        <button onClick={handleAddGeneralAdminClick}>Add General Admin</button>
      </div>

      {showEmployeeForm && <EmployeeForm />}
      {showGeneralAdminForm && <GeneralAdminForm />}

      <div>
        <h2>Manage Employees</h2>
        <button onClick={() => console.log('Update Employee')}>Update Employee</button>
        <button onClick={() => console.log('Delete Employee')}>Delete Employee</button>
        
      </div>

      <div>
        
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default SuperAdmin;

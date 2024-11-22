import { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/EmployeeForm.css';

const EmployeeForm = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    employeeId: '', // South African ID (saId)
    gender: '',
    image: '', // Base64-encoded image
    editMode: false,
    editIndex: -1, // To track which employee is being edited
  });
  const API_URL = 'http://localhost:5000/api/employees'; // Correct API URL for the employees

  // Fetch employees from the server when the component mounts
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_URL);
      const data = response.data || [];
      setEmployees(Object.values(data)); // Format the data for display
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle form field input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle image file input (converts to Base64)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          image: reader.result, // Store the Base64 string of the image
        }));
      };
      reader.readAsDataURL(file); // Convert the image to Base64 string
    }
  };

  // Handle form submission (add or update employee)
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create the employee data object
    const employeeData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      position: formData.position,
      saId: formData.employeeId, // South African ID (saId)
      photo: formData.image, // Base64 image
    };

    try {
      if (formData.editMode) {
        // Update employee if in edit mode
        await axios.put(`${API_URL}/${formData.editIndex}`, employeeData);
      } else {
        // Add new employee
        await axios.post(API_URL, employeeData);
      }

      // Re-fetch employees after submission
      fetchEmployees();
      // Reset the form
      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Handle edit button click
  const handleEdit = (employee) => {
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      employeeId: employee.employeeId,
      gender: employee.gender,
      image: employee.photo, // Base64 image
      editMode: true,
      editIndex: employee.employeeId, // Track the ID of the employee being edited
    });
  };

  // Handle delete button click
  const handleDelete = async (employeeId) => {
    try {
      await axios.delete(`${API_URL}/${employeeId}`);
      fetchEmployees(); // Re-fetch employees after deletion
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  // Reset the form fields
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: '',
      employeeId: '',
      gender: '',
      image: '', // Reset image
      editMode: false,
      editIndex: -1,
    });
  };

  return (
    <div>
      {/* Search bar */}
      <input 
        type="text" 
        placeholder="Search Employees"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      
      {/* List of employees */}
      <ul>
        {employees.filter(employee => employee.name.toLowerCase().includes(searchTerm.toLowerCase())).map((employee) => (
          <li key={employee.employeeId}>
            {employee.name}
            <button onClick={() => handleEdit(employee)}>Edit</button>
            <button onClick={() => handleDelete(employee.employeeId)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Employee Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="position"
          placeholder="Position"
          value={formData.position}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="employeeId"
          placeholder="Employee ID"
          value={formData.employeeId}
          onChange={handleInputChange}
        />
        
        {/* Gender selection */}
        <div>
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleInputChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        {/* Image upload */}
        <input
          type="file"
          name="image"
          onChange={handleImageChange}
        />
        
        {/* Submit button */}
        <button type="submit">
          {formData.editMode ? 'Update Employee' : 'Add Employee'}
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;

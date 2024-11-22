import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/Dashboard.css';


const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5002/users');
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle user updates (example function)
  const handleUpdate = async (uid, updates) => {
    try {
      await axios.patch('http://localhost:5002/update', { uid, updates });
      alert('User updated successfully');
      // Re-fetch users after update
      const response = await axios.get('http://localhost:5002/users');
      setUsers(response.data);
    } catch (error) {
      alert('Error updating user');
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          <h2>User List</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users && Object.keys(users).map((uid) => {
                const user = users[uid];
                return (
                  <tr key={uid}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.number}</td>
                    <td>{user.role}</td>
                    <td>
                      <button onClick={() => handleUpdate(uid, { role: 'Admin' })}>Make Admin</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

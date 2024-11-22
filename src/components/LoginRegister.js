import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // To handle navigation

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();  // For programmatic navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Sending a POST request to the backend API to authenticate the user
      const response = await axios.post('http://localhost:5000/api/login', { email, password });  // Updated URL
      const { idToken, uid } = response.data;  // Destructure to get idToken and UID

      // Save the ID token and UID to localStorage (or context/state management)
      localStorage.setItem('idToken', idToken);
      localStorage.setItem('uid', uid);

      setMessage('Login successful!');

      // Redirect user based on UID
      if (uid === 'rNkvurYYqLZ2jvCrgFEoFVcMjTx2') {
        // Redirect to Super Admin Dashboard
        navigate('/super-admin');
      } else {
        // Redirect to General Admin Dashboard
        navigate('/super-admin');
      }
    } catch (error) {
      // Handle error and show error message
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div>{message}</div>
    </div>
  );
}

export default Login;

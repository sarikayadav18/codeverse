import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// For Vite, use import.meta.env to access env variables
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const { username, email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/signup', { username, email, password });
      console.log('Signup successful:', res.data);
      // Store token locally and navigate to a protected page
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard'); // Change this to your protected route
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label>Username:</label>
          <input 
            type="text"
            name="username"
            value={username}
            onChange={onChange}
            required 
          />
        </div>
        <div>
          <label>Email:</label>
          <input 
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required 
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required 
          />
        </div>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Signup.css';

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
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard'); // Change to your protected route if necessary
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={onSubmit} className="signup-form">
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
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
};

export default Signup;

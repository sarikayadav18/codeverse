import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

const Navbar = () => {
  const [username, setUsername] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setShowDropdown(prev => !prev);
  
  // Check if the user is logged in by checking for a token
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await axios.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Assuming the response structure is: { user: { username: '...' } }
        setUsername(res.data.user.username);
      } catch (err) {
        console.error("Error fetching user in Navbar:", err);
      }
    };
    fetchUser();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleProfile = () => {
    if (username) {
      navigate(`/profile/${username}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">CodeVerse</div>
      <div className="nav-right">
        {!isLoggedIn && (
          <div className="login-link">
            <Link to="/login">Login</Link>
          </div>
        )}
        {isLoggedIn && (
          <div className="avatar-container" onClick={toggleDropdown}>
            <div className="avatar">
              {username ? username.charAt(0).toUpperCase() : 'U'}
            </div>
            {showDropdown && (
              <div className="dropdown">
                <div className="dropdown-item" onClick={handleProfile}>
                  Profile
                </div>
                <div className="dropdown-item" onClick={handleLogout}>
                  Logout
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

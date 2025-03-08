import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const toggleDropdown = () => setShowDropdown(prev => !prev);

  // Check if the user is logged in by checking for a token
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
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
            <img 
              src="https://via.placeholder.com/40" 
              alt="Avatar"
              className="avatar"
            />
            {showDropdown && (
              <div className="dropdown">
                <div className="dropdown-item" onClick={handleProfile}>Profile</div>
                <div className="dropdown-item" onClick={handleLogout}>Logout</div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

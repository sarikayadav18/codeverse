import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const toggleDropdown = () => setShowDropdown(prev => !prev);

  return (
    <nav className="navbar">
      <div className="logo">CodeVerse</div>
      <div className="avatar-container" onClick={toggleDropdown}>
        <img 
          src="https://via.placeholder.com/40" 
          alt="Avatar"
          className="avatar"
        />
        {showDropdown && (
          <div className="dropdown">
            <div className="dropdown-item">Profile</div>
            <div className="dropdown-item">Logout</div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

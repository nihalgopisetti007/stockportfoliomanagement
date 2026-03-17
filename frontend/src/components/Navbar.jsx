import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../services/authService';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">◈</span>
        <span className="brand-text">QuantumTrade</span>
      </div>
      <div className="navbar-links">
        <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
          <span className="nav-icon">⬡</span> Dashboard
        </Link>
        <Link to="/portfolio" className={`nav-link ${isActive('/portfolio') ? 'active' : ''}`}>
          <span className="nav-icon">◉</span> Portfolio
        </Link>
        <Link to="/market" className={`nav-link ${isActive('/market') ? 'active' : ''}`}>
          <span className="nav-icon">⟁</span> Market
        </Link>
        <Link to="/add-stock" className={`nav-link ${isActive('/add-stock') ? 'active' : ''}`}>
          <span className="nav-icon">+</span> Add Stock
        </Link>
      </div>
      <div className="navbar-right">
        <div className="user-badge">
          <span className="user-avatar">{user.name ? user.name[0].toUpperCase() : 'U'}</span>
          <span className="user-name">{user.name || 'Trader'}</span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          ⎋ Logout
        </button>
      </div>
    </nav>
  );
}

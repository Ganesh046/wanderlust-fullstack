import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Compass, LogOut, Plus, Search, ClipboardList, Calendar, Menu } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ onSearch }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    navigate('/listings');
    await logout();
  };

  return (
    <nav className="navbar-glass">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/listings" className="nav-logo">
          <Compass size={28} strokeWidth={2.5} className="logo-icon nav-logo-icon" />
          <span className="nav-logo-text">wanderlust</span>
        </Link>

        {/* Search Bar (Airbnb-Style Rounded Pill) */}
        <div className="search-bar-container nav-search-bar">
          <input
            type="text"
            placeholder="Start your search..."
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="nav-search-input"
          />
          <button className="nav-search-button">
            <Search size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* Action Menu */}
        <div className="nav-actions">
          <Link to="/listings" className="nav-explore-link nav-hover">Explore</Link>

          {user ? (
            <>
              <Link to="/listings/new" className="btn-primary nav-host-btn">
                <Plus size={14} />
                <span>Wanderlust Your Home</span>
              </Link>
              
              <div className="nav-profile-menu-container" ref={dropdownRef}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="profile-pill nav-profile-pill"
                >
                  <Menu size={16} style={{ color: 'var(--text-muted)' }} />
                  <div className="nav-profile-avatar">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                </button>

                {profileMenuOpen && (
                  <div className="nav-dropdown-menu">
                    {/* Welcome Header */}
                    <div className="nav-dropdown-header">
                      <div className="nav-dropdown-username">{user.username}</div>
                      <div className="nav-dropdown-email">{user.email}</div>
                    </div>

                    {/* Menu links */}
                    <Link 
                      to="/trips" 
                      onClick={() => setProfileMenuOpen(false)}
                      className="nav-dropdown-link dropdown-item"
                    >
                      <Calendar size={15} style={{ color: 'var(--color-primary)' }} />
                      <span>My Trips</span>
                    </Link>

                    <Link 
                      to="/dashboard" 
                      onClick={() => setProfileMenuOpen(false)}
                      className="nav-dropdown-link dropdown-item"
                    >
                      <ClipboardList size={15} style={{ color: 'var(--color-primary)' }} />
                      <span>Host Dashboard</span>
                    </Link>

                    <Link 
                      to="/listings/new" 
                      onClick={() => setProfileMenuOpen(false)}
                      className="nav-dropdown-link dropdown-item"
                    >
                      <Plus size={15} style={{ color: 'var(--color-primary)' }} />
                      <span>Wanderlust Your Home</span>
                    </Link>

                    <div className="nav-dropdown-divider" />

                    <button 
                      onClick={() => {
                        setProfileMenuOpen(false);
                        handleLogout();
                      }}
                      className="nav-dropdown-logout dropdown-item"
                    >
                      <LogOut size={15} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="nav-auth-container">
              <Link to="/login" className="nav-login-link nav-hover">Log In</Link>
              <Link to="/signup" className="btn-primary nav-signup-btn">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

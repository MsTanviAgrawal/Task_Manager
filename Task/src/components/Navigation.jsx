import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../stylePages/Navigation.css';

function Navigation({ currentUser, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn = Boolean(currentUser);

  const handleLogout = () => {
    onLogout();
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        
        {/* BRAND BRAND ELEMENT */}
        <div className="nav-brand">
          <h1>Task Manager</h1>
        </div>

        {/* BACK BACKDROP MASK OVERLAY LAYER - Decreases background opacity on toggle */}
        <div 
          className={`nav-backdrop-overlay ${mobileMenuOpen ? 'visible' : ''}`}
          onClick={closeMobileMenu}
        />

        {/* MOBILE DYNAMIC HAMBURGER CONTROLLER TOGGLE */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        {/* LEFT SLIDE-OUT MENU WRAPPER ENGINE */}
        <div className={`nav-menu-wrapper ${mobileMenuOpen ? 'open' : ''}`}>
          
          {/* Mobile Only Header inside Drawer Panel */}
          <div className="mobile-drawer-header">
            <h2>Task Manager</h2>
            {/* <button className="drawer-close-btn" onClick={closeMobileMenu} aria-label="Close menu">
              <XIcon />
            </button> */}
          </div>

          <ul className="nav-menu">
            <li>
              <NavLink
                to="/dashboard"
                onClick={closeMobileMenu}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/create"
                onClick={closeMobileMenu}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Create Task
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/tasks"
                onClick={closeMobileMenu}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                All Tasks
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/priority"
                onClick={closeMobileMenu}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Priority Board
              </NavLink>
            </li>
            {isLoggedIn && currentUser.role === 'admin' && (
              <li>
                <NavLink
                  to="/users"
                  onClick={closeMobileMenu}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  Users
                </NavLink>
              </li>
            )}
          </ul>

          <div className="nav-user">
            {isLoggedIn ? (
              <>
                <div className="user-info-nav">
                  <div className="user-avatar-nav">
                    {currentUser.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="user-details">
                    <span className="user-name">{currentUser.username}</span>
                    <span className="user-role">{currentUser.role}</span>
                  </div>
                </div>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </>
            ) : (
              <div className="nav-auth-actions">
                <NavLink to="/login" onClick={closeMobileMenu} className="btn-auth btn-auth-login">
                  Login
                </NavLink>
                <NavLink to="/register" onClick={closeMobileMenu} className="btn-auth btn-auth-signup">
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
}

const XIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default Navigation;

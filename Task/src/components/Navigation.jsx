import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../stylePages/Navigation.css';

function Navigation({ currentUser, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <div className="nav-brand">
          <h1>Task Manager</h1>
        </div>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <div className={`nav-menu-wrapper ${mobileMenuOpen ? 'open' : ''}`}>
          <ul className="nav-menu">
            <li>
              <NavLink
                to="/dashboard"
                onClick={closeMobileMenu}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                🏠 Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/create"
                onClick={closeMobileMenu}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                ➕ Create Task
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/tasks"
                onClick={closeMobileMenu}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                📋 All Tasks
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/priority"
                onClick={closeMobileMenu}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                🎯 Priority Board
              </NavLink>
            </li>
            {currentUser.role === 'admin' && (
              <li>
                <NavLink
                  to="/users"
                  onClick={closeMobileMenu}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  👥 Users
                </NavLink>
              </li>
            )}
          </ul>

          <div className="nav-user">
            <div className="user-info-nav">
              <div className="user-avatar-nav">
                {currentUser.username.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <span className="user-name">{currentUser.username}</span>
                <span className="user-role">{currentUser.role}</span>
              </div>
            </div>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;

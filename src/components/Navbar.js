import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role;
  const userEmail = user.email;

  const handleLogout = () => {
    // Clear all user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to home
    navigate('/');
    
    // Force reload to update navbar
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <Link to="/" style={styles.logoLink}>🚗 CarWash Pro</Link>
      </div>
      
      <div style={styles.navLinks}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/services" style={styles.link}>Services</Link>
        
        {isLoggedIn ? (
          <>
            {/* Show user info */}
            <div style={styles.userInfo}>
              <span style={styles.userEmail}>{userEmail}</span>
              <span style={styles.userRole}>({userRole})</span>
            </div>
            
            {/* Show dashboard based on role */}
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            
            {/* Show "My Vehicles" only for CUSTOMERS, not for ADMIN or STAFF */}
            {userRole === 'CUSTOMER' && (
              <Link to="/vehicles" style={styles.link}>My Vehicles</Link>
            )}
            
            {/* Admin specific links */}
            {userRole === 'ADMIN' && (
              <Link to="/admin" style={styles.link}>Admin Dashboard</Link>
            )}
            
            {/* Staff specific links */}
            {userRole === 'STAFF' && (
              <Link to="/staff" style={styles.link}>Staff Dashboard</Link>
            )}
            
            {/* Logout button */}
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Show login/register when not logged in */}
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#2c3e50',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  logoLink: {
    color: 'white',
    textDecoration: 'none',
    '&:hover': {
      color: '#3498db'
    }
  },
  navLinks: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.1)'
    }
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '0.8rem',
    color: '#bdc3c7',
    marginRight: '0.5rem'
  },
  userEmail: {
    fontWeight: '500',
  },
  userRole: {
    fontSize: '0.7rem',
    fontStyle: 'italic',
  },
  logoutBtn: {
    backgroundColor: '#50e73cff',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: '#156e5bff'
    }
  },
};

export default Navbar;
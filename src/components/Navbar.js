import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  
  // Get user data from localStorage
  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  const currentUser = getCurrentUser();
  const isLoggedIn = !!localStorage.getItem('token');
  const userRole = currentUser?.role;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    setTimeout(() => window.location.reload(), 100);
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
            {/* Show user role */}
            <div style={styles.userRole}>
              <span style={{
                ...styles.roleBadge,
                backgroundColor: userRole === 'ADMIN' ? '#e74c3c' : 
                               userRole === 'STAFF' ? '#3498db' : '#2ecc71'
              }}>
                {userRole}
              </span>
            </div>
            
            {/* ADMIN SPECIFIC LINKS */}
            {userRole === 'ADMIN' && (
              <>
                <Link to="/admin" style={styles.adminLink}>Admin Dashboard</Link>
                <Link to="/admin" onClick={() => {/* Will be handled by dashboard tabs */}} style={styles.link}>
                  Manage Services
                </Link>
                <Link to="/admin" onClick={() => {/* Will be handled by dashboard tabs */}} style={styles.link}>
                  View Reports
                </Link>
              </>
            )}
            
            {/* CUSTOMER SPECIFIC LINKS */}
            {userRole === 'CUSTOMER' && (
              <>
                <Link to="/dashboard" style={styles.link}>Dashboard</Link>
                <Link to="/book" style={styles.link}>Book Service</Link>
                <Link to="/bookings" style={styles.link}>My Bookings</Link>
                <Link to="/vehicles" style={styles.link}>My Vehicles</Link>
              </>
            )}
            
            {/* STAFF SPECIFIC LINKS */}
            {userRole === 'STAFF' && (
              <>
                <Link to="/dashboard" style={styles.link}>Staff Dashboard</Link>
                <Link to="#" style={styles.link}>Today's Schedule</Link>
                <Link to="#" style={styles.link}>Assigned Jobs</Link>
              </>
            )}
            
            {/* Common logout for all */}
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
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
  },
  adminLink: {
    color: '#e74c3c',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    border: '1px solid rgba(231, 76, 60, 0.3)',
    fontWeight: 'bold',
  },
  userRole: {
    marginRight: '0.5rem',
  },
  roleBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: 'white',
  },
  logoutBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};

export default Navbar;
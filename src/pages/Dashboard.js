import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Get user info from localStorage
    setUser({
      email: localStorage.getItem('email'),
      fullName: localStorage.getItem('fullName'),
      role: localStorage.getItem('role')
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  if (!user) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Welcome, {user.fullName}!</h1>
        <p style={styles.role}>Role: {user.role}</p>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>

      <div style={styles.dashboard}>
        {/* Customer Dashboard */}
        {user.role === 'CUSTOMER' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Customer Dashboard</h2>
            <div style={styles.cards}>
              <Link to="/book" style={styles.card}>
                <div style={styles.cardIcon}>🚗</div>
                <h3>Book a Service</h3>
                <p>Schedule your car wash</p>
              </Link>
              <Link to="/bookings" style={styles.card}>
                <div style={styles.cardIcon}>📋</div>
                <h3>My Bookings</h3>
                <p>View your appointments</p>
              </Link>
              <Link to="/vehicles" style={styles.card}>
                <div style={styles.cardIcon}>🚙</div>
                <h3>My Vehicles</h3>
                <p>Manage your cars</p>
              </Link>
              <Link to="/profile" style={styles.card}>
                <div style={styles.cardIcon}>👤</div>
                <h3>My Profile</h3>
                <p>Update your information</p>
              </Link>
            </div>
          </div>
        )}

        {/* Staff Dashboard */}
        {user.role === 'STAFF' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Staff Dashboard</h2>
            <p style={styles.message}>Staff dashboard coming soon...</p>
          </div>
        )}

        {/* Admin Dashboard */}
        {user.role === 'ADMIN' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Admin Dashboard</h2>
            <p style={styles.message}>Admin dashboard coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 200px)',
    padding: '20px',
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    marginBottom: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '32px',
    color: '#2c3e50',
    marginBottom: '5px',
  },
  role: {
    fontSize: '16px',
    color: '#7f8c8d',
    backgroundColor: '#ecf0f1',
    padding: '5px 15px',
    borderRadius: '20px',
    display: 'inline-block',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  dashboard: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  section: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '24px',
    color: '#2c3e50',
    marginBottom: '20px',
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  card: {
    backgroundColor: '#f8f9fa',
    padding: '25px',
    borderRadius: '10px',
    textDecoration: 'none',
    color: '#2c3e50',
    transition: 'transform 0.3s, box-shadow 0.3s',
    textAlign: 'center',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    },
  },
  cardIcon: {
    fontSize: '40px',
    marginBottom: '15px',
  },
  message: {
    fontSize: '18px',
    color: '#7f8c8d',
    textAlign: 'center',
    padding: '40px',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: '#7f8c8d',
  },
};

export default Dashboard;
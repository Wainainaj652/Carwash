import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Professional Car Wash Services</h1>
        <p style={styles.heroText}>
          Book your car wash online. Fast, reliable, and eco-friendly service.
        </p>
        <div style={styles.heroButtons}>
          <Link to="/book" style={styles.primaryButton}>
            Book Now
          </Link>
          <Link to="/services" style={styles.secondaryButton}>
            View Services
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Why Choose Us</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.feature}>
            <div style={styles.featureIcon}></div>
            <h3>Convenient Booking</h3>
            <p>Book online 24/7 from anywhere</p>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>💧</div>
            <h3>Eco-Friendly</h3>
            <p>Environmentally safe products</p>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>⭐</div>
            <h3>Quality Service</h3>
            <p>Professional and experienced staff</p>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '70vh',
  },
  hero: {
    background: 'linear-gradient(135deg, #3498db, #2c3e50)',
    color: 'white',
    padding: '4rem 2rem',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  heroText: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    opacity: 0.9,
  },
  heroButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '0.8rem 2rem',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: 'white',
    padding: '0.8rem 2rem',
    borderRadius: '4px',
    textDecoration: 'none',
    border: '2px solid white',
    fontWeight: 'bold',
  },
  features: {
    padding: '4rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '3rem',
    color: '#2c3e50',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
  },
  feature: {
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
};

export default Home;
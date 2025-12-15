import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.section}>
          <h3 style={styles.heading}>Premium Car WashingWash</h3>
          <p style={styles.text}>
            Professional car washing and detailing services with quality and care.
          </p>
        </div>
        
        <div style={styles.section}>
          <h3 style={styles.heading}>Contact Us</h3>
          <p style={styles.text}> +254 759 325 372</p>
          <p style={styles.text}> groupY@gmail.com</p>
        </div>
        
        <div style={styles.section}>
          <h3 style={styles.heading}>Business Hours</h3>
          <p style={styles.text}>Mon-Fri: 8AM - 8PM</p>
          <p style={styles.text}>Sat-Sun: 9AM - 6PM</p>
        </div>
      </div>
      
      <div style={styles.copyright}>
        <p>© 2025 CarWash. All rights reserved.</p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '2rem 0 1rem',
    marginTop: 'auto',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: '2rem',
    padding: '0 1rem',
  },
  section: {
    flex: 1,
    minWidth: '250px',
  },
  heading: {
    fontSize: '1.2rem',
    marginBottom: '1rem',
    color: '#3498db',
  },
  text: {
    marginBottom: '0.5rem',
    lineHeight: '1.6',
  },
  copyright: {
    textAlign: 'center',
    marginTop: '2rem',
    paddingTop: '1rem',
    borderTop: '1px solid #34495e',
    color: '#bdc3c7',
  },
};

export default Footer;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

await axios.get('http://localhost:8080/api/services', {
  params: {
    _t: new Date().getTime()  // Adds ?_t=timestamp to URL
  }
});

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/services');
      setServices(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load services. Please try again.');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format price with 2 decimal places
  const formatPrice = (price) => {
    if (!price) return 'KSH 0.00';
    return `KSH ${parseFloat(price).toFixed(2)}`;
  };

  // Format duration
  const formatDuration = (minutes) => {
    if (!minutes) return '0 mins';
    if (minutes < 60) return `${minutes} mins`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Our Car Wash Services</h1>
        <p style={styles.heroText}>
          Choose from our range of professional car wash and detailing services
        </p>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <p style={styles.loadingText}>Loading services...</p>
          </div>
        ) : error ? (
          <div style={styles.errorContainer}>
            <p style={styles.errorText}>⚠️ {error}</p>
            <button onClick={fetchServices} style={styles.retryButton}>
              Try Again
            </button>
          </div>
        ) : services.length === 0 ? (
          <div style={styles.emptyContainer}>
            <p style={styles.emptyText}>No services available at the moment.</p>
          </div>
        ) : (
          <>
            {/* Services Count */}
            <div style={styles.statsBar}>
              <p style={styles.statsText}>
                Showing <strong>{services.length}</strong> service{services.length !== 1 ? 's' : ''}
              </p>
              <div style={styles.filterNote}>
                All our services use eco-friendly products
              </div>
            </div>

            {/* Services Grid */}
            <div style={styles.servicesGrid}>
              {services.map((service) => (
                <div key={service.id} style={styles.serviceCard}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.serviceName}>{service.name}</h3>
                    <div style={styles.priceBadge}>
                      {formatPrice(service.price)}
                    </div>
                  </div>
                  
                  <div style={styles.serviceDetails}>
                    <div style={styles.duration}>
                      ⏱️ {formatDuration(service.durationMinutes)}
                    </div>
                    <div style={styles.typeBadge}>
                      {service.durationMinutes <= 45 ? 'EXPRESS' : 'STANDARD'}
                    </div>
                  </div>

                  <p style={styles.serviceDescription}>
                    {service.description || 'Professional cleaning service'}
                  </p>

                  <div style={styles.cardFooter}>
                    <Link 
                      to={`/book?service=${service.id}`}
                      style={styles.bookButton}
                    >
                      Book This Service
                    </Link>
                    <Link 
                      to={`/services/${service.id}`}
                      style={styles.detailsLink}
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Booking CTA */}
            <div style={styles.ctaSection}>
              <h2 style={styles.ctaTitle}>Ready to Book?</h2>
              <p style={styles.ctaText}>
                Select a service above or contact us for custom packages
              </p>
              <div style={styles.ctaButtons}>
                <Link to="/book" style={styles.primaryCtaButton}>
                  Book a Service Now
                </Link>
                <a href="tel:0759325372" style={styles.secondaryCtaButton}>
                  📞 Call to Book: 0759 325 372
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 200px)',
    backgroundColor: '#f8f9fa',
  },
  hero: {
    background: 'linear-gradient(135deg, #3498db, #2c3e50)',
    color: 'white',
    padding: '60px 20px',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: '2.8rem',
    marginBottom: '15px',
    fontWeight: '700',
  },
  heroText: {
    fontSize: '1.2rem',
    opacity: 0.9,
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: '1.6',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  loadingSpinner: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px',
  },
  loadingText: {
    fontSize: '18px',
    color: '#7f8c8d',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#ffeaea',
    borderRadius: '10px',
    margin: '20px 0',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: '16px',
    marginBottom: '20px',
  },
  retryButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  emptyContainer: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyText: {
    fontSize: '18px',
    color: '#7f8c8d',
  },
  statsBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '15px 20px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  statsText: {
    fontSize: '16px',
    color: '#2c3e50',
  },
  filterNote: {
    fontSize: '14px',
    color: '#7f8c8d',
    backgroundColor: '#ecf0f1',
    padding: '5px 12px',
    borderRadius: '20px',
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '25px',
    marginBottom: '50px',
  },
  serviceCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    display: 'flex',
    flexDirection: 'column',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
    },
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
  },
  serviceName: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    margin: 0,
    flex: 1,
  },
  priceBadge: {
    backgroundColor: '#2ecc71',
    color: 'white',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '1.3rem',
    fontWeight: 'bold',
    minWidth: '80px',
    textAlign: 'center',
  },
  serviceDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #eee',
  },
  duration: {
    fontSize: '14px',
    color: '#7f8c8d',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  typeBadge: {
    fontSize: '12px',
    color: '#3498db',
    backgroundColor: '#ebf5fb',
    padding: '4px 10px',
    borderRadius: '12px',
    fontWeight: '600',
  },
  serviceDescription: {
    color: '#5d6d7e',
    lineHeight: '1.6',
    flex: 1,
    marginBottom: '20px',
    fontSize: '15px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  bookButton: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '15px',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#2980b9',
    },
  },
  detailsLink: {
    color: '#3498db',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  ctaSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    marginTop: '30px',
  },
  ctaTitle: {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '15px',
  },
  ctaText: {
    fontSize: '1.1rem',
    color: '#7f8c8d',
    marginBottom: '25px',
    maxWidth: '600px',
    margin: '0 auto 25px',
  },
  ctaButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  primaryCtaButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '15px 30px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '16px',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#c0392b',
    },
  },
  secondaryCtaButton: {
    backgroundColor: 'transparent',
    color: '#3498db',
    padding: '15px 30px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '16px',
    border: '2px solid #3498db',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: '#3498db',
      color: 'white',
    },
  },
};

// Add CSS animation for spinner
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);

export default Services;
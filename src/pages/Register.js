import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user types
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email) {
      setError('Email is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.fullName) {
      setError('Full name is required');
      return false;
    }
    if (!formData.phoneNumber) {
      setError('Phone number is required');
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare data for backend
      const userData = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        role: 'CUSTOMER' // Default role for registration
      };

      console.log('Sending register request...', userData);
      
      // Call backend register API
      const response = await axios.post(
        'http://localhost:8080/api/auth/register',
        userData
      );

      console.log('Register response:', response.data);

      // Check if response has token
      if (!response.data.token) {
        throw new Error('No token received from server');
      }

      // Save user data from response
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('email', response.data.email);
      localStorage.setItem('fullName', response.data.fullName);
      localStorage.setItem('role', response.data.role);

      console.log('Data saved to localStorage');

      setSuccess('Account created successfully! Redirecting to dashboard...');

      // Clear form
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        phoneNumber: ''
      });

      // Redirect based on role
      switch(response.data.role) {
        case 'ADMIN':
          setTimeout(() => navigate('/admin'), 1500);
          break;
        case 'STAFF':
          setTimeout(() => navigate('/staff'), 1500);
          break;
        default: // CUSTOMER
          setTimeout(() => navigate('/dashboard'), 1500);
      }

    } catch (err) {
      console.error('Register error:', err);
      console.error('Error response:', err.response);
      
      // Handle different types of errors
      if (err.response) {
        // Backend returned an error
        setError(err.response.data || 'Registration failed');
      } else if (err.request) {
        // Network error
        setError('Network error. Please check your connection.');
      } else {
        // Other errors
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.registerBox}>
        <div style={styles.header}>
          <h2 style={styles.title}>Create Your Account</h2>
          <p style={styles.subtitle}>Join CarWash Pro to book services</p>
        </div>

        {error && (
          <div style={styles.errorBox}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={styles.successBox}>
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleRegister} style={styles.form}>
          {/* Full Name */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Full Name <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              style={styles.input}
              placeholder="John Doe"
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Email Address <span style={styles.required}>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          {/* Phone Number */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Phone Number <span style={styles.required}>*</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              style={styles.input}
              placeholder="0712 345 678"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Password <span style={styles.required}>*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="At least 6 characters"
              disabled={loading}
            />
            <div style={styles.passwordHint}>
              Must be at least 6 characters
            </div>
          </div>

          {/* Confirm Password */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Confirm Password <span style={styles.required}>*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input}
              placeholder="Re-enter your password"
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            style={styles.registerButton}
            disabled={loading}
          >
            {loading ? (
              <span style={styles.loadingText}>Creating Account...</span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerText}>ALREADY HAVE AN ACCOUNT?</span>
        </div>

        <div style={styles.loginSection}>
          <Link to="/login" style={styles.loginLink}>
            ← Back to Login
          </Link>
        </div>

        {/* Terms Section */}
        <div style={styles.termsSection}>
          <p style={styles.termsText}>
            By creating an account, you agree to our{' '}
            <Link to="/terms" style={styles.termsLink}>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" style={styles.termsLink}>
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 200px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: '20px',
  },
  registerBox: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    padding: '40px',
    width: '100%',
    maxWidth: '500px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#7f8c8d',
    margin: 0,
  },
  errorBox: {
    backgroundColor: '#ffeaea',
    color: '#e74c3c',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    border: '1px solid #ffcdd2',
  },
  successBox: {
    backgroundColor: '#e8f7ef',
    color: '#27ae60',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    border: '1px solid #a3e9c1',
  },
  form: {
    marginBottom: '25px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#2c3e50',
  },
  required: {
    color: '#e74c3c',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    transition: 'all 0.3s',
  },
  passwordHint: {
    fontSize: '12px',
    color: '#7f8c8d',
    marginTop: '4px',
    fontStyle: 'italic',
  },
  registerButton: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '10px',
  },
  loadingText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  divider: {
    position: 'relative',
    textAlign: 'center',
    margin: '25px 0',
  },
  dividerText: {
    position: 'relative',
    backgroundColor: 'white',
    padding: '0 15px',
    color: '#7f8c8d',
    fontSize: '14px',
    fontWeight: '600',
  },
  loginSection: {
    textAlign: 'center',
    marginBottom: '25px',
  },
  loginLink: {
    color: '#3498db',
    fontWeight: '600',
    textDecoration: 'none',
    fontSize: '15px',
  },
  termsSection: {
    textAlign: 'center',
    paddingTop: '20px',
    borderTop: '1px solid #f0f0f0',
  },
  termsText: {
    fontSize: '13px',
    color: '#95a5a6',
    lineHeight: '1.5',
  },
  termsLink: {
    color: '#3498db',
    textDecoration: 'none',
  },
};

// Add focus styles
const addFocusStyles = () => {
  const focusStyles = `
    input:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52,152,219,0.2);
    }
    input:disabled {
      backgroundColor: #f5f5f5;
      cursor: not-allowed;
    }
    button:hover:not(:disabled) {
      background-color: #27ae60;
    }
    button:disabled {
      background-color: #bdc3c7;
      cursor: not-allowed;
    }
    a:hover {
      text-decoration: underline;
    }
  `;
  
  const style = document.createElement('style');
  style.textContent = focusStyles;
  document.head.appendChild(style);
};

// Initialize styles when component mounts
if (typeof document !== 'undefined') {
  addFocusStyles();
}

export default Register;
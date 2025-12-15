import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Test credentials function (for quick testing)
  const fillTestCredentials = (userType) => {
    let testEmail = '';
    let testPassword = '';

    switch(userType) {
      case 'customer':
        testEmail = 'customer@test.com';
        testPassword = 'password123';
        break;
      case 'staff':
        testEmail = 'staff@carwash.com';
        testPassword = 'staff123';
        break;
      case 'admin':
        testEmail = 'admin@carwash.com';
        testPassword = 'admin123';
        break;
      default:
        testEmail = 'customer@test.com';
        testPassword = 'password123';
    }

    setEmail(testEmail);
    setPassword(testPassword);
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', email);
      
      // Call backend login API
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: email.trim(),
        password: password
      });

      console.log('Login response:', response.data);

      // Check if response has token
      if (!response.data.token) {
        throw new Error('No token received from server');
      }

      // Save user data to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('email', response.data.email);
      localStorage.setItem('fullName', response.data.fullName);
      localStorage.setItem('role', response.data.role);

      console.log('User data saved to localStorage');
      console.log('Role:', response.data.role);

      // Redirect based on role
      switch(response.data.role) {
        case 'ADMIN':
          console.log('Redirecting to admin dashboard');
          navigate('/admin');
          break;
        case 'STAFF':
          console.log('Redirecting to staff dashboard');
          navigate('/staff');
          break;
        case 'CUSTOMER':
          console.log('Redirecting to customer dashboard');
          navigate('/dashboard');
          break;
        default:
          console.log('Unknown role, redirecting to home');
          navigate('/');
      }

      // Force page reload to update Navbar
      setTimeout(() => {
        window.location.reload();
      }, 100);

    } catch (err) {
      console.error('Login error details:', err);
      console.error('Error response:', err.response);

      if (err.response) {
        // Backend returned an error
        const errorMessage = err.response.data || 'Login failed';
        setError(`Error: ${errorMessage}`);
      } else if (err.request) {
        // Request was made but no response
        setError('Cannot connect to server. Make sure backend is running on http://localhost:8080');
      } else {
        // Something else happened
        setError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <div style={styles.header}>
          <h2 style={styles.title}>Login to CarWash Pro</h2>
          <p style={styles.subtitle}>Access your account to book services</p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={styles.errorBox}>
            <div style={styles.errorIcon}>⚠️</div>
            <div style={styles.errorText}>{error}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="you@example.com"
              required
              disabled={loading}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            style={loading ? styles.loginButtonDisabled : styles.loginButton}
            disabled={loading}
          >
            {loading ? (
              <span style={styles.loading}>
                <span style={styles.spinner}></span>
                Logging in...
              </span>
            ) : (
              'Login to Account'
            )}
          </button>
        </form>

        {/* Quick Test Buttons */}
        <div style={styles.testSection}>
          <p style={styles.testTitle}>Quick Test:</p>
          <div style={styles.testButtons}>
            <button 
              onClick={() => fillTestCredentials('customer')}
              style={styles.testButton}
            >
              Use Customer Account
            </button>
            <button 
              onClick={() => fillTestCredentials('staff')}
              style={styles.testButton}
            >
              Use Staff Account
            </button>
            <button 
              onClick={() => fillTestCredentials('admin')}
              style={styles.testButton}
            >
              Use Admin Account
            </button>
          </div>
        </div>

        <div style={styles.divider}>
          <span style={styles.dividerText}>OR</span>
        </div>

        {/* Register Link */}
        <div style={styles.registerSection}>
          <p style={styles.registerText}>
            Don't have an account?{' '}
            <Link to="/register" style={styles.registerLink}>
              Create one here
            </Link>
          </p>
        </div>

        {/* Debug Info (only in development) */}
        <div style={styles.debugInfo}>
          <p style={styles.debugTitle}>Debug Info:</p>
          <p style={styles.debugText}>
            Backend URL: http://localhost:8080/api/auth/login
          </p>
          <p style={styles.debugText}>
            Current Token: {localStorage.getItem('token') ? 'Present' : 'None'}
          </p>
          <button 
            onClick={() => {
              localStorage.clear();
              console.log('LocalStorage cleared');
              setError('LocalStorage cleared. Try login again.');
            }}
            style={styles.clearButton}
          >
            Clear LocalStorage
          </button>
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
  loginBox: {
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
    border: '1px solid #ffcdd2',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  },
  errorIcon: {
    fontSize: '18px',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: '14px',
    flex: 1,
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
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    transition: 'all 0.3s',
  },
  loginButton: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '10px',
  },
  loginButtonDisabled: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#bdc3c7',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'not-allowed',
    marginTop: '10px',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid #ffffff',
    borderTop: '2px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  testSection: {
    marginBottom: '25px',
  },
  testTitle: {
    fontSize: '14px',
    color: '#7f8c8d',
    marginBottom: '10px',
    textAlign: 'center',
  },
  testButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  testButton: {
    padding: '10px',
    backgroundColor: '#ecf0f1',
    color: '#2c3e50',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
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
  },
  registerSection: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  registerText: {
    fontSize: '15px',
    color: '#7f8c8d',
  },
  registerLink: {
    color: '#3498db',
    fontWeight: '600',
    textDecoration: 'none',
  },
  debugInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '15px',
    marginTop: '20px',
    fontSize: '12px',
    color: '#7f8c8d',
  },
  debugTitle: {
    fontWeight: '600',
    marginBottom: '5px',
    color: '#2c3e50',
  },
  debugText: {
    marginBottom: '5px',
    wordBreak: 'break-all',
  },
  clearButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
    marginTop: '5px',
  },
};

// Add CSS animation for spinner
if (typeof document !== 'undefined') {
  const spinAnimation = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    input:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52,152,219,0.2);
    }
    
    input:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }
    
    button:hover:not(:disabled) {
      opacity: 0.9;
    }
    
    .testButton:hover {
      background-color: #d5dbdb;
    }
    
    .registerLink:hover {
      text-decoration: underline;
    }
  `;
  
  const style = document.createElement('style');
  style.textContent = spinAnimation;
  document.head.appendChild(style);
}

export default Login;
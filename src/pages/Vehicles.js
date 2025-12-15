import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    licensePlate: '',
    color: '',
    type: 'SEDAN'
  });

  // Fetch user's vehicles - defined with useCallback
  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:8080/api/vehicles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setVehicles(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        localStorage.clear();
        navigate('/login');
      } else {
        setError('Failed to load vehicles. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchVehicles();
  }, [navigate, fetchVehicles]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Add new vehicle
  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post('http://localhost:8080/api/vehicles', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Add new vehicle to list
      setVehicles([...vehicles, response.data]);
      
      // Reset form and hide it
      setFormData({
        make: '',
        model: '',
        licensePlate: '',
        color: '',
        type: 'SEDAN'
      });
      setShowAddForm(false);
      
      alert('Vehicle added successfully!');
    } catch (err) {
      console.error('Error adding vehicle:', err);
      setError(err.response?.data || 'Failed to add vehicle. Please try again.');
    }
  };

  // Delete vehicle
  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`http://localhost:8080/api/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}`}
      });

      // Remove vehicle from list
      setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
      alert('Vehicle deleted successfully!');
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      setError('Failed to delete vehicle. Please try again.');
    }
  };

  // Vehicle types
  const vehicleTypes = ['SEDAN', 'SUV', 'TRUCK', 'VAN', 'MOTORCYCLE'];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Vehicles</h1>
        <p style={styles.subtitle}>Manage your vehicles for booking car wash services</p>
      </div>

      {/* Error Message */}
      {error && (
        <div style={styles.errorBox}>
          ⚠️ {error}
        </div>
      )}

      {/* Add Vehicle Button */}
      <div style={styles.addButtonContainer}>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={styles.addButton}
        >
          {showAddForm ? 'Cancel' : '+ Add New Vehicle'}
        </button>
      </div>

      {/* Add Vehicle Form */}
      {showAddForm && (
        <div style={styles.formContainer}>
          <h3 style={styles.formTitle}>Add New Vehicle</h3>
          <form onSubmit={handleAddVehicle} style={styles.form}>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Make (Brand)*</label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="e.g., Toyota"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Model*</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="e.g., Camry"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>License Plate*</label>
                <input
                  type="text"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="e.g., ABC 123"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Color*</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="e.g., White"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Vehicle Type*</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  style={styles.select}
                  required
                >
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.formActions}>
              <button type="submit" style={styles.submitButton}>
                Add Vehicle
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vehicles List */}
      <div style={styles.vehiclesContainer}>
        {loading ? (
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <p>Loading vehicles...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🚗</div>
            <h3>No vehicles yet</h3>
            <p>Add your first vehicle to book car wash services</p>
            <button
              onClick={() => setShowAddForm(true)}
              style={styles.emptyButton}
            >
              Add Your First Vehicle
            </button>
          </div>
        ) : (
          <div style={styles.vehiclesGrid}>
            {vehicles.map(vehicle => (
              <div key={vehicle.id} style={styles.vehicleCard}>
                <div style={styles.cardHeader}>
                  <div style={styles.vehicleIcon}>
                    {vehicle.type === 'SUV' ? '🚙' : 
                     vehicle.type === 'TRUCK' ? '🚚' : 
                     vehicle.type === 'MOTORCYCLE' ? '🏍️' : '🚗'}
                  </div>
                  <div style={styles.vehicleInfo}>
                    <h3 style={styles.vehicleName}>
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <p style={styles.vehicleType}>{vehicle.type}</p>
                  </div>
                </div>

                <div style={styles.cardDetails}>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>License Plate:</span>
                    <span style={styles.detailValue}>{vehicle.licensePlate}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Color:</span>
                    <span style={styles.detailValue}>{vehicle.color}</span>
                  </div>
                </div>

                <div style={styles.cardActions}>
                  <button
                    onClick={() => navigate(`/book?vehicle=${vehicle.id}`)}
                    style={styles.bookButton}
                  >
                    Book Service
                  </button>
                  <button
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
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
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '2.5rem',
    color: '#2c3e50',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#7f8c8d',
  },
  errorBox: {
    backgroundColor: '#ffeaea',
    color: '#e74c3c',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto',
  },
  addButtonContainer: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  addButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    maxWidth: '800px',
    margin: '0 auto 30px',
  },
  formTitle: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '20px',
    textAlign: 'center',
  },
  form: {
    marginBottom: '0',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '25px',
  },
  formGroup: {
    marginBottom: '0',
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
    padding: '12px 15px',
    fontSize: '16px',
    border: '2px solid #e0e0e0',
    borderRadius: '6px',
    transition: 'all 0.3s',
  },
  select: {
    width: '100%',
    padding: '12px 15px',
    fontSize: '16px',
    border: '2px solid #e0e0e0',
    borderRadius: '6px',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
  },
  submitButton: {
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  vehiclesContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
  },
  spinner: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  emptyIcon: {
    fontSize: '60px',
    marginBottom: '20px',
  },
  emptyButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '20px',
  },
  vehiclesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '25px',
  },
  vehicleCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '20px',
  },
  vehicleIcon: {
    fontSize: '40px',
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: '1.3rem',
    color: '#2c3e50',
    margin: '0 0 5px 0',
  },
  vehicleType: {
    fontSize: '14px',
    color: '#7f8c8d',
    backgroundColor: '#ecf0f1',
    padding: '4px 10px',
    borderRadius: '12px',
    display: 'inline-block',
  },
  cardDetails: {
    marginBottom: '20px',
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    paddingBottom: '10px',
    borderBottom: '1px solid #f0f0f0',
  },
  detailLabel: {
    fontSize: '14px',
    color: '#7f8c8d',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: '14px',
    color: '#2c3e50',
    fontWeight: '600',
  },
  cardActions: {
    display: 'flex',
    gap: '10px',
  },
  bookButton: {
    flex: 1,
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

// Add CSS animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    input:focus, select:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52,152,219,0.2);
    }
    
    button:hover {
      opacity: 0.9;
    }
    
    .vehicleCard:hover {
      transform: translateY(-5px);
    }
  `;
  document.head.appendChild(style);
}

export default Vehicles;
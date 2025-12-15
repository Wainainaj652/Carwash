import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Book = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form data
    const [bookingData, setBookingData] = useState({
        serviceId: '',
        vehicleId: '',
        bookingDateTime: '',
        notes: ''
    });

    useEffect(() => {
        checkAuth();
        loadServices();
        loadVehicles();
    }, []);

    const checkAuth = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    };

    const loadServices = async () => {
        try {
            const response = await api.get('/services');
            setServices(response.data);
        } catch (error) {
            console.error('Failed to load services:', error);
            setError('Failed to load services');
        }
    };

    const loadVehicles = async () => {
        try {
            const response = await api.get('/vehicles');
            setVehicles(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to load vehicles:', error);
            setError('You need to add a vehicle first');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!bookingData.serviceId || !bookingData.vehicleId || !bookingData.bookingDateTime) {
            setError('Please fill all required fields');
            return;
        }

        try {
            await api.post('/bookings', bookingData);
            setSuccess('Booking created successfully!');
            setError('');
            
            // Reset form
            setBookingData({
                serviceId: '',
                vehicleId: '',
                bookingDateTime: '',
                notes: ''
            });

            // Redirect to bookings page after 2 seconds
            setTimeout(() => {
                navigate('/bookings');
            }, 2000);

        } catch (error) {
            setError(error.response?.data || 'Failed to create booking');
            setSuccess('');
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Book a Service</h1>
                <p style={styles.subtitle}>Schedule your car wash appointment</p>
            </div>

            {error && (
                <div style={styles.alertError}>
                    {error}
                    {error.includes('vehicle') && (
                        <button 
                            onClick={() => navigate('/vehicles')}
                            style={styles.addVehicleBtn}
                        >
                            Add Vehicle Now
                        </button>
                    )}
                </div>
            )}

            {success && (
                <div style={styles.alertSuccess}>{success}</div>
            )}

            <div style={styles.formContainer}>
                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* Service Selection */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            Select Service *
                        </label>
                        <select
                            value={bookingData.serviceId}
                            onChange={(e) => setBookingData({...bookingData, serviceId: e.target.value})}
                            required
                            style={styles.select}
                        >
                            <option value="">Choose a service</option>
                            {services.map(service => (
                                <option key={service.id} value={service.id}>
                                    {service.name} - ${service.price} ({service.durationMinutes} mins)
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Vehicle Selection */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            Select Vehicle *
                        </label>
                        {vehicles.length === 0 ? (
                            <div style={styles.noVehicles}>
                                <p>No vehicles found. Please add a vehicle first.</p>
                                <button 
                                    type="button"
                                    onClick={() => navigate('/vehicles')}
                                    style={styles.primaryButton}
                                >
                                    Add Vehicle
                                </button>
                            </div>
                        ) : (
                            <select
                                value={bookingData.vehicleId}
                                onChange={(e) => setBookingData({...bookingData, vehicleId: e.target.value})}
                                required
                                style={styles.select}
                            >
                                <option value="">Choose a vehicle</option>
                                {vehicles.map(vehicle => (
                                    <option key={vehicle.id} value={vehicle.id}>
                                        {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Date & Time */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            Date & Time *
                        </label>
                        <input
                            type="datetime-local"
                            value={bookingData.bookingDateTime}
                            onChange={(e) => setBookingData({...bookingData, bookingDateTime: e.target.value})}
                            required
                            style={styles.input}
                            min={new Date().toISOString().slice(0, 16)}
                        />
                        <small style={styles.helperText}>
                            Select a future date and time
                        </small>
                    </div>

                    {/* Notes */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            Additional Notes
                        </label>
                        <textarea
                            value={bookingData.notes}
                            onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                            placeholder="Any special instructions or requests..."
                            style={styles.textarea}
                            rows="4"
                        />
                    </div>

                    {/* Selected Service Details */}
                    {bookingData.serviceId && (
                        <div style={styles.servicePreview}>
                            <h3>Selected Service:</h3>
                            {services
                                .filter(s => s.id == bookingData.serviceId)
                                .map(service => (
                                    <div key={service.id} style={styles.serviceCard}>
                                        <h4>{service.name}</h4>
                                        <p>{service.description}</p>
                                        <div style={styles.serviceDetails}>
                                            <span>Price: ${service.price}</span>
                                            <span>Duration: {service.durationMinutes} minutes</span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )}

                    {/* Submit Button */}
                    <div style={styles.formGroup}>
                        <button 
                            type="submit" 
                            style={styles.submitButton}
                            disabled={vehicles.length === 0}
                        >
                            Book Now
                        </button>
                    </div>
                </form>

                {/* Services Preview */}
                <div style={styles.servicesPreview}>
                    <h3>Available Services</h3>
                    <div style={styles.servicesGrid}>
                        {services.map(service => (
                            <div 
                                key={service.id} 
                                style={{
                                    ...styles.serviceCardPreview,
                                    borderColor: bookingData.serviceId == service.id ? '#667eea' : '#ddd'
                                }}
                                onClick={() => setBookingData({...bookingData, serviceId: service.id})}
                            >
                                <h4 style={styles.serviceName}>{service.name}</h4>
                                <p style={styles.serviceDesc}>{service.description}</p>
                                <div style={styles.servicePrice}>
                                    <span style={styles.price}>${service.price}</span>
                                    <span style={styles.duration}>{service.durationMinutes} mins</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
    },
    header: {
        textAlign: 'center',
        marginBottom: '40px',
    },
    title: {
        fontSize: '36px',
        color: '#2c3e50',
        marginBottom: '10px',
    },
    subtitle: {
        fontSize: '18px',
        color: '#7f8c8d',
    },
    alertError: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    alertSuccess: {
        backgroundColor: '#d4edda',
        color: '#155724',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
    },
    addVehicleBtn: {
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    formContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        marginTop: '20px',
    },
    form: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    formGroup: {
        marginBottom: '25px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600',
        color: '#2c3e50',
        fontSize: '16px',
    },
    select: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '16px',
        backgroundColor: 'white',
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '16px',
    },
    textarea: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '16px',
        fontFamily: 'inherit',
        resize: 'vertical',
    },
    helperText: {
        display: 'block',
        marginTop: '5px',
        color: '#7f8c8d',
        fontSize: '14px',
    },
    noVehicles: {
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        textAlign: 'center',
    },
    primaryButton: {
        backgroundColor: '#667eea',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '6px',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: '600',
    },
    servicePreview: {
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
    },
    serviceCard: {
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        marginTop: '10px',
    },
    serviceDetails: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '10px',
        color: '#2c3e50',
        fontWeight: '500',
    },
    submitButton: {
        backgroundColor: '#667eea',
        color: 'white',
        border: 'none',
        padding: '15px 30px',
        borderRadius: '6px',
        fontSize: '18px',
        cursor: 'pointer',
        fontWeight: '600',
        width: '100%',
        transition: 'background-color 0.3s',
    },
    servicesPreview: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    servicesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '20px',
    },
    serviceCardPreview: {
        border: '2px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 0.3s',
        backgroundColor: '#f8f9fa',
    },
    serviceName: {
        margin: '0 0 10px 0',
        color: '#2c3e50',
        fontSize: '18px',
    },
    serviceDesc: {
        margin: '0 0 15px 0',
        color: '#7f8c8d',
        fontSize: '14px',
        lineHeight: '1.5',
    },
    servicePrice: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#28a745',
    },
    duration: {
        backgroundColor: '#e9ecef',
        color: '#495057',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '14px',
    },
    loading: {
        textAlign: 'center',
        padding: '50px',
        fontSize: '20px',
        color: '#7f8c8d',
    },
};

export default Book;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const MyBookings = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [debugInfo, setDebugInfo] = useState('');

    useEffect(() => {
        checkAuth();
        loadBookings();
    }, []);

    const checkAuth = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return false;
        }
        return true;
    };

    const loadBookings = async () => {
        try {
            console.log('🔄 Loading bookings...');
            
            // Try the exact endpoint from your controller
            const response = await api.get('/bookings/my-bookings');
            
            console.log('📦 API Response:', response);
            console.log('📦 Response data:', response.data);
            
            setDebugInfo(`Status: ${response.status}, Data Type: ${typeof response.data}, Length: ${response.data?.length || 0}`);
            
            if (response.data && Array.isArray(response.data)) {
                setBookings(response.data);
                console.log(`✅ Loaded ${response.data.length} bookings`);
            } else {
                console.warn('⚠️ Response data is not an array:', response.data);
                setBookings([]);
            }
            
            setLoading(false);
        } catch (error) {
            console.error('❌ Failed to load bookings:', error);
            console.error('❌ Error response:', error.response);
            
            setDebugInfo(`Error: ${error.message}, Status: ${error.response?.status}`);
            setError(`Failed to load bookings: ${error.response?.data || error.message}`);
            setLoading(false);
            
            // Try alternative endpoint
            tryAlternativeEndpoint();
        }
    };

    const tryAlternativeEndpoint = async () => {
        try {
            console.log('🔄 Trying alternative endpoint: /bookings');
            const response = await api.get('/bookings');
            console.log('Alternative response:', response);
            
            if (response.data && Array.isArray(response.data)) {
                setBookings(response.data);
                setError('');
                setDebugInfo(prev => prev + ' | Using /bookings endpoint');
            }
        } catch (altError) {
            console.error('Alternative endpoint also failed:', altError);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            await api.put(`/bookings/${bookingId}/status`, { status: 'CANCELLED' });
            
            // Update local state
            setBookings(bookings.map(booking => 
                booking.id === bookingId 
                    ? { ...booking, status: 'CANCELLED' }
                    : booking
            ));
            
            alert('Booking cancelled successfully!');
        } catch (error) {
            console.error('Cancel error:', error);
            alert(`Failed to cancel booking: ${error.response?.data || error.message}`);
        }
    };

    // Debug function to see booking structure
    const debugBooking = (booking) => {
        console.log('🔍 Booking details:', booking);
        console.log('Service:', booking.service);
        console.log('Vehicle:', booking.vehicle);
        console.log('Status:', booking.status);
        alert(JSON.stringify(booking, null, 2));
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <h1>My Bookings</h1>
                <div style={styles.loading}>
                    <div style={styles.spinner}></div>
                    <p>Loading your bookings...</p>
                    <p style={styles.debug}>{debugInfo}</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>My Bookings</h1>
                <button 
                    onClick={() => navigate('/book')}
                    style={styles.newBookingBtn}
                >
                    + New Booking
                </button>
            </div>

            {error && (
                <div style={styles.alertError}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Debug info */}
            <div style={styles.debugInfo}>
                <p><strong>Debug Info:</strong> {debugInfo}</p>
                <p><strong>Bookings Count:</strong> {bookings.length}</p>
                <button 
                    onClick={() => {
                        console.log('All bookings:', bookings);
                        alert(JSON.stringify(bookings, null, 2));
                    }}
                    style={styles.debugButton}
                >
                    Show Raw Data
                </button>
                <button 
                    onClick={loadBookings}
                    style={styles.debugButton}
                >
                    Reload Data
                </button>
            </div>

            {bookings.length === 0 ? (
                <div style={styles.noBookings}>
                    <h2>No bookings found</h2>
                    <p>You haven't made any bookings yet.</p>
                    <button 
                        onClick={() => navigate('/book')}
                        style={styles.primaryButton}
                    >
                        Book Your First Service
                    </button>
                </div>
            ) : (
                <div>
                    <h2 style={styles.subtitle}>You have {bookings.length} booking{bookings.length !== 1 ? 's' : ''}</h2>
                    
                    {bookings.map((booking, index) => (
                        <div key={booking.id || index} style={styles.bookingCard}>
                            <div style={styles.bookingHeader}>
                                <h3 style={styles.bookingTitle}>
                                    Booking #{booking.id || 'N/A'} 
                                    <button 
                                        onClick={() => debugBooking(booking)}
                                        style={styles.debugSmallButton}
                                    >
                                        🔍
                                    </button>
                                </h3>
                                <span style={{
                                    ...styles.statusBadge,
                                    backgroundColor: booking.status === 'PENDING' ? '#ffc107' :
                                                   booking.status === 'CONFIRMED' ? '#17a2b8' :
                                                   booking.status === 'COMPLETED' ? '#28a745' :
                                                   booking.status === 'CANCELLED' ? '#dc3545' : '#6c757d'
                                }}>
                                    {booking.status || 'UNKNOWN'}
                                </span>
                            </div>

                            <div style={styles.bookingDetails}>
                                {/* Service Info */}
                                <div style={styles.detailRow}>
                                    <strong>Service:</strong>
                                    <span>
                                        {booking.service?.name || 'Service'}
                                        {booking.service?.price && ` - $${booking.service.price}`}
                                    </span>
                                </div>

                                {/* Vehicle Info */}
                                <div style={styles.detailRow}>
                                    <strong>Vehicle:</strong>
                                    <span>
                                        {booking.vehicle?.make || 'Make'} {booking.vehicle?.model || 'Model'}
                                        {booking.vehicle?.licensePlate && ` (${booking.vehicle.licensePlate})`}
                                    </span>
                                </div>

                                {/* Date & Time */}
                                <div style={styles.detailRow}>
                                    <strong>Date & Time:</strong>
                                    <span>
                                        {booking.bookingDateTime 
                                            ? new Date(booking.bookingDateTime).toLocaleString()
                                            : 'Not specified'
                                        }
                                    </span>
                                </div>

                                {/* Notes */}
                                {booking.notes && (
                                    <div style={styles.detailRow}>
                                        <strong>Notes:</strong>
                                        <span style={styles.notes}>{booking.notes}</span>
                                    </div>
                                )}

                                {/* Rating */}
                                {booking.rating && (
                                    <div style={styles.detailRow}>
                                        <strong>Rating:</strong>
                                        <span style={styles.rating}>
                                            {'★'.repeat(booking.rating)}{'☆'.repeat(5 - booking.rating)}
                                            {booking.review && ` - "${booking.review}"`}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div style={styles.bookingActions}>
                                {booking.status === 'PENDING' && (
                                    <button 
                                        onClick={() => handleCancelBooking(booking.id)}
                                        style={styles.cancelBtn}
                                    >
                                        Cancel
                                    </button>
                                )}
                                
                                {booking.status === 'COMPLETED' && !booking.rating && (
                                    <button 
                                        onClick={() => {
                                            const rating = prompt('Rate (1-5):');
                                            const review = prompt('Review (optional):');
                                            if (rating) {
                                                // Here you would call the rate API
                                                alert(`Would rate ${rating} stars: ${review}`);
                                            }
                                        }}
                                        style={styles.rateBtn}
                                    >
                                        Rate
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    title: {
        fontSize: '32px',
        color: '#333',
        margin: 0,
    },
    subtitle: {
        fontSize: '20px',
        color: '#666',
        marginBottom: '20px',
    },
    newBookingBtn: {
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
    },
    alertError: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px',
        border: '1px solid #f5c6cb',
    },
    debugInfo: {
        backgroundColor: '#e9ecef',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px',
        fontSize: '14px',
        color: '#495057',
    },
    debugButton: {
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '3px',
        margin: '5px',
        fontSize: '12px',
        cursor: 'pointer',
    },
    debugSmallButton: {
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '12px',
        cursor: 'pointer',
        marginLeft: '10px',
    },
    noBookings: {
        textAlign: 'center',
        padding: '50px 20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        border: '2px dashed #dee2e6',
    },
    primaryButton: {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '20px',
    },
    bookingCard: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #dee2e6',
    },
    bookingHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
        paddingBottom: '15px',
        borderBottom: '1px solid #eee',
    },
    bookingTitle: {
        margin: 0,
        color: '#333',
        fontSize: '20px',
    },
    statusBadge: {
        padding: '5px 15px',
        borderRadius: '20px',
        color: 'white',
        fontSize: '14px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    bookingDetails: {
        marginBottom: '15px',
    },
    detailRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px',
        padding: '5px 0',
    },
    notes: {
        fontStyle: 'italic',
        color: '#666',
    },
    rating: {
        color: '#ffc107',
    },
    bookingActions: {
        display: 'flex',
        gap: '10px',
    },
    cancelBtn: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    rateBtn: {
        backgroundColor: '#ffc107',
        color: '#212529',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    loading: {
        textAlign: 'center',
        padding: '50px',
    },
    spinner: {
        border: '5px solid #f3f3f3',
        borderTop: '5px solid #3498db',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px',
    },
    debug: {
        fontSize: '12px',
        color: '#666',
        marginTop: '10px',
    },
};

// Add spinner animation
const styleSheet = document.styleSheets[0];
if (styleSheet) {
    styleSheet.insertRule(`
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `, styleSheet.cssRules.length);
}

export default MyBookings;
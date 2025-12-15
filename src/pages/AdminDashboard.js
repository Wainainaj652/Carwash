import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('stats');
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);
    const [services, setServices] = useState([]);
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    
    // Service editing states
    const [editingService, setEditingService] = useState(null);
    const [newService, setNewService] = useState({
        name: '',
        description: '',
        price: '',
        durationMinutes: '',
        currency: 'KES'
    });
    
    // Stats
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCustomers: 0,
        totalStaff: 0,
        totalAdmins: 0,
        totalBookings: 0,
        pendingBookings: 0,
        completedBookings: 0,
        totalRevenue: 0,
        currency: 'KES'
    });
    
    const currencySymbols = {
        'KES': 'KSh',
        'USD': '$',
        'EUR': '€'
    };

    useEffect(() => {
        checkAdminAccess();
        loadUserProfile();
    }, []);

    useEffect(() => {
        if (activeTab === 'stats') {
            loadDashboardStats();
        } else if (activeTab === 'services') {
            loadServices();
        } else if (activeTab === 'users') {
            loadUsers();
        } else if (activeTab === 'bookings') {
            loadBookings();
        }
    }, [activeTab]);

    const checkAdminAccess = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.role !== 'ADMIN') {
                navigate('/dashboard');
                return;
            }

            setLoading(false);
        } catch (error) {
            console.error('Access check failed:', error);
            navigate('/login');
        }
    };

    const loadUserProfile = async () => {
        try {
            const response = await api.get('/users/profile');
            setUserProfile(response.data);
        } catch (error) {
            console.error('Failed to load profile:', error);
        }
    };

    const loadDashboardStats = async () => {
        try {
            // Mock stats for now
            const mockStats = {
                totalUsers: 45,
                totalCustomers: 32,
                totalStaff: 10,
                totalAdmins: 3,
                totalBookings: 156,
                pendingBookings: 12,
                completedBookings: 120,
                totalRevenue: 254700,
                currency: 'KES'
            };
            setStats(mockStats);
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    };

    const loadServices = async () => {
        try {
            const response = await api.get('/services');
            setServices(response.data);
        } catch (error) {
            console.error('Failed to load services:', error);
        }
    };

    const loadUsers = async () => {
        try {
            // We'll implement this when we have the endpoint
            const mockUsers = [
                { id: 1, fullName: 'John Customer', email: 'john@test.com', role: 'CUSTOMER', active: true },
                { id: 2, fullName: 'Jane Staff', email: 'jane@carwash.com', role: 'STAFF', active: true },
                { id: 3, fullName: 'Admin User', email: 'admin@carwash.com', role: 'ADMIN', active: true }
            ];
            setUsers(mockUsers);
        } catch (error) {
            console.error('Failed to load users:', error);
        }
    };

    const loadBookings = async () => {
        try {
            // We'll implement this when we have the endpoint
            const mockBookings = [
                { id: 1, customerName: 'John Customer', serviceName: 'Premium Wash', price: 1500, status: 'COMPLETED', date: '2024-01-15' },
                { id: 2, customerName: 'Mary Client', serviceName: 'Interior Cleaning', price: 2000, status: 'PENDING', date: '2024-01-16' }
            ];
            setBookings(mockBookings);
        } catch (error) {
            console.error('Failed to load bookings:', error);
        }
    };

    const handleCreateService = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/services', newService);
            setServices([...services, response.data]);
            setNewService({
                name: '',
                description: '',
                price: '',
                durationMinutes: '',
                currency: 'KES'
            });
            alert('Service created successfully!');
        } catch (error) {
            console.error('Failed to create service:', error);
            alert('Failed to create service: ' + (error.response?.data || error.message));
        }
    };

    const handleUpdateService = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/services/${editingService.id}`, editingService);
            setServices(services.map(s => s.id === editingService.id ? response.data : s));
            setEditingService(null);
            alert('Service updated successfully!');
        } catch (error) {
            console.error('Failed to update service:', error);
            alert('Failed to update service: ' + (error.response?.data || error.message));
        }
    };

    const handleDeleteService = async (serviceId) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            try {
                await api.delete(`/services/${serviceId}`);
                setServices(services.filter(s => s.id !== serviceId));
                alert('Service deleted successfully!');
            } catch (error) {
                console.error('Failed to delete service:', error);
                alert('Failed to delete service: ' + (error.response?.data || error.message));
            }
        }
    };

    const formatPrice = (price, currency = 'KES') => {
        const symbol = currencySymbols[currency] || currency;
        if (currency === 'KES') {
            return `${symbol} ${parseInt(price).toLocaleString()}`;
        }
        return `${symbol}${parseFloat(price).toFixed(2)}`;
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) {
        return (
            <div style={styles.loading}>
                <div style={styles.spinner}></div>
                <p>Loading Admin Dashboard...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>System Administration</h1>
                    <p style={styles.subtitle}>
                        Welcome, <strong>{userProfile?.fullName || 'Admin'}</strong> | 
                        Currency: <strong>Kenya Shilling (KES)</strong>
                    </p>
                </div>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                    Logout
                </button>
            </div>

            {/* Admin Navigation */}
            <div style={styles.adminNav}>
                <button 
                    style={{...styles.navBtn, ...(activeTab === 'stats' && styles.activeNavBtn)}}
                    onClick={() => setActiveTab('stats')}
                >
                    📊 Statistics
                </button>
                <button 
                    style={{...styles.navBtn, ...(activeTab === 'users' && styles.activeNavBtn)}}
                    onClick={() => setActiveTab('users')}
                >
                    👥 User Management
                </button>
                <button 
                    style={{...styles.navBtn, ...(activeTab === 'services' && styles.activeNavBtn)}}
                    onClick={() => setActiveTab('services')}
                >
                    🧼 Service Management
                </button>
                <button 
                    style={{...styles.navBtn, ...(activeTab === 'bookings' && styles.activeNavBtn)}}
                    onClick={() => setActiveTab('bookings')}
                >
                    📅 Booking Management
                </button>
            </div>

            {/* Content Area */}
            <div style={styles.content}>
                {activeTab === 'stats' && (
                    <div>
                        <h2 style={styles.sectionTitle}>System Statistics (KES)</h2>
                        <div style={styles.statsGrid}>
                            <div style={styles.statCard}>
                                <h3 style={styles.statTitle}>👥 Users</h3>
                                <p style={styles.statNumber}>{stats.totalUsers}</p>
                                <div style={styles.statDetails}>
                                    <span>Customers: {stats.totalCustomers}</span>
                                    <span>Staff: {stats.totalStaff}</span>
                                    <span>Admins: {stats.totalAdmins}</span>
                                </div>
                            </div>
                            <div style={styles.statCard}>
                                <h3 style={styles.statTitle}>📅 Bookings</h3>
                                <p style={styles.statNumber}>{stats.totalBookings}</p>
                                <div style={styles.statDetails}>
                                    <span>Pending: {stats.pendingBookings}</span>
                                    <span>Completed: {stats.completedBookings}</span>
                                </div>
                            </div>
                            <div style={styles.statCard}>
                                <h3 style={styles.statTitle}>💰 Revenue</h3>
                                <p style={styles.statNumber}>{formatPrice(stats.totalRevenue, stats.currency)}</p>
                                <div style={styles.statDetails}>
                                    <span>From completed bookings</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'services' && (
                    <div>
                        <h2 style={styles.sectionTitle}>Service Management</h2>
                        
                        {/* Create New Service Form */}
                        <div style={styles.formCard}>
                            <h3 style={styles.formTitle}>
                                {editingService ? 'Edit Service' : 'Create New Service'}
                            </h3>
                            <form onSubmit={editingService ? handleUpdateService : handleCreateService}>
                                <div style={styles.formGrid}>
                                    <input
                                        type="text"
                                        placeholder="Service Name"
                                        value={editingService ? editingService.name : newService.name}
                                        onChange={(e) => editingService 
                                            ? setEditingService({...editingService, name: e.target.value})
                                            : setNewService({...newService, name: e.target.value})
                                        }
                                        required
                                        style={styles.input}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Price (KES)"
                                        value={editingService ? editingService.price : newService.price}
                                        onChange={(e) => editingService 
                                            ? setEditingService({...editingService, price: e.target.value})
                                            : setNewService({...newService, price: e.target.value})
                                        }
                                        required
                                        style={styles.input}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Duration (minutes)"
                                        value={editingService ? editingService.durationMinutes : newService.durationMinutes}
                                        onChange={(e) => editingService 
                                            ? setEditingService({...editingService, durationMinutes: e.target.value})
                                            : setNewService({...newService, durationMinutes: e.target.value})
                                        }
                                        required
                                        style={styles.input}
                                    />
                                    <select
                                        value={editingService ? editingService.currency : newService.currency}
                                        onChange={(e) => editingService 
                                            ? setEditingService({...editingService, currency: e.target.value})
                                            : setNewService({...newService, currency: e.target.value})
                                        }
                                        style={styles.input}
                                    >
                                        <option value="KES">Kenya Shilling (KES)</option>
                                        <option value="USD">US Dollar (USD)</option>
                                        <option value="EUR">Euro (EUR)</option>
                                    </select>
                                </div>
                                <textarea
                                    placeholder="Service Description"
                                    value={editingService ? editingService.description : newService.description}
                                    onChange={(e) => editingService 
                                        ? setEditingService({...editingService, description: e.target.value})
                                        : setNewService({...newService, description: e.target.value})
                                    }
                                    required
                                    style={styles.textarea}
                                    rows="4"
                                />
                                <div style={styles.formActions}>
                                    <button type="submit" style={styles.submitBtn}>
                                        {editingService ? 'Update Service' : 'Create Service'}
                                    </button>
                                    {editingService && (
                                        <button 
                                            type="button"
                                            onClick={() => setEditingService(null)}
                                            style={styles.cancelBtn}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Services List */}
                        <div style={styles.servicesList}>
                            <h3 style={styles.listTitle}>All Services ({services.length})</h3>
                            <div style={styles.servicesGrid}>
                                {services.map(service => (
                                    <div key={service.id} style={styles.serviceCard}>
                                        <div style={styles.serviceHeader}>
                                            <h4 style={styles.serviceName}>{service.name}</h4>
                                            <div style={styles.serviceActions}>
                                                <button 
                                                    onClick={() => setEditingService(service)}
                                                    style={styles.editBtn}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteService(service.id)}
                                                    style={styles.deleteBtn}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                        <p style={styles.serviceDescription}>{service.description}</p>
                                        <div style={styles.serviceDetails}>
                                            <div style={styles.priceSection}>
                                                <span style={styles.priceLabel}>Price:</span>
                                                <span style={styles.priceValue}>
                                                    {formatPrice(service.price, service.currency || 'KES')}
                                                </span>
                                            </div>
                                            <div style={styles.durationSection}>
                                                <span style={styles.durationLabel}>Duration:</span>
                                                <span style={styles.durationValue}>{service.durationMinutes} minutes</span>
                                            </div>
                                            <div style={styles.currencySection}>
                                                <span style={styles.currencyLabel}>Currency:</span>
                                                <span style={styles.currencyValue}>
                                                    {service.currency || 'KES'} ({currencySymbols[service.currency || 'KES']})
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div>
                        <h2 style={styles.sectionTitle}>User Management</h2>
                        <div style={styles.placeholder}>
                            <p>👥 User management features coming soon...</p>
                            <div style={styles.featureGrid}>
                                <div style={styles.featureCard}>
                                    <h4>View All Users</h4>
                                    <p>See all customers, staff, and admins</p>
                                </div>
                                <div style={styles.featureCard}>
                                    <h4>Create Staff Accounts</h4>
                                    <p>Add new staff members</p>
                                </div>
                                <div style={styles.featureCard}>
                                    <h4>Manage Roles</h4>
                                    <p>Change user roles and permissions</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'bookings' && (
                    <div>
                        <h2 style={styles.sectionTitle}>Booking Management</h2>
                        <div style={styles.placeholder}>
                            <p>📅 Booking management features coming soon...</p>
                            <div style={styles.featureGrid}>
                                <div style={styles.featureCard}>
                                    <h4>View All Bookings</h4>
                                    <p>See all customer appointments</p>
                                </div>
                                <div style={styles.featureCard}>
                                    <h4>Assign Staff</h4>
                                    <p>Assign bookings to staff members</p>
                                </div>
                                <div style={styles.featureCard}>
                                    <h4>Update Status</h4>
                                    <p>Change booking status</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    title: {
        margin: 0,
        fontSize: '28px',
        fontWeight: 'bold',
    },
    subtitle: {
        margin: '5px 0 0 0',
        color: '#bdc3c7',
        fontSize: '14px',
    },
    logoutBtn: {
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
        transition: 'background-color 0.3s',
    },
    adminNav: {
        backgroundColor: 'white',
        padding: '0 40px',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        gap: '1px',
        overflowX: 'auto',
    },
    navBtn: {
        padding: '15px 25px',
        backgroundColor: 'white',
        border: 'none',
        borderBottom: '3px solid transparent',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        color: '#666',
        whiteSpace: 'nowrap',
        transition: 'all 0.3s',
    },
    activeNavBtn: {
        color: '#3498db',
        borderBottomColor: '#3498db',
        backgroundColor: '#f8f9fa',
        fontWeight: '600',
    },
    content: {
        padding: '30px 40px',
        maxWidth: '1400px',
        margin: '0 auto',
    },
    sectionTitle: {
        color: '#2c3e50',
        marginBottom: '30px',
        fontSize: '24px',
        fontWeight: '600',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '25px',
        marginBottom: '40px',
    },
    statCard: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
        borderLeft: '4px solid #3498db',
    },
    statTitle: {
        margin: '0 0 15px 0',
        color: '#2c3e50',
        fontSize: '18px',
        fontWeight: '600',
    },
    statNumber: {
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#2c3e50',
        margin: '0 0 15px 0',
    },
    statDetails: {
        color: '#7f8c8d',
        fontSize: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
    },
    formCard: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
        marginBottom: '30px',
    },
    formTitle: {
        margin: '0 0 20px 0',
        color: '#2c3e50',
        fontSize: '20px',
        fontWeight: '600',
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '15px',
    },
    input: {
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '14px',
        width: '100%',
        boxSizing: 'border-box',
    },
    textarea: {
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '14px',
        width: '100%',
        boxSizing: 'border-box',
        marginBottom: '15px',
        fontFamily: 'inherit',
        resize: 'vertical',
        minHeight: '100px',
    },
    formActions: {
        display: 'flex',
        gap: '15px',
    },
    submitBtn: {
        backgroundColor: '#2ecc71',
        color: 'white',
        border: 'none',
        padding: '12px 25px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        flex: 1,
    },
    cancelBtn: {
        backgroundColor: '#95a5a6',
        color: 'white',
        border: 'none',
        padding: '12px 25px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        flex: 1,
    },
    servicesList: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
    },
    listTitle: {
        margin: '0 0 20px 0',
        color: '#2c3e50',
        fontSize: '20px',
        fontWeight: '600',
    },
    servicesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px',
    },
    serviceCard: {
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        transition: 'transform 0.3s, box-shadow 0.3s',
    },
    serviceHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '15px',
    },
    serviceName: {
        margin: 0,
        color: '#2c3e50',
        fontSize: '18px',
        fontWeight: '600',
    },
    serviceActions: {
        display: 'flex',
        gap: '10px',
    },
    editBtn: {
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '500',
    },
    deleteBtn: {
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '500',
    },
    serviceDescription: {
        color: '#666',
        fontSize: '14px',
        lineHeight: '1.5',
        marginBottom: '20px',
    },
    serviceDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    priceSection: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        backgroundColor: 'white',
        borderRadius: '6px',
        border: '1px solid #e0e0e0',
    },
    priceLabel: {
        color: '#7f8c8d',
        fontSize: '14px',
        fontWeight: '500',
    },
    priceValue: {
        color: '#27ae60',
        fontSize: '18px',
        fontWeight: 'bold',
    },
    durationSection: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        backgroundColor: 'white',
        borderRadius: '6px',
        border: '1px solid #e0e0e0',
    },
    durationLabel: {
        color: '#7f8c8d',
        fontSize: '14px',
        fontWeight: '500',
    },
    durationValue: {
        color: '#2c3e50',
        fontSize: '16px',
        fontWeight: '500',
    },
    currencySection: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        backgroundColor: 'white',
        borderRadius: '6px',
        border: '1px solid #e0e0e0',
    },
    currencyLabel: {
        color: '#7f8c8d',
        fontSize: '14px',
        fontWeight: '500',
    },
    currencyValue: {
        color: '#8e44ad',
        fontSize: '14px',
        fontWeight: '500',
    },
    placeholder: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
        textAlign: 'center',
    },
    featureGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '30px',
    },
    featureCard: {
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
    },
    loading: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f7fa',
    },
    spinner: {
        border: '5px solid #f3f3f3',
        borderTop: '5px solid #3498db',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px',
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

export default AdminDashboard;
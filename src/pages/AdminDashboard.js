import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);
    
    const checkAdminAccess = useCallback(async () => {
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
    }, [navigate]);

    const loadUserProfile = async () => {
        try {
            const response = await api.get('/users/profile');
            setUserProfile(response.data);
        } catch (error) {
            console.error('Failed to load profile:', error);
        }
    };

    useEffect(() => {
        checkAdminAccess();
        loadUserProfile();
    }, [checkAdminAccess]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) {
        return <div style={{ padding: '50px', textAlign: 'center' }}>Loading Admin Dashboard...</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                paddingBottom: '20px',
                borderBottom: '1px solid #ddd'
            }}>
                <div>
                    <h1 style={{ margin: 0, color: '#333' }}>Admin Dashboard</h1>
                    <p style={{ margin: '5px 0 0 0', color: '#666' }}>
                        Welcome, {userProfile?.fullName || 'Admin'}!
                    </p>
                </div>
                <button 
                    onClick={handleLogout}
                    style={{
                        padding: '10px 20px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Logout
                </button>
            </div>

            {/* Tabs */}
            <div style={{ 
                display: 'flex', 
                gap: '10px', 
                marginBottom: '30px',
                borderBottom: '1px solid #ddd',
                paddingBottom: '10px'
            }}>
                <button 
                    onClick={() => setActiveTab('dashboard')}
                    style={{
                        padding: '10px 20px',
                        background: activeTab === 'dashboard' ? '#667eea' : '#f8f9fa',
                        color: activeTab === 'dashboard' ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'dashboard' ? 'bold' : 'normal'
                    }}
                >
                    Dashboard
                </button>
                <button 
                    onClick={() => setActiveTab('profile')}
                    style={{
                        padding: '10px 20px',
                        background: activeTab === 'profile' ? '#667eea' : '#f8f9fa',
                        color: activeTab === 'profile' ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'profile' ? 'bold' : 'normal'
                    }}
                >
                    My Profile
                </button>
                <button 
                    onClick={() => setActiveTab('system')}
                    style={{
                        padding: '10px 20px',
                        background: activeTab === 'system' ? '#667eea' : '#f8f9fa',
                        color: activeTab === 'system' ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'system' ? 'bold' : 'normal'
                    }}
                >
                    System Info
                </button>
            </div>

            {/* Content */}
            <div style={{ 
                background: 'white', 
                padding: '30px', 
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                {activeTab === 'dashboard' && (
                    <div>
                        <h2 style={{ color: '#333', marginBottom: '20px' }}>Admin Dashboard</h2>
                        <p>This is the admin dashboard. More features will be added soon.</p>
                        
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                            gap: '20px',
                            marginTop: '30px'
                        }}>
                            <div style={{
                                background: '#f8f9fa',
                                padding: '20px',
                                borderRadius: '8px',
                                borderLeft: '4px solid #667eea'
                            }}>
                                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Current User</h3>
                                <p style={{ margin: '5px 0', color: '#666' }}>
                                    <strong>Name:</strong> {userProfile?.fullName || 'N/A'}
                                </p>
                                <p style={{ margin: '5px 0', color: '#666' }}>
                                    <strong>Email:</strong> {userProfile?.email || 'N/A'}
                                </p>
                                <p style={{ margin: '5px 0', color: '#666' }}>
                                    <strong>Role:</strong> {userProfile?.role || 'N/A'}
                                </p>
                            </div>
                            
                            <div style={{
                                background: '#f8f9fa',
                                padding: '20px',
                                borderRadius: '8px',
                                borderLeft: '4px solid #28a745'
                            }}>
                                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Quick Actions</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <button style={{
                                        padding: '10px',
                                        background: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}>
                                        View All Users
                                    </button>
                                    <button style={{
                                        padding: '10px',
                                        background: '#17a2b8',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}>
                                        Manage Services
                                    </button>
                                    <button style={{
                                        padding: '10px',
                                        background: '#6c757d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}>
                                        View Bookings
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'profile' && userProfile && (
                    <div>
                        <h2 style={{ color: '#333', marginBottom: '20px' }}>My Profile</h2>
                        
                        <div style={{ 
                            background: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            marginBottom: '20px'
                        }}>
                            <div style={{ marginBottom: '15px' }}>
                                <strong style={{ display: 'inline-block', width: '150px' }}>Full Name:</strong>
                                <span>{userProfile.fullName || 'Not set'}</span>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <strong style={{ display: 'inline-block', width: '150px' }}>Email:</strong>
                                <span>{userProfile.email || 'Not set'}</span>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <strong style={{ display: 'inline-block', width: '150px' }}>Phone:</strong>
                                <span>{userProfile.phoneNumber || 'Not set'}</span>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <strong style={{ display: 'inline-block', width: '150px' }}>Role:</strong>
                                <span style={{
                                    padding: '4px 12px',
                                    background: userProfile.role === 'ADMIN' ? '#d4edda' : '#fff3cd',
                                    color: userProfile.role === 'ADMIN' ? '#155724' : '#856404',
                                    borderRadius: '20px',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}>
                                    {userProfile.role}
                                </span>
                            </div>
                            <div>
                                <strong style={{ display: 'inline-block', width: '150px' }}>Status:</strong>
                                <span style={{
                                    padding: '4px 12px',
                                    background: userProfile.active ? '#d4edda' : '#f8d7da',
                                    color: userProfile.active ? '#155724' : '#721c24',
                                    borderRadius: '20px',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}>
                                    {userProfile.active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                        
                        <button style={{
                            padding: '10px 20px',
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}>
                            Edit Profile
                        </button>
                    </div>
                )}

                {activeTab === 'system' && (
                    <div>
                        <h2 style={{ color: '#333', marginBottom: '20px' }}>System Information</h2>
                        <p>This section will display system statistics and configuration.</p>
                        
                        <div style={{ 
                            background: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            marginTop: '20px'
                        }}>
                            <h3 style={{ color: '#333', marginBottom: '15px' }}>Backend Status</h3>
                            <p style={{ color: '#28a745', margin: '5px 0' }}>✅ Auth Controller: Working</p>
                            <p style={{ color: '#28a745', margin: '5px 0' }}>✅ User Controller: Working</p>
                            <p style={{ color: '#ffc107', margin: '5px 0' }}>⚠️ Admin Controller: Not implemented</p>
                            <p style={{ color: '#ffc107', margin: '5px 0' }}>⚠️ Booking Controller: Not implemented</p>
                        </div>
                        
                        <div style={{ 
                            background: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            marginTop: '20px'
                        }}>
                            <h3 style={{ color: '#333', marginBottom: '15px' }}>Next Steps</h3>
                            <ol style={{ paddingLeft: '20px', color: '#666' }}>
                                <li>Implement AdminController with user management</li>
                                <li>Add booking management features</li>
                                <li>Add service management</li>
                                <li>Add reporting and analytics</li>
                            </ol>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Footer */}
            <div style={{ 
                marginTop: '40px', 
                paddingTop: '20px', 
                borderTop: '1px solid #ddd',
                color: '#666',
                fontSize: '14px',
                textAlign: 'center'
            }}>
                <p>CarWash Pro Admin Dashboard • {new Date().getFullYear()}</p>
                <p>Role: Administrator • Access Level: Full System Access</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // User ki info localStorage se hata do
        localStorage.removeItem('userInfo');
        // User ko login page par bhej do
        navigate('/login');
    };

    return (
        <nav style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '1rem 2rem', 
            backgroundColor: '#333', 
            color: 'white' 
        }}>
            <h3 style={{ margin: 0 }}>Social Scheduler</h3>
            <div>
                <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>Dashboard</Link>
                <Link to="/calendar" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>Calendar</Link>
                <button onClick={handleLogout} style={{ background: 'none', border: '1px solid white', color: 'white', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Link ko import kiya

const Login = () => {
    // State aur handleSubmit logic waisa hi rahega
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await axios.post('http://localhost:5001/api/auth/login', { email, password });
            console.log('Login successful, token:', response.data.token);
            setMessage('Login successful!');
            // TODO: Token save karke redirect karna
        } catch (error) {
            console.error('Login failed:', error.response.data.message);
            setMessage(error.response.data.message || 'Login failed.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
            <form onSubmit={handleSubmit} style={{ padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', backgroundColor: 'white', width: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#333', fontFamily: 'Arial, sans-serif' }}>Login to Your Account</h2>
                
                <div style={{ marginBottom: '16px' }}>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '24px' }}>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                </div>
                
                <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer', fontSize: '16px' }}>
                    Login
                </button>

                {message && <p style={{ textAlign: 'center', marginTop: '16px', color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}

                {/* --- REGISTER KA LINK YAHAN ADD KIYA --- */}
                <p style={{ textAlign: 'center', marginTop: '20px', fontFamily: 'Arial, sans-serif' , color : 'black'}}>
                    Don't have an account? <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>Register</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;


import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    // State logic waisa hi rahega
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await axios.post('http://localhost:5001/api/auth/register', {
                name,
                email,
                password,
            });
            console.log(response.data);
            setMessage('Registration successful! You can now log in.');
        } catch (error) {
            console.error('Registration failed:', error.response.data.message);
            setMessage(error.response.data.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
            <form onSubmit={handleSubmit} style={{ padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', backgroundColor: 'white', width: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#333', fontFamily: 'Arial, sans-serif' }}>Create Your Account</h2>
                
                {/* Maine yahan <label> hata kar placeholder add kar diya hai */}
                <div style={{ marginBottom: '16px' }}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name" // Placeholder yahan hai
                        required
                        style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '16px' }}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email" // Placeholder yahan hai
                        required
                        style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '24px' }}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password" // Placeholder yahan hai
                        required
                        style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    />
                </div>
                
                <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer', fontSize: '16px' }}>
                    Register
                </button>

                {message && <p style={{ textAlign: 'center', marginTop: '16px', color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
            </form>
        </div>
    );
};

export default Register;

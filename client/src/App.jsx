import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // Dashboard ko import kiya

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      {/* Humne yahan dashboard ka naya route add kiya hai */}
      <Route path="/dashboard" element={<Dashboard />} /> 
      {/* Default route abhi bhi login page hai */}
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App;


import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Register from './pages/Register'; // .jsx hataya
import Login from './pages/Login';       // .jsx hataya
import Dashboard from './pages/Dashboard'; // .jsx hataya
import CalendarPage from './pages/CalendarPage'; // .jsx hataya
import Navbar from './components/Navbar';       // .jsx hataya

function App() {
  const location = useLocation();
  // Hum Navbar sirf login aur register page par nahi dikhayenge
  const showNavbar = location.pathname !== '/login' && location.pathname !== '/register';

  return (
    <div>
      {/* Agar showNavbar true hai, to hi Navbar dikhega */}
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendar" element={<CalendarPage />} /> {/* Naya route add kiya */}
        <Route path="/" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;

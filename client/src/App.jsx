import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import Navbar from './components/Navbar.jsx';

// Humari nayi custom CSS file ko yahan import kiya
import './App.css'; 

function App() {
  const location = useLocation();
  // Hum Navbar sirf login aur register page par nahi dikhayenge
  const showNavbar = location.pathname !== '/login' && location.pathname !== '/register';

  return (
    <div>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;

import React from 'react';
// Routes aur Route ko react-router-dom se import kiya
import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login'; // Login component ko import kiya

function App() {
  return (
    // Routes component ke andar hum alag-alag Route define karte hain
    <Routes>
      {/* Agar URL me /register hai, to Register component dikhao */}
      <Route path="/register" element={<Register />} />
      
      {/* Agar URL me /login hai, to Login component dikhao */}
      <Route path="/login" element={<Login />} />

      {/* Hum / (default) route ko bhi login par bhej dete hain */}
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App;
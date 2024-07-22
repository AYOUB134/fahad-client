import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './features/customer/Login';
import Home from './features/customer/Home';
import ProtectedRoute from './features/customer/ProtectedRoute'; // Adjust the import path as needed

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
      </Routes>
    </Router>
  );
}

export default App;

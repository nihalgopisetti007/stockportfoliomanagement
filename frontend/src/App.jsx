import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import AddStock from './pages/AddStock';
import Market from './pages/Market';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/portfolio"
          element={<ProtectedRoute><Portfolio /></ProtectedRoute>}
        />
        <Route
          path="/add-stock"
          element={<ProtectedRoute><AddStock /></ProtectedRoute>}
        />
        <Route
          path="/market"
          element={<ProtectedRoute><Market /></ProtectedRoute>}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
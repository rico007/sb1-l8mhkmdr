import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AuthGuard from './components/auth/AuthGuard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Properties from './pages/Properties';
import AddProperty from './pages/properties/AddProperty';
import EditProperty from './pages/properties/EditProperty';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <AuthGuard>
              <Layout />
            </AuthGuard>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="properties" element={<Properties />} />
          <Route path="properties/add" element={<AddProperty />} />
          <Route path="properties/:id/edit" element={<EditProperty />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
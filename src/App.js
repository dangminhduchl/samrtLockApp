import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import axios from 'axios';

import PrivateRoutes from './utils/PrivateRoutes';
import PublicRoutes from './utils/PublicRoutes';
import { getToken, removeUserSession, setUserSession } from './utils/common';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import CameraCapture from './pages/FaceLogin';

function App() {
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }

  setUserSession(token);
  setAuthLoading(false);
    
  }, []);

  if (authLoading && getToken()) {
    return <div className="content">Checking Authentication...</div>
  }

  return (
    <BrowserRouter>
      <div className="header">
        <NavLink className={({ isActive }) => isActive ? 'active' : ''} to="/">Home</NavLink>
        <NavLink className={({ isActive }) => isActive ? 'active' : ''} to="/login">Login</NavLink><small>(Access without token only)</small>
        <NavLink className={({ isActive }) => isActive ? 'active' : ''} to="/facelogin">Face Login</NavLink><small>(Access without token only)</small>
        <NavLink className={({ isActive }) => isActive ? 'active' : ''} to="/register">Register</NavLink>
        <NavLink className={({ isActive }) => isActive ? 'active' : ''} to="/dashboard">Dashboard</NavLink><small>(Access with token only)</small>
      </div>
      <div className="content">
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route index element={<Home />} />
          <Route element={<PublicRoutes />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<PublicRoutes />}>
            <Route path="/facelogin" element={<CameraCapture />} />
          </Route>
          <Route>
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import axios from 'axios';
import { AuthContext } from './context';

import PrivateRoutes from './utils/PrivateRoutes';
import PublicRoutes from './utils/PublicRoutes';
import { getToken, removeUserSession, setUserSession } from './utils/common';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import CameraCapture from './pages/FaceLogin';
import { getUser } from './utils/common';

function App() {
  const [authLoading, setAuthLoading] = useState(true);
  const [userName, setUserName] = useState('');

  const [context, setContext] = useState({username: ""})

  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }
    // Get user name from the token (You'll need to replace 'userNameKey' with the actual key in the token that contains the user's name
    setUserSession(token);
    console.log(token)
    setUserName(getUser());
    // console.log(getUser)
    setAuthLoading(false);
  }, []);

  const handleLogout = () => {
    removeUserSession();
    setUserName(''); // Reset the user name state
    // Perform any additional cleanup or redirection logic
  };

  if (authLoading && getToken()) {
    return <div className="content">Checking Authentication...</div>;
  }

  return (
    <AuthContext.Provider value={[context, setContext]}>
      <BrowserRouter>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              My App
            </Typography>
            {context.username ? (
              <>
                <Typography variant="body1" sx={{ marginRight: '16px' }}>
                  Welcome, {context.username}
                </Typography>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={NavLink} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={NavLink} to="/facelogin">
                  Face Login
                </Button>
                <Button color="inherit" component={NavLink} to="/register">
                  Register
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>
        <div className="content">
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route index element={<Home />} />
            <Route element={<PublicRoutes />}>
              <Route path="/login" element={<Login />} />
              <Route path="/facelogin" element={<CameraCapture />} />
              <Route path="/register" element={<Register />} />
            </Route>
            <Route element={<PrivateRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;

import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { AuthContext } from '../context';

import PrivateRoutes from '../utils/PrivateRoutes';
import PublicRoutes from '../utils/PublicRoutes';
import { getToken, getUserId, removeUserSession, setUserSession } from '../utils/common';

import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import Register from '../pages/Register';
import CameraCapture from '../pages/FaceLogin';
import UsersManagement from '../pages/UsersManage';
import UserProfile from '../pages/ChangePasswordDialog';
import { getUser } from '../utils/common';
import DeviceHistory from '../pages/History';

function RouterComponent() {
  const [authLoading, setAuthLoading] = useState(true);
  const [userName, setUserName] = useState('');

  const [context, setContext] = useState({ username: '', id: null });

   useEffect(() => {
    const token = getToken();
    if (!token) {
      setAuthLoading(false);
      return;
    }
    setUserSession(token);
    setUserName(getUser());
    setAuthLoading(false);
    setContext((prevContext) => ({ ...prevContext, username: getUser(), id : getUserId() }));
  }, []);

  const handleLogout = () => {
    removeUserSession();
    setUserName('');
    setContext((prevContext) => ({ ...prevContext, username: '', id: null }));
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
              Knock Knock
            </Typography>
            {context.username ? (
              <>
                <NavLink to={`/dashboard`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    Welcome, {context.username}
                  </NavLink>
                  <Button color="inherit" component={NavLink} to="/users">
                    User
                  </Button>
                  <Button color="inherit" component={NavLink} to="/history">
                    History
                  </Button>
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
              <Route path="/users" element={<UsersManagement />} />
              <Route path="/user/:username" element={<UserProfile />} />
              <Route path="history" element={<DeviceHistory/>} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default RouterComponent;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useHistory } from 'react-router-dom';

import PrivateRoutes from './utils/PrivateRoutes';
import PublicRoutes from './utils/PublicRoutes';
import { getToken, removeUserSession, setUserSession } from './utils/common';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import CameraCapture from './pages/FaceLogin';
import './app.css';

import {
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  AppBar,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import {
  AccountCircle,
  Home as MHome,
  Lock,
  Logout,
  PersonAdd,
  Menu,
} from '@mui/icons-material';

function App() {
  const [authLoading, setAuthLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerWidth = 240; // Adjust the width according to your needs
  const history = useHistory(); // Access the history object for navigation

  useEffect(() => {
    const token = getToken();
    if (token) {
      setUserSession(token);
    }
    setAuthLoading(false);
  }, []);

  if (authLoading) {
    return <div className="content">Checking Authentication...</div>;
  }

  const handleDrawerToggle = (path) => {
    setDrawerOpen(false);
    if (window.location.pathname !== path) {
      history.push(path); // Use history.push for programmatic navigation
    }
  };

  const handleLogout = () => {
    removeUserSession();
    // Add your logout logic here
  };

  const drawerContent = (
    <div>
      <List>
        <ListItem button component={NavLink} to="/" exact onClick={() => handleDrawerToggle('/')}>
          <ListItemIcon>
            <MHome />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={NavLink} to="/login" onClick={() => handleDrawerToggle('/login')}>
          <ListItemIcon>
            <Lock />
          </ListItemIcon>
          <ListItemText primary="Login" />
        </ListItem>
        <ListItem button component={NavLink} to="/facelogin" onClick={() => handleDrawerToggle('/facelogin')}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary="Face Login" />
        </ListItem>
        <ListItem button component={NavLink} to="/register" onClick={() => handleDrawerToggle('/register')}>
          <ListItemIcon>
            <PersonAdd />
          </ListItemIcon>
          <ListItemText primary="Register" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Router>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" onClick={() => setDrawerOpen(!drawerOpen)}>
            <Menu />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My App
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex' }}>
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
            },
          }}
        >
          {drawerContent}
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
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
        </Box>
      </Box>
    </Router>
  );
}

export default App;

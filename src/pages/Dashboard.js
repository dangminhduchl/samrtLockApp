import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, removeUserSession } from '../utils/common';
import Home from './Home';
import '../dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate();
  const user = getUser();

  // Xử lý sự kiện click của nút đăng xuất
  const handleLogout = () => {
    removeUserSession();
    navigate('/login');
  };

  return (
    <div>
      <Home />
    </div>
  );
};

export default Dashboard;

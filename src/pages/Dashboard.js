import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, removeUserSession } from '../utils/common';
import Home from './Home'

const Dashboard = props => {
  const history = useNavigate();
  const user = getUser();

  // handle click event of logout button
  const handleLogout = () => {
    removeUserSession();
    history('/login');
  }

  return (
    <div>
      Welcome {user?.name}!<br /><br />
      <Home/>
      <input type="button" onClick={handleLogout} value="Logout" />
    </div>
  );
}

export default Dashboard;
import React, { useState, useEffect, useMemo } from 'react';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import { postAPI } from '../utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import {getToken} from '../utils/common'
import { Button } from '@mui/material';
import { useContext } from 'react';
import { AuthContext } from '../context';

const Home = () => {
  const [status, setStatus] = useState(null);

  const { lastMessage } = useWebSocket('ws://localhost:8000/ws/status');

  const navigate = useNavigate();

  const [context, _] = useContext(AuthContext);
  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const messageData = JSON.parse(lastMessage.data);
        setStatus(messageData);
      } catch (error) {
        console.log('Error parsing message:', error);
        setStatus(lastMessage.data); // Trả về chuỗi chưa được chuyển đổi
      }
    }
    
  }, [lastMessage]);

  const lock = useMemo(() => {
    return status ? status.lock : null;
  }, [status]);

  const door = useMemo(() => {
    return status ? status.door : null;
  }, [status]);

  const notice = useMemo(() => {
    return status ? status.notice : null;
  }, [status]);

  const handleUnlock = async () => {
    const token = getToken();
    if (!token) {
      console.log(token)
      navigate('/facelogin'); // Chuyển hướng đến trang đăng nhập
      return;
    }
    try{
      const response = await postAPI('device/control/', { 'lock': 0 });
      console.log(response);
      toast.success('Unlock successful.'); // Hiển thị thông báo thành công bằng toast.success
    } catch (error) {
      console.log('Error lock:', error);
      if (error?.response && error?.response?.data && error?.data?.error) {
        toast.error(error?.response?.data?.error);
      } else {
        toast.error(error?.response?.data?.detail || "Some Thing Went Wrong");
      }       // Hiển thị thông báo lỗi bằng toast.error
    }
  };

  const handleLock = async () => {
    const token = getToken();
    if (!token) {
      navigate('/facelogin'); // Chuyển hướng đến trang đăng nhập
      return;
    }
    try {
      const response = await postAPI('device/control/', { 'lock': 1 });
      console.log(response);
      toast.success('Lock successful.'); // Hiển thị thông báo thành công bằng toast.success
    } catch (error) {
      console.log('Error lock:', error);
      if (error?.response && error?.response?.data && error?.data?.error) {
        toast.error(error?.response?.data?.error);
      } else {
        toast.error(error?.response?.data?.detail || "Some Thing Went Wrong");
      } // Hiển thị thông báo lỗi bằng toast.error
    }
  };

  return (
    <div className="container">
      <h1>Homepage</h1>
      <div className="status">
        {status ? (
          <div>
            <p>Lock: {lock}</p>
            <p>Door: {door}</p>
            {status.notice && <p>Notice : {notice}</p>}
            <div>
              {lock === 0 ? (
                <Button  variant="contained" className="lock-button" onClick={handleLock}>Khóa</Button>
              ) : (
                <Button  variant="contained" className="lock-button" onClick={handleUnlock}>Mở khóa</Button>
              )}
            </div>
          </div>
        ) : (
          <p>Loading status...</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Home;

import React, { useState, useEffect, useMemo } from 'react';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import { postAPI } from '../utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../home.css'; // Import tệp CSS tại đây

const Home = () => {
  const [status, setStatus] = useState(null);

  const { lastMessage } = useWebSocket('ws://localhost:8000/ws/status');

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
    try {
      const response = await postAPI('device/control/', { 'lock': 0 });
      console.log(response);
      toast.success('Unlock successful.'); // Hiển thị thông báo thành công bằng toast.success
    } catch (error) {
      console.log('Error unlock:', error);
      toast.error(error.response.data.error); // Hiển thị thông báo lỗi bằng toast.error
    }
  };

  const handleLock = async () => {
    try {
      const response = await postAPI('device/control/', { 'lock': 1 });
      console.log(response);
      toast.success('Lock successful.'); // Hiển thị thông báo thành công bằng toast.success
    } catch (error) {
      console.log('Error lock:', error);
      toast.error(error.response.data.error); // Hiển thị thông báo lỗi bằng toast.error
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
              <p>Lock: {lock}</p>
              {lock === 0 ? (
                <button className="lock-button" onClick={handleLock}>Khóa</button>
              ) : (
                <button className="lock-button" onClick={handleUnlock}>Mở khóa</button>
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

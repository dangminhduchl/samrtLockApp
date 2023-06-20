import React, { useState, useEffect, useMemo } from 'react';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import { postAPI } from '../utils/axios'; 

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

  const handleUnlock = async() => {
    // Gửi yêu cầu mở khóa lên server
    try{
      const response = await postAPI('device/control/', {'lock' : 0});
      console.log(response)
    } catch (error) {
      console.log('Error login:', error);
    }
  };

  const handleLock = async() => {
    try{
      const response = await postAPI('device/control/', { 'lock' : 1});
      console.log(response)
    } catch (error) {
      console.log('Error login:', error);
    }
  }

  return (
    <div>
      <h1>Homepage</h1>
      <div>
        <h2>Status:</h2>
        {status ? (
          <div>
            <p>Lock: {lock}</p>
            <p>Door: {door}</p>
            { status.notice && <p>Notice : {notice}</p>}
            <div>
            <p>Lock: {lock}</p>
            {lock === 0 ? (
              <button onClick={handleLock}>Khóa</button>
            ) : (
              <button onClick={handleUnlock}>Mở khóa</button>
            )}
          </div>
          </div>
        ) : (
          <p>Loading status...</p>
        )}
      </div>
    </div>
  );
};

export default Home;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getAPI } from '../utils/axios';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';


const Home = () => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    // Hàm fetchStatus() để gọi API và nhận thông tin status
    fetchStatus();
  }, []);


  const { sendMessage, lastMessage, readyState } = useWebSocket("ws://localhost:8000/ws/helloworld");

  useEffect(() => {
    console.log(lastMessage)
  }, [lastMessage])
  const fetchStatus = async () => {
    try {
      const response = await getAPI('/device/status/');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.log('Error fetching status:', error);
    }
  };

  const message = useMemo(() => {
    return lastMessage?.data
  }, [lastMessage])

  return (
    <div>
      <h1>Homepage</h1>
      <div>
        <h2>Status :</h2>
        {status ? (
          <div>
            <p>Lock: {status.lock}</p>
            <p>Door: {status.door}</p>
          </div>
        ) : (
          <p>{message}</p>
        )}
      </div>
    </div>
  );
};

export default Home;




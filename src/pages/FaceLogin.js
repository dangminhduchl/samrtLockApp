import React, { useState } from 'react';
import Camera from '../utils/camera';
import { postAPI } from '../utils/axios'; // Thay thế bằng module gửi request API tương ứng
import { Button } from '@mui/material';
import '../login.css';
import { useContext } from 'react';
import { setUserSession } from '../utils/common';
import { getUser } from '../utils/common';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context';

const FaceLogin = () => {
  const history = useNavigate();
  const [capturedImages, setCapturedImages] = useState([]);
  const captureCount = 10;
  const [cameraStatus, setCameraStatus] = useState(true);
  const [context, setContext] = useContext(AuthContext);
  const [error, setError] = useState(null);

  const handleFaceLogin = async () => {
    if (capturedImages.length !== 10) {
      console.log('Please capture 10 images before registering.');
      return;
    }
    setCameraStatus(false);
    try {
      const formData = new FormData();
      capturedImages.forEach((image, index) => {
        formData.append(`image${index + 1}`, image, `image${index + 1}.jpg`);
      });

      const response = await postAPI('user/face_login/', formData);
      setUserSession(response.data.access);
      history('/dashboard');
      setContext((prevContext) => ({ ...prevContext, username: getUser() }));

      console.log('Login response:', response.data);
    } catch (error) {
      if (error?.response?.status === 401) setError(error.response?.data?.error);
      else setError('Something went wrong, please try again');
    }
  };

  const handleCaptureComplete = (images) => {
    setCapturedImages(images);
  };

  return (
    <div className='login-section'>
      <h2>FaceLogin</h2>
      <div className="camera-wrapper">
        {cameraStatus && <Camera onCaptureComplete={handleCaptureComplete} captureCount={captureCount} />}
      </div>
  
      <div className="face-login-button">
        <Button
          variant="contained"
          onClick={handleFaceLogin}
          disabled={capturedImages.length !== captureCount}
        >
          FaceLogin
        </Button>
      </div>
    </div>
  );
};

export default FaceLogin;
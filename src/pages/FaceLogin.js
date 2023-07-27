import React, { useState } from 'react';
import Camera from '../utils/camera';
import { postAPI } from '../utils/axios';
import { Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../login.css';
import { useContext } from 'react';
import { getUserId, setUserSession } from '../utils/common';
import { getUser } from '../utils/common';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context';

const FaceLogin = () => {
  const history = useNavigate();
  const [capturedImages, setCapturedImages] = useState([]);
  const captureCount = 10;
  const [cameraStatus, setCameraStatus] = useState(true);
  const [context, setContext] = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFaceLogin = async () => {
    if (capturedImages.length !== 10) {
      toast.error('Please capture 10 images before registering.');
      return;
    }
    setIsLoading(true);
    setCameraStatus(false);
    try {
      const formData = new FormData();
      capturedImages.forEach((image, index) => {
        formData.append(`image${index + 1}`, image, `image${index + 1}.jpg`);
      });

      const response = await postAPI('user/face_login/', formData);
      setUserSession(response.data.access);
      history('/dashboard');
      setContext((prevContext) => ({ ...prevContext, username: getUser(), id: getUserId() }));

      toast.success('Login successful!');
      console.log('Login response:', response.data);
    } catch (error) {
      if (error?.response?.status === 401) setError(error.response?.data?.error);
      else setError('Something went wrong, please try again');

      toast.error(error?.response?.data?.error || 'Something went wrong, please try again');
    } finally {
      setIsLoading(false);
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
          disabled={isLoading || capturedImages.length !== captureCount}
        >
          {isLoading ? 'Loading...' : 'FaceLogin'}
        </Button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default FaceLogin;

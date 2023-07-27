import React, { useState } from 'react';
import Camera from '../utils/camera';
import { postAPI } from '../utils/axios';
import { Button, TextField } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../login.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [capturedImages, setCapturedImages] = useState([]);
  const captureCount = 50;
  const [isLoading, setIsLoading] = useState(false);

  const history = useNavigate();

  const handleRegister = async () => {
    if (capturedImages.length !== captureCount) {
      toast.error('Please capture 50 images before registering.');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('email', email);

      capturedImages.forEach((image, index) => {
        formData.append(`image${index + 1}`, image, `image${index + 1}.jpg`);
      });

      const response = await postAPI('user/register/', formData);
      console.log('Register response:', response.data);

      setIsLoading(false);

      // Show success toast message
      toast.success('Registration successful! Redirecting to login page...');

      // Redirect to login page after successful registration
      setTimeout(() => {
        history('/login');
      }, 3000); // Wait for 3 seconds before redirecting
    } catch (error) {
      setIsLoading(false);
      console.log('Error registering:', error);
      // Show error toast message
      toast.error('Error during registration. Please try again.');
    }
  };

  const handleCaptureComplete = (images) => {
    setCapturedImages(images);
  };

  return (
    <div className='login-container'>
      <div className="border">
        <div className='register-form'>
          <div className="login-section">
            <div className='face-login-section'>
              <div className='input-block'>
                <h3>Register</h3>
                <TextField
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  helperText="Please enter your username"
                />
                <TextField
                  label="Email"
                  type="email"
                  helperText="Please enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  label="Password"
                  type="password"
                  helperText="Please enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className='login-section'>
            <h3>FaceRegister</h3>
            <Camera onCaptureComplete={handleCaptureComplete} captureCount={captureCount} disabled={isLoading} />
          </div>
        </div>
        <Button variant="contained" className="input-button" onClick={handleRegister} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Register'}
        </Button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;

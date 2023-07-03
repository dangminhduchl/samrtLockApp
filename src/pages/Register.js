import React, { useState } from 'react';
import Camera from '../utils/camera';
import { postAPI } from '../utils/axios';
import { Button, TextField } from '@mui/material';
import '../login.css';
const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [capturedImages, setCapturedImages] = useState([]);
  const captureCount = 50;

  const handleRegister = async () => {
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
    } catch (error) {
      console.log('Error registering:', error);
    }
  };

  const handleCaptureComplete = (images) => {
    setCapturedImages(images);
  };

  return (
    <div class='login-container'>
      <div class="border">
        <div class="login-section">
          <div class='face-login-section'>
            <h3>Register</h3>
            <div class = 'input-block'>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            </div>
          </div>
        </div>

          <div class='login-section'>
            <h3>FaceRegister</h3>
            <Camera onCaptureComplete={handleCaptureComplete} captureCount={captureCount} />
              <ul>
                {capturedImages.map((image, index) => (
                  <li key={index}>
                    <img src={URL.createObjectURL(image)} alt={`Image ${index + 1}`} />
                  </li>
                ))}
              </ul>
           
            </div>
      </div>
    </div>
  );
};

export default Register;

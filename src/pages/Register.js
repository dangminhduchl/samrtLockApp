import React, { useState } from 'react';
import Camera from '../utils/camera';
import { postAPI } from '../utils/axios';
import { Button, TextField } from '@mui/material';

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
    <div>
      <h3>Register</h3>
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

      <Camera onCaptureComplete={handleCaptureComplete} captureCount={captureCount} />
      <div>
        <h3>Captured Images:</h3>
        <ul>
          {capturedImages.map((image, index) => (
            <li key={index}>
              <img src={URL.createObjectURL(image)} alt={`Image ${index + 1}`} />
            </li>
          ))}
        </ul>
        <Button variant="contained" onClick={handleRegister}>
          Register
        </Button>
      </div>
    </div>
  );
};

export default Register;

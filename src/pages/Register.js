import React, { useState } from 'react';
import Camera from '../utils/camera';
import { postAPI } from '../utils/axios'; // Thay thế bằng module gửi request API tương ứng

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [capturedImages, setCapturedImages] = useState([]);

  const handleRegister = async () => {
    if (capturedImages.length !== 50) {
      console.log('Please capture 50 images before registering.');
      return;
    }

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
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>

      <Camera onCaptureComplete={handleCaptureComplete} />

      <div>
        <h3>Captured Images:</h3>
        <ul>
          {capturedImages.map((image, index) => (
            <li key={index}>
              <img src={URL.createObjectURL(image)} alt={`Image ${index + 1}`} />
            </li>
          ))}
        </ul>
        <button onClick={handleRegister} disabled={capturedImages.length !== 50}>
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;

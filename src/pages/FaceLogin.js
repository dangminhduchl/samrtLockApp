import React, { useState } from 'react';
import Camera from '../utils/camera';
import { postAPI } from '../utils/axios'; // Thay thế bằng module gửi request API tương ứng
import { Button } from '@mui/material';

const FaceLogin = () => {
  const [capturedImages, setCapturedImages] = useState([]);
  const captureCount = 10;
  const [cameraStatus, setCameraStatus] = useState(true)

  const handleFaceLogin = async () => {
    if (capturedImages.length !== 10) {
      console.log('Please capture 10 images before registering.');
      
      return;
    }
    setCameraStatus(false)
    try {
      const formData = new FormData();
      capturedImages.forEach((image, index) => {
        formData.append(`image${index + 1}`, image, `image${index + 1}.jpg`);
      });

      const response = await postAPI('user/face_login/', formData);
      console.log('Login response:', response.data);
    } catch (error) {
      console.log('Error login:', error);
    }
  };

  const handleCaptureComplete = (images) => {
    setCapturedImages(images);
  };

  return (
    <div>
      <h3>FaceLogin</h3>
      { cameraStatus && <Camera onCaptureComplete={handleCaptureComplete} captureCount={captureCount} />}
      <div>
        <h3>Captured Images:</h3>
        <ul>
          {capturedImages.length > 0 && capturedImages.map((image, index) => {
            console.log(image, index)
            return (
              <li key={index}>
                <img src={URL.createObjectURL(image)} alt={`Image ${index + 1}`} />
              </li>
            )
          })}
        </ul>
        <Button variant="contained" onClick={handleFaceLogin} disabled={capturedImages.length !== captureCount}>
        FaceLogin
        </Button>
      </div>
    </div>
  );
};

export default FaceLogin;

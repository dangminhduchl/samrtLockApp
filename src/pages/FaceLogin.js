import React, { useState } from 'react';
import Camera from '../utils/camera';
import { postAPI } from '../utils/axios'; // Thay thế bằng module gửi request API tương ứng

const FaceLogin = () => {
  const [capturedImages, setCapturedImages] = useState([]);
  const captureCount = 10;

  const handleFaceLogin = async () => {
    if (capturedImages.length !== 10) {
      console.log('Please capture 10 images before registering.');
      return;
    }

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
        <button onClick={handleFaceLogin} disabled={capturedImages.length !== captureCount}>
        FaceLogin
        </button>
      </div>
    </div>
  );
};

export default FaceLogin;

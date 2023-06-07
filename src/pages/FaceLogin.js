import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const CameraCapture = () => {
  const videoRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [isCameraStarted, setIsCameraStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (capturedImages.length === 25) {
      uploadImages();
    }
  }, [capturedImages]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setIsCameraStarted(true);
    } catch (error) {
      console.log('Error accessing camera:', error);
    }
  };

  const capturePhoto = async () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(
        videoRef.current,
        0,
        0,
        videoRef.current.videoWidth,
        videoRef.current.videoHeight
      );
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImages(prevImages => [...prevImages, dataUrl]);
    } catch (error) {
      console.log('Error capturing photo:', error);
    }
  };

  const uploadImages = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const base64Images = capturedImages.map(image => {
        const base64Data = image.replace(/^data:image\/jpeg;base64,/, '');
        return base64Data;
      });

      const response = await axios.post('API_URL', { images: base64Images });

      console.log('Upload response:', response.data);
    } catch (error) {
      setError('Error uploading images');
      console.log('Error uploading images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartCamera = async () => {
    await startCamera();
    await clearImages();
    if (capturedImages.length <= 25) {
      setInterval(capturePhoto, 100)
    }
    
    // Gọi hàm clearImages để xóa danh sách ảnh đã chụp sau khi gửi
  };

  const clearImages = async () => {
    setCapturedImages([]);
  };

  return (
    <div>
      <button onClick={handleStartCamera}>Start Camera</button>
      <br />
      <video ref={videoRef} width="320" height="240" autoPlay></video>
      <br />
      <button onClick={capturePhoto} disabled={!isCameraStarted}>
        Capture Photo
      </button>
      <br />
      <div>
        {capturedImages.map((image, index) => (
          <img key={index} src={image} alt={`Captured ${index + 1}`} />
        ))}
      </div>
      {isLoading && <p>Uploading images...</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default CameraCapture;

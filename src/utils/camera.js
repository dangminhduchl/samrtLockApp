import React, { useRef, useEffect, useState } from 'react';

const Camera = ({ onCaptureComplete, captureCount }) => {
  const videoRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);

  useEffect(() => {
    startCamera();
  }, []);

  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.log('Camera is not available:', error);
      });
  };

  const capturePhotos = async () => {
    const images = [];

    for (let i = 0; i < captureCount; i++) {
      const image = await capturePhoto();
      images.push(image);
    }

    setCapturedImages(images);
    onCaptureComplete(images);
  };

  const capturePhoto = () => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.8);
    });
  };

  return (
    <div>
      <h3>Camera Capture</h3>
      <video ref={videoRef} autoPlay />

      <button onClick={capturePhotos}>Capture Images</button>
    </div>
  );
};

export default Camera;

import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@mui/material';

const Camera = ({ onCaptureComplete, captureCount }) => {
  const videoRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [cameraActive, setCameraActive] = useState(true);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    }
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

  const stopCamera = () => {
    const stream = videoRef?.current?.srcObject;
    const tracks = stream?.getTracks();
    if (tracks) {
      tracks.forEach((track) => {
        track.stop();
      });
    }
  };
  
  const capturePhotos = async () => {
    const images = [];

    for (let i = 0; i < captureCount; i++) {
      const image = capturePhoto();
      images.push(image);
    }

    setCapturedImages(images);
    onCaptureComplete(images);
    setCameraActive(false)

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
    <div class='face-login-div'>
      <video ref={videoRef} autoPlay />
      <Button variant="contained" onClick={capturePhotos}>Capture Images</Button>
    </div>
  );
};

export default Camera;

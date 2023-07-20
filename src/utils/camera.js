import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@mui/material';
import '../login.css';

const Camera = ({ onCaptureComplete, captureCount }) => {
  const videoRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [cameraActive, setCameraActive] = useState(true);
  const mediaStreamRef = useRef(null);

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        mediaStreamRef.current = stream;
        setCameraActive(true);
      })
      .catch((error) => {
        console.log('Camera is not available:', error);
        setCameraActive(false);
      });
  };

  const stopCamera = async () => {
    if (mediaStreamRef.current) {
      const tracks = mediaStreamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const capturePhotos = async () => {
    const images = [];

    for (let i = 0; i < captureCount; i++) {
      const image = await capturePhoto();
      images.push(image);
    }

    setCapturedImages(images);
    onCaptureComplete(images);
    setCameraActive(false);
    await stopCamera();
  };

  const capturePhoto = async () => {
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
    <div className='camera'>
    <div className='camera-container'>
      <video ref={videoRef} autoPlay className='video-preview' />
    </div>
      <Button variant="contained" onClick={capturePhotos}>
        Capture Images
      </Button>
    </div>
  );
};

export default Camera;

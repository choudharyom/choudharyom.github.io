// PlantIdentifier.jsx
import React, { useState, useRef, useEffect } from 'react';
import '@/styles/PlantIdentifier.css';

const PlantIdentifier = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [showResources, setShowResources] = useState(false);
  const [error, setError] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Handler for file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        setSelectedImage(file);
        if (cameraActive) handleStopCamera();
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handler for camera activation
  const handleStartCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      setError('Camera access error: ' + err.message);
      console.error('Camera access error:', err);
    }
  };
  
  // Handler for stopping camera
  const handleStopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };
  
  // Handler for capturing photo from camera
  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageSrc = canvas.toDataURL('image/jpeg');
      setPreviewImage(imageSrc);
      
      // Convert data URL to Blob
      canvas.toBlob((blob) => {
        setSelectedImage(blob);
      }, 'image/jpeg', 0.95);
      
      handleStopCamera();
    }
  };
  
  // Handler for identifying the plant using Google Gemini API
  const handleIdentifyPlant = async () => {
    if (!selectedImage) {
      setError('Please upload or capture an image first.');
      return;
    }
    
    try {
      setAnalyzing(true);
      setError(null);
      
      // Create FormData to send the image to the API
      const formData = new FormData();
      formData.append('image', selectedImage);
      
      // Add your Google Gemini API integration here
      // This is a placeholder for the actual API call
      // You'll need to implement the server endpoint or direct API call
      
      const response = await fetch('/api/identify-plant', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      
      // Set the result from the API
      setResult({
        name: data.plantName,
        scientificName: data.scientificName,
        confidence: data.confidence,
        careInfo: data.careInfo,
        additionalInfo: data.additionalInfo,
        resources: data.resources || []
      });
      
    } catch (err) {
      setError('Error identifying plant: ' + err.message);
      console.error('Error identifying plant:', err);
    } finally {
      setAnalyzing(false);
    }
  };
  
  // Reset everything
  const handleReset = () => {
    setSelectedImage(null);
    setPreviewImage(null);
    setResult(null);
    setError(null);
    setShowResources(false);
    if (cameraActive) handleStopCamera();
  };
  
  // Clean up camera on component unmount
  useEffect(() => {
    return () => {
      if (cameraActive) handleStopCamera();
    };
  }, [cameraActive]);
  
  return (
    <div className="plant-identifier">
      <h1 className="plant-identifier__title">
        <span className="plant-identifier__title-icon">🌱</span> Plant Identification
      </h1>
      
      {/* Upload and Camera Controls */}
      <div className="plant-identifier__controls">
        <button 
          className="plant-identifier__button" 
          onClick={() => fileInputRef.current.click()}
        >
          <span className="button-icon">📁</span> Upload Image
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="file-input"
          hidden
        />
        
        <button 
          className="plant-identifier__button"
          onClick={cameraActive ? handleStopCamera : handleStartCamera}
        >
          <span className="button-icon">{cameraActive ? '❌' : '📷'}</span> 
          {cameraActive ? 'Stop Camera' : 'Take Photo'}
        </button>
      </div>
      
      {/* Camera View */}
      {cameraActive && (
        <div className="plant-identifier__camera">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="camera-preview"
          ></video>
          <button 
            className="plant-identifier__button capture-button"
            onClick={handleCapturePhoto}
          >
            <span className="button-icon">📸</span> Capture Photo
          </button>
        </div>
      )}
      
      {/* Hidden Canvas for Capturing Photos */}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      
      {/* Image Preview */}
      {previewImage && (
        <div className="plant-identifier__preview">
          <img 
            src={previewImage} 
            alt="Selected plant" 
            className="preview-image" 
          />
          <div className="preview-actions">
            <button 
              className="plant-identifier__button analyze-button"
              onClick={handleIdentifyPlant}
              disabled={analyzing}
            >
              {analyzing ? 'Analyzing...' : 'Identify Plant'}
            </button>
            <button 
              className="plant-identifier__button reset-button"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
      )}
      
      {/* Error Display */}
      {error && (
        <div className="plant-identifier__error">
          <p>{error}</p>
        </div>
      )}
      
      {/* Results Display */}
      {result && (
        <div className="plant-identifier__results">
          <div className="results-header">
            <h2>Plant Identified!</h2>
            <div className="confidence-badge">
              {Math.round(result.confidence * 100)}% Confidence
            </div>
          </div>
          
          <div className="plant-info">
            <h3 className="plant-name">{result.name}</h3>
            <p className="scientific-name">{result.scientificName}</p>
            
            <h4>Care Information</h4>
            <div className="care-info">
              {result.careInfo.map((info, index) => (
                <div key={index} className="care-card">
                  <div className="care-icon">{info.icon}</div>
                  <h5>{info.title}</h5>
                  <p>{info.description}</p>
                </div>
              ))}
            </div>
            
            <div className="additional-info">
              <h4>About This Plant</h4>
              <p>{result.additionalInfo}</p>
            </div>
            
            <button 
              className="plant-identifier__button resources-button"
              onClick={() => setShowResources(!showResources)}
            >
              {showResources ? 'Hide Resources' : 'Show Learning Resources'}
            </button>
            
            {showResources && (
              <div className="learning-resources">
                <h4>Learning Resources</h4>
                <div className="resources-list">
                  {result.resources.map((resource, index) => (
                    <a 
                      key={index} 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="resource-card"
                    >
                      <h5>{resource.title}</h5>
                      <p>{resource.description}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* How It Works Section */}
      <div className="plant-identifier__how-it-works">
        <h2>How It Works</h2>
        <div className="how-it-works-cards">
          <div className="how-card">
            <div className="how-icon">📷</div>
            <h3>Step 1: Capture</h3>
            <p>Upload a photo or use your camera to take a picture of any plant you want to identify.</p>
          </div>
          <div className="how-card">
            <div className="how-icon">🔍</div>
            <h3>Step 2: Analyze</h3>
            <p>Our AI analyzes the image using Google's advanced Gemini API to identify the plant species.</p>
          </div>
          <div className="how-card">
            <div className="how-icon">📚</div>
            <h3>Step 3: Learn</h3>
            <p>Get detailed information about your plant, including care instructions and helpful resources.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantIdentifier;
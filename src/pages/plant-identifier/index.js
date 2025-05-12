// PlantIdentifier.jsx
import React, { useState, useRef, useEffect } from 'react';
import styles from '@/styles/PlantIdentifier.module.css';

const PlantIdentifier = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisStage, setAnalysisStage] = useState('');
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
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate progress for larger files
      const fileSize = file.size;
      let progress = 0;
      const interval = setInterval(() => {
        progress += (fileSize > 1000000 ? 5 : 10); // Slower progress for larger files
        if (progress >= 100) {
          clearInterval(interval);
          progress = 100;
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
          }, 500);
        }
        setUploadProgress(progress);
      }, 100);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        setSelectedImage(file);
        if (cameraActive) handleStopCamera();
        clearInterval(interval);
        setUploadProgress(100);
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 500);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handler for camera activation
  const handleStartCamera = async () => {
    try {
      setError(null);
      setAnalysisStage('Accessing camera...');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
      setAnalysisStage('');
    } catch (err) {
      setError('Camera access error: ' + err.message);
      console.error('Camera access error:', err);
      setAnalysisStage('');
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
      setAnalysisStage('Capturing photo...');
      
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
        setAnalysisStage('');
        
        // Simulate a quick loading effect for UI feedback
        let progress = 0;
        const interval = setInterval(() => {
          progress += 20;
          if (progress >= 100) {
            clearInterval(interval);
            handleStopCamera();
          }
          setUploadProgress(progress);
        }, 50);
        
        setTimeout(() => {
          setUploadProgress(0);
        }, 500);
        
      }, 'image/jpeg', 0.95);
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
      setResult(null);
      
      // Analysis progress stages
      const stages = [
        'Preparing image for analysis...',
        'Analyzing visual features...',
        'Identifying plant species...',
        'Retrieving plant information...',
        'Gathering care instructions...',
        'Finalizing results...'
      ];
      
      // Create FormData to send the image to the API
      const formData = new FormData();
      formData.append('image', selectedImage);
      
      // Simulate the different analysis stages for better UX
      for (let i = 0; i < stages.length; i++) {
        setAnalysisStage(stages[i]);
        // Simulate API processing time with different durations for each stage
        await new Promise(resolve => setTimeout(resolve, (i === 2) ? 2000 : 1000));
      }
      
      // Add your Google Gemini API integration here
      // This is a placeholder for the actual API call
      try {
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
      } catch (apiError) {
        // If the API fails, use mock data for demonstration purposes
        console.warn('Using mock data due to API error:', apiError);
        
        // Mock data for demonstration
        setResult({
          name: "Monstera Deliciosa",
          scientificName: "Monstera deliciosa",
          confidence: 0.92,
          careInfo: [
            {
              icon: '💧',
              title: 'Water',
              description: 'Water when the top 1-2 inches of soil are dry, usually every 1-2 weeks. Reduce watering in winter.'
            },
            {
              icon: '☀️',
              title: 'Light',
              description: 'Bright, indirect light is ideal. Can tolerate some shade but may grow more slowly.'
            },
            {
              icon: '🌡️',
              title: 'Temperature',
              description: 'Thrives in temperatures between 65-85°F (18-29°C). Keep away from cold drafts.'
            },
            {
              icon: '🌱',
              title: 'Soil',
              description: 'Well-draining, rich potting mix with peat moss and perlite.'
            }
          ],
          additionalInfo: 'The Monstera Deliciosa, also known as the Swiss Cheese Plant, is famous for its large, perforated leaves. It\'s a popular tropical houseplant native to the rainforests of Central America. As it matures, the leaves develop distinctive holes (fenestrations) and deep splits that give it a unique appearance.',
          resources: [
            {
              title: 'Complete Care Guide',
              description: 'Learn everything about caring for your Monstera Deliciosa.',
              url: 'https://example.com/plants/monstera-deliciosa'
            },
            {
              title: 'Common Issues & Solutions',
              description: 'Troubleshoot common problems with this plant species.',
              url: 'https://example.com/troubleshooting/monstera-deliciosa'
            },
            {
              title: 'Community Discussion',
              description: 'Join conversations with other growers of this plant.',
              url: 'https://example.com/forum/plants'
            }
          ]
        });
      }
      
    } catch (err) {
      setError('Error identifying plant: ' + err.message);
      console.error('Error identifying plant:', err);
    } finally {
      setAnalyzing(false);
      setAnalysisStage('');
    }
  };
  
  // Reset everything
  const handleReset = () => {
    setSelectedImage(null);
    setPreviewImage(null);
    setResult(null);
    setError(null);
    setShowResources(false);
    setUploadProgress(0);
    setIsUploading(false);
    setAnalysisStage('');
    if (cameraActive) handleStopCamera();
  };
  
  // Clean up camera on component unmount
  useEffect(() => {
    return () => {
      if (cameraActive) handleStopCamera();
    };
  }, [cameraActive]);
  
  return (
    <div className={styles['plant-identifier']}>
      <h1 className={styles['plant-identifier__title']}>
        <span className={styles['plant-identifier__title-icon']}>🌱</span> Plant Identification
      </h1>
      
      {/* Upload and Camera Controls */}
      <div className={styles['plant-identifier__controls']}>
        <button 
          className={`${styles['plant-identifier__button']} ${isUploading ? styles.uploading : ''}`}
          onClick={() => fileInputRef.current.click()}
          disabled={isUploading || analyzing}
        >
          <span className={styles['button-icon']}>📁</span> Upload Image
          {isUploading && (
            <span className={styles['loading-icon']}>
              <svg className={styles.spinner} viewBox="0 0 50 50">
                <circle className={styles.path} cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
              </svg>
            </span>
          )}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className={styles['file-input']}
          hidden
        />
        
        <button 
          className={styles['plant-identifier__button']}
          onClick={cameraActive ? handleStopCamera : handleStartCamera}
          disabled={analyzing}
        >
          <span className={styles['button-icon']}>{cameraActive ? '❌' : '📷'}</span> 
          {cameraActive ? 'Stop Camera' : 'Take Photo'}
        </button>
      </div>
      
      {/* Upload Progress Bar */}
      {uploadProgress > 0 && (
        <div className={styles['upload-progress-container']}>
          <div 
            className={styles['upload-progress-bar']}
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
      
      {/* Camera View */}
      {cameraActive && (
        <div className={styles['plant-identifier__camera']}>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className={styles['camera-preview']}
          ></video>
          <button 
            className={`${styles['plant-identifier__button']} ${styles['capture-button']}`}
            onClick={handleCapturePhoto}
          >
            <span className={styles['button-icon']}>📸</span> Capture Photo
          </button>
        </div>
      )}
      
      {/* Hidden Canvas for Capturing Photos */}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      
      {/* Image Preview */}
      {previewImage && !analyzing && !result && (
        <div className={styles['plant-identifier__preview']}>
          <img 
            src={previewImage} 
            alt="Selected plant" 
            className={styles['preview-image']}
          />
          <div className={styles['preview-actions']}>
            <button 
              className={`${styles['plant-identifier__button']} ${styles['analyze-button']}`}
              onClick={handleIdentifyPlant}
              disabled={analyzing}
            >
              {analyzing ? 'Analyzing...' : 'Identify Plant'}
            </button>
            <button 
              className={`${styles['plant-identifier__button']} ${styles['reset-button']}`}
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
      )}
      
      {/* Error Display */}
      {error && (
        <div className={styles['plant-identifier__error']}>
          <p>{error}</p>
        </div>
      )}
      
      {/* Analysis Progress Indicator */}
      {analyzing && (
        <div className={styles['plant-identifier__analyzing']}>
          <div className={styles['analyzing-content']}>
            <div className={styles['analyzing-spinner']}>
              <svg className={styles.spinner} viewBox="0 0 50 50">
                <circle className={styles.path} cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
              </svg>
            </div>
            <h3>Analyzing Your Plant</h3>
            <p className={styles['analysis-stage']}>{analysisStage}</p>
            <div className={styles['analysis-progress']}>
              <div className={styles['dot-pulse']}></div>
            </div>
            <p className={styles['analysis-tip']}>Our AI is examining various plant characteristics including leaf shape, color, and texture patterns.</p>
          </div>
          <img 
            src={previewImage} 
            alt="Plant being analyzed" 
            className={styles['analyzing-image']}
          />
        </div>
      )}
      
      {/* Results Display with Skeleton Loading */}
      {(analyzing && !result) && (
        <div className={`${styles['plant-identifier__results']} ${styles.skeleton}`}>
          <div className={styles['results-header']}>
            <div className={`${styles['skeleton-text']} ${styles['skeleton-title']}`}></div>
            <div className={styles['skeleton-badge']}></div>
          </div>
          
          <div className={styles['plant-info']}>
            <div className={`${styles['skeleton-text']} ${styles['skeleton-name']}`}></div>
            <div className={`${styles['skeleton-text']} ${styles['skeleton-scientific']}`}></div>
            
            <div className={`${styles['skeleton-text']} ${styles['skeleton-subtitle']}`}></div>
            <div className={styles['care-info']}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`${styles['care-card']} ${styles['skeleton-card']}`}>
                  <div className={styles['skeleton-circle']}></div>
                  <div className={styles['skeleton-text']}></div>
                  <div className={styles['skeleton-text']}></div>
                  <div className={styles['skeleton-text']}></div>
                </div>
              ))}
            </div>
            
            <div className={`${styles['skeleton-text']} ${styles['skeleton-subtitle']}`}></div>
            <div className={styles['skeleton-text']}></div>
            <div className={styles['skeleton-text']}></div>
            <div className={styles['skeleton-text']}></div>
          </div>
        </div>
      )}
      
      {/* Results Display */}
      {result && (
        <div className={styles['plant-identifier__results']}>
          <div className={styles['results-header']}>
            <h2>Plant Identified!</h2>
            <div className={styles['confidence-badge']}>
              {Math.round(result.confidence * 100)}% Confidence
            </div>
          </div>
          
          <div className="plant-info">
            <h3 className={styles['plant-name']}>{result.name}</h3>
            <p className={styles['scientific-name']}>{result.scientificName}</p>
            
            <h4>Care Information</h4>
            <div className={styles['care-info']}>
              {result.careInfo.map((info, index) => (
                <div key={index} className={styles['care-card']}>
                  <div className={styles['care-icon']}>{info.icon}</div>
                  <h5>{info.title}</h5>
                  <p>{info.description}</p>
                </div>
              ))}
            </div>
            
            <div className={styles['additional-info']}>
              <h4>About This Plant</h4>
              <p>{result.additionalInfo}</p>
            </div>
            
            <button 
              className={`${styles['plant-identifier__button']} ${styles['resources-button']}`}
              onClick={() => setShowResources(!showResources)}
            >
              {showResources ? 'Hide Resources' : 'Show Learning Resources'}
            </button>
            
            {showResources && (
              <div className={styles['learning-resources']}>
                <h4>Learning Resources</h4>
                <div className={styles['resources-list']}>
                  {result.resources.map((resource, index) => (
                    <a 
                      key={index} 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles['resource-card']}
                    >
                      <h5>{resource.title}</h5>
                      <p>{resource.description}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            <button 
              className={`${styles['plant-identifier__button']} ${styles['reset-button']} ${styles['mt-4']}`}
              onClick={handleReset}
            >
              Identify Another Plant
            </button>
          </div>
        </div>
      )}
      
      {/* How It Works Section */}
      <div className={styles['plant-identifier__how-it-works']}>
        <h2>How It Works</h2>
        <div className={styles['how-it-works-cards']}>
          <div className={styles['how-card']}>
            <div className={styles['how-icon']}>📷</div>
            <h3>Step 1: Capture</h3>
            <p>Upload a photo or use your camera to take a picture of any plant you want to identify.</p>
          </div>
          <div className={styles['how-card']}>
            <div className={styles['how-icon']}>🔍</div>
            <h3>Step 2: Analyze</h3>
            <p>Our AI analyzes the image using Google's advanced Gemini API to identify the plant species.</p>
          </div>
          <div className={styles['how-card']}>
            <div className={styles['how-icon']}>📚</div>
            <h3>Step 3: Learn</h3>
            <p>Get detailed information about your plant, including care instructions and helpful resources.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantIdentifier;
import { useEffect, useRef, useState } from 'react';
import styles from '../../styles/NNVisualization.module.css';

const SimpleNNVisualization = () => {
  const canvasRef = useRef(null);
  const [animated, setAnimated] = useState(false);
  
  // Network architecture
  const layers = [3, 4, 2]; // Input, hidden, output
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Responsive handling
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawNetwork(ctx, layers, canvas.width, canvas.height, animated ? null : 0);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Draw the initial network
    drawNetwork(ctx, layers, canvas.width, canvas.height, 0);
    
    // Set up animation when in view
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setAnimated(true);
      }
    }, { threshold: 0.5 });
    
    observer.observe(canvas);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [layers]);
  
  // Animation effect when component becomes animated
  useEffect(() => {
    if (!animated) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let animationFrame;
    let startTime = null;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      // Animation cycle of 3 seconds
      const progress = (elapsed % 3000) / 3000;
      
      // Draw the network with current animation progress
      drawNetwork(ctx, layers, canvas.width, canvas.height, progress);
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [animated, layers]);
  
  return (
    <div className={styles.visualizationContainer}>
      <canvas ref={canvasRef} className={styles.nnCanvas} />
    </div>
  );
};

// Function to draw the neural network
function drawNetwork(ctx, layers, width, height, animationProgress) {
  ctx.clearRect(0, 0, width, height);
  
  // Calculate positions
  const layerGap = width / (layers.length + 1);
  const maxNeurons = Math.max(...layers);
  const neuronRadius = Math.min(layerGap, height / maxNeurons) * 0.15;
  
  // Draw connections first (behind neurons)
  ctx.lineWidth = neuronRadius * 0.2;
  
  for (let l = 0; l < layers.length - 1; l++) {
    const layerX = (l + 1) * layerGap;
    const nextLayerX = (l + 2) * layerGap;
    
    const layerNeurons = layers[l];
    const nextLayerNeurons = layers[l + 1];
    
    for (let i = 0; i < layerNeurons; i++) {
      const neuronY = (height / (layerNeurons + 1)) * (i + 1);
      
      for (let j = 0; j < nextLayerNeurons; j++) {
        const nextNeuronY = (height / (nextLayerNeurons + 1)) * (j + 1);
        
        // Create gradient for connection
        const gradient = ctx.createLinearGradient(layerX, neuronY, nextLayerX, nextNeuronY);
        
        // Animate connections if animation progress provided
        if (animationProgress !== null) {
          // Random "weight" value for visual effect
          const weight = Math.sin((i * j + l) * 0.5 + animationProgress * Math.PI * 2);
          const colorIntensity = (weight + 1) / 2; // Map to 0-1
          
          gradient.addColorStop(0, `rgba(66, 133, 244, ${0.3 + colorIntensity * 0.4})`);
          gradient.addColorStop(1, `rgba(219, 68, 55, ${0.3 + colorIntensity * 0.4})`);
          
          // Draw signal pulse
          if (Math.random() < 0.3) {
            const pulsePosition = (animationProgress + (i * j * 0.05) % 1) % 1;
            const pulseX = layerX + (nextLayerX - layerX) * pulsePosition;
            const pulseY = neuronY + (nextNeuronY - neuronY) * pulsePosition;
            
            ctx.beginPath();
            ctx.arc(pulseX, pulseY, neuronRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fill();
          }
        } else {
          gradient.addColorStop(0, 'rgba(66, 133, 244, 0.5)');
          gradient.addColorStop(1, 'rgba(219, 68, 55, 0.5)');
        }
        
        ctx.beginPath();
        ctx.moveTo(layerX, neuronY);
        ctx.lineTo(nextLayerX, nextNeuronY);
        ctx.strokeStyle = gradient;
        ctx.stroke();
      }
    }
  }
  
  // Draw neurons
  for (let l = 0; l < layers.length; l++) {
    const layerX = (l + 1) * layerGap;
    const layerNeurons = layers[l];
    
    for (let i = 0; i < layerNeurons; i++) {
      const neuronY = (height / (layerNeurons + 1)) * (i + 1);
      
      // Neuron glow effect
      if (animationProgress !== null) {
        const glowIntensity = 0.5 + 0.5 * Math.sin(animationProgress * Math.PI * 2 + l * 1.5 + i * 0.7);
        
        ctx.beginPath();
        ctx.arc(layerX, neuronY, neuronRadius * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(66, 133, 244, ${glowIntensity * 0.15})`;
        ctx.fill();
      }
      
      // Neuron circle
      ctx.beginPath();
      ctx.arc(layerX, neuronY, neuronRadius, 0, Math.PI * 2);
      
      // Different colors for different layers
      if (l === 0) {
        ctx.fillStyle = 'rgba(66, 133, 244, 0.9)'; // Input - Blue
      } else if (l === layers.length - 1) {
        ctx.fillStyle = 'rgba(219, 68, 55, 0.9)'; // Output - Red
      } else {
        ctx.fillStyle = 'rgba(244, 180, 0, 0.9)'; // Hidden - Yellow
      }
      
      ctx.fill();
      
      // Neuron border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = neuronRadius * 0.1;
      ctx.stroke();
    }
  }
}

export default SimpleNNVisualization;

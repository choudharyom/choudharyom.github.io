import { useEffect, useRef, useState } from 'react';
import styles from '../../styles/NNVisualization.module.css';

const MathNNVisualization = () => {
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
      drawNetworkWithMath(ctx, layers, canvas.width, canvas.height, animated ? null : 0);
    };

    window.addEventListener('resize', handleResize);

    // Draw the initial network
    drawNetworkWithMath(ctx, layers, canvas.width, canvas.height, 0);

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

      // Animation cycle of 0.7 seconds (faster)
      const progress = (elapsed % 700) / 700;

      // Draw the network with current animation progress
      drawNetworkWithMath(ctx, layers, canvas.width, canvas.height, progress);

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

// Function to draw the neural network and math overlays
function drawNetworkWithMath(ctx, layers, width, height, animationProgress) {
  ctx.clearRect(0, 0, width, height);

  // Draw equation at the top
  ctx.save();
  ctx.font = 'bold 1.4rem "Fira Sans", Arial, sans-serif';
  ctx.fillStyle = '#22223b';
  ctx.textAlign = 'center';
  ctx.globalAlpha = 0.95;
  ctx.fillText('y = σ(Wx + b)', width / 2, 38);
  ctx.globalAlpha = 1;
  ctx.restore();

  // Draw input vector (left)
  const vectorX = 60;
  const vectorY = 90;
  const vectorSpacing = 36;
  ctx.save();
  ctx.font = '1.1rem "Fira Sans", Arial, sans-serif';
  ctx.fillStyle = '#0070f3';
  ctx.textAlign = 'right';
  ctx.fillText('x =', vectorX - 18, vectorY + vectorSpacing);
  ctx.restore();

  for (let i = 0; i < 3; i++) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(vectorX, vectorY + i * vectorSpacing, 32, 32);
    ctx.fillStyle = '#e0e7ff';
    ctx.strokeStyle = '#0070f3';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
    ctx.font = 'bold 1.1rem "Fira Sans", Arial, sans-serif';
    ctx.fillStyle = '#22223b';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(['x₁', 'x₂', 'x₃'][i], vectorX + 16, vectorY + i * vectorSpacing + 16);
    ctx.restore();
  }

  // Draw weight matrix (middle)
  const matrixX = 160;
  const matrixY = 90;
  ctx.save();
  ctx.font = '1.1rem "Fira Sans", Arial, sans-serif';
  ctx.fillStyle = '#7928ca';
  ctx.textAlign = 'right';
  ctx.fillText('W =', matrixX - 18, matrixY + vectorSpacing * 2);
  ctx.restore();

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(matrixX + col * 28, matrixY + row * 28, 24, 24);
      ctx.fillStyle = '#f3e8ff';
      ctx.strokeStyle = '#7928ca';
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();
      ctx.font = '0.95rem "Fira Sans", Arial, sans-serif';
      ctx.fillStyle = '#7928ca';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('w', matrixX + col * 28 + 12, matrixY + row * 28 + 12);
      ctx.restore();
    }
  }

  // Draw output vector (right)
  const outX = 340;
  const outY = 120;
  ctx.save();
  ctx.font = '1.1rem "Fira Sans", Arial, sans-serif';
  ctx.fillStyle = '#d7263d';
  ctx.textAlign = 'right';
  ctx.fillText('y =', outX - 18, outY + vectorSpacing);
  ctx.restore();

  for (let i = 0; i < 2; i++) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(outX, outY + i * vectorSpacing * 1.2, 32, 32);
    ctx.fillStyle = '#ffe0e7';
    ctx.strokeStyle = '#d7263d';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
    ctx.font = 'bold 1.1rem "Fira Sans", Arial, sans-serif';
    ctx.fillStyle = '#d7263d';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(['y₁', 'y₂'][i], outX + 16, outY + i * vectorSpacing * 1.2 + 16);
    ctx.restore();
  }

  // Animate a "flow" from input vector through matrix to output
  if (animationProgress !== null) {
    // Animate a dot moving from x to W to y
    const t = animationProgress;
    // Path: input x2 -> matrix (row 2, col 1) -> output y1
    const start = { x: vectorX + 32, y: vectorY + vectorSpacing + 16 };
    const mid = { x: matrixX + 28, y: matrixY + 28 + 12 };
    const end = { x: outX, y: outY + 16 };

    // Interpolate position
    let dot;
    if (t < 0.5) {
      // Move from start to mid
      const tt = t / 0.5;
      dot = {
        x: start.x + (mid.x - start.x) * tt,
        y: start.y + (mid.y - start.y) * tt,
      };
    } else {
      // Move from mid to end
      const tt = (t - 0.5) / 0.5;
      dot = {
        x: mid.x + (end.x - mid.x) * tt,
        y: mid.y + (end.y - mid.y) * tt,
      };
    }
    ctx.save();
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,112,243,0.85)';
    ctx.shadowColor = '#0070f3';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.restore();

    // Draw arrow from x to W and W to y
    ctx.save();
    ctx.strokeStyle = '#0070f3';
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(mid.x, mid.y);
    ctx.stroke();
    ctx.strokeStyle = '#d7263d';
    ctx.beginPath();
    ctx.moveTo(mid.x, mid.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  // Draw the neural network as before, but faded in the background
  ctx.save();
  ctx.globalAlpha = 0.18;
  drawNetwork(ctx, layers, width, height, animationProgress);
  ctx.globalAlpha = 1;
  ctx.restore();
}

// Original network drawing function (unchanged)
function drawNetwork(ctx, layers, width, height, animationProgress) {
  // ... (same as in SimpleNNVisualization.js)
  // [You can copy the original drawNetwork function here if needed]
}

export default MathNNVisualization;

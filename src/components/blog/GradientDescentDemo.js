import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import Chart from 'chart.js/auto';
import styles from './GradientDescentDemo.module.css';


// --- Configuration ---
const PLANE_SIZE = 8; // Size of the x-z plane
const PLANE_SEGMENTS = 40; // Resolution of the surface mesh
const INITIAL_POS = { x: 3.5, z: 3 }; // Starting point
const MAX_ITERATIONS = 200;

// --- Loss Functions & Gradients ---
const lossFunctions = {
  quadratic: {
    name: 'Simple Bowl (x² + z²)',
    func: (x, z) => x * x + z * z,
    grad: (x, z) => new THREE.Vector3(2 * x, 0, 2 * z), // Gradient in 3D space (y component is 0)
    bounds: { x: [-4, 4], z: [-4, 4], yMax: 32 }, // Approx bounds for visualization
  },
  himmelblau: {
    name: "Himmelblau's Function",
    func: (x, z) => Math.pow(x * x + z - 11, 2) + Math.pow(x + z * z - 7, 2),
    grad: (x, z) => {
      const dx = 2 * (x * x + z - 11) * (2 * x) + 2 * (x + z * z - 7);
      const dz = 2 * (x * x + z - 11) + 2 * (x + z * z - 7) * (2 * z);
      return new THREE.Vector3(dx, 0, dz);
    },
    bounds: { x: [-5, 5], z: [-5, 5], yMax: 400 }, // Approx bounds
  },
  // Add more functions here (e.g., Rastrigin, Beale)
};

// --- Helper: Generate Surface Geometry ---
const generateSurfaceGeometry = (lossFnData) => {
  const { func, bounds } = lossFnData;
  const geometry = new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE, PLANE_SEGMENTS, PLANE_SEGMENTS);
  const positions = geometry.attributes.position.array;
  const colors = [];
  const yMin = 0; // Assume min loss is 0 for color mapping
  const yMax = bounds.yMax; // Use defined max Y for color mapping

  const colorScale = (y) => {
    const t = Math.min(1, Math.max(0, (y - yMin) / (yMax - yMin))); // Normalize y
    // Simple blue (low) to red (high) gradient
    const color = new THREE.Color();
    color.setHSL(0.7 * (1 - t), 0.8, 0.5 + 0.3 * t);
    return color;
  };

  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const z = positions[i + 2]; // Note: z is the third component in PlaneGeometry
    const y = func(x, z);
    positions[i + 1] = y; // Set the height (y-coordinate)

    const color = colorScale(y);
    colors.push(color.r, color.g, color.b);
  }

  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals(); // For lighting
  return geometry;
};


// --- 3D Components ---

// Represents the particle moving on the surface
const Particle = ({ position }) => {
  return (
    <Sphere args={[0.1, 16, 16]} position={position}>
      <meshStandardMaterial color="yellow" emissive="orange" emissiveIntensity={0.5} />
    </Sphere>
  );
};

// Visualizes the gradient vector
const GradientArrow = ({ position, direction }) => {
  const arrowRef = useRef();

  // Use useMemo to create/update the ArrowHelper instance
  const arrow = useMemo(() => {
    if (!direction || direction.length() < 1e-4) return null;

    const displayDirection = direction.clone().normalize();
    const length = Math.min(2, direction.length() * 0.1 + 0.3);
    const color = 0xff0000; // Red

    // Create a new ArrowHelper instance
    const helper = new THREE.ArrowHelper(displayDirection, position, length, color, 0.2, 0.1);
    return helper;

  }, [position, direction]); // Recreate if position or direction changes

  // Update position and direction imperatively if needed (optional optimization)
  useFrame(() => {
    if (arrowRef.current && direction && direction.length() >= 1e-4) {
      arrowRef.current.position.copy(position);
      arrowRef.current.setDirection(direction.clone().normalize());
      const length = Math.min(2, direction.length() * 0.1 + 0.3);
      arrowRef.current.setLength(length, 0.2, 0.1);
    }
  });

  if (!arrow) return null;

  // Use the 'primitive' object to render the existing THREE object
  return <primitive object={arrow} ref={arrowRef} />;
};

// Renders the loss surface mesh
const LossSurface = ({ lossFnData }) => {
  const geometry = useMemo(() => generateSurfaceGeometry(lossFnData), [lossFnData]);

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Rotate plane to align with x-z */}
      <meshStandardMaterial vertexColors={true} side={THREE.DoubleSide} metalness={0.2} roughness={0.8} />
    </mesh>
  );
};

// Draws the path taken by the particle
const PathLine = ({ points }) => {
  if (points.length < 2) return null;
  return <Line points={points} color="lime" lineWidth={3} />;
};


// --- Main Demo Component ---
const GradientDescentDemo = () => {
  const [learningRate, setLearningRate] = useState(0.01);
  const [selectedFnKey, setSelectedFnKey] = useState(Object.keys(lossFunctions)[0]);
  const [params, setParams] = useState({ x: INITIAL_POS.x, z: INITIAL_POS.z });
  const [path, setPath] = useState([]); // Array of [x, y, z] points
  const [lossHistory, setLossHistory] = useState([]);
  const [gradient, setGradient] = useState(new THREE.Vector3(0, 0, 0));
  const [currentLoss, setCurrentLoss] = useState(0);
  const [iteration, setIteration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const animationFrameId = useRef(null);
  const chartRef = useRef(null); // Ref for the canvas element
  const chartInstance = useRef(null); // Ref for the Chart object

  const lossFnData = useMemo(() => lossFunctions[selectedFnKey], [selectedFnKey]);

  // --- Core Gradient Descent Step ---
  const performStep = useCallback(() => {
    setParams((prevParams) => {
      const currentX = prevParams.x;
      const currentZ = prevParams.z;

      // 1. Calculate Loss at current position
      const loss = lossFnData.func(currentX, currentZ);
      setCurrentLoss(loss); // Update displayed loss

      // 2. Calculate Gradient at current position
      const grad = lossFnData.grad(currentX, currentZ);
      setGradient(grad); // Update displayed gradient

      // 3. Update Parameters
      const nextX = currentX - learningRate * grad.x;
      const nextZ = currentZ - learningRate * grad.z;

      // Clamp parameters within reasonable bounds if needed (optional)
      const clampedX = Math.max(lossFnData.bounds.x[0], Math.min(lossFnData.bounds.x[1], nextX));
      const clampedZ = Math.max(lossFnData.bounds.z[0], Math.min(lossFnData.bounds.z[1], nextZ));

      const nextParams = { x: clampedX, z: clampedZ };

      // 4. Update Path and Loss History
      const nextLoss = lossFnData.func(nextParams.x, nextParams.z); // Loss at *next* point for path
      setPath((prevPath) => [...prevPath, [nextParams.x, nextLoss + 0.02, nextParams.z]]); // Add slight y-offset for visibility
      setLossHistory((prev) => [...prev, loss]); // Record loss *before* the step
      setIteration((i) => i + 1);

      // Check for convergence (optional)
      if (grad.length() < 1e-3 || iteration >= MAX_ITERATIONS -1) {
        console.log("Converged or max iterations reached.");
        setIsRunning(false);
      }

      return nextParams;
    });
  }, [learningRate, lossFnData, iteration]); // Dependencies

  // --- Animation Loop ---
  useEffect(() => {
    if (isRunning && iteration < MAX_ITERATIONS) {
      animationFrameId.current = requestAnimationFrame(performStep);
    } else {
      cancelAnimationFrame(animationFrameId.current);
    }
    // Cleanup function
    return () => cancelAnimationFrame(animationFrameId.current);
  }, [isRunning, performStep, iteration]); // Rerun effect if isRunning or performStep changes

  // --- Reset Function ---
  const handleReset = useCallback(() => {
    setIsRunning(false);
    setParams({ x: INITIAL_POS.x, z: INITIAL_POS.z });
    const initialLoss = lossFnData.func(INITIAL_POS.x, INITIAL_POS.z);
    setPath([[INITIAL_POS.x, initialLoss + 0.02, INITIAL_POS.z]]); // Start path at initial point
    setLossHistory([]);
    setIteration(0);
    setCurrentLoss(initialLoss);
    setGradient(lossFnData.grad(INITIAL_POS.x, INITIAL_POS.z));
  }, [lossFnData]); // Dependency on lossFnData

  // --- Initialize/Reset on Function Change ---
  useEffect(() => {
    handleReset();
  }, [selectedFnKey, handleReset]); // Reset when function changes

  // --- Chart.js Integration ---
  useEffect(() => {
    if (chartRef.current) {
      // Destroy previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      // Create new chart instance
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: lossHistory.map((_, i) => i + 1), // Iteration numbers
          datasets: [{
            label: 'Loss',
            data: lossHistory,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            pointRadius: 1,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Loss' }
            },
            x: {
              title: { display: true, text: 'Iteration' }
            }
          },
          animation: {
            duration: 0 // Disable animation for faster updates
          }
        }
      });
    }
    // Cleanup chart on component unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []); // Run only once on mount to initialize

  // Update chart data when lossHistory changes
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.data.labels = lossHistory.map((_, i) => i + 1);
      chartInstance.current.data.datasets[0].data = lossHistory;
      chartInstance.current.update();
    }
  }, [lossHistory]);


  // --- Event Handlers ---
  const handleRunToggle = () => setIsRunning(!isRunning);
  const handleStep = () => {
      if (!isRunning && iteration < MAX_ITERATIONS) {
          performStep();
      }
  };
  const handleLearningRateChange = (e) => setLearningRate(parseFloat(e.target.value));
  const handleLossFnChange = (e) => setSelectedFnKey(e.target.value);

  // Calculate particle position including Y (loss)
  const particlePosition = useMemo(() => {
      const y = lossFnData.func(params.x, params.z);
      return new THREE.Vector3(params.x, y + 0.02, params.z); // Add slight offset
  }, [params, lossFnData]);

  // Calculate gradient position (same as particle)
   const gradientPosition = useMemo(() => {
      const y = lossFnData.func(params.x, params.z);
      return new THREE.Vector3(params.x, y + 0.05, params.z); // Slightly higher offset
  }, [params, lossFnData]);


  return (
    <div className={styles.container}>
      {/* --- Controls & Info --- */}
      <div className={styles.controlsAndInfo}>
        <div className={styles.controlsSection}>
          <label htmlFor="lossFnSelect">Loss Function:</label>
          <select id="lossFnSelect" value={selectedFnKey} onChange={handleLossFnChange}>
            {Object.entries(lossFunctions).map(([key, data]) => (
              <option key={key} value={key}>{data.name}</option>
            ))}
          </select>

          <label htmlFor="lrSlider">Learning Rate ({learningRate.toFixed(3)}):</label>
          <input
            type="range"
            id="lrSlider"
            min="0.001"
            max="0.1" // Adjust max LR based on functions
            step="0.001"
            value={learningRate}
            onChange={handleLearningRateChange}
            disabled={isRunning}
          />
          <div className={styles.buttonGroup}>
            <button onClick={handleStep} disabled={isRunning || iteration >= MAX_ITERATIONS}>Step</button>
            <button onClick={handleRunToggle} disabled={iteration >= MAX_ITERATIONS}>
              {isRunning ? 'Pause' : 'Run'}
            </button>
            <button onClick={handleReset} className={styles.resetButton}>Reset</button>
          </div>
        </div>

        <div className={styles.infoSection}>
          <p><strong>Iteration:</strong> {iteration}</p>
          <p><strong>Position (x, z):</strong> ({params.x.toFixed(2)}, {params.z.toFixed(2)})</p>
          <p><strong>Loss:</strong> {currentLoss.toFixed(3)}</p>
          <p><strong>Gradient (dx, dz):</strong> ({gradient.x.toFixed(2)}, {gradient.z.toFixed(2)})</p>
          <p><strong>Gradient Mag:</strong> {gradient.length().toFixed(3)}</p>
        </div>
      </div>

      {/* --- Visualization --- */}
      <div className={styles.visualizationContainer}>
        {/* 3D Canvas */}
        <div className={styles.canvasContainer}>
          <Canvas camera={{ position: [0, PLANE_SIZE * 1.2, PLANE_SIZE * 1.2], fov: 50 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 10, 7]} intensity={0.8} castShadow />
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />

            <LossSurface lossFnData={lossFnData} />
            <Particle position={particlePosition} />
            <GradientArrow position={gradientPosition} direction={gradient.clone().multiplyScalar(-1)} /> {/* Point opposite gradient */}
            <PathLine points={path} />

            {/* Optional: Add axes helpers */}
            {/* <axesHelper args={[PLANE_SIZE / 2]} /> */}
            <gridHelper args={[PLANE_SIZE, PLANE_SEGMENTS, '#888', '#ccc']} rotation={[0, 0, 0]} position={[0, -0.01, 0]}/>
          </Canvas>
        </div>

        {/* Loss Chart */}
        <div className={styles.chartContainer}>
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default GradientDescentDemo;

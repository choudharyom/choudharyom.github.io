import React, { useState, useMemo, useCallback } from 'react';
import styles from './MatrixTransformationDemo.module.css';

// --- Component Constants ---
const SVG_VIEWBOX_SIZE = 400; // Internal coordinate system size
const SCALE_FACTOR = 40; // Pixels per unit in the coordinate system
const GRID_RANGE = 5; // How many units the grid extends from the origin
const VECTOR_SCALE = 0.95; // Slightly shorten vectors to prevent arrowhead overlap

const initialMatrix = { a: 1, b: 0, c: 0, d: 1 };

const originalVectors = [
  { x: 1, y: 0, color: 'red', id: 'i' },
  { x: 0, y: 1, color: 'blue', id: 'j' },
  { x: 1, y: 1, color: 'purple', id: 'k' },
  { x: -1, y: 0.5, color: 'green', id: 'l' },
];

const presets = {
  Identity: { a: 1, b: 0, c: 0, d: 1 },
  Rotate90: { a: 0, b: -1, c: 1, d: 0 },
  Scale: { a: 1.5, b: 0, c: 0, d: 1.5 },
  Shear: { a: 1, b: 0.5, c: 0, d: 1 },
  ReflectY: { a: 1, b: 0, c: 0, d: -1 },
  ReflectX: { a: -1, b: 0, c: 0, d: 1 },
};

// --- Helper Functions ---
const transformPoint = (x, y, matrix) => {
  // Ensure matrix values are numbers, default to identity if invalid
  const a = Number(matrix.a) || (matrix.a === 0 ? 0 : 1);
  const b = Number(matrix.b) || 0;
  const c = Number(matrix.c) || 0;
  const d = Number(matrix.d) || (matrix.d === 0 ? 0 : 1);

  return {
    x: a * x + b * y,
    y: c * x + d * y,
  };
};

// --- React Component ---
const MatrixTransformationDemo = () => {
  const [matrix, setMatrix] = useState(initialMatrix);

  // Memoize transformed vectors to avoid recalculation on every render
  const transformedVectors = useMemo(() => {
    return originalVectors.map(v => ({
      ...v, // Keep original properties like color, id
      ...transformPoint(v.x, v.y, matrix), // Add transformed x, y
    }));
  }, [matrix]); // Recalculate only when matrix changes

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    // Allow empty string, '-', '.' for typing, otherwise parse as float
    const isValidPartial = value === '' || value === '-' || value === '.' || value === '-.';
    const parsedValue = parseFloat(value);

    if (isValidPartial || !isNaN(parsedValue)) {
       setMatrix(prev => ({
           ...prev,
           // Store the raw string if it's a valid partial, otherwise the number or keep old if invalid
           [name]: isValidPartial ? value : (!isNaN(parsedValue) ? parsedValue : prev[name])
       }));
    } else if (value === '') { // Explicitly handle clearing the input
        setMatrix(prev => ({ ...prev, [name]: '' }));
    }
    // Basic validation is handled by input type="number", but this allows intermediate states
  }, []);

   // Ensure matrix values used for calculation are valid numbers
   const safeMatrix = useMemo(() => ({
        a: Number(matrix.a) || (matrix.a === 0 ? 0 : 1),
        b: Number(matrix.b) || 0,
        c: Number(matrix.c) || 0,
        d: Number(matrix.d) || (matrix.d === 0 ? 0 : 1),
   }), [matrix]);


  const applyPreset = useCallback((presetName) => {
    setMatrix(presets[presetName]);
  }, []);

  const handleReset = useCallback(() => {
    setMatrix(initialMatrix);
  }, []);

  // --- SVG Coordinate Calculations ---
  const originX = SVG_VIEWBOX_SIZE / 2;
  const originY = SVG_VIEWBOX_SIZE / 2;

  // Function to convert math coordinates to SVG coordinates
  const toSvgCoords = (x, y) => ({
    svgX: originX + x * SCALE_FACTOR,
    svgY: originY - y * SCALE_FACTOR, // Flip Y-axis
  });

  // --- Render Grid Lines (Transformed) ---
  const renderGridLines = () => {
    const lines = [];
    const lineLength = SVG_VIEWBOX_SIZE * 1.5; // Extend lines beyond viewbox

    // Transformed basis vectors define the grid orientation
    const iPrime = transformPoint(1, 0, safeMatrix);
    const jPrime = transformPoint(0, 1, safeMatrix);

    for (let i = -GRID_RANGE; i <= GRID_RANGE; i++) {
      // Lines parallel to transformed Y-axis (along iPrime direction)
      const startYParallel = transformPoint(i, -GRID_RANGE, safeMatrix);
      const endYParallel = transformPoint(i, GRID_RANGE, safeMatrix);
      const svgStartYP = toSvgCoords(startYParallel.x, startYParallel.y);
      const svgEndYP = toSvgCoords(endYParallel.x, endYParallel.y);
       lines.push(
         <line
           key={`grid-v-${i}`}
           x1={svgStartYP.svgX} y1={svgStartYP.svgY}
           x2={svgEndYP.svgX} y2={svgEndYP.svgY}
           className={styles.gridLine}
         />
       );


      // Lines parallel to transformed X-axis (along jPrime direction)
      const startXParallel = transformPoint(-GRID_RANGE, i, safeMatrix);
      const endXParallel = transformPoint(GRID_RANGE, i, safeMatrix);
      const svgStartXP = toSvgCoords(startXParallel.x, startXParallel.y);
      const svgEndXP = toSvgCoords(endXParallel.x, endXParallel.y);
       lines.push(
         <line
           key={`grid-h-${i}`}
           x1={svgStartXP.svgX} y1={svgStartXP.svgY}
           x2={svgEndXP.svgX} y2={svgEndXP.svgY}
           className={styles.gridLine}
         />
       );
    }
    return <g id="transformed-grid">{lines}</g>;
  };


  // --- Render Vectors ---
  const renderVectors = (vectors, isTransformed = false) => {
    return vectors.map((v) => {
      const { svgX: startX, svgY: startY } = toSvgCoords(0, 0);
      // Use transformed coords if isTransformed, else original
      const endMathX = (isTransformed ? v.x : v.x) * VECTOR_SCALE;
      const endMathY = (isTransformed ? v.y : v.y) * VECTOR_SCALE;
      const { svgX: endX, svgY: endY } = toSvgCoords(endMathX, endMathY);

      // Avoid drawing zero-length vectors
      if (Math.abs(endMathX) < 1e-6 && Math.abs(endMathY) < 1e-6 && isTransformed) {
          return null; // Don't draw transformed zero vector
      }
       if (Math.abs(v.x) < 1e-6 && Math.abs(v.y) < 1e-6 && !isTransformed) {
          return null; // Don't draw original zero vector
      }


      // Label position calculation (slightly offset from arrowhead)
      const angle = Math.atan2(endMathY, endMathX); // Angle in math coords
      const labelOffset = 15 / SCALE_FACTOR; // Offset in math units
      const labelX = endMathX + labelOffset * Math.cos(angle);
      const labelY = endMathY + labelOffset * Math.sin(angle);
      const { svgX: labelSvgX, svgY: labelSvgY } = toSvgCoords(labelX, labelY);


      return (
        <g key={`${v.id}-${isTransformed ? 'transformed' : 'original'}`}>
          <line
            x1={startX} y1={startY}
            x2={endX} y2={endY}
            stroke={v.color}
            className={isTransformed ? styles.transformedVector : styles.originalVector}
            markerEnd={`url(#arrowhead-${v.color})`}
          />
          {/* Add labels only to transformed vectors for clarity */}
          {isTransformed && (
             <text
                x={labelSvgX}
                y={labelSvgY}
                fill={v.color}
                className={styles.vectorLabel}
                // transform={`scale(1, -1)`} // Not needed if coords are already flipped
             >
                {v.id}'
             </text>
          )}
        </g>
      );
    });
  };

  return (
    <div className={styles.container}>
      {/* --- Control Panel --- */}
      <div className={styles.controlsContainer}>
        {/* Matrix Inputs */}
        <div className={styles.matrixInputs} aria-labelledby="matrix-label">
           <span id="matrix-label" style={{ gridColumn: '1 / -1', textAlign: 'center', fontWeight:'bold', marginBottom:'5px' }}>Transformation Matrix</span>
          <label htmlFor="matrix-a">a:</label>
          <input type="number" step="0.1" id="matrix-a" name="a" value={matrix.a} onChange={handleInputChange} />
          <label htmlFor="matrix-b">b:</label>
          <input type="number" step="0.1" id="matrix-b" name="b" value={matrix.b} onChange={handleInputChange} />
          <label htmlFor="matrix-c">c:</label>
          <input type="number" step="0.1" id="matrix-c" name="c" value={matrix.c} onChange={handleInputChange} />
          <label htmlFor="matrix-d">d:</label>
          <input type="number" step="0.1" id="matrix-d" name="d" value={matrix.d} onChange={handleInputChange} />
        </div>

        {/* Buttons */}
        <div className={styles.buttonsPanel}>
           <div className={styles.presetButtons} aria-label="Preset Transformations">
             {Object.keys(presets).map(name => (
               <button key={name} onClick={() => applyPreset(name)}>
                 {name}
               </button>
             ))}
           </div>
           <button onClick={handleReset} className={styles.resetButton}>
             Reset (Identity)
           </button>
        </div>
      </div>

      {/* --- SVG Visualization --- */}
      <div className={styles.svgContainer}>
        <svg
          className={styles.svgVisualization}
          viewBox={`0 0 ${SVG_VIEWBOX_SIZE} ${SVG_VIEWBOX_SIZE}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Define arrowheads for each color */}
            {originalVectors.map(v => (
              <marker
                key={`arrowhead-${v.color}`}
                id={`arrowhead-${v.color}`}
                viewBox="0 0 10 10" refX="8" refY="5"
                markerWidth="5" markerHeight="5" // Smaller arrowhead
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill={v.color} />
              </marker>
            ))}
          </defs>

          {/* Render Grid Lines */}
          {renderGridLines()}

          {/* Axes */}
          <g id="axes">
            <line
              x1="0" y1={originY} x2={SVG_VIEWBOX_SIZE} y2={originY}
              className={styles.axisLine}
            />
            <line
              x1={originX} y1="0" x2={originX} y2={SVG_VIEWBOX_SIZE}
              className={styles.axisLine}
            />
             {/* Axis Labels */}
             <text x={SVG_VIEWBOX_SIZE - 10} y={originY - 5} fontSize="12" fill="#555">x</text>
             <text x={originX + 5} y="15" fontSize="12" fill="#555">y</text>
          </g>

          {/* Render Original Vectors (Faded) */}
          <g id="original-vectors">
            {renderVectors(originalVectors, false)}
          </g>

          {/* Render Transformed Vectors */}
          <g id="transformed-vectors">
            {renderVectors(transformedVectors, true)}
          </g>

        </svg>
      </div>
    </div>
  );
};

export default MatrixTransformationDemo;

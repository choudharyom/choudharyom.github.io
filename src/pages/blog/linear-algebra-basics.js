import Head from 'next/head';
import BlogPostLayout from '@/components/layout/BlogPostLayout';
import { useEffect } from 'react';
import styles from '@/styles/BlogPost.module.css';
import MatrixTransformationDemo from '@/components/blog/MatrixTransformationDemo';
import GradientDescentDemo from '@/components/blog/GradientDescentDemo'; 

// --- Define Meta and Author Data Once ---
const pageMeta = {
  id: 'la-basics', // Added ID
  slug: 'linear-algebra-basics', // Added slug
  title: 'Linear Algebra Basics for Machine Learning',
  description: 'A comprehensive overview of essential linear algebra concepts that form the mathematical foundation of modern machine learning algorithms.',
  coverImage: '/images/placeholder-la.jpg', // Added cover image path
  canonicalUrl: "https://choudharyom.com/blog/linear-algebra-basics",
  date: "2025-04-23",
  readingTime: "10 min read",
  tags: ['linear-algebra', 'machine-learning', 'mathematics', 'vectors', 'matrices'],
  content: `
      <p>Linear algebra is a fundamental mathematical tool for anyone working in machine learning. It provides the language and operations needed to work with data in high-dimensional spaces.</p>
      <h2>Vectors and Matrices</h2>
      <p>At its core, linear algebra deals with vectors (arrays of numbers) and matrices (grids of numbers). In machine learning, datasets are often represented as matrices, where rows might be samples and columns are features. Vectors can represent individual data points or model parameters.</p>
      <h2>Key Operations</h2>
      <p>Operations like matrix multiplication, dot products, and finding determinants or inverses are crucial. For example, matrix multiplication is used extensively in neural network layers to transform input data.</p>
      <p>Understanding these concepts is essential for grasping how many machine learning algorithms, from linear regression to deep learning models, actually work under the hood.</p>
    ` // Added basic content
  };

const pageAuthor = {
  name: "Om Choudhary",
  title: 'Software Architect👾',
  bio: 'I write about machine learning, neural networks, and mathematical foundations of AI. Currently working on research in deep learning optimization.',
  imageUrl: "/images/AuthorOm.png",
};
// --- End Data Definition ---

const LinearAlgebraBasics = () => {
  useEffect(() => {
    // MathJax typesetting
    if (typeof window !== 'undefined' && window.MathJax) {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
    }
    // Prism.js syntax highlighting
    if (typeof window !== 'undefined' && window.Prism) {
      window.Prism.highlightAll();
    }
  }, []);

  // --- Manually defined correlated data points (centered around 0,0) ---
  // Simulating data roughly along y = 0.7x with some noise
  const pcaDataPoints = [
    [ 2.5,  1.8], [ 2.8,  2.1], [ 2.2,  1.5], [ 3.1,  2.0], [ 2.0,  1.2],
    [ 1.5,  1.1], [ 1.8,  1.4], [ 1.2,  0.8], [ 2.1,  1.6], [ 1.0,  0.5],
    [ 0.8,  0.6], [ 0.5,  0.4], [ 1.1,  0.9], [ 0.2,  0.1], [ 0.9,  0.7],
    [-0.1, -0.0], [-0.5, -0.3], [-0.2, -0.2], [ 0.3,  0.3], [-0.8, -0.5],
    [-1.2, -0.8], [-1.0, -0.7], [-1.5, -1.0], [-0.7, -0.6], [-1.8, -1.2],
    [-2.1, -1.5], [-1.9, -1.3], [-2.5, -1.7], [-2.2, -1.6], [-2.8, -1.9],
    [ 2.6,  1.6], [ 1.3,  1.2], [ 0.6,  0.7], [-0.4, -0.1], [-1.1, -0.9],
    [-2.0, -1.4], [-2.6, -1.8], [ 2.9,  1.9], [ 1.7,  1.0], [ 0.1,  0.2],
    [-0.9, -0.4], [-1.6, -1.1], [-2.3, -1.5], [ 2.3,  1.7], [ 1.9,  1.3],
    [ 0.4,  0.5], [-0.6, -0.4], [-1.3, -1.0], [-2.4, -1.6], [ 3.0,  2.2]
  ];

  // --- Principal Component Vector Definitions (Example) ---
  // Assume PC1 is roughly along the angle 35 degrees (0.61 rad)
  // Assume PC2 is perpendicular (35 + 90 = 125 degrees, or 2.18 rad)
  const pcAngle1 = 0.61; // Radians (~35 degrees)
  const pcLength1 = 3.0; // Represents larger eigenvalue / variance
  const pcAngle2 = pcAngle1 + Math.PI / 2; // Perpendicular
  const pcLength2 = 1.2; // Represents smaller eigenvalue / variance

  const pc1_x = pcLength1 * Math.cos(pcAngle1);
  const pc1_y = pcLength1 * Math.sin(pcAngle1);
  const pc2_x = pcLength2 * Math.cos(pcAngle2);
  const pc2_y = pcLength2 * Math.sin(pcAngle2);

  const scaleFactor = 40; // Pixels per unit

  return (
    <BlogPostLayout meta={pageMeta} author={pageAuthor}>
      <div className={styles.content}>
            {/* Render meta line here if BlogPostLayout doesn't */}
            {/* MathJax script for client-side rendering */}
            <section>
          <p>
            Linear algebra forms the mathematical foundation of machine learning. Whether you're implementing a simple linear regression or building complex neural networks, understanding how vectors, matrices, and their operations work is essential. In this post, we'll explore the fundamental concepts of linear algebra that are most relevant to machine learning, with a focus on intuition backed by mathematical precision.
          </p>

          <div className="highlight">
            <h3>What you'll learn:</h3>
            <ul>
              <li>Vector operations and their geometric interpretations</li>
              <li>Matrix transformations and why they matter for ML</li>
              <li>Eigenvalues and eigenvectors in dimensionality reduction</li>
              <li>How linear algebra powers optimization in machine learning</li>
            </ul>
          </div>

          <h2 id="vectors-foundation">Vectors: The Foundation of Linear Algebra</h2>
          <p>
            At the heart of machine learning lies data, often represented as vectors. A vector is not just a list of numbers—it's a mathematical entity with magnitude and direction, living in an n-dimensional space. For machine learning practitioners, vectors typically represent features of our data points.
          </p>

          <p>
            Formally, an n-dimensional vector {'\(\vec{v} \in \mathbb{R}^n\)'} is written as:
          </p>

          <div className="highlight">
            <p>
              {'$$\vec{v} = \begin{bmatrix} v_1 \\ v_2 \\ \vdots \\ v_n \end{bmatrix}$$'}
            </p>
          </div>

          <p>
            Vector operations form the building blocks of machine learning algorithms. Let's examine the most critical ones:
          </p>

          <h3 id="vector-addition">Vector Addition and Scalar Multiplication</h3>
          <p>
            For vectors {'\(\vec{u}\)'} and {'\(\vec{v}\) '}in {'\(\mathbb{R}^n\)'}, addition is performed element-wise:
          </p>

          <div className="highlight">
            <p>
              {'$$\vec{u} + \vec{v} = \begin{bmatrix} u_1 + v_1 \\ u_2 + v_2 \\ \vdots \\ u_n + v_n \end{bmatrix}$$'}
            </p>
          </div>

          <p>
            While scalar multiplication scales a vector by a constant \(c\):
          </p>

          <div className="highlight">
            <p>
              {'$$c\vec{v} = \begin{bmatrix} c \cdot v_1 \\ c \cdot v_2 \\ \vdots \\ c \cdot v_n \end{bmatrix}$$'}
            </p>
          </div>

          <div className="figure-container">
            {/* --- SVG START --- */}
            <svg width="500" height="300" xmlns="http://www.w3.org/2000/svg" style={{ border: '1px solid #eee', fontFamily: 'sans-serif' }}>
              <title>Vector Addition: u + v</title>
              <desc>Illustration of adding vector u=(3,1) and vector v=(1,2) using the parallelogram law. The resultant vector u+v=(4,3) is shown.</desc>

              <defs>
                {/* Arrowhead Marker Definition */}
                <marker id="arrowhead" viewBox="0 0 10 10" refX="8" refY="5"
                    markerWidth="6" markerHeight="6"
                    orient="auto-start-reverse">
                  {/* Use context-stroke to inherit color from the line */}
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" />
                </marker>
              </defs>

              {/* Coordinate System Group: Apply transformations here */}
              {/* Origin at SVG (50, 250), Scale: 1 unit = 50px, Flip Y-axis */}
              <g id="coordinate-system" transform="translate(50, 250) scale(1, -1)">

                {/* Grid Lines */}
                <g id="grid" stroke="#e0e0e0" strokeWidth="0.5">
                  {/* Vertical Lines (x = -1 to 8) */}
                  {[...Array(10)].map((_, i) => (
                    <line key={`vgrid-${i}`} x1={(i - 1) * 50} y1="-100" x2={(i - 1) * 50} y2="200" />
                  ))}
                  {/* Horizontal Lines (y = -1 to 4) */}
                  {[...Array(6)].map((_, i) => (
                    <line key={`hgrid-${i}`} x1="-100" y1={(i - 1) * 50} x2="450" y2={(i - 1) * 50} />
                  ))}
                </g>

                {/* Axes */}
                <line id="x-axis" x1="-100" y1="0" x2="450" y2="0" stroke="#888" strokeWidth="1.5" />
                <line id="y-axis" x1="0" y1="-100" x2="0" y2="200" stroke="#888" strokeWidth="1.5" />

                {/* Axis Labels (need to counteract the y-flip) */}
                <text x="440" y="-10" transform="scale(1, -1)" fontSize="14" fill="#333" textAnchor="middle">x</text>
                <text x="10" y="-190" transform="scale(1, -1)" fontSize="14" fill="#333" textAnchor="start">y</text>

                {/* Origin Mark */}
                <circle cx="0" cy="0" r="3" fill="#333" />
                <text x="5" y="15" transform="scale(1, -1)" fontSize="12" fill="#333">O</text>

                {/* --- Vectors --- */}
                {/* Vector u = (3, 1) -> (3*50, 1*50) = (150, 50) */}
                <line x1="0" y1="0" x2="150" y2="50" stroke="blue" strokeWidth="2" markerEnd="url(#arrowhead)" />
                <text x="155" y="-60" transform="scale(1, -1)" fill="blue" fontSize="14">u</text>

                {/* Vector v = (1, 2) -> (1*50, 2*50) = (50, 100) */}
                <line x1="0" y1="0" x2="50" y2="100" stroke="green" strokeWidth="2" markerEnd="url(#arrowhead)" />
                <text x="55" y="-110" transform="scale(1, -1)" fill="green" fontSize="14">v</text>

                {/* Resultant Vector u+v = (4, 3) -> (4*50, 3*50) = (200, 150) */}
                <line x1="0" y1="0" x2="200" y2="150" stroke="red" strokeWidth="2.5" markerEnd="url(#arrowhead)" />
                <text x="210" y="-160" transform="scale(1, -1)" fill="red" fontSize="14" fontWeight="bold">u+v</text>

                {/* --- Parallelogram Lines (dashed) --- */}
                {/* Line from end of u (150, 50) to end of u+v (200, 150) */}
                <line x1="150" y1="50" x2="200" y2="150" stroke="gray" strokeWidth="1" strokeDasharray="4 2" />
                {/* Line from end of v (50, 100) to end of u+v (200, 150) */}
                <line x1="50" y1="100" x2="200" y2="150" stroke="gray" strokeWidth="1" strokeDasharray="4 2" />

              </g>
            </svg>
            {/* --- SVG END --- */}
            <p className="figure-caption">Figure 1: Geometric interpretation of vector addition shows how vectors combine to form a resultant vector following the parallelogram law.</p>
          </div>

          <h3 id="dot-product">Dot Product and Its Significance</h3>
          <p>
            The dot product (or inner product) between vectors {'\(\vec{u}\)'} and {'\(\vec{v}\)'} is defined as:
          </p>

          <div className="highlight">
            <p>
              {'$$\vec{u} \cdot \vec{v} = \sum_{i=1}^{n} u_i v_i = u_1v_1 + u_2v_2 + \ldots + u_nv_n$$'}
            </p>
          </div>

          <p>
            This operation yields a scalar value that has profound geometric significance: it relates to the cosine of the angle between the vectors:
          </p>

          <div className="highlight">
            <p>
              {'$$\vec{u} \cdot \vec{v} = \|\vec{u}\| \|\vec{v}\| \cos\theta$$'}
            </p>
            <p>Where:</p>
            <ul>
              <li>{'\(\|\vec{u}\|\)'} and {'\(\|\vec{v}\|\)'} are the magnitudes of the vectors</li>
              <li>{'\(\theta\)'} is the angle between them</li>
            </ul>
          </div>

          <p>
            In machine learning, the dot product appears everywhere—from calculating similarities between data points to measuring prediction errors. When two vectors are orthogonal (perpendicular), their dot product is zero, indicating no correlation between the features they represent.
          </p>

          <pre>
            <code className="language-python">
{`import numpy as np

# Creating two vectors
v1 = np.array([1, 2, 3])
v2 = np.array([4, 5, 6])

# Computing dot product
dot_product = np.dot(v1, v2)
print(f"Dot product: {dot_product}")  # Output: 32

# Computing the angle between vectors
cos_theta = dot_product / (np.linalg.norm(v1) * np.linalg.norm(v2))
angle = np.arccos(cos_theta)
print(f"Angle between vectors: {np.degrees(angle)} degrees")`}
            </code>
          </pre>

          <h2 id="matrices-transformations">Matrices: Linear Transformations</h2>
          <p>
            If vectors represent data points, matrices represent transformations of that data. A matrix {'\(A \in \mathbb{R}^{m \times n}\)'} is a rectangular array of numbers with m rows and n columns:
          </p>

          <div className="highlight">
            <p>
              {'$$A = \begin{bmatrix} '}
              {'a_{11} & a_{12} & \cdots & a_{1n} \\'}
              {'a_{21} & a_{22} & \cdots & a_{2n} \\'}
              {'\vdots & \vdots & \ddots & \vdots \\'}
              {'a_{m1} & a_{m2} & \cdots & a_{mn}'}
              {'\end{bmatrix}$$'}
            </p>
          </div>

          <h3 id="matrix-multiplication">Matrix Multiplication</h3>
          <p>
            The product of matrices {'\(A \in \mathbb{R}^{m \times n}\)'} and {'\(B \in \mathbb{R}^{n \times p}\)'} results in a new matrix {'\(C \in \mathbb{R}^{m \times p}\)'} where each element is calculated as:
          </p>

          <div className="highlight">
            <p>
              {'$$c_{ij} = \sum_{k=1}^{n} a_{ik} \cdot b_{kj}$$'}
            </p>
          </div>

          <p>
            This operation is at the core of how neural networks process information. When a matrix multiplies a vector, it transforms the vector according to the linear transformation encoded in the matrix.
          </p>

          <div className="figure-container">
            {/* REACT COMPONENT PLACEHOLDER: Matrix Transformation Interactive Demo */}
            <MatrixTransformationDemo />
            <p className="figure-caption">Figure 2: An interactive demonstration of how matrices transform vectors in 2D space. Try different matrices to see how they stretch, rotate, or shear the original vectors.</p>
          </div>

          <h3 id="special-matrices">Special Matrices in Machine Learning</h3>
          <p>
            Certain matrices have special properties that make them particularly useful in machine learning:
          </p>

          <ul>
            <li>
              <strong>Identity Matrix ({'\(I\)'})</strong>: Like the number 1 in scalar multiplication, the identity matrix leaves a vector unchanged when multiplied:
              {'$$I_n = \begin{bmatrix} '}
              {'1 & 0 & \cdots & 0 \\'}
              {'0 & 1 & \cdots & 0 \\'}
              {'\vdots & \vdots & \ddots & \vdots \\'}
              {'0 & 0 & \cdots & 1'}
              {'\end{bmatrix}$$'}
            </li>
            <li>
              <strong>Diagonal Matrix</strong>: A matrix where all non-diagonal elements are zero. These are computationally efficient and often used in regularization techniques.
            </li>
            <li>
              <strong>Orthogonal Matrix ({'\(Q\)'})</strong>: A square matrix whose columns and rows are orthonormal vectors, meaning {'\(Q^TQ = QQ^T = I\)'}. These matrices preserve distances when transforming vectors, which is crucial in techniques like QR decomposition.
            </li>
          </ul>

          <h2 id="determinants-inverses">Determinants and Inverses</h2>
          <p>
            For a square matrix {'\(A\)'}, the determinant {'\(\det(A)\)'} is a scalar value that provides information about how the matrix transforms space. Geometrically, it represents the factor by which the matrix scales volumes.
          </p>

          <div className="highlight">
            <p>
              For a 2×2 matrix: {'$$\det\begin{bmatrix} a & b \\ c & d \end{bmatrix} = ad - bc$$'}
            </p>
          </div>

          <p>
            The inverse of a matrix {'\(A\)'}, denoted {'\(A^{-1}\)'}, is a matrix such that {'\(AA^{-1} = A^{-1}A = I\)'}. Not all matrices have inverses—only those with non-zero determinants (known as invertible or non-singular matrices). In machine learning, matrix inversion appears in techniques like least squares regression:
          </p>

          <div className="highlight">
            <p>
              {'$$\hat{\beta} = (X^TX)^{-1}X^Ty$$'}
            </p>
            <p>Where:</p>
            <ul>
              <li>{'\(X\)'} is the feature matrix</li>
              <li>{'\(y\)'} is the target vector</li>
              <li>{'\(\hat{\beta}\)'} is the vector of regression coefficients</li>
            </ul>
          </div>

          <h2 id="eigenvalues-eigenvectors">Eigenvalues and Eigenvectors</h2>
          <p>
            An eigenvector {'\(\vec{v}\)'} of a square matrix {'\(A\)'} is a non-zero vector that, when multiplied by {'\(A\)'}, results in a scalar multiple of itself:
          </p>

          <div className="highlight">
            <p>
              {'$$A\vec{v} = \lambda\vec{v}$$'}
            </p>
            <p>Where {'\(\lambda\)'} is the corresponding eigenvalue.</p>
          </div>

          <p>
            Eigendecomposition is the process of decomposing a matrix into its eigenvectors and eigenvalues. For a diagonalizable matrix \(A\):
          </p>

          <div className="highlight">
            <p>
              {'$$A = P\Lambda P^{-1}$$'}
            </p>
            <p>Where:</p>
            <ul>
              <li>{'\(P\)'} is a matrix whose columns are the eigenvectors of {'\(A\)'}</li>
              <li>{'\(\Lambda\)'} is a diagonal matrix of the corresponding eigenvalues</li>
            </ul>
          </div>

          <p>
            This decomposition is foundational to Principal Component Analysis (PCA), which is widely used for dimensionality reduction in machine learning.
          </p>

          <pre>
            <code className="language-python">
{`import numpy as np
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA

# Generate some random data with correlation
np.random.seed(42)
mean = [0, 0]
cov = [[1, 0.8], [0.8, 1]]  # Covariance matrix with correlation
data = np.random.multivariate_normal(mean, cov, 100)

# Apply PCA
pca = PCA(n_components=2)
pca.fit(data)

# Access eigenvalues and eigenvectors
print("Eigenvalues:", pca.explained_variance_)
print("Eigenvectors:\\n", pca.components_)

# Project data onto principal components
transformed_data = pca.transform(data)

# Code for visualization would go here`}
            </code>
          </pre>

          <div className="figure-container">
            {/* --- SVG START for Figure 3 --- */}
            <svg width="500" height="300" xmlns="http://www.w3.org/2000/svg" style={{ border: '1px solid #eee', fontFamily: 'sans-serif' }}>
              <title>Principal Component Analysis (PCA) Visualization</title>
              <desc>Scatter plot of correlated data points showing the first two principal components (PC1 and PC2) as vectors indicating directions of maximum variance.</desc>

              <defs>
                {/* Reusable Arrowhead Marker */}
                <marker id="arrowhead-pca" viewBox="0 0 10 10" refX="8" refY="5"
                    markerWidth="6" markerHeight="6"
                    orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" />
                </marker>
              </defs>

              {/* Coordinate System Group: Origin at SVG center, Scale, Flip Y */}
              {/* Centering origin at (250, 150) */}
              <g id="pca-coordinate-system" transform={`translate(250, 150) scale(1, -1)`}>

                {/* Grid Lines */}
                <g id="pca-grid" stroke="#e0e0e0" strokeWidth="0.5">
                  {/* Vertical Lines (adjust range based on scaleFactor and data) */}
                  {[-4, -3, -2, -1, 1, 2, 3, 4].map(x => (
                    <line key={`vgrid-pca-${x}`} x1={x * scaleFactor} y1={-3 * scaleFactor} x2={x * scaleFactor} y2={3 * scaleFactor} />
                  ))}
                  {/* Horizontal Lines */}
                  {[-2, -1, 1, 2].map(y => (
                    <line key={`hgrid-pca-${y}`} x1={-5 * scaleFactor} y1={y * scaleFactor} x2={5 * scaleFactor} y2={y * scaleFactor} />
                  ))}
                </g>

                {/* Axes */}
                <line id="pca-x-axis" x1={-5 * scaleFactor} y1="0" x2={5 * scaleFactor} y2="0" stroke="#aaa" strokeWidth="1" />
                <line id="pca-y-axis" x1="0" y1={-3 * scaleFactor} x2="0" y2={3 * scaleFactor} stroke="#aaa" strokeWidth="1" />

                {/* Axis Labels (counteract y-flip) */}
                <text x={4.8 * scaleFactor} y="-10" transform="scale(1, -1)" fontSize="12" fill="#555" textAnchor="middle">x</text>
                <text x="10" y={-2.8 * scaleFactor} transform="scale(1, -1)" fontSize="12" fill="#555" textAnchor="start">y</text>

                {/* Data Points */}
                <g id="data-points">
                  {pcaDataPoints.map((point, index) => (
                    <circle
                      key={`point-${index}`}
                      cx={point[0] * scaleFactor}
                      cy={point[1] * scaleFactor}
                      r="3"
                      fill="steelblue"
                      opacity="0.7"
                    />
                  ))}
                </g>

                {/* Principal Component Vectors */}
                <g id="principal-components">
                  {/* PC1 (Longer, direction of max variance) */}
                  <line
                    x1="0" y1="0"
                    x2={pc1_x * scaleFactor} y2={pc1_y * scaleFactor}
                    stroke="red" strokeWidth="2.5"
                    markerEnd="url(#arrowhead-pca)"
                  />
                  <text
                    x={pc1_x * scaleFactor + 10 * Math.cos(pcAngle1)} // Offset label slightly
                    y={-(pc1_y * scaleFactor + 10 * Math.sin(pcAngle1))} // Y is negative due to scale(1,-1) on text
                    transform="scale(1, -1)"
                    fill="red" fontSize="14" fontWeight="bold"
                    textAnchor="middle" dominantBaseline="middle"
                  >
                    PC1
                  </text>

                  {/* PC2 (Shorter, perpendicular to PC1) */}
                  <line
                    x1="0" y1="0"
                    x2={pc2_x * scaleFactor} y2={pc2_y * scaleFactor}
                    stroke="darkorange" strokeWidth="2"
                    markerEnd="url(#arrowhead-pca)"
                  />
                   <text
                    x={pc2_x * scaleFactor + 10 * Math.cos(pcAngle2)} // Offset label slightly
                    y={-(pc2_y * scaleFactor + 10 * Math.sin(pcAngle2))} // Y is negative
                    transform="scale(1, -1)"
                    fill="darkorange" fontSize="14" fontWeight="bold"
                    textAnchor="middle" dominantBaseline="middle"
                  >
                    PC2
                  </text>
                </g>
              </g>

              {/* Legend (Positioned outside the transformed group) */}
              <g id="pca-legend" transform="translate(10, 10)">
                 <rect x="0" y="0" width="120" height="55" fill="#f9f9f9" stroke="#ccc" rx="3" ry="3" />
                 {/* Data Point Legend */}
                 <circle cx="15" cy="15" r="3" fill="steelblue" opacity="0.7" />
                 <text x="25" y="18" fontSize="10">Data Points</text>
                 {/* PC1 Legend */}
                 <line x1="5" y1="30" x2="20" y2="30" stroke="red" strokeWidth="2" />
                 <text x="25" y="33" fontSize="10" fill="red">PC1 (Max Var)</text>
                 {/* PC2 Legend */}
                 <line x1="5" y1="45" x2="20" y2="45" stroke="darkorange" strokeWidth="2" />
                 <text x="25" y="48" fontSize="10" fill="darkorange">PC2</text>
              </g>

            </svg>
            {/* --- SVG END --- */}
            <p className="figure-caption">Figure 3: PCA identifies the directions of maximum variance in the data. The eigenvectors (PC1, PC2) point in these directions, with lengths proportional to the variance (eigenvalues) explained by each component.</p>
          </div>

          <h2 id="linear-systems">Linear Systems of Equations</h2>
          <p>
            Many machine learning problems involve solving systems of linear equations, which can be represented in matrix form as {'\(A\vec{x} = \vec{b}\)'}, where {'\(A\)'} is the coefficient matrix, {'\(\vec{x}\)'} is the vector of unknowns, and {'\(\vec{b}\)'} is the constant vector.
          </p>

          <p>
            When \(A\) is invertible, the solution is straightforward: {'\(\vec{x} = A^{-1}\vec{b}\)'}. However, in practice, direct inversion is often numerically unstable. Instead, we use more efficient methods like:
          </p>

          <ul>
            <li><strong>LU Decomposition</strong>: Factorizes {'\(A\)'} into lower and upper triangular matrices</li>
            <li><strong>QR Decomposition</strong>: Expresses {'\(A\)'} as the product of an orthogonal matrix {'\(Q\)'} and an upper triangular matrix {'\(R\)'}</li>
            <li><strong>Singular Value Decomposition (SVD)</strong>: Decomposes {'\(A\)'} as {'\(A = U\Sigma V^T\)'}, where {'\(\Sigma\)'} contains the singular values</li>
          </ul>

          <p>
            In machine learning, these decompositions are used for solving least squares problems, implementing regularization, and performing dimensionality reduction.
          </p>

          <h2 id="applications-in-ml">Applications in Machine Learning</h2>
          <p>
            Let's explore how these linear algebra concepts manifest in common machine learning algorithms:
          </p>

          <h3 id="linear-regression">Linear Regression</h3>
          <p>
            In linear regression, we model the relationship between input features {'\(X\)'} and target values {'\(y\)'} using a linear equation:
          </p>

          <div className="highlight">
            <p>
              {'$$y = X\beta + \epsilon$$'}
            </p>
            <p>
              The least squares solution minimizes the sum of squared residuals:
            </p>
            <p>
              {'$$\hat{\beta} = \arg\min_\beta ||y - X\beta||^2$$'}
            </p>
            <p>
              This leads to the normal equation:
            </p>
            <p>
              {'$$\hat{\beta} = (X^TX)^{-1}X^Ty$$'}
            </p>
          </div>

          <h3 id="covariance-matrices">Covariance Matrices</h3>
          <p>
            The covariance matrix {'\(\Sigma\)'} captures the relationships between different features:
          </p>

          <div className="highlight">
            <p>
              {'$$\Sigma_{ij} = \frac{1}{n-1}\sum_{k=1}^{n}(x_{ki} - \bar{x}_i)(x_{kj} - \bar{x}_j)$$'}
            </p>
          </div>

          <p>
            This matrix is fundamental to PCA, where we find the eigenvectors and eigenvalues of the covariance matrix to identify the principal components of variation in the data.
          </p>

          <h3 id="gradient-descent">Gradient Descent</h3>
          <p>
            Gradient descent, the workhorse of neural network training, relies on computing gradients—essentially vectors of partial derivatives:
          </p>

          <div className="highlight">
            <p>
              {'$$\nabla f(\theta) = \begin{bmatrix} \frac{\partial f}{\partial \theta_1} \\ \frac{\partial f}{\partial \theta_2} \\ \vdots \\ \frac{\partial f}{\partial \theta_n} \end{bmatrix}$$'}
            </p>
          </div>

          <p>
            We then update parameters in the direction of steepest descent:
          </p>

          <div className="highlight">
            <p>
              {'$$\theta_{t+1} = \theta_t - \alpha \nabla f(\theta_t)$$'}
            </p>
            <p>Where {'\(\alpha\)'} is the learning rate.</p>
          </div>

          <div className="figure-container">
            {/* REACT COMPONENT PLACEHOLDER: Gradient Descent Visualization */}
            <GradientDescentDemo />
            <p className="figure-caption">Figure 4: Interactive visualization of gradient descent optimization on a loss surface. The gradient vector at each point indicates the direction of steepest ascent.</p>
          </div>

          <h2 id="conclusion">Conclusion: The Power of Linear Algebra in ML</h2>
          <p>
            Linear algebra provides the mathematical language that allows us to express and solve complex machine learning problems efficiently. Understanding vectors, matrices, and their operations gives us:
          </p>

          <ul>
            <li>A framework for representing and manipulating high-dimensional data</li>
            <li>Tools for reducing dimensionality while preserving important information</li>
            <li>Methods for optimizing model parameters</li>
            <li>Techniques for analyzing relationships between features</li>
          </ul>

          <p>
            While the mathematics might seem abstract at first, the geometric intuition behind these concepts helps us develop a deeper understanding of how our algorithms work. As you continue your machine learning journey, you'll find that strengthening your linear algebra foundation will pay dividends in your ability to implement, understand, and innovate with machine learning algorithms.
          </p>

          <div className="highlight">
            <h3>Key Takeaways:</h3>
            <ul>
              <li>Vectors are the fundamental building blocks for representing data in machine learning</li>
              <li>Matrix operations allow us to transform data and extract meaningful patterns</li>
              <li>Eigendecomposition underlies dimensionality reduction techniques like PCA</li>
              <li>Linear systems form the basis of many optimization problems in ML</li>
              <li>A strong grasp of linear algebra enables more intuitive understanding of complex ML algorithms</li>
            </ul>
          </div>
        </section>
      </div>
    </BlogPostLayout>
  );
};

export default LinearAlgebraBasics;

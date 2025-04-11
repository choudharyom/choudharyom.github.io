import BlogPostLayout from '@/components/layout/BlogPostLayout';
import styles from '@/styles/BlogPost.module.css'; // Keep styles for content elements

const LinearAlgebraBasics = () => {
  // Define meta information
  const meta = {
    title: 'Linear Algebra Basics for Machine Learning',
  };

  // Define author information
  const author = {
    name: 'Om 🐯 Choudhary 🧘‍♂️',
    title: 'Software Architect👾',
    bio: 'I write about machine learning, neural networks, and mathematical foundations of AI. Currently working on research in deep learning optimization.',
    // imageUrl: '/path/to/your/image.jpg' // Optional: Add image path later
  };

  return (
    <BlogPostLayout meta={meta} author={author}> {/* Pass author prop */}
      <h1>Linear Algebra Basics for Machine Learning</h1>
      <p className={styles.meta}>Published on: April 10, 2025 | Tags: <a href="/tag/linear-algebra">linear-algebra</a>, <a href="/tag/mathematics">mathematics</a>, <a href="/tag/machine-learning">machine-learning</a></p>

      <div className={styles.content}>
        <p>
          Linear algebra is a fundamental mathematical tool for anyone working in machine learning. It provides the language and operations needed to work with data in high-dimensional spaces.
        </p>
        {/* Add IDs to headings */}
        <h2 id="vectors-matrices">Vectors and Matrices</h2>
        <p>
          At its core, linear algebra deals with vectors (arrays of numbers) and matrices (grids of numbers). In machine learning, datasets are often represented as matrices, where rows might be samples and columns are features. Vectors can represent individual data points or model parameters.
        </p>
        <h2 id="key-operations">Key Operations</h2>
        <p>
          Operations like matrix multiplication, dot products, and finding determinants or inverses are crucial. For example, matrix multiplication is used extensively in neural network layers to transform input data.
        </p>
        <p>
          Understanding these concepts is essential for grasping how many machine learning algorithms, from linear regression to deep learning models, actually work under the hood.
        </p>
      </div>
    </BlogPostLayout>
  );
};

export default LinearAlgebraBasics;

import BlogPostLayout from '@/components/layout/BlogPostLayout';
import styles from '@/styles/BlogPost.module.css'; // Keep styles for content elements

// --- Define Meta and Author Data Once ---
const pageMeta = {
  title: 'Introduction to Neural Networks',
  description: 'A brief overview of neural networks, their structure, and how they learn, forming the foundation of modern AI.', // Added description
  date: "2024-05-15", // Example date - Update with actual publish date
  readingTime: "7 min read", // Example reading time
  tags: ['neural-networks', 'machine-learning', 'introduction', 'ai'], // Added tags
};

const pageAuthor = {
  name: "Om Choudhary", // Consistent name
  title: 'Software Architect👾',
  bio: 'I write about machine learning, neural networks, and mathematical foundations of AI. Currently working on research in deep learning optimization.',
  imageUrl: "/images/AuthorOm.png", // Use consistent image path
};
// --- End Data Definition ---

const IntroToNeuralNetworks = () => {
  return (
    <BlogPostLayout
      meta={pageMeta} // Pass the defined meta object
      author={pageAuthor} // Pass the defined author object
    >
      {/* reuse the title here */}
      <h1>{pageMeta.title}</h1> 

      {/* Consider moving tag rendering into BlogPostLayout if it's always the same format */}
      <p className={styles.meta}>
        Published on: {new Date(pageMeta.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} | Tags: {' '}
        {pageMeta.tags.map((tag, index) => (
          <span key={tag}>
            <a href={`/tags/${tag}`}>{tag}</a>
            {index < pageMeta.tags.length - 1 ? '' : ''}
          </span>
        ))}
      </p>

      <div className={styles.content}>
        <p>
          Neural networks are a cornerstone of modern machine learning and artificial intelligence. Inspired by the structure of the human brain, they consist of interconnected nodes or 'neurons' organized in layers.
        </p>
        <h2 id="mathematical-foundations">Mathematical Foundations</h2>
        <p>...</p> {/* Placeholder for content */}
        <h3 id="forward-propagation">Forward Propagation</h3>
        <p>...</p> {/* Placeholder for content */}
        <h3 id="backpropagation">Backpropagation</h3>
        <p>...</p> {/* Placeholder for content */}
        <h2 id="implementation">Implementing a Simple Neural Network</h2>
        <p>...</p> {/* Placeholder for content */}
        <h2 id="visualization">Neural Network Visualization</h2>
        <p>...</p> {/* Placeholder for content */}
        <h2 id="implementing-backprop">Implementing Backpropagation from Scratch</h2>
        <p>...</p> {/* Placeholder for content */}
        <h2 id="advanced-concepts">Advanced Concepts</h2>
        <p>...</p> {/* Placeholder for content */}
        <h3 id="regularization">Regularization</h3>
        <p>...</p> {/* Placeholder for content */}
        <h3 id="optimization">Optimization Algorithms</h3>
        <p>
          A simple neural network has an input layer, one or more hidden layers, and an output layer. Data flows from the input layer, through the hidden layers where computations occur, to the output layer which produces the final result (e.g., a classification or prediction).
        </p>
        <p>
          Neural networks 'learn' by adjusting the connection strengths (weights) between neurons based on sample data. This process, often involving backpropagation and gradient descent, aims to minimize the difference between the network's predictions and the actual target values.
        </p>
        <p>
          This is just a brief overview. Future posts will delve deeper into activation functions, different network architectures (like CNNs and RNNs), and the underlying mathematics.
        </p>
      </div>
    </BlogPostLayout>
  );
};

export default IntroToNeuralNetworks;

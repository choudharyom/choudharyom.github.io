// Simple in-memory store for sample posts
// In a real app, this data would come from a CMS, database, or markdown files

const samplePosts = [
  {
    id: 'nn-intro',
    slug: 'intro-to-neural-networks',
    title: 'Introduction to Neural Networks',
    excerpt: 'A brief overview of neural network structure and the learning process.',
    coverImage: '/images/placeholder-nn.jpg',
    date: '2025-04-10',
    readingTime: '3 min',
    tags: ['neural-networks', 'machine-learning'],
    content: `
      <p>Neural networks are a cornerstone of modern machine learning and artificial intelligence. Inspired by the structure of the human brain, they consist of interconnected nodes or 'neurons' organized in layers.</p>
      <h2>Basic Structure</h2>
      <p>A simple neural network has an input layer, one or more hidden layers, and an output layer. Data flows from the input layer, through the hidden layers where computations occur, to the output layer which produces the final result (e.g., a classification or prediction).</p>
      <h2>Learning Process</h2>
      <p>Neural networks 'learn' by adjusting the connection strengths (weights) between neurons based on sample data. This process, often involving backpropagation and gradient descent, aims to minimize the difference between the network's predictions and the actual target values.</p>
      <p>This is just a brief overview. Future posts will delve deeper into activation functions, different network architectures (like CNNs and RNNs), and the underlying mathematics.</p>
    ` // Added basic content for potential future use
  },
  {
    id: 'la-basics',
    slug: 'linear-algebra-basics',
    title: 'Linear Algebra Basics for Machine Learning',
    excerpt: 'Understanding vectors, matrices, and key operations essential for ML.',
    coverImage: '/images/placeholder-la.jpg',
    date: '2025-04-10',
    readingTime: '4 min',
    tags: ['linear-algebra', 'machine-learning', 'mathematics', 'vectors', 'matrices'],
    content: `
      <p>Linear algebra is a fundamental mathematical tool for anyone working in machine learning. It provides the language and operations needed to work with data in high-dimensional spaces.</p>
      <h2>Vectors and Matrices</h2>
      <p>At its core, linear algebra deals with vectors (arrays of numbers) and matrices (grids of numbers). In machine learning, datasets are often represented as matrices, where rows might be samples and columns are features. Vectors can represent individual data points or model parameters.</p>
      <h2>Key Operations</h2>
      <p>Operations like matrix multiplication, dot products, and finding determinants or inverses are crucial. For example, matrix multiplication is used extensively in neural network layers to transform input data.</p>
      <p>Understanding these concepts is essential for grasping how many machine learning algorithms, from linear regression to deep learning models, actually work under the hood.</p>
    ` // Added basic content
  },
  {
    id: 'weather-forecasting-cnn',
    slug: 'weather-forecasting-cnn',
    title: 'Weather Forecasting with Convolutional Neural Networks: A Mathematical Deep Dive',
    excerpt: 'Explore how Convolutional Neural Networks (CNNs) are transforming weather prediction through advanced mathematical modeling and machine learning techniques.',
    coverImage: '/images/placeholder-nn.jpg',
    date: '2025-04-11',
    readingTime: '8 min',
    tags: ['deep-learning', 'cnn', 'weather', 'mathematics'],
    content: `
      <p>In the intricate world of <strong>weather forecasting</strong>, <strong>Convolutional Neural Networks (CNNs)</strong> have emerged as a groundbreaking approach to understanding and predicting atmospheric dynamics. This deep learning technique bridges the gap between complex mathematical principles and practical meteorological predictions, offering unprecedented insights into the chaotic nature of weather systems.</p>
      <ul>
        <li>CNNs transform how we interpret spatial weather data</li>
        <li>Mathematical modeling meets machine learning</li>
        <li>Potential applications across multiple sectors</li>
      </ul>
      <p>Read the full article for a mathematical deep dive and real-world case studies.</p>
    `
  },
  {
    id: 'elhclf-intro',
    slug: 'elhclf-configurator',
    title: 'Introducing the ELHLCF Configurator: Build Your Embedded Linux System Visually',
    description: 'Learn about the Embedded Linux High-Level Configuration Framework (ELHLCF) Configurator, a web-based tool designed to simplify the creation of custom embedded Linux systems.',
    coverImage: '/images/placeholder-embedded.jpg', // Suggest using a relevant cover image
    canonicalUrl: "https://choudharyom.com/elhclf-configurator", // Adjust domain if needed
    date: "2025-05-03", // Set current date or desired publish date
    readingTime: "6 min read",
    tags: ['embedded-linux', 'configurator', 'web-development', 'react', 'build-systems', 'ui-ux'],
    content: `
        <p>Building custom embedded Linux systems often involves navigating complex configuration files and build systems. The ELHLCF Configurator aims to streamline this process with a modern, web-based interface.</p>
        <h2>The Challenge of Embedded Linux Configuration</h2>
        <p>Manually setting up toolchains, kernels, bootloaders, filesystems, and packages can be error-prone and time-consuming. The ELHLCF Configurator provides a guided, visual approach.</p>
        <h2>Key Features</h2>
        <p>Explore the features that make embedded Linux configuration easier: step-by-step guidance, validation, and direct configuration file generation.</p>
      ` // Basic content summary for layout
  }
  // Add more posts here
];

export function getAllPosts() {
  // Sort posts by date or title if needed
  return samplePosts.sort((postA, postB) => new Date(postB.date) - new Date(postA.date));
}

export function getAllTags() {
  const allTags = new Set();
  samplePosts.forEach(post => {
    // Ensure tags are consistently handled, e.g., lowercase
    post.tags.forEach(tag => allTags.add(tag.toLowerCase()));
  });
  return Array.from(allTags);
}

export function getPostsByTag(tagSlug) {
  const lowerCaseTagSlug = tagSlug.toLowerCase(); // Ensure the target slug is lowercase
  return samplePosts.filter(post =>
    post.tags.some(tag => tag.toLowerCase() === lowerCaseTagSlug) // Compare lowercase versions
  );
}

export function getPostBySlug(slug) {
    // Consider making slug comparison case-insensitive too if needed
    return samplePosts.find(post => post.slug.toLowerCase() === slug.toLowerCase());
}

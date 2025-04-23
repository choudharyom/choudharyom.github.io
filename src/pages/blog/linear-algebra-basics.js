import BlogPostLayout from '@/components/layout/BlogPostLayout';
import styles from '@/styles/BlogPost.module.css'; // Keep styles for content elements

// --- Define Meta and Author Data Once ---
const pageMeta = {
  title: "Linear Algebra Basics for Machine Learning",
  description: "Learn the basics of linear algebra for machine learning.",
  publishedIn: "On Algebra", // This seems like a category/series?
  date: "2025-04-10",
  readingTime: "5 min read",
  // Add tags here if BlogPostLayout uses them from meta
  tags: ['linear-algebra', 'mathematics', 'machine-learning'],
};

const pageAuthor = {
  name: "Om Choudhary", // Use consistent name if possible
  title: "Software Architect👾",
  bio: "I write about embedded systems, neural networks, and mathematical foundations of AI.",
  imageUrl: "/images/AuthorOm.png",
};
// --- End Data Definition ---


const LinearAlgebraBasics = () => {
  // The component itself now only focuses on rendering the layout and content

  return (
    <BlogPostLayout
      meta={pageMeta} // Pass the defined meta object
      author={pageAuthor} // Pass the defined author object
    >
      {/* Content specific to this blog post */}
      <h1>{pageMeta.title}</h1> {/* You can reuse the title here */}

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
          Linear algebra is a fundamental mathematical tool for anyone working in machine learning. It provides the language and operations needed to work with data in high-dimensional spaces.
        </p>
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

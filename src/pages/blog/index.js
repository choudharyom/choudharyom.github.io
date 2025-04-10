import Link from 'next/link';
import { getAllPosts } from '@/lib/posts'; // Import the helper function
import styles from '@/styles/BlogIndex.module.css';

// Receive posts as props from getStaticProps
const BlogIndexPage = ({ posts }) => {
  return (
    // Assuming Layout is handled globally by _app.js
    <div className={styles.container}>
      <h1>All Blog Articles</h1>
      <ul className={styles.postList}>
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <li key={post.id} className={styles.postItem}> {/* Use post.id */}
              <Link href={`/blog/${post.slug}`} className={styles.postLink}>
                {post.title}
              </Link>
              {/* Optional: Add excerpt or date here */}
              <p className={styles.postExcerpt}>{post.excerpt}</p>
            </li>
          ))
        ) : (
          <p>No blog posts found.</p>
        )}
      </ul>
    </div>
  );
};

// Fetch all posts at build time
export async function getStaticProps() {
  const posts = getAllPosts(); // Get all posts from the lib
  return {
    props: {
      posts,
    },
  };
}

export default BlogIndexPage;

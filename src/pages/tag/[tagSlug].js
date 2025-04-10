import { useRouter } from 'next/router';
import Link from 'next/link'; // Import Link
import { getAllTags, getPostsByTag } from '@/lib/posts'; // Import helper functions
// Layout is handled globally in _app.js
import styles from '@/styles/TagPage.module.css';

// Receive posts and tagSlug as props from getStaticProps
const TagPage = ({ posts, tagSlug }) => {
  const router = useRouter();

  // Optional: Show loading state if fallback is true in getStaticPaths
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    // Note: We removed Layout from about.js because _app.js had it.
    // If _app.js wraps *everything*, remove Layout here too.
    // If _app.js logic is more complex, we might need Layout here.
    // Let's assume for now _app.js handles layout globally based on previous fix.
    <div className={styles.container}>
      <h1>Posts tagged with: "{tagSlug}"</h1>
      {posts && posts.length > 0 ? (
        <ul className={styles.postList}> {/* Use ul for list */}
          {posts.map((post) => (
            <li key={post.id} className={styles.postItem}> {/* Add list item */}
              <Link href={`/blog/${post.slug}`}>
                <a className={styles.postLink}>{post.title}</a>
              </Link>
              <p className={styles.postExcerpt}>{post.excerpt}</p> {/* Optional: Show excerpt */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts found for the tag "{tagSlug}" yet.</p>
      )}
    </div>
  );
};

// Fetch data at build time
export async function getStaticPaths() {
  const tags = getAllTags(); // Get all unique tags from our posts lib
  const paths = tags.map((tag) => ({
    params: { tagSlug: tag },
  }));

  // fallback: false means pages for tags not listed here will 404.
  // fallback: true or 'blocking' could be used for dynamically generated pages.
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { tagSlug } = params;
  const posts = getPostsByTag(tagSlug); // Fetch posts for this specific tag

  return {
    props: {
      posts, // Pass the filtered posts to the page component
      tagSlug, // Pass the tag slug itself for display purposes
    },
    // Optional: revalidate: 10 // Re-generate page every 10 seconds if needed
  };
}

export default TagPage;

import { useRouter } from 'next/router';
import Link from 'next/link';
import { getAllTags, getPostsByTag } from '@/lib/posts';
import styles from '@/styles/TagPage.module.css'; // Use the updated styles

const TagPage = ({ posts, tagSlug }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Posts tagged with: "{tagSlug}"</h1>
      {posts && posts.length > 0 ? (
        <ul className={styles.postList}> {/* Grid layout applied via CSS */}
          {posts.map((post) => (
            <li key={post.id || post.slug} className={styles.postItem}> {/* Card style applied via CSS */}
              {/* Post Title Link */}
              <Link href={`/blog/${post.slug}`} className={styles.postLink}>
                {post.title}
              </Link>

              {/* Post Excerpt */}
              {post.excerpt && (
                <p className={styles.postExcerpt}>{post.excerpt}</p>
              )}

              {/* Post Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className={styles.postTags}>
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      // Link to the tag page itself (lowercase, URI encoded)
                      href={`/tag/${encodeURIComponent(tag.toLowerCase())}`}
                      // Apply the tag style. Check if current tag matches post tag for potential highlight (optional)
                      className={`${styles.tag} ${tag.toLowerCase() === tagSlug.toLowerCase() ? styles.activeTag : ''}`} // Add activeTag class if needed
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        // Use the specific class for the message
        <p className={styles.noPostsMessage}>
          No posts found for the tag "{tagSlug}" yet.
        </p>
      )}
    </div>
  );
};

export async function getStaticPaths() {
  const tags = getAllTags();
  const paths = tags.map((tag) => ({
    // Ensure slugs are lowercase and URL-safe if not already handled by getAllTags
    params: { tagSlug: encodeURIComponent(tag.toLowerCase()) },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  // Decode the slug if it was encoded in getStaticPaths
  const tagSlug = decodeURIComponent(params.tagSlug);

  // Ensure getPostsByTag fetches necessary fields, including 'tags' and 'excerpt'
  const posts = getPostsByTag(tagSlug, [
    'title',
    'slug',
    'date', // Keep date for potential sorting later if needed
    'excerpt',
    'tags',
    // 'id' if your posts have unique IDs, otherwise slug is usually the key
  ]);

  // Optional: Sort posts if needed (e.g., by date)
  posts.sort((post1, post2) => (post1.date > post2.date ? -1 : 1));


  return {
    props: {
      posts,
      tagSlug, // Pass the original (decoded) tag slug
    },
  };
}

export default TagPage;

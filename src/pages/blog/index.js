// src/pages/blog/index.js (or src/pages/blog.js)

import Head from 'next/head';
import Link from 'next/link'; // Import Link
import { getAllPosts } from '@/lib/posts'; // Adjust path if necessary
import styles from '@/styles/BlogIndex.module.css'; // Use the updated styles

export default function BlogIndex({ allPosts }) {
  return (
    <>
      <Head>
        <title>Blog - ChoudharyOm</title>
        <meta name="description" content="Read the latest articles on technology, programming, and more from Om Choudhary." />
      </Head>
      <div className={styles.container}>
        <h1>All Articles</h1>

        {allPosts.length === 0 ? (
          <p>No articles published yet.</p> // Optional: Message if no posts
        ) : (
          <ul className={styles.postList}>
            {allPosts.map((post) => (
              <li key={post.slug} className={styles.postItem}>
                {/* Post Title Link */}
                <Link href={`/blog/${post.slug}`} className={styles.postLink}>
                  {post.title}
                </Link>

                {/* Post Excerpt (Optional but recommended) */}
                {post.excerpt && (
                  <p className={styles.postExcerpt}>{post.excerpt}</p>
                )}

                {/* Post Tags (Render like in search.js) */}
                {post.tags && post.tags.length > 0 && (
                  <div className={styles.postTags}>
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/tags/${encodeURIComponent(tag.toLowerCase())}`}
                        className={styles.tag}
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export async function getStaticProps() {
  const allPosts = getAllPosts([
    'title',
    'slug',
    'date',
    'excerpt', // Ensure excerpt is fetched
    'tags',    // Ensure tags are fetched
  ]); // Adjust fields as needed by getAllPosts

  // Optional: Sort posts by date if not already done in getAllPosts
  allPosts.sort((post1, post2) => (post1.date > post2.date ? -1 : 1));

  return {
    props: { allPosts },
  };
}

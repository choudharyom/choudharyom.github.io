// /workspaces/choudharyom.github.io/src/pages/search.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'; // Import Link
import Head from 'next/head';
import getConfig from 'next/config';
import styles from '@/styles/Search.module.css';

// Get the runtime config
const { publicRuntimeConfig } = getConfig() || {}; // Add || {} for safety
const assetPrefix = publicRuntimeConfig?.assetPrefix || ''; // Get assetPrefix, default to ''

const SearchPage = () => {
  const router = useRouter();
  const { q } = router.query;

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    // Construct the correct path using the assetPrefix
    const searchIndexPath = `${assetPrefix}/search-index.json`;
    console.log(`Fetching search index from: ${searchIndexPath}`); // Add log for debugging

    fetch(searchIndexPath) // Use the dynamic path
      .then((res) => {
        if (!res.ok) {
          // Provide more context in the error
          throw new Error(`Failed to load search index. Status: ${res.status} ${res.statusText} at ${searchIndexPath}`);
        }
        return res.json();
      })
      .then((data) => {
        setAllPosts(data);
        setError(null);
      })
      .catch((err) => {
        console.error('Error fetching search index:', err);
        setError(err.message || 'Could not load search data. Please try again later.'); // Use error message
        setAllPosts([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []); // Fetch only once on mount

  // Perform search when 'q' (from URL) or allPosts data changes
  useEffect(() => {
    // Only run search if allPosts is loaded and q is present
    if (q && typeof q === 'string' && allPosts.length > 0) {
      const currentSearchTerm = q.toLowerCase().trim();
      setSearchTerm(q);
      setIsLoading(true); // Indicate searching (can be brief)

      const filteredResults = allPosts.filter((post) => {
        const titleMatch = post.title?.toLowerCase().includes(currentSearchTerm); // Add optional chaining
        const excerptMatch = post.excerpt?.toLowerCase().includes(currentSearchTerm);
        const tagMatch = post.tags?.some(tag => tag.toLowerCase().includes(currentSearchTerm));

        return titleMatch || excerptMatch || tagMatch;
      });

      setResults(filteredResults);
      // Consider setting loading false slightly delayed if filtering is heavy,
      // but usually it's fast enough.
      setIsLoading(false);
    } else if (q) {
      // q exists but maybe allPosts isn't ready yet, or q is not a string
      setSearchTerm(q);
      setResults([]); // Clear results until data is ready
    } else {
      // No query parameter 'q'
      setSearchTerm('');
      setResults([]);
    }
  }, [q, allPosts]); // Re-run search if query or post data changes

  // Determine loading state more accurately
  const isActuallyLoading = isLoading || (q && allPosts.length === 0 && !error);

  return (
    <div className={styles.container}>
      <Head>
        <title>{searchTerm ? `Search Results for "${searchTerm}"` : 'Search'} - ChoudharyOm</title>
        <meta name="description" content={`Search results for articles on ChoudharyOm related to ${searchTerm}`} />
      </Head>

      <h1>Search</h1>

      {/* Optional Search Input within the page */}
      {/* ... (input code remains the same) ... */}

      {searchTerm && <h2 className={styles.resultsTitle}>Results for "{searchTerm}"</h2>}

      {/* Show loading indicator when fetching index OR when filtering after q changes */}
      {isActuallyLoading && <p>Loading...</p>}

      {/* Show error if fetching failed */}
      {error && <p className={styles.error}>{error}</p>}

      {/* Show "No results" only when not loading, no error, search term exists, and results are empty */}
      {!isActuallyLoading && !error && searchTerm && results.length === 0 && (
        <p>No articles found matching "{searchTerm}".</p>
      )}

      {/* Show results only when not loading, no error, and results exist */}
      {!isActuallyLoading && !error && results.length > 0 && (
        <ul className={styles.resultsList}>
          {results.map((post) => (
            <li key={post.slug} className={styles.resultItem}>
              {/* Ensure link path also respects assetPrefix if needed, but usually not for page routes */}
              <Link href={`/blog/${post.slug}`} className={styles.resultLink}>
                {post.title}
              </Link>
              {post.excerpt && <p className={styles.resultExcerpt}>{post.excerpt}</p>}
              {post.tags && post.tags.length > 0 && (
                <div className={styles.resultTags}>
                  {/* Map over each tag and wrap it in a Link */}
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tags/${encodeURIComponent(tag.toLowerCase())}`} // Link to /tags/tag-name (lowercase, URL-encoded)
                      className={styles.tag} // Apply the existing tag style
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

       {/* Show prompt only when not loading, no error, and no search term */}
       {!isActuallyLoading && !error && !searchTerm && (
         <p>Enter a term in the header search bar to find articles.</p>
       )}
    </div>
  );
};

export default SearchPage;

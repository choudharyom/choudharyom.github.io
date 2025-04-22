import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import styles from '@/styles/Search.module.css'; // We'll create this CSS module next

const SearchPage = () => {
  const router = useRouter();
  const { q } = router.query; // Get the search query 'q' from the URL

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allPosts, setAllPosts] = useState([]); // To store the fetched index

  // Fetch the search index once when the component mounts
  useEffect(() => {
    setIsLoading(true);
    fetch('/search-index.json') // Fetch the generated index from the public folder
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to load search index');
        }
        return res.json();
      })
      .then((data) => {
        setAllPosts(data);
        setError(null);
      })
      .catch((err) => {
        console.error('Error fetching search index:', err);
        setError('Could not load search data. Please try again later.');
        setAllPosts([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []); // Empty dependency array ensures this runs only once on mount

  // Perform search when 'q' (from URL) or allPosts data changes
  useEffect(() => {
    if (q && typeof q === 'string' && allPosts.length > 0) {
      const currentSearchTerm = q.toLowerCase().trim();
      setSearchTerm(q); // Update the displayed search term
      setIsLoading(true); // Indicate searching

      // Filter the posts based on the search term
      const filteredResults = allPosts.filter((post) => {
        const titleMatch = post.title.toLowerCase().includes(currentSearchTerm);
        const excerptMatch = post.excerpt?.toLowerCase().includes(currentSearchTerm); // Optional chaining for excerpt
        const tagMatch = post.tags?.some(tag => tag.toLowerCase().includes(currentSearchTerm)); // Search tags if they exist

        return titleMatch || excerptMatch || tagMatch;
      });

      setResults(filteredResults);
      setIsLoading(false); // Done searching
    } else {
      setSearchTerm(q || ''); // Set search term even if empty
      setResults([]); // Clear results if no query or no posts loaded
    }
  }, [q, allPosts]); // Re-run search if query or post data changes

  return (
    <div className={styles.container}>
      <Head>
        <title>{searchTerm ? `Search Results for "${searchTerm}"` : 'Search'} - ChoudharyOm</title>
        <meta name="description" content={`Search results for articles on ChoudharyOm related to ${searchTerm}`} />
      </Head>

      <h1>Search</h1>

      {/* You might want a search input here as well, which updates the URL query 'q' */}
      {/* <input
        type="search"
        placeholder="Search articles..."
        defaultValue={searchTerm} // Use defaultValue to reflect URL state initially
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            router.push(`/search?q=${e.target.value}`);
          }
        }}
        className={styles.searchInput}
      /> */}

      {searchTerm && <h2 className={styles.resultsTitle}>Results for "{searchTerm}"</h2>}

      {isLoading && <p>Loading search data or searching...</p>}

      {error && <p className={styles.error}>{error}</p>}

      {!isLoading && !error && searchTerm && results.length === 0 && (
        <p>No articles found matching "{searchTerm}".</p>
      )}

      {!isLoading && !error && results.length > 0 && (
        <ul className={styles.resultsList}>
          {results.map((post) => (
            <li key={post.slug} className={styles.resultItem}>
              <Link href={`/blog/${post.slug}`} className={styles.resultLink}>
                {post.title}
              </Link>
              {post.excerpt && <p className={styles.resultExcerpt}>{post.excerpt}</p>}
              {post.tags && post.tags.length > 0 && (
                 <div className={styles.resultTags}>
                   Tags: {post.tags.join(', ')}
                 </div>
              )}
            </li>
          ))}
        </ul>
      )}

       {!isLoading && !error && !searchTerm && (
         <p>Enter a term in the header search bar to find articles.</p>
       )}
    </div>
  );
};

export default SearchPage;

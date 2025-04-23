import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './PostCard.module.css';

const PostCard = ({ post }) => {
  // If no post data is provided, render nothing.
  if (!post) {
    return null;
  }

  // Destructure post properties for easier access.
  const { title, excerpt, slug, coverImage, date, readingTime, tags } = post;

  // Determine the correct image source:
  // - Use coverImage if it exists (it can be an internal path like '/images/...' or a full external URL).
  // - Otherwise, use the default placeholder image.
  // - IMPORTANT: Paths for images inside the 'public' directory should start with '/' and NOT include '/public'.
  const imageSrc = coverImage || '/images/placeholder-la.jpg';

  // Determine the alt text for the image.
  const imageAlt = title || 'Post image';

  return (
    <div className={styles.card}>
      {/* Use the determined imageSrc and imageAlt */}
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={600} // Define appropriate dimensions
        height={360} // Define appropriate dimensions
        className={styles.cardImage}
        // Consider adding priority={true} for images above the fold (e.g., the first few cards)
        // priority={true}
        // If mixing many external URLs, you might need unoptimized={true} depending on loader config
        // unoptimized={imageSrc.startsWith('http')}
      />

      {/* Link to the full blog post */}
      <Link href={`/blog/${slug}`} className={styles.cardTitle}>
        {title || 'Untitled Post'} {/* Fallback title */}
      </Link>

      {/* Post metadata */}
      <div className={styles.cardMeta}>
        {date && <span>{date}</span>}
        {/* Add a separator if both date and readingTime exist */}
        {date && readingTime && <span> • </span>}
        {readingTime && <span>{readingTime}</span>}
      </div>

      {/* Post excerpt */}
      <div className={styles.cardExcerpt}>
        {excerpt || 'No excerpt available.'} {/* Fallback excerpt */}
      </div>

      {/* Post tags */}
      {tags && tags.length > 0 && (
        <div className={styles.cardTags}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostCard;

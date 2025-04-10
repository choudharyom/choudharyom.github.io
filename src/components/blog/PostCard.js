import Link from 'next/link';
import Image from 'next/image';
// Add styles import if needed, e.g., import styles from './PostCard.module.css';

const PostCard = ({ post }) => {
  if (!post) {
    return null; // Or some placeholder if post is undefined
  }

  const { title, excerpt, slug, coverImage, date, readingTime, tags } = post;

  return (
    // Replace with your actual card structure and styling
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
      {coverImage && (
        <Image src={coverImage} alt={title || 'Post image'} width={300} height={200} style={{ objectFit: 'cover' }} />
      )}
      <h2>
        <Link href={`/blog/${slug}`}>
          <a>{title || 'Untitled Post'}</a>
        </Link>
      </h2>
      {date && <p><small>Date: {date}</small></p>}
      {readingTime && <p><small>Reading Time: {readingTime}</small></p>}
      <p>{excerpt || 'No excerpt available.'}</p>
      {tags && tags.length > 0 && (
        <div>
          Tags: {tags.join(', ')}
        </div>
      )}
    </div>
  );
};

export default PostCard;

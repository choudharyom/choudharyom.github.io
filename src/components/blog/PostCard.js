import Link from 'next/link';
import Image from 'next/image';
import styles from './PostCard.module.css';

const PostCard = ({ post }) => {
  if (!post) {
    return null;
  }

  const { title, excerpt, slug, coverImage, date, readingTime, tags } = post;

  return (
    <div className={styles.card}>
      {coverImage ? (
        <Image
          src={coverImage.startsWith('/') ? `/public${coverImage}` : coverImage}
          alt={title || 'Post image'}
          width={600}
          height={360}
          className={styles.cardImage}
        />
      ) : (
        <Image
          src="/public/images/placeholder-la.jpg"
          alt={title || 'Post image'}
          width={600}
          height={360}
          className={styles.cardImage}
        />
      )}
      <Link href={`/blog/${slug}`} className={styles.cardTitle}>
        {title || 'Untitled Post'}
      </Link>
      <div className={styles.cardMeta}>
        {date && <span>{date}</span>}
        {readingTime && <span>{readingTime}</span>}
      </div>
      <div className={styles.cardExcerpt}>
        {excerpt || 'No excerpt available.'}
      </div>
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

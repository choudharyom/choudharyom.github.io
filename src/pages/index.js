import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import PostCard from '@/components/blog/PostCard';
import SimpleNNVisualization from '@/components/neural-network/SimpleNNVisualization';
import { getAllPosts } from '@/lib/posts'; // Import the helper function

export default function Home({ featuredPosts }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Choudhary Om - Mathematics & Neural Networks</title>
        <meta name="description" content="Exploring mathematics and neural networks with clear explanations and interactive demos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <section className={styles.hero}>
          {/* Hero Section */}
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Mathematics of Neural Networks</h1>
            <p className={styles.description}>
              Exploring the fascinating intersection of mathematics and artificial intelligence
            </p>
            <div className={styles.buttonGroup}>
              <Link href="/blog" className={styles.primaryButton}>Read Articles</Link>
              <Link href="/about" className={styles.secondaryButton}>About Me</Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <SimpleNNVisualization />
          </div>
        </section>

        {/* Featured Articles Section */}
        <section className={styles.featuredSection}>
          <h2 className={styles.sectionTitle}>Featured Articles</h2>
          <div className={styles.grid}>
            {featuredPosts?.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>

        {/* Topics Section */}
        <section className={styles.topics}>
          <h2 className={styles.sectionTitle}>Explore Topics</h2>
          <div className={styles.topicGrid}>
            <Link href="/tag/neural-networks" className={styles.topicCard}>
                <h3>Neural Networks</h3>
                <p>Fundamentals to advanced concepts</p>
            </Link>
            {/* ... other topic cards ... */}
          </div>
        </section>
      </main>
    </div>
  );
}

export function getStaticProps() {
  // Fetch all posts using the helper function
  // For now, we'll treat all posts as "featured"
  // In a real app, you might filter or select specific posts here
  const featuredPosts = getAllPosts();

  return {
    props: {
      featuredPosts
    }
  };
}

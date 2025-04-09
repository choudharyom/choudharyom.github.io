import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import PostCard from '@/components/blog/PostCard';
import SimpleNNVisualization from '@/components/neural-network/SimpleNNVisualization';

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
              <Link href="/blog">
                <a className={styles.primaryButton}>Read Articles</a>
              </Link>
              <Link href="/about">
                <a className={styles.secondaryButton}>About Me</a>
              </Link>
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
            <Link href="/tag/neural-networks">
              <a className={styles.topicCard}>
                <h3>Neural Networks</h3>
                <p>Fundamentals to advanced concepts</p>
              </a>
            </Link>
            {/* ... other topic cards ... */}
          </div>
        </section>
      </main>
    </div>
  );
}

export function getStaticProps() {
  const featuredPosts = [
    {
      id: 1,
      title: 'Understanding Backpropagation with Calculus',
      excerpt: 'A step-by-step walkthrough of the mathematics behind neural network training',
      slug: 'understanding-backpropagation',
      coverImage: '/images/backprop.jpg',
      date: '2023-01-15',
      readingTime: '8 min',
      tags: ['neural-networks', 'calculus']
    },
    // ... other featured posts ...
  ];

  return {
    props: {
      featuredPosts
    }
  };
}

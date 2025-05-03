import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import PostCard from '@/components/blog/PostCard';
import SimpleNNVisualization from '@/components/neural-network/SimpleNNVisualization';
import MathNNVisualization from '@/components/neural-network/MathNNVisualization';
import { getAllPosts, getPopularTags } from '@/lib/posts';

export default function Home({ featuredPosts, popularTags  }) {
  const [visiblePosts, setVisiblePosts] = useState(2);
  
  const showMorePosts = () => {
    setVisiblePosts(prev => Math.min(prev + 2, featuredPosts?.length || 0));
  };

  const hasMorePosts = featuredPosts?.length > visiblePosts;

  return (
    <div className={styles.container}>
      <Head>
        <title>Om 🐯 Choudhary 🧘‍♂️ - Mathematics & Neural Networks</title>
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

        {/* Math Neural Network Visualization Section */}
        <section className={styles.mathNNSection}>
          <h2 className={styles.sectionTitle}>How Neural Networks Compute</h2>
          <MathNNVisualization />
          <p style={{ maxWidth: 700, margin: '0 auto 2rem auto', fontSize: '1.15rem', color: '#444', textAlign: 'center' }}>
            The equation <b>y = σ(Wx + b)</b> describes how a neural network layer transforms an input vector <b>x</b> using a weight matrix <b>W</b> and bias <b>b</b>, then applies a nonlinear activation function <b>σ</b> (like sigmoid or ReLU). 
            <br />
            <br />
            In the animation above, you can see the input vector, weight matrix, and output vector, with a moving dot showing how data flows through the network. This is the core math behind every neural network!
          </p>
        </section>

        {/* Featured Articles Section */}
        <section className={styles.featuredSection}>
            <h2 className={styles.sectionTitle}>Featured Articles</h2>
            <div className={styles.cardStack}>
              {featuredPosts?.slice(0, visiblePosts).map((post, index) => (
                <div 
                  key={post.id} 
                  className={styles.cardWrapper}
                  style={{ 
                    '--index': index,
                    zIndex: visiblePosts - index 
                  }}
                >
                  <PostCard post={post} />
                </div>
              ))}
            </div>
            {hasMorePosts && (
              <button 
                onClick={showMorePosts} 
                className={styles.loadMoreButton}
              >
                Show More Articles
              </button>
            )}
          </section>

          {/* Topics Section */}
          <section className={styles.topics}>
            <h2 className={styles.sectionTitle}>Explore Topics</h2>
            <div className={styles.topicGrid}>
              {popularTags?.slice(0, 6).map((tag) => (
                <Link 
                  key={tag.slug} 
                  href={`/tag/${tag.slug}`} 
                  className={styles.topicCard}
                >
                  <div>
                    <h3>{tag.name}</h3>
                    <p>{tag.description}</p>
                  </div>
                </Link>
              )) || <p>Loading topics...</p>}
            </div>
          </section>
      </main>
    </div>
  );
}

export function getStaticProps() {
  const allPosts = getAllPosts();
  const popularTags = getPopularTags(6) || []; // Ensure we always return an array

  return {
    props: {
      featuredPosts: allPosts,
      popularTags
    }
  };
}

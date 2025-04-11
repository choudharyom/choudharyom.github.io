import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import PostCard from '@/components/blog/PostCard';
import SimpleNNVisualization from '@/components/neural-network/SimpleNNVisualization';
import MathNNVisualization from '@/components/neural-network/MathNNVisualization';
import { getAllPosts } from '@/lib/posts'; // Import the helper function

export default function Home({ featuredPosts }) {
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
              <div>
                <h3>Neural Networks</h3>
                <p>Fundamentals to advanced concepts</p>
              </div>
            </Link>
            <Link href="/tag/linear-algebra" className={styles.topicCard}>
              <div>
                <h3>Linear Algebra</h3>
                <p>Vectors, matrices, and their role in AI</p>
              </div>
            </Link>
            <Link href="/tag/tensorflow" className={styles.topicCard}>
              <div>
                <h3>TensorFlow</h3>
                <p>Deep learning with TensorFlow</p>
              </div>
            </Link>
            <Link href="/tag/machine-learning" className={styles.topicCard}>
              <div>
                <h3>Machine Learning</h3>
                <p>Algorithms, models, and applications</p>
              </div>
            </Link>
            <Link href="/tag/python" className={styles.topicCard}>
              <div>
                <h3>Python</h3>
                <p>Programming for data science and AI</p>
              </div>
            </Link>
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

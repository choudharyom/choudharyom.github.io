import styles from '@/styles/About.module.css'; // Assuming we might want specific styles later

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <h1>About the Author</h1>
      <h2>Author: Choudhary Om</h2>
        <h3>AI Researcher & Developer</h3>
        <p>
          I write about machine learning, neural networks, and mathematical foundations of AI.
          Currently working on research in deep learning optimization.
        </p>
    </div>
  );
};

export default AboutPage;

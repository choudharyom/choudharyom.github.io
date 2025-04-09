import { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import styles from '@/styles/Layout.module.css';

const Layout = ({ children }) => {
  // Add a scroll progress bar for reading experience
  useEffect(() => {
    const progressBar = document.createElement('div');
    progressBar.className = styles.progressBar;
    document.body.appendChild(progressBar);

    const updateProgress = () => {
      const scrollPosition = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollPosition / scrollHeight) * 100;
      progressBar.style.width = `${scrollPercentage}%`;
    };

    window.addEventListener('scroll', updateProgress);
    
    return () => {
      window.removeEventListener('scroll', updateProgress);
      if (document.body.contains(progressBar)) {
        document.body.removeChild(progressBar);
      }
    };
  }, []);

  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;

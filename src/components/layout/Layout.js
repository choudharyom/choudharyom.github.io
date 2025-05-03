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
    // Use Tailwind for flex structure and default background
    // Remove styles.layout if it only contained flex properties
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900"> {/* Default background */}
      <Header />
      {/* Add flex-grow using Tailwind to make main fill space */}
      {/* Keep styles.main ONLY if it has other non-conflicting styles */}
      {/* If styles.main is now empty, you can remove it */}
      <main className={`flex-grow w-full ${styles.main}`}> {/* Add flex-grow */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

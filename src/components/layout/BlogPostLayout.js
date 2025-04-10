import styles from '@/styles/BlogPost.module.css';
import Head from 'next/head'; // Import Head for potential meta tags later

// TODO: Make Author Info dynamic (props or context)
// TODO: Make TOC dynamic (parse children or pass headings as props)

const BlogPostLayout = ({ children, meta }) => {
  // Basic TOC data - replace with dynamic generation later
  const tocItems = [
    { id: 'introduction', title: 'Introduction to Neural Networks', level: 2 },
    { id: 'mathematical-foundations', title: 'Mathematical Foundations', level: 2 },
    { id: 'forward-propagation', title: 'Forward Propagation', level: 3 },
    { id: 'backpropagation', title: 'Backpropagation', level: 3 },
    { id: 'implementation', title: 'Implementing a Simple Neural Network', level: 2 },
    { id: 'visualization', title: 'Neural Network Visualization', level: 2 },
    { id: 'implementing-backprop', title: 'Implementing Backpropagation from Scratch', level: 2 },
    { id: 'advanced-concepts', title: 'Advanced Concepts', level: 2 },
    { id: 'regularization', title: 'Regularization', level: 3 },
    { id: 'optimization', title: 'Optimization Algorithms', level: 3 },
  ];

  return (
    <>
      {/* Add Head component for SEO or title if needed */}
      {/* <Head>
        <title>{meta?.title || 'Blog Post'}</title>
        <meta name="description" content={meta?.description || 'Blog post description'} />
      </Head> */}

      {/* Main container for article and sidebar */}
      <div className={styles.pageContainer}>
        {/* Article Content Area - children will be rendered here */}
        <article className={styles.articleContent}>
          {children}
        </article>

        {/* Sidebar */}
        <aside className={`${styles.sidebar} md:w-1/4 px-4 mt-8 md:mt-0`}>
            <div className="sticky top-24">
                {/* About Author Card */}
                <div className={`${styles.card} mb-6`}>
                    <div className="p-4">
                        <h3 className="font-bold text-lg mb-3">About the Author</h3>
                        <div className="flex items-center mb-4">
                            {/* TODO: Replace placeholder image */}
                            <img src="https://via.placeholder.com/60" alt="Author" className="w-14 h-14 rounded-full mr-3"/>
                            <div>
                                <h4 className="font-bold">Choudhary Om</h4>
                                <p className="text-sm text-gray-600">AI Researcher & Developer</p>
                            </div>
                        </div>
                        <p className="text-sm mb-3">I write about machine learning, neural networks, and mathematical foundations of AI. Currently working on research in deep learning optimization.</p>
                        {/* TODO: Implement follow functionality */}
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all">Follow</button>
                    </div>
                </div>
                
                {/* Table of Contents Card */}
                <div className={`${styles.toc} ${styles.card} p-4`}>
                    <h3 className="font-bold text-lg mb-4">Table of Contents</h3>
                    <nav>
                        {tocItems.map(item => (
                            <a 
                              key={item.id} 
                              href={`#${item.id}`} 
                              className={`${styles.tocLink} ${item.level === 2 ? styles.tocH2 : styles.tocH3}`}
                            >
                              {item.title}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
        </aside>
      </div>
    </>
  );
};

export default BlogPostLayout;

import styles from '@/styles/BlogPost.module.css';
import Head from 'next/head'; // Import Head for potential meta tags later
import React from 'react'; // Import React

// TODO: Implement follow functionality
// TODO: Replace placeholder image with actual author image if available

const BlogPostLayout = ({ children, meta, author }) => { // Add author prop
  // Function to extract headings from children recursively
  const getHeadings = (nodes) => {
    const headings = [];
    React.Children.forEach(nodes, (node) => {
      if (!React.isValidElement(node)) {
        return;
      }

      // Check direct children like <h2>, <h3>
      // Also check for mdxType for potential MDX integration
      const nodeType = node.props.mdxType || node.type;
      if (nodeType === 'h2' || nodeType === 'h3') {
        // Ensure the heading has an ID and its child is a string (the title)
        if (node.props.id && typeof node.props.children === 'string') {
          headings.push({
            id: node.props.id,
            title: node.props.children,
            level: nodeType === 'h2' ? 2 : 3,
          });
        } else if (node.props.id && React.isValidElement(node.props.children) && typeof node.props.children.props.children === 'string') {
          // Handle cases where title might be wrapped, e.g., <h2><a>Title</a></h2>
          // This might need adjustment based on actual heading structure
          headings.push({
            id: node.props.id,
            title: node.props.children.props.children,
            level: nodeType === 'h2' ? 2 : 3,
          });
        }
      } 
      
      // Recursively check children if the current node has children
      if (node.props && node.props.children) {
        headings.push(...getHeadings(node.props.children));
      }
    });
    return headings;
  };

  const tocItems = getHeadings(children);

  // Default author info if not provided or incomplete
  const displayAuthor = {
    name: author?.name || 'Choudhary Om',
    title: author?.title || 'AI Researcher & Developer',
    bio: author?.bio || 'I write about machine learning, neural networks, and mathematical foundations of AI. Currently working on research in deep learning optimization.',
    imageUrl: author?.imageUrl || 'https://via.placeholder.com/60' // Default placeholder
  };

  return (
    <>
      {/* Add Head component for SEO or title if needed */}
      {meta?.title && (
        <Head>
          <title>{meta.title}</title>
          {meta.description && <meta name="description" content={meta.description} />}
        </Head>
      )}

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
                            <img src={displayAuthor.imageUrl} alt={`Photo of ${displayAuthor.name}`} className="w-14 h-14 rounded-full mr-3"/>
                            <div>
                                <h4 className="font-bold">{displayAuthor.name}</h4>
                                <p className="text-sm text-gray-600">{displayAuthor.title}</p>
                            </div>
                        </div>
                        <p className="text-sm mb-3">{displayAuthor.bio}</p>
                        {/* TODO: Implement follow functionality */}
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all">Follow</button>
                    </div>
                </div>
                
                {/* Table of Contents Card - Only render if items exist */}
                {tocItems.length > 0 && (
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
                )}
            </div>
        </aside>
      </div>
    </>
  );
};

export default BlogPostLayout;

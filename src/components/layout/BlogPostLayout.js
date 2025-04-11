import styles from '@/styles/BlogPost.module.css';
import aboutStyles from '@/styles/About.module.css';
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
    name: author?.name || 'Om 🐯 Choudhary 🧘‍♂️',
    title: author?.title || 'Software Architect👾',
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
        <aside className={`${styles.sidebar}`}>
          {/* No need for sticky class here anymore */}
          <div>
            {/* About Author Card */}
            <div className={aboutStyles.heroCard} style={{ marginBottom: '1.5rem' }}>
              <div className={aboutStyles.avatarWrapper}>
                <img
                  src={displayAuthor.imageUrl}
                  alt={`Photo of ${displayAuthor.name}`}
                  className={aboutStyles.avatar}
                />
              </div>
              <h1 className={aboutStyles.name} style={{ fontSize: '1.4rem', marginBottom: '0.2rem' }}>
                <span className={aboutStyles.animatedUnderline}>{displayAuthor.name}</span>
              </h1>
              <h2 className={aboutStyles.subtitle} style={{ fontSize: '1.05rem', marginBottom: '0.7rem' }}>
                {displayAuthor.title}
              </h2>
              <p className={aboutStyles.intro} style={{ fontSize: '0.98rem', marginBottom: '0.7rem' }}>
                <span className={aboutStyles.animatedIntro}>
                  {displayAuthor.bio}
                </span>
              </p>
            </div>

            {/* Table of Contents Card */}
            {tocItems.length > 0 && (
              <div className={`${styles.card} p-4`}>
                <h3 className="font-semibold text-xl mb-4 text-gray-900 dark:text-gray-100">Table of Contents</h3>
                <nav>
                  {tocItems.map((item) => (
                    <a key={item.id} href={`#${item.id}`} className={`${styles.tocLink} ${item.level === 2 ? styles.tocH2 : styles.tocH3}`}>
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

import styles from '@/styles/BlogPost.module.css';
import aboutStyles from '@/styles/About.module.css';
import Head from 'next/head';
import React from 'react';

const BlogPostLayout = ({ children, meta, author }) => {
  const getHeadings = (nodes) => {
    const headings = [];
    React.Children.forEach(nodes, (node) => {
      if (!React.isValidElement(node)) return;
      const nodeType = node.props.mdxType || node.type;
      if (nodeType === 'h2' || nodeType === 'h3') {
        if (node.props.id && typeof node.props.children === 'string') {
          headings.push({
            id: node.props.id,
            title: node.props.children,
            level: nodeType === 'h2' ? 2 : 3,
          });
        } else if (node.props.id && React.isValidElement(node.props.children) && typeof node.props.children.props.children === 'string') {
          headings.push({
            id: node.props.id,
            title: node.props.children.props.children,
            level: nodeType === 'h2' ? 2 : 3,
          });
        }
      }
      if (node.props && node.props.children) {
        headings.push(...getHeadings(node.props.children));
      }
    });
    return headings;
  };

  const tocItems = getHeadings(children);

  const displayAuthor = {
    name: author?.name || 'Om Choudhary',
    title: author?.title || 'Software Architect👾',
    bio: author?.bio || 'I write about machine learning, neural networks, and mathematical foundations of AI. Currently working on research in deep learning optimization.',
    imageUrl: author?.imageUrl || 'https://via.placeholder.com/60',
  };

  const readingTime = meta?.readingTime || '5 min read';

  return (
    <>
      {/* Head component for meta tags, title tag, canonical link */}
      <Head>
        <title>{meta?.title || 'Blog Post'}</title> {/* Use meta title for page title */}
        {meta?.description && <meta name="description" content={meta.description} />}
        {meta?.canonicalUrl && <link rel="canonical" href={meta.canonicalUrl} />}
        {/* Other meta tags like OG tags can go here */}
      </Head>

      <div className={styles.pageContainer}>
        <article className={styles.articleContent}>
          {/* Render the main title */}
          <h1>{meta?.title}</h1>

          {/* Meta row with Author and Reading Time */}
          <div className={styles.metaRow}>
            <img
              src={displayAuthor.imageUrl}
              alt={`Photo of ${displayAuthor.name}`}
              className={styles.authorAvatar}
            />
            <div className={styles.metaText}>
              <span className={styles.authorName}><b>{displayAuthor.name}</b></span>
              <span className={styles.dot}>·</span>
              <span className={styles.followLink}>Follow</span>
              <span className={styles.dot}>·</span>
              <span className={styles.readingTime}>{readingTime}</span>
            </div>
          </div>
          
          {/* Render Publish Date and Tags here, below the title */}
          {meta?.date && meta?.tags && (
            <p className={styles.meta}>
              <b>Published on: </b>{new Date(meta.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              {meta.tags.length > 0 && ' | Tags: '}
              {meta.tags.map((tag, index) => (
                <span key={tag}>
                  <a href={`/tags/${tag}`}>{tag}</a>
                  {index < meta.tags.length - 1 ? '' : ''}
                </span>
              ))}
            </p>
          )}

          {/* Action bar */}
          <div className={styles.actionBarWrapper}>
             {/* ... action bar content ... */}
             <hr className={styles.actionBarLine} />
             <div className={styles.actionBar}>
             <div className={styles.actionBarLeft}>
                <button className={styles.actionButton} title="Clap">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#232946" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
                </button>
                <button className={styles.actionButton} title="Comment">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#232946" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </button>
              </div>
              <div className={styles.actionBarRight}>
                <button className={styles.actionButton} title="Save">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#232946" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                </button>
                <button className={styles.actionButton} title="Share">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#232946" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                </button>
              </div>
             </div>
          </div>

          {/* Render the actual blog post content */}
          {children}

        </article>

        <aside className={`${styles.sidebar}`}>
          <div>
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
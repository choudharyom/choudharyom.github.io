import Link from 'next/link';
import styles from '@/styles/Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Top section using flex container for responsiveness */}
        <div className={styles.footerFlexContainer}>
          {/* About Section */}
          <div className={styles.footerAbout}>
            <h2 className={styles.footerTitle}>ChoudharyOm</h2>
            <p className={styles.footerDescription}>Exploring the mathematics of neural networks and machine learning</p>
          </div>

          {/* Navigation Links Sections */}
          <div className={styles.footerCategories}>
            <h3 className={styles.footerCategoryTitle}>Content</h3>
            <ul className={styles.footerList}>
              <li className={styles.footerListItem}><Link href="/blog"><a className={styles.footerLink}>Articles</a></Link></li>
              <li className={styles.footerListItem}><Link href="/tag/neural-networks"><a className={styles.footerLink}>Neural Networks</a></Link></li>
              <li className={styles.footerListItem}><Link href="/tag/linear-algebra"><a className={styles.footerLink}>Linear Algebra</a></Link></li>
              <li className={styles.footerListItem}><Link href="/tag/tensorflow"><a className={styles.footerLink}>TensorFlow</a></Link></li>
            </ul>
          </div>

          <div className={styles.footerLinks}>
            <h3 className={styles.footerLinksTitle}>About</h3>
            <ul className={styles.footerList}>
              <li className={styles.footerListItem}><Link href="/about"><a className={styles.footerLink}>About Me</a></Link></li>
              <li className={styles.footerListItem}><Link href="/contact"><a className={styles.footerLink}>Contact</a></Link></li>
            </ul>
          </div>

          <div className={styles.footerLinks}> {/* Reusing footerLinks style for consistency */}
            <h3 className={styles.footerLinksTitle}>Legal</h3>
            <ul className={styles.footerList}>
              <li className={styles.footerListItem}><Link href="/privacy"><a className={styles.footerLink}>Privacy Policy</a></Link></li>
              <li className={styles.footerListItem}><Link href="/terms"><a className={styles.footerLink}>Terms of Use</a></Link></li>
            </ul>
          </div>

          {/* Connect Section (includes social links) */}
          <div className={styles.footerConnect}>
             <h3 className={styles.footerConnectTitle}>Connect</h3>
             <div className={styles.footerSocialLinks}>
                <a href="https://twitter.com/choudharyom" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className={styles.footerSocialLink}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
                <a href="https://github.com/choudharyom" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={styles.footerSocialLink}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </a>
                <a href="https://linkedin.com/in/choudharyom" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={styles.footerSocialLink}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
             </div>
          </div>
        </div>

        {/* Bottom section for copyright */}
        <div className={styles.footerCopyright}>
          <p>© {new Date().getFullYear()} ChoudharyOm. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

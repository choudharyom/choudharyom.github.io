// src/components/layout/Footer.js
import Link from 'next/link';
import styles from '@/styles/Footer.module.css'; // We'll create/update this next
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'; // Example icons

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}> {/* Grid container */}
        {/* Section 1: Navigation */}
        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>Navigation</h4>
          <ul className={styles.navList}>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/projects">Projects</Link></li>
            {/* Add other relevant links */}
          </ul>
        </div>

        {/* Section 2: Social Links */}
        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>Connect</h4>
          <div className={styles.socialLinks}>
            <a href="https://github.com/choudharyom" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FaGithub />
            </a>
            <a href="https://linkedin.com/in/om-choudhary" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="https://twitter.com/choudharyom_" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            {/* Add other social links */}
          </div>
        </div>

        {/* Section 3: Maybe Contact or other info */}
        <div className={styles.footerSection}>
           <h4 className={styles.sectionTitle}>Contact</h4>
           <p>choudharyom [at] hotmail.com</p>
           {/* Or a link to a contact page */}
           {/* <Link href="/contact">Get in Touch</Link> */}
        </div>

      </div>

      {/* Bottom Bar: Copyright */}
      <div className={styles.footerBottom}>
        <p>&copy; {currentYear} Om Choudhary 2025. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

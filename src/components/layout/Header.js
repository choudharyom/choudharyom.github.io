import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import styles from '@/styles/Header.module.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link href="/">
          <a className={styles.logo}>
            <Image
              src="/images/logo.svg"
              alt="Choudhary Om Logo"
              width={40}
              height={40}
            />
            <span>ChoudharyOm</span>
          </a>
        </Link>

        {/* Search Bar */}
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search articles..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                router.push(`/search?q=${e.target.value}`);
              }
            }}
          />
          <button aria-label="Search">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className={styles.menuButton} onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation */}
        <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
          <Link href="/blog">
            <a className={router.pathname.startsWith('/blog') ? styles.active : ''}>Articles</a>
          </Link>
          <Link href="/tag/neural-networks">
            <a className={router.pathname.startsWith('/tag/neural-networks') ? styles.active : ''}>Neural Networks</a>
          </Link>
          <Link href="/about">
            <a className={router.pathname === '/about' ? styles.active : ''}>About</a>
          </Link>
          <ThemeToggle />
          
          {/* User Menu */}
          {user ? (
            <div className={styles.userMenu}>
              <Link href="/profile">
                <a className={styles.profileLink}>
                  <Image
                    src={user.photoURL || "/images/default-avatar.png"}
                    alt={user.displayName || "User"}
                    width={32}
                    height={32}
                    className={styles.avatar}
                  />
                </a>
              </Link>
              <button onClick={signOut} className={styles.signOutButton}>
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/login">
              <a className={styles.loginButton}>Sign In</a>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

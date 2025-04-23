import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import styles from '@/styles/Header.module.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // <-- 1. Add state for search query
  const router = useRouter();
  const { user, signOut } = useAuth();

  // --- 2. Create a search handler function ---
  const handleSearch = () => {
    const query = searchQuery.trim(); // Trim whitespace
    if (query) { // Only search if query is not empty
      router.push(`/search?q=${encodeURIComponent(query)}`); // Use router to navigate
      setSearchQuery(''); // Optional: Clear the input after search
      setMenuOpen(false); // Optional: Close menu if open after search
    }
  };
  // --- End of search handler ---

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle closing menu on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setMenuOpen(false);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);


  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.headerContainer}>
        <Link href="/" className={styles.headerLogo}>
          <Image
            src="/images/logo.png"
            alt="Choudhary Om"
            width={50}
            height={40}
          />
          <span>ChoudharyOm</span>
        </Link>

        {/* --- Updated Search Bar --- */}
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery} // <-- Bind input value to state
            onChange={(e) => setSearchQuery(e.target.value)} // <-- Update state on change
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch(); // <-- 3. Call handler on Enter
              }
            }}
          />
          <button
            aria-label="Search"
            onClick={handleSearch} // <-- 3. Call handler on Button Click
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
        {/* --- End of Updated Search Bar --- */}

        <button
          className={`${styles.headerMenuButton} ${menuOpen ? styles.open : ''}`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav id="main-navigation" className={`${styles.headerNav} ${menuOpen ? styles.open : ''}`}>
          <Link
            href="/blog"
            className={`${styles.headerNavLink} ${router.pathname.startsWith('/blog') ? styles.active : ''}`}>
            Articles
          </Link>
          <Link
            href="/tag/neural-networks"
            className={`${styles.headerNavLink} ${router.pathname.startsWith('/tag/neural-networks') ? styles.active : ''}`}>
            Neural Networks
          </Link>
          <Link
            href="/about"
            className={`${styles.headerNavLink} ${router.pathname === '/about' ? styles.active : ''}`}>
            About
          </Link>
          <ThemeToggle />

          {user ? (
            <div className={styles.userMenu}>
              <Link href="/profile" className={styles.profileLink}>
                <Image
                  src={user.photoURL || "/images/default-avatar.png"}
                  alt={user.displayName || "User"}
                  width={32}
                  height={32}
                  className={styles.avatar}
                />
              </Link>
              <button onClick={signOut} className={styles.signOutButton}>
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/login" className={styles.loginButton}>
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

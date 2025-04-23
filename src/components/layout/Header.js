import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import styles from '@/styles/Header.module.css'; // Note: CSS file uses .headerContainer, .headerLogo etc.

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  console.log("Header Rendered - menuOpen:", menuOpen); // Check initial and re-renders

  const toggleMenu = () => {
    console.log("Button Clicked - Toggling menuOpen to:", !menuOpen);
    setMenuOpen(!menuOpen);
  };
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
    // Use .header and add .scrolled (defined below)
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      {/* Use .headerContainer */}
      <div className={styles.headerContainer}> 
        <Link href="/" className={styles.headerLogo}>
          {/* Use .headerLogo */}

          <Image
            src="/images/logo.png" // Ensure this path is correct
            alt="Choudhary Om"
            width={50}
            height={40}
          />
          <span>ChoudharyOm</span>

        </Link>

        {/* Search Bar - Use .searchBar (defined below) */}
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
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>

        {/* Mobile Menu Button - Use .headerMenuButton */}
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

        {/* Navigation - Use .headerNav and .open (defined below) */}
        <nav className={`${styles.headerNav} ${menuOpen ? styles.open : ''}`}>
          <Link
            href="/blog"
            className={`${styles.headerNavLink} ${router.pathname.startsWith('/blog') ? styles.active : ''}`}>
             {/* Use .headerNavLink and .active (defined below) */}
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
          
          {/* User Menu - Use .userMenu (defined below) */}
          {user ? (
            <div className={styles.userMenu}>
              <Link href="/profile" className={styles.profileLink}>
                {/* Use .profileLink (defined below) */}

                <Image
                  src={user.photoURL || "/images/default-avatar.png"} // Ensure this path is correct
                  alt={user.displayName || "User"}
                  width={32}
                  height={32}
                   /* Use .avatar (defined below) */
                  className={styles.avatar}
                />

              </Link>
               {/* Use .signOutButton (defined below) */}
              <button onClick={signOut} className={styles.signOutButton}>
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/login" className={styles.loginButton}>
               {/* Use .loginButton (defined below) */}
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

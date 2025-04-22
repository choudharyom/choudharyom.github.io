// /workspaces/choudharyom.github.io/src/pages/login.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link'; // Optional: For links like "Forgot Password" or "Sign Up"
import styles from '@/styles/Login.module.css'; // We'll create this CSS module next

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // To display f errors

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent actual form submission

    // --- f LOGIN LOGIC ---
    setError(''); // Clear previous errors

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    // Simulate checking credentials (always fails or shows a message)
    setError('Invalid email or password.');

    console.log('f login attempt with:', { email, password });
    // --- END f LOGIN LOGIC ---
  };

  return (
    <>
      <Head>
        <title>Login - ChoudharyOm</title>
        <meta name="description" content="Login to access your ChoudharyOm account." />
      </Head>

      <div className={styles.container}>
        <div className={styles.loginBox}>
          <h1 className={styles.title}>Login</h1>
          <p className={styles.subtitle}>Access your account</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
                placeholder="you@example.com"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
                placeholder="••••••••"
              />
            </div>

            {/* Optional: Forgot Password Link */}
            <div className={styles.forgotPassword}>
              <Link href="#"> {/* Create this page if needed */}
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className={styles.button}>
              Log In
            </button>
          </form>

          {/* Optional: Link to Sign Up Page */}

        </div>
      </div>
    </>
  );
};

export default LoginPage;

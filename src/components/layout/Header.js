import Link from 'next/link'

export default function Header() {
  return (
    <header>
      <nav>
        <Link href="/">
          <span>Home</span>
        </Link>
        <Link href="/about">
          <span>About</span>
        </Link>
        <Link href="/blog">
          <span>Blog</span>
        </Link>
      </nav>

      <style jsx>{`
        header {
          padding: 1rem;
          background: #f5f5f5;
        }
        nav {
          display: flex;
          gap: 1rem;
        }
        span {
          cursor: pointer;
        }
      `}</style>
    </header>
  )
}

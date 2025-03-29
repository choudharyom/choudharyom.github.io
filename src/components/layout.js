import React from "react"
import { Link } from "gatsby"
import "katex/dist/katex.min.css"
import "prismjs/themes/prism-tomorrow.css"
import "../styles/global.css"

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-primary">
              My Blog
            </Link>
            <Link 
              to="/write" 
              className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
            >
              Write Post
            </Link>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8 prose prose-lg">
        {children}
      </main>
    </div>
  )
}

import React from "react"
import { Link } from "gatsby"
import { useAuth } from "./auth-provider"
import "katex/dist/katex.min.css"
import "prismjs/themes/prism-tomorrow.css"
import "../styles/global.css"
import SearchBar from './search-bar'

export default function Layout({ children, hideSearch }) {
  const { isAuthenticated, login, logout, isWriter } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-primary">
              My Blog
            </Link>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  {isWriter && (
                    <>
                      <Link 
                        to="/write" 
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
                      >
                        Write Post
                      </Link>
                      <Link 
                        to="/drafts" 
                        className="text-gray-600 hover:text-primary"
                      >
                        Drafts
                      </Link>
                    </>
                  )}
                  <Link to="/dashboard" className="text-gray-600 hover:text-primary">
                    Dashboard
                  </Link>
                  <button 
                    onClick={logout} 
                    className="text-gray-600 hover:text-primary"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button 
                  onClick={login}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8 prose prose-lg">
        {!hideSearch && <SearchBar />}
        {children}
      </main>
    </div>
  )
}

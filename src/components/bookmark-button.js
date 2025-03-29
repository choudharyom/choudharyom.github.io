import React, { useState, useEffect } from 'react'
import { useAuth } from './auth-provider'

const BookmarkButton = ({ postId, title }) => {
  const { isAuthenticated } = useAuth()
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}')
      setIsBookmarked(!!bookmarks[postId])
    }
  }, [postId, isAuthenticated])

  const handleBookmark = () => {
    if (!isAuthenticated) return

    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}')
    const newIsBookmarked = !isBookmarked

    if (newIsBookmarked) {
      bookmarks[postId] = { title, savedAt: new Date().toISOString() }
    } else {
      delete bookmarks[postId]
    }

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    setIsBookmarked(newIsBookmarked)
  }

  return (
    <button
      onClick={handleBookmark}
      className={`interaction-button-outline ${
        isBookmarked 
          ? 'text-primary border-primary bg-primary bg-opacity-5' 
          : ''
      }`}
      disabled={!isAuthenticated}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Save post'}
    >
      <svg 
        className="button-icon" 
        fill={isBookmarked ? 'currentColor' : 'none'}
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
        />
      </svg>
      <span className="font-medium">{isBookmarked ? 'Saved' : 'Save'}</span>
    </button>
  )
}

export default BookmarkButton

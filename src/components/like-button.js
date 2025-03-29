import React, { useState, useEffect } from 'react'
import { useAuth } from './auth-provider'

const LikeButton = ({ postId }) => {
  const { isAuthenticated } = useAuth()
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  useEffect(() => {
    // Check local storage for liked status
    if (isAuthenticated) {
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}')
      setIsLiked(!!likedPosts[postId])
    }
  }, [postId, isAuthenticated])

  const handleLike = () => {
    if (!isAuthenticated) return

    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}')
    const newIsLiked = !isLiked

    if (newIsLiked) {
      likedPosts[postId] = true
      setLikeCount(prev => prev + 1)
    } else {
      delete likedPosts[postId]
      setLikeCount(prev => prev - 1)
    }

    localStorage.setItem('likedPosts', JSON.stringify(likedPosts))
    setIsLiked(newIsLiked)
  }

  return (
    <button
      onClick={handleLike}
      className={`interaction-button-outline ${
        isLiked 
          ? 'text-primary border-primary bg-primary bg-opacity-5' 
          : ''
      }`}
      disabled={!isAuthenticated}
      aria-label={isLiked ? 'Unlike post' : 'Like post'}
    >
      <svg 
        className="button-icon" 
        fill={isLiked ? 'currentColor' : 'none'}
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
      <span className="font-medium">{likeCount}</span>
    </button>
  )
}

export default LikeButton

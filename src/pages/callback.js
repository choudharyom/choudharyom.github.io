import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { navigate } from 'gatsby'

const Callback = () => {
  const { isLoading, error } = useAuth0()

  React.useEffect(() => {
    if (!isLoading && !error) {
      navigate('/dashboard')
    }
  }, [isLoading, error])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Completing login...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p>Authentication error. Please try again.</p>
          <button 
            onClick={() => navigate('/login')}
            className="mt-4 bg-primary text-white px-4 py-2 rounded"
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  return null
}

export default Callback

import React from 'react'
import { navigate } from 'gatsby'
import { useAuth } from './auth-provider'

const ProtectedRoute = ({ component: Component, requiredRole, ...rest }) => {
  const { isAuthenticated, userRole } = useAuth()

  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
      navigate('/login')
    }
    return null
  }

  if (requiredRole && userRole !== requiredRole && userRole !== 'admin') {
    if (typeof window !== 'undefined') {
      navigate('/unauthorized')
    }
    return null
  }

  return <Component {...rest} />
}

export default ProtectedRoute

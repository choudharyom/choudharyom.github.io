import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0()
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    if (isAuthenticated && user) {
      // Get user role from Auth0 metadata
      setUserRole(user['https://myblog.com/roles'] || 'reader')
    }
  }, [isAuthenticated, user])

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      userRole,
      login: loginWithRedirect,
      logout,
      isWriter: userRole === 'writer' || userRole === 'admin',
      isEditor: userRole === 'editor' || userRole === 'admin',
      isAdmin: userRole === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

import React from 'react'
import Layout from '../components/layout'
import { useAuth } from '../components/auth-provider'
import { navigate } from 'gatsby'

const ProfilePage = () => {
  const { isAuthenticated, user, userRole } = useAuth()

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated])

  if (!isAuthenticated || !user) return null

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-start gap-6">
            {user.picture && (
              <img 
                src={user.picture} 
                alt={user.name}
                className="w-24 h-24 rounded-full"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <p className="text-gray-600 mb-4">{user.email}</p>
              <div className="inline-block bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full">
                {userRole}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ProfilePage

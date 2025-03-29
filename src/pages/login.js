import React from 'react'
import Layout from '../components/layout'
import { useAuth } from '../components/auth-provider'
import { navigate } from 'gatsby'

const LoginPage = () => {
  const { isAuthenticated, login } = useAuth()
  
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated])

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-4xl font-bold mb-8">Welcome Back</h1>
        <button
          onClick={login}
          className="bg-primary text-white px-6 py-3 rounded-lg text-lg hover:bg-opacity-90"
        >
          Log In / Sign Up
        </button>
      </div>
    </Layout>
  )
}

export default LoginPage

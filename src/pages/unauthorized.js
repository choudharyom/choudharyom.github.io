import React from 'react'
import Layout from '../components/layout'
import { Link } from 'gatsby'

const UnauthorizedPage = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-8">
          You don't have permission to access this page.
        </p>
        <Link
          to="/"
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90"
        >
          Return Home
        </Link>
      </div>
    </Layout>
  )
}

export default UnauthorizedPage

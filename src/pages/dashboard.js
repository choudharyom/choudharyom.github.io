import React from 'react'
import Layout from '../components/layout'
import { useAuth } from '../components/auth-provider'
import { Link } from 'gatsby'

const Dashboard = () => {
  const { user, userRole, isWriter, isEditor, isAdmin } = useAuth()

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <h1>Dashboard</h1>
        
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl mb-4">Welcome, {user?.name}</h2>
          <p className="text-gray-600">Role: {userRole}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Writer Features */}
          {isWriter && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg mb-4">Content Management</h3>
              <ul className="space-y-2">
                <li><Link to="/write" className="text-primary hover:underline">Create New Post</Link></li>
                <li><Link to="/my-posts" className="text-primary hover:underline">My Posts</Link></li>
                <li><Link to="/drafts" className="text-primary hover:underline">My Drafts</Link></li>
              </ul>
            </div>
          )}

          {/* Editor Features */}
          {isEditor && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg mb-4">Editorial Tools</h3>
              <ul className="space-y-2">
                <li><Link to="/pending-reviews" className="text-primary hover:underline">Pending Reviews</Link></li>
                <li><Link to="/approved-posts" className="text-primary hover:underline">Approved Posts</Link></li>
              </ul>
            </div>
          )}

          {/* Admin Features */}
          {isAdmin && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg mb-4">Admin Tools</h3>
              <ul className="space-y-2">
                <li><Link to="/user-management" className="text-primary hover:underline">Manage Users</Link></li>
                <li><Link to="/site-settings" className="text-primary hover:underline">Site Settings</Link></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard

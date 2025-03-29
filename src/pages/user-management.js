import React from 'react'
import Layout from '../components/layout'
import { useAuth } from '../components/auth-provider'
import { navigate } from 'gatsby'

const UserManagement = () => {
  const { isAuthenticated, isAdmin } = useAuth()
  const [users, setUsers] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/unauthorized')
    }
  }, [isAuthenticated, isAdmin])

  // Mock function to fetch users - replace with actual API call
  const fetchUsers = async () => {
    setLoading(true)
    try {
      // Replace with actual API call to Auth0 Management API
      const mockUsers = [
        { id: 1, name: 'Test User', email: 'test@example.com', role: 'reader' },
        { id: 2, name: 'Writer User', email: 'writer@example.com', role: 'writer' }
      ]
      setUsers(mockUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
    setLoading(false)
  }

  React.useEffect(() => {
    fetchUsers()
  }, [])

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">User Management</h1>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <label className="sr-only" htmlFor={`role-${user.id}`}>
                      Role for {user.name}
                    </label>
                    <select 
                      id={`role-${user.id}`}
                      defaultValue={user.role}
                      className="border rounded px-2 py-1"
                    >
                      <option value="reader">Reader</option>
                      <option value="writer">Writer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-primary hover:text-opacity-80">
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}

export default UserManagement

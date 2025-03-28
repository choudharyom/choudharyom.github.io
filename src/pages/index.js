import * as React from "react"
import { Link } from "gatsby"

const IndexPage = () => {
  return (
    <main>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Link 
          to="/write" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          New Post
        </Link>
      </div>
      <h1>Welcome to My Blog</h1>
      <p>This is a minimal Gatsby site.</p>
    </main>
  )
}

export default IndexPage

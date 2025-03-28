import React from "react"
import "katex/dist/katex.min.css"
import "../styles/global.css"

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background-light">
      <main className="container mx-auto px-4 py-8 max-w-[900px]">
        {children}
      </main>
    </div>
  )
}

import React, { useEffect, useRef, useState, useCallback } from "react"
import "easymde/dist/easymde.min.css"  // Add this import at the top
import { useAuth } from '../components/auth-provider'
import { navigate } from 'gatsby'

const WritePage = () => {
  const { isAuthenticated, isWriter, user } = useAuth()

  React.useEffect(() => {
    if (!isAuthenticated || !isWriter) {
      navigate('/login')
    }
  }, [isAuthenticated, isWriter])

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState("")
  const editorRef = useRef(null)
  const mdeRef = useRef(null)
  const [showFrontmatter, setShowFrontmatter] = useState(true)
  const [isClient, setIsClient] = useState(false)

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }

  const handleAddTag = (e) => {
    e.preventDefault()
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const generateFrontmatter = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    const slug = generateSlug(title)
    return `---
title: "${title}"
date: "${today}"
slug: "${slug}"
description: "${description}"
author: "${user?.name || 'Anonymous'}"
tags:
${tags.map(tag => `  - "${tag}"`).join('\n')}
---\n\n`
  }, [title, description, tags, user])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    // Dynamically import EasyMDE only on client side
    import('easymde').then((EasyMDE) => {
      mdeRef.current = new EasyMDE.default({
        element: editorRef.current,
        spellChecker: false,
        initialValue: generateFrontmatter(),
        toolbar: [
          "bold", "italic", "heading", "|",
          "quote", "code", "unordered-list", "ordered-list", "|",
          "link", "image", "|",
          "preview", "side-by-side", "fullscreen", "|",
          {
            name: "download",
            action: function downloadMD() {
              const frontmatter = generateFrontmatter()
              const content = mdeRef.current.value()
              const fullContent = frontmatter + content
              const blob = new Blob([fullContent], { type: "text/markdown" })
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement("a")
              const slug = generateSlug(title)
              a.href = url
              a.download = `${new Date().toISOString().split('T')[0]}-${slug}.md`
              a.click()
              window.URL.revokeObjectURL(url)
            },
            className: "fa fa-download",
            title: "Download Markdown",
          },
        ],
        placeholder: "Write your post content here...",
        autofocus: false,
      })

      if (mdeRef.current) {
        const currentContent = mdeRef.current.value()
        const newContent = generateFrontmatter() + currentContent.split('---\n\n')[1] || ''
        mdeRef.current.value(newContent)
      }
    })

    return () => {
      if (mdeRef.current) {
        mdeRef.current.toTextArea()
      }
    }
  }, [title, description, tags, isClient, generateFrontmatter])

  if (!isClient) {
    return <div>Loading editor...</div>
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl mb-6 font-bold">Write a Post</h1>
      
      {/* Title Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2" htmlFor="title">
          Post Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Enter post title..."
        />
      </div>

      {/* Description Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2" htmlFor="description">
          Post Description (for SEO)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Enter a brief description of your post..."
          rows="3"
        />
      </div>

      {/* Tags Section */}
      <div className="mb-6">
        <label htmlFor="tagInput" className="block text-sm font-medium mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map(tag => (
            <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <form onSubmit={handleAddTag} className="flex gap-2">
          <input
            id="tagInput"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Add a tag..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Tag
          </button>
        </form>
      </div>

      {/* Frontmatter Preview */}
      {showFrontmatter && (
        <div className="mb-4 p-3 bg-gray-50 rounded border">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-medium">Frontmatter Preview</h2>
            <button 
              onClick={() => setShowFrontmatter(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Hide
            </button>
          </div>
          <pre className="text-sm text-gray-600 whitespace-pre-wrap">
            {generateFrontmatter()}
          </pre>
        </div>
      )}

      {/* Editor Container - Add specific styling */}
      <div className="markdown-editor-container mb-6 border rounded-lg overflow-hidden">
        <textarea ref={editorRef} className="w-full" />
      </div>

      {/* Tips Section */}
      <div className="mt-4 text-sm text-gray-600">
        <h2 className="font-medium mb-2">Markdown Tips:</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li># Header 1, ## Header 2, ### Header 3</li>
          <li>**bold** or __bold__</li>
          <li>*italic* or _italic_</li>
          <li>`code`</li>
          <li>```language\ncode block\n```</li>
          <li>[Link text](URL)</li>
          <li>![Alt text](image URL)</li>
        </ul>
      </div>
    </div>
  )
}

export default WritePage

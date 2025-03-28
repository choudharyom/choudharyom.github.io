import React, { useEffect, useRef, useState } from "react"

const WritePage = () => {
  const [title, setTitle] = useState("")
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

  const generateFrontmatter = () => {
    const today = new Date().toISOString().split('T')[0]
    const slug = generateSlug(title)
    return `---
title: "${title}"
date: "${today}"
slug: "/${slug}/"
---\n\n`
  }

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
  }, [title, isClient])

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

      {/* Editor */}
      <textarea ref={editorRef} />

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

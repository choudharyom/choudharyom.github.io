import React, { useState } from "react"

const CodeBlock = ({ children, className }) => {
  const [copied, setCopied] = useState(false)
  const language = className?.replace(/language-/, '') || 'text'
  const languageLabels = {
    python: 'Python',
    javascript: 'JavaScript',
    bash: 'Bash',
    html: 'HTML',
    css: 'CSS',
    text: 'Plain Text'
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <div className="code-header">
        <span>{languageLabels[language] || language}</span>
        <button 
          onClick={handleCopy} 
          className="copy-button"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className={className}>
        <code className={className}>{children}</code>
      </pre>
    </div>
  )
}

export default CodeBlock

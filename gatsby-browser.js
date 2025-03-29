import React from "react"
import CodeBlock from "./src/components/code-block"

// Import base Prism first
import Prism from "prismjs"

// Import Prism theme and plugins
import "prismjs/themes/prism-tomorrow.css"
import "prismjs/plugins/line-numbers/prism-line-numbers.css"
import "prismjs/plugins/line-numbers/prism-line-numbers"

// Import EasyMDE CSS
import "easymde/dist/easymde.min.css"

// Import languages after Prism is defined
require("prismjs/components/prism-python")
require("prismjs/components/prism-javascript")
require("prismjs/components/prism-bash")
require("prismjs/components/prism-css")
require("prismjs/components/prism-json")

// Manually initialize Prism
export const onClientEntry = () => {
  Prism.manual = true
}

// Highlight code blocks after route updates
export const onRouteUpdate = () => {
  if (typeof window !== 'undefined' && window.Prism) {
    window.Prism.highlightAll()
  }
}

// Replace pre tags with custom component
export const wrapRootElement = ({ element }) => {
  const components = {
    pre: props => <CodeBlock {...props} />
  }

  return React.cloneElement(element, {
    components
  })
}

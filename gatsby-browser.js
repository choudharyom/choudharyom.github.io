import React from "react"
import CodeBlock from "./src/components/code-block"
import { Auth0Provider } from "@auth0/auth0-react"
import { AuthProvider } from "./src/components/auth-provider"

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

// Add copy code functionality
export const onClientEntry = () => {
  window.copyCode = (button) => {
    const pre = button.closest('.code-block').querySelector('pre');
    const code = pre.querySelector('code').textContent;
    navigator.clipboard.writeText(code).then(() => {
      button.textContent = 'Copied!';
      setTimeout(() => button.textContent = 'Copy', 2000);
    });
  }
  // Manually initialize Prism
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

  return (
    <Auth0Provider
      domain={process.env.GATSBY_AUTH0_DOMAIN}
      clientId={process.env.GATSBY_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: process.env.GATSBY_AUTH0_CALLBACK_URL,
      }}
      cacheLocation="localstorage"
      loginUrl={process.env.GATSBY_AUTH0_LOGIN_URI}
    >
      <AuthProvider>
        {React.cloneElement(element, { components })}
      </AuthProvider>
    </Auth0Provider>
  )
}

import React, { useState } from "react";

const CodeBlock = ({ children, className }) => {
  const language = className?.replace(/language-/, "") || "text";
  const [buttonText, setButtonText] = useState("Copy");

  const languageLabels = {
    python: "Python",
    javascript: "JavaScript",
    bash: "Bash",
    html: "HTML",
    css: "CSS",
    text: "Plain Text",
  };

  const handleCopy = (e) => {
    const codeBlock = e.currentTarget.closest(".code-block");
    if (!codeBlock) return;

    const codeElement = codeBlock.querySelector("code");
    if (!codeElement) return;

    const code = codeElement.textContent;
    navigator.clipboard.writeText(code).then(() => {
      setButtonText("Copied!");
      setTimeout(() => setButtonText("Copy"), 2000);
    }).catch(err => {
      console.error("Failed to copy text: ", err);
    });
  };

  return (
    <div className="code-block">
      <div className="code-header">
        <span className="code-language">{languageLabels[language] || language}</span>
        <button
          className="copy-button"
          onClick={handleCopy}
        >
          {buttonText}
        </button>
      </div>
      <pre className={className || ""}>
        <code>{children}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
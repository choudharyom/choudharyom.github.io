import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en">
      
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Source+Sans+Pro:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css" 
          integrity="sha384-vKruj+a13U8yHIkAyGgK1J3ArTLzrFGBbBc0tDp4ad/EyewESeXE/Iv67Aj8gKZ0" 
          crossOrigin="anonymous" 
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/themes/prism-tomorrow.min.css"
        />
        <style>{`
          .highlight {
            background: #f7f9fb;
            border-left: 6px solid #4a76c5;
            border-radius: 12px 0 0 12px;
            box-shadow: 0 2px 12px 0 rgba(74, 118, 197, 0.07), 0 1.5px 4px 0 rgba(0,0,0,0.03);
            padding: 1.5em 1.5em 1.5em 2em;
            margin: 2em 0;
            transition: box-shadow 0.2s;
          }
          .highlight:hover {
            box-shadow: 0 4px 24px 0 rgba(74, 118, 197, 0.13), 0 2px 8px 0 rgba(0,0,0,0.06);
          }
          .highlight h3 {
            color: #4a76c5;
            font-weight: 700;
            margin-top: 0;
            margin-bottom: 0.7em;
            font-size: 1.25em;
            letter-spacing: 0.01em;
          }
          .highlight ul {
            margin: 0;
            padding-left: 1.2em;
          }
          .highlight li {
            margin-bottom: 0.3em;
            font-size: 1.07em;
          }
          .figure-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 2em 0;
          }
          .figure-caption {
            font-size: 0.9em;
            color: #555;
            margin-top: 0.8em;
            text-align: center;
            max-width: 90%;
          }
          @media (max-width: 600px) {
            .highlight {
              padding: 1em 1em 1em 1.2em;
              border-radius: 8px 0 0 8px;
            }
          }
        `}</style>
      </Head>
      <body>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML" />
            {/* Prism.js for syntax highlighting */}
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/prism.min.js"/>
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/components/prism-python.min.js"/>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
import { Html, Head, Main, NextScript, Document } from 'next/document';

class MyDocument extends Document {
  render() {
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
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

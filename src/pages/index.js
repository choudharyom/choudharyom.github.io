import Head from 'next/head'
import Layout from '@/components/layout/Layout'

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Choudhary Om - Portfolio</title>
        <meta name="description" content="Welcome to my portfolio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to my portfolio</h1>
      </main>
    </Layout>
  )
}

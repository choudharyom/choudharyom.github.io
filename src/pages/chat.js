import React from 'react';
import Head from 'next/head';
import styles from '@/styles/SuperAgent.module.css';
import SuperAgent from '@/components/superagent/SuperAgent';

export default function Chat() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Super Agent</title>
        <meta name="description" content="Chat with our Super Agent" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <span>Super Agent</span>
        </h1>
        
        <p className={styles.description}>
          Ask me anything and I'll do my best to help!
        </p>

        <div className={styles.agentWrapper}>
          <SuperAgent />
        </div>
      </main>
    </div>
  );
}
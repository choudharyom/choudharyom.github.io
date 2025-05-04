import React from 'react';
import Head from 'next/head';
import styles from '@/styles/SuperAgent.module.css';
import SuperAgent from '@/components/superagent/SuperAgent';

const SuperAgentPage = () => {
    return (
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.title}>
                Welcome to <span>Super Agent</span>
              </h1>
                <p className={styles.description}>
                    Ask me anything and I'll do my best to help!
                </p>
                <SuperAgent />
            </div>
          </div>
        </div>
      );
};
export default SuperAgentPage;
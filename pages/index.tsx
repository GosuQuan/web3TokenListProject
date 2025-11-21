import Head from 'next/head';
import TokenList from '@/components/TokenList';
import { useTokenWebSocket } from '@/hooks/useTokenWebSocket';
import styles from '@/styles/Home.module.css';

export default function Home() {
  const { tokens, isConnected, error } = useTokenWebSocket();

  return (
    <>
      <Head>
        <title>Web3 Token Trending List</title>
        <meta name="description" content="Real-time trending token list with WebSocket updates" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.main}>
        {error && (
          <div className={styles.error}>
            Error: {error}
          </div>
        )}
        <TokenList tokens={tokens} isConnected={isConnected} />
      </main>
    </>
  );
}

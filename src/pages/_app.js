import '@/styles/globals.css';
import { ThemeProvider } from 'next-themes';
import Layout from '@/components/layout/Layout';
import { AuthProvider } from '@/hooks/useAuth';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;

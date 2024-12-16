import React from 'react';
import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import SimplifiProvider from '../SimpliProvider';
import ErrorBoundary from '@/components/ErrorBoundary';
import SEOHead from '@/components/SEOHead';
import Layout from '@/components/Layout';

export default function App({ Component, pageProps }: AppProps) {
  const [isMounted, setMount] = React.useState(false);
  React.useEffect(() => setMount(true), []);

  return (
    <React.Fragment>
      <SEOHead url={undefined} />
        {
          isMounted? 
            <ErrorBoundary fallback={<p>Something went wrong</p>}>
              <SimplifiProvider>
                <Layout>
                  <Component {...pageProps}/>
                </Layout> 
              </SimplifiProvider>
            </ErrorBoundary> : null
        }
      </React.Fragment>
    );
}

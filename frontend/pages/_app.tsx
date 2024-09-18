import React from 'react';
import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
// import NextHead from 'next/head';
import type { AppProps } from 'next/app';
import SimplifiProvider from '../SimpliProvider';
import ErrorBoundary from '@/components/ErrorBoundary';
import { cookieToInitialState } from 'wagmi';
import SEOHead from '@/components/SEOHead';

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
                  <Component {...pageProps}/>
              </SimplifiProvider>
          </ErrorBoundary> : null
        }
      </React.Fragment>
    );
}

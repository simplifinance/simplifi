import '../styles/globals.css'
import React from 'react';
import NextHead from 'next/head';
import type { AppProps } from 'next/app';
import { cookieToInitialState } from 'wagmi';
import { SimplifiProvider } from '../context';
import { config } from '@/config';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMount] = React.useState(false);
  const initialState = cookieToInitialState(config);

  React.useEffect(() => setMount(true), []);

  return (
    <React.Fragment>
      <NextHead>
        <title>RandoBet</title>
      </NextHead>
      {
        mounted && 
              <ErrorBoundary fallback={<p>Something went wrong</p>}>
                <SimplifiProvider initialState={initialState}>
                    <Component {...pageProps}/>
                </SimplifiProvider>
              </ErrorBoundary>
      }
    </React.Fragment>
  );
}



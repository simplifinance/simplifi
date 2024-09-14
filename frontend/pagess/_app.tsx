import '../styles/globals.css'
import React from 'react';
import type { AppProps } from 'next/app';
import { cookieToInitialState } from 'wagmi';
import { SimplifiProvider } from '../context';
import { BrowserRouter } from "react-router-dom";
import { config } from '@/config';
import ErrorBoundary from '@/components/ErrorBoundary';
import SEOHead from '@/components/SEOHead';

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMount] = React.useState(false);
  const initialState = cookieToInitialState(config);

  React.useEffect(() => setMount(true), []);

  return (
    <React.Fragment> 
      <SEOHead url={undefined} />
      {
        mounted && 
              <ErrorBoundary fallback={<p>Something went wrong</p>}>
                <BrowserRouter>
                  <SimplifiProvider initialState={initialState}>
                    <Component {...pageProps}/>
                  </SimplifiProvider>
                </BrowserRouter>
              </ErrorBoundary>
      }
    </React.Fragment>
  );
}

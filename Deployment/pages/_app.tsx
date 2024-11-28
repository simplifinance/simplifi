import React from 'react';
import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
// import NextHead from 'next/head';
import type { AppProps } from 'next/app';
import SimplifiProvider from '../SimpliProvider';
import ErrorBoundary from '@/components/ErrorBoundary';
import SEOHead from '@/components/SEOHead';
import Layout from '@/components/Layout/layout';

export default function App({ Component, pageProps }: AppProps) {
  const [isMounted, setMount] = React.useState(false);
  const [isClicked, setClicked] = React.useState(false)

  const handleClick = () => {
    setClicked(!isClicked)
  }
  React.useEffect(() => setMount(true), []);

  return (
    <React.Fragment>
      <SEOHead url={undefined} />
        {
          isMounted? 
            <ErrorBoundary fallback={<p>Something went wrong</p>}>
              <SimplifiProvider>
                <Layout handleClick={handleClick} isClicked={isClicked}>
                  <Component {...pageProps}/>
                </Layout> 
              </SimplifiProvider>
            </ErrorBoundary> : null
        }
      </React.Fragment>
    );
}

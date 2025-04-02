import React from 'react';
import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import AppProvider from '../components/contexts/AppProvider';
import ErrorBoundary from '@/components/utilities/ErrorBoundary';
import Head from 'next/head';
import { Session } from 'next-auth';

export default function App({ Component, pageProps }: AppProps<{session: Session}>) {
  const [isMounted, setMount] = React.useState(false);
  React.useEffect(() => setMount(true), []);

  return (
    <React.Fragment>
      <Head children={undefined}></Head>
        {
          isMounted? 
            <ErrorBoundary fallback={<p>Something went wrong</p>}>
              <AppProvider session={pageProps.session}>
                <Component {...pageProps}/>
              </AppProvider>
            </ErrorBoundary> : null
        }
      </React.Fragment>
    );
}

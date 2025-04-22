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


// check icon
{/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
</svg> */}


// Back arrow
{/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
</svg> */}

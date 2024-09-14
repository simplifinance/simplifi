import React from 'react';
import '../styles/globals.css'
import NextHead from 'next/head';
import type { AppProps } from 'next/app';
import { BrowserRouter } from 'react-router-dom';
import { SimplifiProvider } from '../context';
import ErrorBoundary from '@/components/ErrorBoundary';
import { cookieToInitialState } from 'wagmi';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
import SEOHead from '@/components/SEOHead';
import { config } from '@/config';

// const theme = createTheme();
const initialState = cookieToInitialState(config);

export default function App({ Component, pageProps }: AppProps) {
  // let mode = React.useRef({value: 'dark'});
  const [isMounted, setMount] = React.useState(false);
  React.useEffect(() => setMount(true), []);

  return (
    <React.Fragment>
      <SEOHead url={undefined} />
        {
          isMounted? 
            <ErrorBoundary fallback={<p>Something went wrong</p>}>
              {/* <BrowserRouter> */}
                <SimplifiProvider initialState={initialState}>
                <Component {...pageProps}/>
              </SimplifiProvider>
            {/* </BrowserRouter> */}
          </ErrorBoundary> : null
        }
      </React.Fragment>
    );
}




// theme={{
  //   primary: "#6366f1",
  //   secondary: "#eef2ff",
  //   text: "#000000",
  //   textSecondary: "#1f2937",
  //   textTertiary: "#64748b",
  //   muted: "#e2e8f0",
  //   background: "#ffffff",
  //   error: "#ef4444"
  // }}
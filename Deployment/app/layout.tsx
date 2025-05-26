import React from 'react';
import type { Metadata } from "next";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import AppProvider from '@/components/contexts/AppProvider';
import ErrorBoundary from '@/components/utilities/ErrorBoundary';
import { Author } from 'next/dist/lib/metadata/types/metadata-types';

const authors : Author[] = [
  {
    name: 'Isaac Jesse aka Bobman',
    url: 'https://github.com/bobeu'
  },
  {
    name: 'Tserundede Godwill',
    url: 'https://github.com/princetalk2011'
  }
];

export const metadata: Metadata = {
  title: "Simplifinance App",
  description: "A Decentralised Protocols Built On The Blockchain",
  applicationName: "Simplifinance",
  assets: '/favicon-32x32.png',
  creator: 'Simplifinance Team',
  authors,
  icons: '/favicon-32x32.png',
  keywords: ['Defi', 'Web3', 'Web3 loan', 'short-term loan', 'web3 traditional finance', 'finance'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ErrorBoundary>
          <AppProvider>
            {children}
          </AppProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

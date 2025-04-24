"use client"

import { WagmiProvider } from "wagmi";
import { getDefaultConfig, RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { str } from "@/utilities";
import { Chain } from "viem";
import { celoAlfajores, } from 'wagmi/chains';

// Your walletconnect project Id
const projectId = str(process.env.NEXT_PUBLIC_PROJECT_ID);

// Alchemy websocket URI
const testAlchemyWebSocket = str(process.env.NEXT_PUBLIC_ALCHEMY_WEBSOCKET_TESTNET);
if (!projectId) throw new Error('Project ID is undefined');

// Alchemy API Key
const alchemy_api_key = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY

// CrossFi Blaze network configuration
const blaze : Chain = {
  id: 4157,
  name: "Blaze",
  nativeCurrency: {
    name: "CrossFi Test Token",
    symbol: "XFI",
    decimals: 18
  },
  blockExplorers: {
    default: {
      name: "xfi",
      url: "https://scan.testnet.ms"
    }
  },
  rpcUrls: {
    default: {
      // http: ["https://rpc.testnet.ms",],
      http: ["https://rpc.testnet.ms", `https://crossfi-testnet.g.alchemy.com/v2/${alchemy_api_key}`,],
      webSocket: [testAlchemyWebSocket]
    }
  }
}

// CrossFi mainnet configuration
// const crossFiMainnet : Chain = {
//   id: 4158,
//   name: "CrossFi Mainnet",
//   nativeCurrency: {
//     name: "CrossFi Mainnet Token",
//     symbol: "XFI",
//     decimals: 18
//   },
//   blockExplorers: {
//     default: {
//       name: "crossFi",
//       url: "https://xfiscan.com"
//     }
//   },
//   rpcUrls: {
//     default: {
//       // http: ["https://rpc.mainnet.ms",],
//       http: ["https://rpc.mainet.ms", `https://crossfi-mainnet.g.alchemy.com/v2/${alchemy_api_key}`,],
//       webSocket: ['']
//     }
//   }
// } 

// Load the defaut config from RainbowKit
const config = getDefaultConfig({
  appName: 'Simplifinance',
  projectId,
  appIcon: '/favicon-32x32.png',
  appDescription: 'A decentralized p2p, DeFi protocol',
  appUrl: 'https://testnet.simplifinance.xyz',
  chains: [ celoAlfajores, blaze ],
  ssr: true
});

// Light theme configuration for RainbowKit wallet set up
const theme = lightTheme(
  {
    ...lightTheme.accentColors.orange,
    accentColorForeground: '#fdba74',
    borderRadius: 'large',
    fontStack: 'system',
    overlayBlur: 'small',
    accentColor: '#2E3231'
  }
);

export default function AppProvider({children} : {children: React.ReactNode}) {
  return(
    <WagmiProvider config={config}>
      <QueryClientProvider client={new QueryClient()}>
        <RainbowKitProvider modalSize="compact" theme={theme} initialChain={celoAlfajores.id} showRecentTransactions={true}>
          { children }
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}


import { WagmiProvider } from "wagmi";
// import { createConfig, http } from 'wagmi';
import { getDefaultConfig, RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { str } from "@/utilities";
import { ReactNode } from "react";
import { Chain, fallback } from "viem";
import { mock, } from 'wagmi/connectors';
import { UserRejectedRequestError } from "viem";
import { celoAlfajores } from 'wagmi/chains';

const projectId = str(process.env.NEXT_PUBLIC_PROJECT_ID);
if (!projectId) throw new Error('Project ID is undefined');

const alchemy_api_key = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
const crossFiTestnet : Chain = {
  id: 4157,
  name: "CrossFi Testnet",
  nativeCurrency: {
    name: "CrossFI Test Token",
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
      webSocket: ['']
    }
  }
}

const crossFiMainnet : Chain = {
  id: 4158,
  name: "CrossFi Mainnet",
  nativeCurrency: {
    name: "CrossFi Mainnet Token",
    symbol: "XFI",
    decimals: 18
  },
  blockExplorers: {
    default: {
      name: "crossFi",
      url: "https://xfiscan.com"
    }
  },
  rpcUrls: {
    default: {
      // http: ["https://rpc.mainnet.ms",],
      http: ["https://rpc.mainet.ms", `https://crossfi-mainnet.g.alchemy.com/v2/${alchemy_api_key}`,],
      webSocket: ['']
    }
  }
} 

export const mockConnector = mock({
  accounts: ['0xD7c271d20c9E323336bFC843AEb8deC23B346352'],
  features: {
    connectError: new UserRejectedRequestError(new Error('Failed to connect')),
    reconnect: false
  }
});

// const config = createConfig({
//   chains: [crossFiTestnet, crossFiMainnet],
//   connectors: [
//     // mockConnector,
//     injected(),
//     metaMask({
//       dappMetadata: {
//         name: 'Simplifinance', 
//         url: 'https://simplifi-glxp.vercel.app',
//         // iconUrl: 'https://favicon-32x32.png'
//       }
//     }),
//     coinbaseWallet({
//       appName: 'Simplifinance',
//       appLogoUrl: '/favicon-32x32.png',
//       darkMode: true,
//       enableMobileWalletLink: true,
//       // overrideIsMetaMask: false,
//       reloadOnDisconnect: true
//     }),
//     walletConnect({
//       projectId,
//       metadata: {
//         name: 'Simplifinance',
//         description: 'A decentralized p2p, DeFi protocol',
//         icons: ['/favicon-32x32.png'],
//         url: 'https://simplifi-glxp.vercel.app',
//       }
//     }),
//   ],
//   transports: {
//     [crossFiTestnet.id]: fallback([
//       http("https://rpc.testnet.ms"),
//       http(`https://crossfi-testnet.g.alchemy.com/v2/${alchemy_api_key}`)
//     ]),
//     [crossFiMainnet.id]: http(),
//   }
// });
const config = getDefaultConfig({
  appName: 'Simplifinance',
  projectId,
  appIcon: '/favicon-32x32.png',
  appDescription: 'A decentralized p2p, DeFi protocol',
  appUrl: 'https://simplifi-glxp.vercel.app',
  chains: [crossFiTestnet, crossFiMainnet, celoAlfajores],
  
});

const theme = lightTheme(
  {
    ...lightTheme.accentColors.orange,
    accentColorForeground: '#fdba74',
    borderRadius: 'large',
    fontStack: 'system',
    overlayBlur: 'small',
    accentColor: '#2E3231'
  }
)

export default function AppProvider({children} : {children: ReactNode}) {
  return(
    <WagmiProvider config={config}>
      <QueryClientProvider client={new QueryClient()}>
        <RainbowKitProvider modalSize="compact" theme={theme} initialChain={crossFiTestnet.id} showRecentTransactions={true}>
          { children }
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
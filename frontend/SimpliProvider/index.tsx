// import { str } from "@/utilities";
// import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
// import { cookieStorage, createStorage } from "wagmi";
// import { sepolia, } from "wagmi/chains";
// import { injected, coinbaseWallet, walletConnect } from "wagmi/connectors";

// // My project ID. You can get one at https://cloud.walletconnect.com
// export const projectId = str(process.env.NEXT_PUBLIC_PROJECT_ID);
// if (!projectId) throw new Error('Project ID is undefined');

// const injectedModule = injected();
// const walletConnectModule = walletConnect({projectId});
// const coinbaseWalletModule = coinbaseWallet({
//     appName: "Simplifinance",
//     appLogoUrl: "",
//     darkMode: true,
//     overrideIsMetaMask: false,
//     reloadOnDisconnect: true
// });

// const metadata = {
//   name: 'Simplifinance',
//   description: 'A Decentralized custom multi-p2p protocol',
//   url: 'https://localhost:3000/', // origin must match your domain & subdomain
//   icons: ['']
// }

// // Setting up Wagmi config
// // const chains = [bsc, bscTestnet, celo, celoAlfajores, ] as const;
// const chains = [ sepolia ] as const;
// export const config = defaultWagmiConfig({
//   projectId,
//   chains,
//   metadata,
//   ssr: true,
//   storage: createStorage({
//     storage: cookieStorage
//   }),
//   batch: {
//     multicall: true
//   },
//   enableWalletConnect: true,
//   enableInjected: true,
//   enableEIP6963: true, 
//   enableCoinbase: true,
//   connectors: [injectedModule, coinbaseWalletModule, walletConnectModule],
// });



// import { } from "wagmi/chains";
import { WagmiProvider } from "wagmi";
import { getDefaultConfig, RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { str } from "@/utilities";
import { ReactNode } from "react";
import { Chain } from "viem";

const projectId = str(process.env.NEXT_PUBLIC_PROJECT_ID);
if (!projectId) throw new Error('Project ID is undefined');

// {
//   readonly url: "ipfs://QmbRJzDeAdMkEXkqDwBwezpUxyjTPHZ2iXEomqKPvWZcWE";
//   readonly width: 40;
//   readonly height: 42;
//   readonly format: "svg";
// };"EIP3091" "https://test.xfiscan.com"; "https://scan.testnet.ms/"

const alchemy_api_key = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
const crossFiTestnet : Chain = {
  id: 4157,
  name: "CrossFi Testnet Chain",
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
      http: ["https://rpc.testnet.ms", `https://crossfi-testnet.g.alchemy.com/v2/${alchemy_api_key}`,],
      webSocket: ['']
    }
  }
} 

const config = getDefaultConfig({
  appName: 'Simplifinance',
  projectId,
  chains: [crossFiTestnet],
});

const theme = lightTheme(
  {
    ...lightTheme.accentColors.orange,
    accentColorForeground: 'white',
    borderRadius: 'medium',
    fontStack: 'system',
    overlayBlur: 'small'
  }
)

export default function SimpliProvider({children} : {children: ReactNode}) {
  return(
    <WagmiProvider config={config}>
      <QueryClientProvider client={new QueryClient()}>
        <RainbowKitProvider modalSize="compact" theme={theme} initialChain={4157} showRecentTransactions={true}>
          { children }
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
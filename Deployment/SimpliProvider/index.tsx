import { WagmiProvider } from "wagmi";
import { getDefaultConfig, RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { str } from "@/utilities";
import { ReactNode } from "react";
import { Chain } from "viem";

const projectId = str(process.env.NEXT_PUBLIC_PROJECT_ID);
if (!projectId) throw new Error('Project ID is undefined');

// const alchemy_api_key = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
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
      http: ["https://rpc.testnet.ms",],
      // http: ["https://rpc.testnet.ms", `https://crossfi-testnet.g.alchemy.com/v2/${alchemy_api_key}`,],
      webSocket: ['']
    }
  }
} 

const config = getDefaultConfig({
  appName: 'Simplifinance',
  projectId,
  chains: [crossFiTestnet]
});

const theme = lightTheme(
  {
    ...lightTheme.accentColors.orange,
    accentColorForeground: 'orange',
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
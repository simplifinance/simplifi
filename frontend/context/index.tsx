import React, { ReactNode } from "react";
import { State, WagmiProvider } from "wagmi";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config, projectId } from "@/config";
import { bscTestnet } from 'wagmi/chains'
import { getTokenAddress } from "@/apis/testToken/getAddress";

const queryClient = new QueryClient();
if (!projectId || projectId === undefined) throw new Error("Project ID not found");

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
  defaultChain: bscTestnet,
  tokens: {
    [bscTestnet.id] : {
      address : getTokenAddress(),
      image: ""
    },
  }
});

export function SimplifiProvider({ initialState, children }: { children: ReactNode; initialState?: State }) {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

import { str } from "@/utilities";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected, coinbaseWallet, walletConnect } from "wagmi/connectors";

// My project ID. You can get one at https://cloud.walletconnect.com
export const projectId = str(process.env.NEXT_PUBLIC_PROJECT_ID);
if (!projectId) throw new Error('Project ID is undefined');

const injectedModule = injected();
const walletConnectModule = walletConnect({projectId});
const coinbaseWalletModule = coinbaseWallet({
    appName: "Simplifinance",
    appLogoUrl: "",
    darkMode: true,
    overrideIsMetaMask: false,
    reloadOnDisconnect: true
});

const metadata = {
  name: 'Simplifinance',
  description: 'A Decentralized custom multi-p2p protocol',
  url: 'https://localhost:3000/', // origin must match your domain & subdomain
  icons: ['']
}

// Setting up Wagmi config
// const chains = [bsc, bscTestnet, celo, celoAlfajores, ] as const;
const chains = [ sepolia ] as const;
export const config = defaultWagmiConfig({
  projectId,
  chains,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
  batch: {
    multicall: true
  },
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true, 
  enableCoinbase: true,
  connectors: [injectedModule, coinbaseWalletModule, walletConnectModule],
});
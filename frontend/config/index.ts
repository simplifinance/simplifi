import { str } from "@/utilities";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage } from "wagmi"
import { bscTestnet, bsc } from "wagmi/chains";
import { injected, coinbaseWallet, walletConnect } from "wagmi/connectors";

// My project ID. You can get one at https://cloud.walletconnect.com
export const projectId = str(process.env.NEXT_PUBLIC_PROJECT_ID);
if (!projectId) throw new Error('Project ID is undefined');

const injectedModule = injected();
const walletConnectModule = walletConnect({projectId});
const coinbaseWalletModule = coinbaseWallet({
    appName: "Simplifi",
    appLogoUrl: "",
    darkMode: true,
    overrideIsMetaMask: false,
    reloadOnDisconnect: true
});

const metadata = {
  name: 'Simplifi',
  description: 'A peer to peer lending and borrowing platform',
  url: 'https://localhost:3000/', // origin must match your domain & subdomain
  icons: ['']
}
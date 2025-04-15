import { celo, celoAlfajores, Chain } from 'wagmi/chains';

const alchemy_url_crossfi_testnet = process.env.NEXT_PUBLIC_ALCHEMY_CROSSFI_TESTNET as string;
const alchemy_url_crossfi_mainnet = process.env.NEXT_PUBLIC_ALCHEMY_CROSSFI_MAINNET as string;
const alchemy_websocket_url_crossfi_testnet = process.env.NEXT_PUBLIC_ALCHEMY_WEBSOCKET_TESTNET as string;
const alchemy_websocket_url_crossfi_mainnet = process.env.NEXT_PUBLIC_ALCHEMY_WEBSOCKET_MAINNET as string;

export const supportedChains : Record<string, Chain> = {
  celoAlfajores,
  celo,
  blaze: {
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
        http: ["https://rpc.testnet.ms", alchemy_url_crossfi_testnet,],
        webSocket: [alchemy_websocket_url_crossfi_testnet]
      }
    }
  },
  crossfi: {
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
        http: ["https://rpc.mainet.ms", alchemy_url_crossfi_mainnet,],
        webSocket: [alchemy_websocket_url_crossfi_mainnet]
      }
    }
  },
}
import { celo, celoAlfajores, Chain } from 'wagmi/chains';

const testAlchemyWebSocket = process.env.NEXT_PUBLIC_ALCHEMY_WEBSOCKET_TESTNET as string;
export const supportedChains : Chain[] = [
    {
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
                http: ["https://rpc.testnet.ms", `https://crossfi-testnet.g.alchemy.com/v2/${alchemy_api_key}`,],
                webSocket: [testAlchemyWebSocket]
            }
        }
    },
    {
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
]
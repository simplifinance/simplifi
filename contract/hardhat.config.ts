import type { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox-viem";
import { config as dotconfig } from "dotenv";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "@nomiclabs/hardhat-web3";
import "@nomicfoundation/hardhat-viem";
import { zeroAddress } from "viem";

dotconfig();
const PRIVATE_KEY = process.env.PRIVATE_KEY_CROSS_0xD7c;
const API_KEY = process.env.ALCHEMY_API_KEY;

const config: HardhatUserConfig = {
  
  networks: {
    crossTest: {
      url: "https://rpc.testnet.ms",  // Not working
      // url: "https://rpc-t.crossfi.nodestake.org", // Bad gateway
      // url: "https://crossfi-testnet-rpc.itrocket.net:443", // Bad gateway
      // url: "https://crossfi-testnet-rpc.itrocket.net/", // Bad gateway
      // url: "https://rpc.nodejumper.io:443/crossfitestnet/", // Bad gateway
      // url: "https://crossfi-rpc.srv.stakr.space/", // Bad gateway
      // url: "https://crossfi-rpc.srv.stakr.space/", // Bad gateway
      // url: "https://crossfi.rpc.t.anode.team/", // Bad gateway
      // url: "https://testnet-crossfi-rpc.kynraze.com/", // Bad gateway
      // url: "https://testnet-crossfi-rpc.genznodes.dev/", // Bad gateway
      // url: "https://rpc.crossfi.gojosatorus.live/", // Bad gateway
      // url: "https://rpc.crossfi.aknodes.net/", // Bad gateway
      // url: "https://crossfi-testnet-rpc.vnode-cash.online/", // Bad gateway
      // url: "https://crossfi.rpc.ruangnode.com/", // Bad gateway
      // url: "https://rpc-crossfi-testnet.sychonix.xyz/", // Bad gateway
      // url: "https://rpc.crossfi.ndnodes.com/", // Bad gateway
      // url: "https://rpc.crossfi-test.hexnodes.one/", // Bad gateway
      // url: "https://crossfi-rpc-testnet.nomadvalidator.com/", // Bad gateway
      // url: "https://crossfi-rpc-testnet.nomadvalidator.com/", // Bad gateway
      // url: "https://t-crossfi.rpc.utsa.tech/", // Bad gateway
      // url: "https://crossfi-testnet-rpc.cryptonode.id/", // Bad gateway
      // url: "https://crossfi-testnet-rpc.synergynodes.com/", // Bad gateway
      // url: "https://crossfi-testnet-rpc.bangpateng.id/", // Bad gateway
      // url: "https://crossfi-testnet-rpc.staketab.org/", // Bad gateway
      // url: `https://crossfi-testnet.g.alchemy.com/v2/${API_KEY}`, // Good
      accounts: [`${PRIVATE_KEY}`],
      chainId: 4157,
    },
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [`${PRIVATE_KEY}`],
      chainId: 44787,
    },
    celo: {
      accounts: [`${PRIVATE_KEY}`],
      url: 'https://forno.celo.org',
    },
  },
  etherscan: {
    apiKey: {
      alfajores: process.env.CELOSCAN_API_KEY ?? '',
      celo: process.env.CELOSCAN_API_KEY ?? '',
    },
    customChains: [
      {
        chainId: 44_787,
        network: 'alfajores',
        urls: {
          apiURL: 'https://api-alfajores.celoscan.io/api',
          browserURL: 'https://alfajores.celoscan.io',
        },
      },
      {
        chainId: 42_220,
        network: 'celo',
        urls: {
          apiURL: 'https://api.celoscan.io/api',
          browserURL: 'https://celoscan.io/',
        },
      },
    ],
  },
  sourcify: {
    enabled: false,
  },
  namedAccounts: {
    deployer: {
      default: 0,
      4157: `privatekey://${PRIVATE_KEY}`,
      44787: `privatekey://${PRIVATE_KEY}`,
    },
    oracle: {
      default: zeroAddress,
      4157: '0x859e221ada7cebdf5d4040bf6a2b8959c05a4233',
      44787: zeroAddress // For testing only, we set to zeroAddress so the contract could switch to using local value.
      // 44787: '0x022F9dCC73C5Fb43F2b4eF2EF9ad3eDD1D853946'  // Chainlink oracle on Celo alfajores
    }
  },

  solidity: {
    version: "0.8.24",
    settings: {          // See the solidity docs for advice about optimization and evmVersion
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "constantinople"
      }
    },
};

export default config;

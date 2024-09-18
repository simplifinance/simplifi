import type { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox-viem";
import { config as dotconfig } from "dotenv";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "@nomiclabs/hardhat-web3";
import "@nomicfoundation/hardhat-viem";

dotconfig();
const PRIVATE_KEY = process.env.PRIVATE_KEY_CROSS_0xD7c;
const API_KEY = process.env.ALCHEMY_API_KEY;

const config: HardhatUserConfig = {
  
  networks: {
    crossTest: {
      // url: "https://rpc.testnet.ms",  // Not working
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
      url: `https://crossfi-testnet.g.alchemy.com/v2/${API_KEY}`, // Good
      accounts: [`${PRIVATE_KEY}`],
      chainId: 4157,
    },
    mainnet: {
      url: "",
      accounts: [`${PRIVATE_KEY}`],
      chainId: 11111111111111,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      4157: `privatekey://${PRIVATE_KEY}`,
    },
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

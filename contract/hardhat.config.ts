import type { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox-viem";
import { config as dotconfig } from "dotenv";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "@nomiclabs/hardhat-web3";
import "@nomicfoundation/hardhat-viem";

dotconfig();
const PRIVATE_KEY = process.env.PRIVATE_KEY_CROSS_0xD7c;

const config: HardhatUserConfig = {
  
  networks: {
    crossTest: {
      url: "https://rpc.testnet.ms",
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

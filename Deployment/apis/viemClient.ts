import { createPublicClient, createWalletClient, http, custom } from "viem";
import { supportedChains } from "./utils/chains";

// Returns public . Useful for reading from the blockchain
export const publicClients = [
    createPublicClient({
        chain: supportedChains.celoAlfajores,
        transport: http(),
    }),
    createPublicClient({
        chain: supportedChains.blaze,
        transport: http(),
    }),
];

// Returns wallet clients. Useful for sending transaction to the blockchain
export const walletClients = [
    createWalletClient({
        chain: supportedChains.celoAlfajores,
        transport: custom(window.ethereum),
    }),
    createWalletClient({
        chain: supportedChains.blaze,
        transport: custom(window.ethereum),
    }),
];

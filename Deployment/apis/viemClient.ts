import { Address } from "@/interfaces";
import { createPublicClient, createWalletClient, http } from "viem";import { privateKeyToAccount } from "viem/accounts";
import { celoAlfajores } from "viem/chains";

export function getClients() {
    return {
        getPublicClient: () => {
            return createPublicClient({
                chain: celoAlfajores,
                transport: http(),
            })
        },
        getWalletClient: () => {
            if(!process.env.NEXT_PUBLIC_AGENT_KEY) throw new Error('Agent key not detected');
            const account = privateKeyToAccount(process.env.NEXT_PUBLIC_AGENT_KEY as Address);
            return createWalletClient({
                chain: celoAlfajores,
                account: account.address,
                transport: http()
            })
        },
        user: () => {
            const client = createPublicClient({
                chain: celoAlfajores,
                transport: http()
            });
            return client.account;
        }
    }
}



import { CONFIRMATIONS } from "@/constants";
import { Address, TransactionCallback, WagmiConfig } from "@/interfaces";
import { waitForTransactionReceipt } from "wagmi/actions";
import { getEpoches } from "../read/readContract";

export const waitForConfirmation = async(
    arg: {
        config: WagmiConfig, 
        hash: Address, 
        callback?: TransactionCallback, 
        fetch: boolean,
    }) => {
    const { config, hash, callback, fetch } = arg;
    const wait = await waitForTransactionReceipt(config, { hash, confirmations: CONFIRMATIONS})
    if(fetch) {
        const data = await getEpoches({config});
        callback?.({
            message: `${wait?.status.toString().toUpperCase()} : Hash ${wait?.transactionHash.substring(0, 6)}... ${wait.transactionHash.substring(28, wait?.transactionHash.length)}`, 
            contractState: [...data],
        });
    }
    return wait.status;
}

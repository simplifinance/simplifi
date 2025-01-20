import { CONFIRMATIONS } from "@/constants";
import { Address, TransactionCallback, WagmiConfig } from "@/interfaces";
import { waitForTransactionReceipt } from "wagmi/actions";

export const waitForConfirmation = async(
    arg: {
        config: WagmiConfig, 
        hash: Address, 
        callback?: TransactionCallback
    }) => {
    const { config, hash, callback } = arg;
    const wait = await waitForTransactionReceipt(config, { hash, confirmations: CONFIRMATIONS})
    callback?.({
        message: `${wait?.status.toString().toUpperCase()} : Hash ${wait?.transactionHash.substring(0, 6)}... ${wait.transactionHash.substring(28, wait?.transactionHash.length)}`, 
    });
    return wait.status;
}

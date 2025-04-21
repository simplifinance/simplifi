import { confirmationBlocks } from "@/constants";
import { Address, TransactionCallback, WagmiConfig } from "@/interfaces";
import { waitForTransactionReceipt } from "wagmi/actions";

/**
 * @dev Utility to wait for confirmation when a transaction is sent to the blockchain 
 * @param arg : Function parameters of type WaitForTransactionParam
 * @returns Transaction status
 */
export const waitForConfirmation = async(arg: WaitForTransactionParam) => {
    const { config, hash, callback, message} = arg;
    const wait = await waitForTransactionReceipt(config, { hash, confirmations: confirmationBlocks})
    callback?.({message: message});
    return wait.status;
}

interface WaitForTransactionParam {
    config: WagmiConfig, 
    hash: Address, 
    message: string;
    callback?: TransactionCallback
}

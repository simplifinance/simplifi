import { CONFIRMATIONS } from "@/constants";
import { Address, TransactionCallback, WagmiConfig } from "@/interfaces";
import { waitForTransactionReceipt } from "wagmi/actions";
import { getContractData } from "./read/readContract";

export const waitForConfirmation = async(
    arg: {
        config: WagmiConfig, 
        hash: Address, 
        callback?: TransactionCallback, 
        fetch: boolean,
    }) => {
    const { config, hash, callback, fetch } = arg;
    await waitForTransactionReceipt(config, { hash, confirmations: CONFIRMATIONS})
        .then(async(wait) => {
            if(fetch) {
                const data = await getContractData({config});
                callback?.({message: "Transaction Completed", txDone: wait.status === 'success'? true : false, result: {wait, ...data}});
            }
        }).catch((error: any) => {
            const errorMessage: string = error?.message || error?.data?.message;
            callback?.({message: `Transaction Failed with: ${errorMessage.length > 100? errorMessage.substring(0, 100) : errorMessage}`, txDone: true});
        
        })
}
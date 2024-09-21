import { CONFIRMATIONS } from "@/constants";
import { Address, TransactionCallback, WagmiConfig } from "@/interfaces";
import { waitForTransactionReceipt } from "wagmi/actions";
import { getContractData } from "./factory/read/readContract";

export const waitForConfirmation = async(
    arg: {
        config: WagmiConfig, 
        hash: Address, 
        callback?: TransactionCallback, 
        account: Address,
        epochId: bigint,
        fetch: boolean,
    }) => {
    const { config, hash, callback, account, fetch, epochId } = arg;
    await waitForTransactionReceipt(config, { hash, confirmations: CONFIRMATIONS})
        .then(async(wait) => {
            if(fetch) {
                const data = await getContractData({config});
                // console.log("DaTA", data);
                callback?.({message: "Transaction Completed", txDone: wait? true : false, result: {wait, ...data}});
                // callback?.({message: "Transaction Completed", txDone: wait? true : false});
            } else {
                callback?.({message: "Transaction Completed", txDone: wait? true : false,});
            }
        });
}
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
        setTrxnDone: boolean
    }) => {
    const { config, hash, callback, setTrxnDone, fetch } = arg;
    const wait = await waitForTransactionReceipt(config, { hash, confirmations: CONFIRMATIONS})
    if(fetch) {
        const data = await getContractData({config});
        callback?.({
            message:  `${wait?.status.toString().toUpperCase()} : Hash ${wait?.transactionHash.substring(0, 10)}... ${wait.transactionHash.substring(11, wait?.transactionHash.length)}`, 
            txDone: setTrxnDone? wait.status === 'success'? true : false : false, result: {wait, ...data}
        });
    }
}

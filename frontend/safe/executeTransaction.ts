// import { waitForConfirmation } from '@/apis/utils/waitForConfirmation';
import { CONFIRMATIONS, SAFE_VERSION } from '@/constants';
import { Address, WagmiConfig } from '@/interfaces';
import SafeApiKit from '@safe-global/api-kit';
import type { Eip1193Provider, SafeProvider, SafeConfig, SafeAccountConfig, PredictedSafeProps, SafeDeploymentConfig } from '@safe-global/protocol-kit';
import Safe, { getSafeAddressFromDeploymentTx } from '@safe-global/protocol-kit';
import { MetaTransactionData, OperationType, SafeTransaction } from '@safe-global/types-kit';
import { sendTransaction, waitForTransactionReceipt } from 'wagmi/actions';
import { getTransaction } from './getTransaction';

/**
 * @dev Confirm transaction
 * @param hash : Transaction hash
 * @param kit : SafeProtocol kit
 * @param apiKit : ApiKit
 * @returns : SignatureResponse
 */
export const executeTransaction = async(
    hash: string,
    kit: Safe, 
    apiKit: SafeApiKit,
) => {
    const safeTrx = await getTransaction(apiKit, hash);
//    const isValidTrx = await kit.isValidTransaction(safeTrx);
// const trxReceipt = response.transactionResponse && (await response.transactionResponse.wait?.());
    return await kit.executeTransaction(safeTrx);
}
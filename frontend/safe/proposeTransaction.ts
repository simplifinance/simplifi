import SafeApiKit from "@safe-global/api-kit";
import Safe from "@safe-global/protocol-kit";
import type { SafeTransaction } from "@safe-global/types-kit";

/**
 * @dev Proposes Trx
 * @param safeTrx : SafeTransaction object
 * @param kit : Safe kit
 * @param apiKit : ApiKit
 * @param safeAddress : Safe address
 * @param senderAddress : Current user/sender
 * @returns : variables of type SafeMultisigTransactionResponse
 */
export const proposeTransaction = async(
    safeTrx: SafeTransaction, 
    kit: Safe, 
    apiKit: SafeApiKit,
    safeAddress: string,
    senderAddress: string,
) => {
    const safeTxHash = await kit.getTransactionHash(safeTrx);
    const senderSig = await kit.signHash(safeTxHash);
    await apiKit.proposeTransaction({
        safeAddress,
        senderSignature: senderSig.data,
        safeTxHash,
        safeTransactionData: safeTrx.data,
        senderAddress,
    });
    return await apiKit.getTransaction(safeTxHash);
}
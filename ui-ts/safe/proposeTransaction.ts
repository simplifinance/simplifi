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




// Create AI agent for the protocol. It takes on the task to execute signed transactions. Also add admin account as one of the executioners.
// Create an AI agent for each contributor. It executes transactions on behalf of the contributor.

// Create a pool with quorum
// Create a smart account for the pool with a signer threshold of quorum
// Create ai agents for the pool .
// One smart account is used instead of several banks. So no need to create a bank on the smart contract.
    // This reduces deployment and interaction cost.
// Each contributor sends their quota to a smart account.
// On getting finance, each contributor sends a signing request to S-Alc. And on completion of the signatures, funds are transfered to the next person.
    // Note: Factory SC will have a way to query the balances of S-Alc and keep proper record.
// On payback, same process is applicable.

// Flow
// On the frontend to create a pool, we need a smart account/safe. The smart alc acts in place of bank.
    // Who create and owns the smart account?
        // 
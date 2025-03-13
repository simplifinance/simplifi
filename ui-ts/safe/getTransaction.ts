import SafeApiKit from "@safe-global/api-kit"

/**
 * @dev Return pending transactions
 * @param apiKit : SafeApiKit
 * @param hash : Transaction hash
 * @returns : Pending transactions
 */
export const getTransaction = async(apiKit: SafeApiKit, hash: string) => {
    return await apiKit.getTransaction(hash)
}
import SafeApiKit from "@safe-global/api-kit"

/**
 * @dev Return pending transactions
 * @param apiKit : SafeApiKit
 * @param safeAddress : Safe Address
 * @returns : Pending transactions
 */
export const getPendingTrxn = async(apiKit: SafeApiKit, safeAddress: string) => {
    return await apiKit.getPendingTransactions(safeAddress)
}
import { SafeAccountConfig } from "@safe-global/protocol-kit";

/**
 * @dev Returns Safe account config
 * @param owners : Array of owners required to create a safe.
 * @param threshold : The required number of signers to executed a transaction.
 * @returns : SafeAccountConfig
 */
export const getSafeAccountConfig = (owners: string[], threshold: number) => {
    const safeAccountConfig : SafeAccountConfig = {
        owners,
        threshold        
    }
    return safeAccountConfig;
}
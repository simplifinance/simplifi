import SafeApiKit from "@safe-global/api-kit";

/**
 * Returns kit for interacting with Safe protocol APIs
 * @param chainId : Connected chain
 * @returns : Safe protocol API kit
 */
export const getApiKit = (chainId: bigint) => new SafeApiKit({chainId});
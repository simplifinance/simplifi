import SafeApiKit from "@safe-global/api-kit";

/**
 * @dev Return Safe address
 * @param apiKit : SafeApiKit
 * @param owner : Safe Owner
 * @returns : Safe address
 */
export const getSafe = async(apiKit: SafeApiKit, owner: string) => await apiKit.getSafesByOwner(owner);

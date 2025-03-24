import { SAFE_VERSION } from "@/constants"
import Safe, { SafeAccountConfig, SafeDeploymentConfig, PredictedSafeProps } from "@safe-global/protocol-kit"
import { Eip1193Provider } from "ethers"

/**
 * @dev Returns Safeprotocol kit using predicted address
 * @param safeAccountConfig : Parameter of type SafeDeploymentConfig.
 * @param saltNonce : A unique parameter to distinguish the address from another.
 * @param provider : Eip1193Provider provider. Can be extracted from Wagmi or Ethersjs or compatible Ethereum client.
 * @param signer : Signer key { optional }
 * @returns : Safe protocol instance
 */
const getKitWithPredictedSafe = async(safeAccountConfig: SafeAccountConfig, saltNonce: string, provider: Eip1193Provider, signer?: string) => {
    const safeDeploymentConfig : SafeDeploymentConfig = {
        deploymentType: 'eip155',
        safeVersion: SAFE_VERSION, // Can be ommited
        saltNonce
    }
    const predictedSafe : PredictedSafeProps = { 
        safeAccountConfig, 
        safeDeploymentConfig
    }
    return await Safe.init({provider, signer, predictedSafe})
}
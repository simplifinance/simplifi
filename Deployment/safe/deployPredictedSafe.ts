import { CONFIRMATIONS, SAFE_VERSION } from "@/constants";
import { Address, WagmiConfig } from "@/interfaces";
import Safe, { getSafeAddressFromDeploymentTx } from "@safe-global/protocol-kit";
import { sendTransaction, waitForTransactionReceipt } from "wagmi/actions";

/**
 * Deploy a new Safe from a predicted address, initialize a new kit and return { safe, owners, and threshold }
 * @param kit : SafeProtocol kit
 * @param config : Wagmi config
 * @returns : Three variables - { safe address, safe owners, threshold}
 */
const deployPredictedSafe = async(kit: Safe, config: WagmiConfig, ) => {
    const deploymentTrx = await kit.createSafeDeploymentTransaction();
    const hash = await sendTransaction(config, {
        data: deploymentTrx.data as Address,
        to: deploymentTrx.to as Address,
        value: BigInt(deploymentTrx.value)
    });
    const trxReceipt = await waitForTransactionReceipt(config, {hash, confirmations: CONFIRMATIONS});
    const newKit = await kit.connect({safeAddress: getSafeAddressFromDeploymentTx(trxReceipt, SAFE_VERSION)});
    const safe = await newKit.getAddress();
    const owners = await newKit.getOwners();
    const threshold = await newKit.getThreshold();

    return{ safe, owners, threshold }
}

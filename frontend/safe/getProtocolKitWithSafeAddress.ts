import { Eip1193Provider } from "@safe-global/protocol-kit";
import Safe from '@safe-global/protocol-kit';

export const getProtocolKitWithSafeAddress = async(provider: Eip1193Provider, safeAddress: string, signer?: string) => {
    return await Safe.init({
        provider,
        safeAddress,
        signer
    });
}
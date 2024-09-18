import { createThirdwebClient } from "thirdweb";
import { CrossfiTestnet, } from "@thirdweb-dev/chains";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
 
const clientId = String(process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID);
// const secretKey = process.env.NEXT_PUBLIC_THIRDWEB_SECRET_KEY;

export const thirdwebClient = createThirdwebClient({clientId});
const sdk = new ThirdwebSDK(CrossfiTestnet, {clientId});
const d = await sdk.getContract("");
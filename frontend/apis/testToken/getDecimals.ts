// import { ContractCommonArgs, OxString } from "@/interfaces";
// import { address as testTokenBsct } from "../../../backend/deployments/bsct/TestToken.json";
// import { formatAddr } from "@/utilities";
// import { readContract } from "wagmi/actions";
// import { getTokenAddress } from "./getAddress";

// export const testToken = (isTestnet: boolean) : OxString => {
//     return isTestnet? formatAddr(testTokenBsct) :  formatAddr("");
// } 

// const decimalsAbi = [
//   {
//       "inputs": [],
//       "name": "decimals",
//       "outputs": [
//         {
//           "internalType": "uint8",
//           "name": "",
//           "type": "uint8"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
// ] as const;

// export const getDecimals = async(args: ContractCommonArgs) => {
//     const { account, config } = args;
//     return await readContract(config!, {
//       address: getTokenAddress(),
//       abi: decimalsAbi,
//       functionName: "decimals",
//       account
//     });
// }


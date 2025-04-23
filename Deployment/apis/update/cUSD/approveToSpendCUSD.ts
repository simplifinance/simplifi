import { celoAddresses } from "@/constants";
import { Address, Config } from "@/interfaces";
import { TrxResult } from "@/interfaces";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { approveCUSDAbi } from "@/apis/utils/abis";
import { errorMessage } from "../formatError";

/**
 * @dev Get the cUSD contract addreses from the different chains
 * @param chainId : Chain Id of the connected chain i.e Alfajores or Celo mainnet
 * @returns cUSD contract addresses
 */
export const getCUSD = (chainId: number) : Address => {
  return celoAddresses[chainId];
} 

/**
 * @dev Approve spender to spend amount of `amount` of cUSD from the owner's account 
 * @param props : Parameter
*/
export default async function approveToSpendCUSD(props: ApproveToSpendCUSDProps) {
  const { config, account, amount, spender, callback } = props;
  let returnValue : TrxResult = 'reverted';
  callback?.({message: 'Request to approve to spend cUSD'});
  const address = getCUSD(44787);
  await simulateContract(config, {
    address,
    account,
    abi: approveCUSDAbi,
    functionName: 'approve',
    args: [spender, amount]
  }).then(async({request}) => {
    const hash = await writeContract(config, request );
    returnValue = await waitForConfirmation({config, hash, callback, message: 'Approval completed'})
  }).catch((error: any) => {
    callback?.({errorMessage: errorMessage(error)});
  });

  return returnValue;
}

interface ApproveToSpendCUSDProps extends Config {
  spender: Address;
  amount: bigint;
}

// export default async function approveToSpendCUS(spender: Address, amount: bigint, callback?: TransactionCallback) {
//   const contractAddress = celoAddresses['44787'];
//   let walletClient = createWalletClient({
//     transport: custom(window.ethereum),
//     chain: celoAlfajores,
//   });
//   let [currentUser] = await walletClient.getAddresses();
//   let receipt : TransactionReceipt = mockReceipt;
//   callback?.({message: 'Create approval transaction'});
//   try {
//     const { allowance }= await getAllowanceInCUSD(currentUser, spender);
//     if(allowance < amount) {
//       const tx = await walletClient.writeContract({
//         address: contractAddress,
//         abi: StableTokenABI.abi,
//         functionName: "approve",
//         account: currentUser,
//         args: [spender, amount],
//       });
//       await configureCeloPublicClient().waitForTransactionReceipt({
//         hash: tx,
//       }).then((receipt) => {
//         callback?.({message: 'Approval transaction completed'});
//         console.log("receipt", receipt);
//       });
//     }    
//   } catch (error: any) {
//     const errorMessage = error?.message || error?.data?.message || error;
//     callback?.({errorMessage});
//   }

//   return receipt;
// }

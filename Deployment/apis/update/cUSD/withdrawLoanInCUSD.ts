// import getAllowanceInCUSD from "./getAllowanceInCUSD";
// import { Address, Config } from "@/interfaces";
// import { TrxResult } from "@/interfaces";
// import { simulateContract, writeContract } from "wagmi/actions";
// import { waitForConfirmation } from "../../utils/waitForConfirmation";
// import { withdrawCUSDAbi } from "@/apis/utils/abis";
// import { errorMessage } from "../formatError";
// import { getCUSD } from "./approveToSpendCUSD";

// /**
//  * @dev Withdraw loan denominated in cUSD given as approval from the 'owner' 
//  * @param props : Parameter
// */
// export default async function withdrawLoanInCUSD(props: WithdrawLoanInCUSDProps) {
//   const { config, account, owner, callback } = props;
//   let returnValue : TrxResult = 'reverted';
//   const { allowance } = await getAllowanceInCUSD({...props, spender: account, requestedAmount: 0n });
//   callback?.({message: 'Request to withdraw cUSD'});
//   const address = getCUSD(44787);
//   await simulateContract(config, {
//     address,
//     account,
//     abi: withdrawCUSDAbi ,
//     functionName: 'transferFrom',
//     args: [owner, account, allowance]
//   }).then(async({request}) => {
//     const hash = await writeContract(config, request );
//     returnValue = await waitForConfirmation({config, hash, callback, message: 'Withdrawal completed'})
//   }).catch((error: any) => {
//     callback?.({errorMessage: errorMessage(error)});
//   });

//   return returnValue;
// }

// interface WithdrawLoanInCUSDProps extends Config {
//   owner: Address;
// }


// // /**
// //  * @dev Withdraw loan denominated in cUSD given as approval from the 'owner'
// //  * @param owner : Owner account
// //  * @param callback : Callback function
// //  * @returns Transaction receipt
// //  */
// // async function withdrawLoanInCUSD(owner: Address, callback: TransactionCallback) {
// //   const contractAddress = celoAddresses['44787'];
// //   let walletClient = createWalletClient({
// //     transport: custom(window.ethereum),
// //     chain: celoAlfajores,
// //   });
// //   let [currentUser] = await walletClient.getAddresses();
// //   let receipt : TransactionReceipt = mockReceipt;
// //   callback({message: "Loan withdrawal request sent"})
// //   try {
// //     const { allowance } = await getAllowanceInCUSD(owner, currentUser)
// //     if(allowance > 0n) {
// //       const tx = await walletClient.writeContract({
// //         address: contractAddress,
// //         abi: StableTokenABI.abi,
// //         functionName: "transferFrom",
// //         account: currentUser,
// //         args: [owner, currentUser, allowance],
// //       });
// //       await configureCeloPublicClient().waitForTransactionReceipt({
// //         hash: tx,
// //       }).then((result) => {
// //         receipt = result;
// //         callback({message: "Loan withdrawal completed"});
// //       })
// //     }    
// //   } catch (error: any) {
// //     const errorMessage = error?.message || error?.data?.message || error;
// //     callback({errorMessage});
// //   }

// //   return receipt;
// // }


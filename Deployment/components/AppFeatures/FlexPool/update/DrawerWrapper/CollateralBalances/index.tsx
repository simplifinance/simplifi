// import { formatAddr, formatValue, toBN } from "@/utilities";
// import { Stack } from "@mui/material";
// import React from "react";
// // import { formatEther,} from "viem";
// import { useAccount, useReadContracts, useConfig } from "wagmi";
// import getReadFunctions from "../readContractConfig";
// import { Address, ButtonObj, HandleTransactionParam, } from "@/interfaces";
// import { Spinner } from "@/components/utilities/Spinner";
// import { ActionButton } from "../../ActionButton";
// import { celoAddresses } from "@/constants";

// export default function CollateralBalances({safe, collateralAsset} : CollateralBalanceProps) {
//     const [drawerOpen, setDrawerState] = React.useState<number>(0);
//     const [loanDrawerOpen, setLoanDrawerState] = React.useState<number>(0);
     
//     const { address, chainId } = useAccount();
//     const config = useConfig();
//     const spender = formatAddr(address);
//     const toggleDrawer = (arg: number) => setDrawerState(arg);
//     const toggleLoanDrawer = (arg: number) => setLoanDrawerState(arg);
//     const { readAllowanceConfig, currency, } = getReadFunctions({chainId});
//     // const { data, isPending, isError } = useReadContract({
//     //     ...readAllowanceConfig({owner: safe, spender}),
//     //     query: {refetchInterval: 5000}
//     // });

//     const { data, isPending, isError } = useReadContracts({
//         contracts: [
//             { ...readAllowanceConfig({owner: safe, spender}),},
//             { ...readAllowanceConfig({owner: safe, spender, asset: celoAddresses[chainId || 44787]})}
//         ],
//         allowFailure: true,
//         query: {refetchInterval: 5000}
//     });
        

//     const buttonObj : ButtonObj = {
//         disable: !data || isPending || isError || data[0]?.result === 0n,
//         value: 'Withdraw Collateral'
//     }

//     const loanButtonObj : ButtonObj = {
//         disable: !data || isPending || isError || data[1]?.result === 0n,
//         value: 'Cashout'
//     }

//     const transactionArgs : HandleTransactionParam = {
//         commonParam: {config, account: spender, unit: 0n, contractAddress: collateralAsset,},
//         txnType: buttonObj.value,
//         safe
//     }

//     const loanTransactionArgs : HandleTransactionParam = {
//         commonParam: {config, account: spender, unit: 0n, contractAddress: collateralAsset,},
//         txnType: loanButtonObj.value,
//         safe
//     }
//     console.log("loanTransactionArgs", loanTransactionArgs)

//     return(
//         <Stack className="bg-gray1 p-4 space-y-4 rounded-lg text-orange-300 font-normal text-sm">
//             <div className="place-items-center space-y-2">
//                 <h1>Collateral balances:</h1>
//                 { isPending && <Spinner color="#fed7aa" /> }
//                 { data && <h1>{`${formatValue(data[0].result)} ${currency}`}</h1> }
//                 { (isError || !data) && <h3>No data</h3>}
//                 <ActionButton 
//                     buttonObj={buttonObj}
//                     confirmationDrawerOn={drawerOpen}
//                     setDrawerState={toggleDrawer}
//                     transactionArgs={transactionArgs}
//                 />
//             </div>
//             <div className="place-items-center space-y-2">
//                 <h1>Loan withdrawables</h1>
//                 { isPending && <Spinner color="#fed7aa" /> }
//                 { data && <h1>{`${formatValue(data[1].result)} ${currency}`}</h1> }
//                 { (isError || !data) && <h3>No data</h3>}
//                 <ActionButton 
//                     buttonObj={loanButtonObj}
//                     confirmationDrawerOn={loanDrawerOpen}
//                     setDrawerState={toggleLoanDrawer}
//                     transactionArgs={loanTransactionArgs}
//                 />
//             </div>

            
//         </Stack>
//     );
// }

// interface CollateralBalanceProps {
//     safe: Address;
//     collateralAsset: Address;
// }

// import { flexSpread, } from "@/constants";
// import { formatAddr, formatValue } from "@/utilities";
// import { Stack } from "@mui/material";
// import React from "react";
// import { parseEther } from "viem";
// import { useAccount, useReadContracts, useConfig } from "wagmi";
// import getReadFunctions from "../readContractConfig";
// import { BalancesProps, CommonParam, HandleTransactionParam, } from "@/interfaces";
// import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
// import { Spinner } from "@/components/utilities/Spinner";
// import { Button } from "@/components/ui/button";
// import { Confirmation } from "../../ActionButton/Confirmation";

// export default function LiquidityAndSafeBalances({safe, isPermissionless, collateralAsset, param } : BalancesProps) {
//     const [drawerOpen, setDrawerState] = React.useState<number>(0);
//     const [transactionArgs, setTransactionArgs] = React.useState<HandleTransactionParam | null>(null);
    
//     const { address, chainId } = useAccount();
//     const config = useConfig();
//     const account = formatAddr(address);
//     const { symbol } = useAppStorage();
//     const toggleDrawer = (arg: number) => setDrawerState(arg);
//     const { readBalanceConfig, readAllowanceConfig } = getReadFunctions({chainId});

//     const { data, isPending, isError } = useReadContracts({
//         contracts: [
//             { ...readBalanceConfig({account: safe, contractAddress: collateralAsset})},
//             { ...readAllowanceConfig({owner: safe, spender: account})}
//         ],
//         allowFailure: true,
//         query: {refetchInterval: 5000}
//     });
    
//     const loading = isPending || isError;  
//     const quota = data?.[1].result;
//     const balances = data?.[0].result;
//     const disableButton = loading || !quota || quota.toString() === '0';

//     const handleClick = (isCashout: boolean) => {
//         const unitLiquidity = formatValue(quota);
//         const unitLiquidity_ = parseEther(unitLiquidity.toString());
//         const {colCoverage, contributors, allGH, durationInHours, } = param;
//         const commonParam : CommonParam = { account, config, unit: unitLiquidity_, contractAddress: collateralAsset };
//         let args: HandleTransactionParam = {
//             commonParam,
//             txnType: isCashout? 'Cashout' : 'Create',
//             safe,
//             router: isPermissionless? 'Permissionless' : 'Permissioned'
//         };
//         if(!isCashout) {
//             if(isPermissionless) {
//                 args.createPermissionlessPoolParam = {
//                     ...commonParam,
//                     colCoverage,
//                     contributors: contributors!,
//                     durationInHours,
//                     quorum: allGH,
//                 };
//             } else {
//                 args.createPermissionedPoolParam = {
//                     ...commonParam,
//                     colCoverage,
//                     contributors: contributors!,
//                     durationInHours,
//                 }

//             }
//         }
//         setTransactionArgs(args);
//         toggleDrawer(1);
//     }

//     return(
//         <Stack className="bg-gray1 p-4 space-y-4 rounded-lg text-orange-400 font-noraml text-sm">
//             <div className={`${flexSpread}`}>
//                 <h1>Safe Balances</h1>
//                 {
//                     isPending || isError? <Spinner color="#fed7aa" /> : <h1>{`${formatValue(balances)} ${symbol || ''}`}</h1>
//                 }
//             </div>
//             <div className={`${flexSpread}`}>
//                 <h1>Withdrawables</h1>
//                 {
//                     isPending || isError? <Spinner color="#fed7aa" /> : <h1>{formatValue(quota).toStr}</h1>
//                 }
//             </div>
//             <div className={`${flexSpread}`}>
//                 <Button onClick={() => handleClick(true)} disabled={disableButton}>{loading? <Spinner color="#fed7aa" /> : 'CashOut'}</Button>
//                 <Button onClick={() => handleClick(false)} disabled={disableButton}>{loading? <Spinner color="#fed7aa" /> : 'Rekey'}</Button>
//             </div>
//             <Confirmation 
//                 openDrawer={drawerOpen}
//                 toggleDrawer={toggleDrawer}
//                 transactionArgs={transactionArgs!}
//             />
//         </Stack>
//     );
// }

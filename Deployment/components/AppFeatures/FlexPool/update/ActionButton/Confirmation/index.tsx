import React from "react";
import { Spinner } from "@/components/utilities/Spinner";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import Drawer from './Drawer';
import Message from "../../../../../utilities/Message";
import { Address, FunctionName, HandleTransactionParam, TransactionCallback, VoidFunc } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { formatAddr, getAmountToApprove } from "@/utilities";
import { useAccount, useConfig, useWriteContract } from "wagmi";
import { getContractData } from "@/apis/utils/getContractData";
import { zeroAddress } from "viem";
import { WriteContractErrorType } from "wagmi/actions";
import { displayMessages } from "@/constants";
import { transferFromAbi, withdrawCUSDAbi } from "@/apis/utils/abis";
import { getBaseContract } from "@/apis/update/cUSD/approveToSpendCUSD";
import assert from "assert";
import getAllowanceInCUSD from "@/apis/update/cUSD/getAllowanceInCUSD";
import getAllowance from "@/apis/update/collateralToken/getAllowance";

export const Confirmation : 
    React.FC<{
        // transactionArgs: HandleTransactionParam
        toggleDrawer: (arg: number) => void
        openDrawer: number,
        back?: VoidFunc,
        optionalDisplay?: React.ReactNode,
        displayMessage?: string,
        actionButtonText?: string,
        getTransactions: () => Transaction[]
    }> = 
        ({ getTransactions, back, toggleDrawer, openDrawer, displayMessage, optionalDisplay, actionButtonText}) => 
{   
    const [loading, setLoading] = React.useState<boolean>(false);

    const { setmessage, setError, setActivepath, refetch } = useAppStorage();
    const isDark = useTheme().theme === 'dark';
    const { chainId, address } = useAccount();
    const account = formatAddr(address);
    const config = useConfig();
    const transactions = getTransactions();
    // const { factory, providers, points, faucets, token, attorney } = getContractData(chainId || 44787);

    // Reset the messages and error messages in state, and close the drawer when transaction is completed
    const handleCloseDrawer = () => {
        setmessage('');
        setError('');
        toggleDrawer(0);
    };

    // Wait for sometime before resetting the state after completing a transaction
    const setCompletion = async(functionName: FunctionName) => {
        await refetch();
        setLoading(false);
        setTimeout(() => {
            handleCloseDrawer();
            back?.();
            if(functionName === 'createPool') setActivepath('Flexpool');
        }, 10000);
        clearTimeout(10000);
    };

    const { writeContractAsync, } = useWriteContract({
        config, 
        mutation: {
            meta: {},
            onError: (error, variables) => {
                setError(error.message);
                setCompletion(variables.functionName as FunctionName);
            },
            onSuccess: (data, variables) => {
                if(variables.functionName === transactions[transactions.length - 1].functionName){
                    setmessage(`Completed ${variables.functionName} with: ${data.substring(0, 8)}...`);
                    setCompletion(variables.functionName as FunctionName);
                } else {
                    setmessage(`Completed approval request with: ${data.substring(0, 8)}...`);
                }
            }
        }
    });

    // let isGetFinance = false;
    // if(tArg !== null){
    //     isGetFinance = functionName === 'getFinance';
    // }

    // const setConvertible = (arg: Address | string) => setAssetHolding(arg);
    // const callback : TransactionCallback = (arg) => {
    //     if(arg.message) setmessage(arg.message);
    //     if(arg.errorMessage) setError(arg.errorMessage);
    //     // if(arg.status === 'success') handleCloseDrawer();
    // }
    
    // const { contractAddress, abi } = React.useMemo(() => {
    //     let abi : any[] = [];
    //     let contractAddress : Address = zeroAddress;
    //     // let args : any[] = [];
    //     switch (functionName) {
    //         case 'borrow':
    //             abi = providers.abi.filter((item) => item.name === functionName);
    //             contractAddress = providers.address;
    //             // assert(tArg.providersSlots !== undefined, "Provider's slot not given");
    //             // args.concat([tArg.providersSlots, tArg.commonParam.unit]);
    //             break;
    //         case 'claimTestTokens':
    //             abi = faucets.abi.filter((item) => item.name === functionName);
    //             contractAddress = faucets.address;
    //             break;
    //         case 'closePool':
    //             abi = factory.abi.filter((item) => item.name === functionName);
    //             contractAddress = factory.address;
    //             // args.push(tArg.commonParam.unit);
    //             break;
    //         case 'lockToken':
    //             abi = token.abi.filter((item) => item.name === functionName);
    //             contractAddress = token.address;
    //             // assert(tArg.routeTo !== undefined, "Escape address not provided");
    //             // args.concat([tArg.routeTo, tArg.commonParam.unit]);
    //             break;
    //         case 'panicUnlock':
    //             abi = token.abi.filter((item) => item.name === functionName);
    //             contractAddress = attorney.address;
    //             // assert(tArg.lostAccount !== undefined, "Lost address not provided");
    //             // args.push(tArg.lostAccount);
    //             break;
    //         case 'registerToEarnPoints':
    //             abi = points.abi.filter((item) => item.name === functionName);
    //             contractAddress = points.address;
    //             break;
    //         case 'provideLiquidity':
    //             abi = providers.abi.filter((item) => item.name === functionName);
    //             contractAddress = providers.address;
    //             // assert(tArg.rate !== undefined, "Rate not provided");
    //             // args.push(tArg.rate);
    //             break;
    //         case 'removeLiquidity':
    //             abi = providers.abi.filter((item) => item.name === functionName);
    //             contractAddress = providers.address;
    //             break;
    //         case 'unlockToken':
    //             abi = token.abi.filter((item) => item.name === functionName);
    //             contractAddress = token.address;
    //             // args.push(tArg.commonParam.unit);
    //             break;
    //         case 'setBaseToken':
    //             abi = faucets.abi.filter((item) => item.name === functionName);
    //             contractAddress = faucets.address;
    //             // assert(tArg.contractAddress !== undefined, "Contract address not provided");
    //             // args.push(tArg.contractAddress);
    //             break;
    //         case 'setCollateralToken':
    //             abi = faucets.abi.filter((item) => item.name === functionName);
    //             contractAddress = faucets.address;
    //             // assert(tArg.contractAddress !== undefined, "Contract address not provided");
    //             // args.push(tArg.contractAddress);
    //             break;
    //         default:
    //             contractAddress = factory.address;
    //             switch (functionName) {
    //                 case 'createPool':
    //                     abi = factory.abi.filter((item) => item.name === functionName);
    //                     switch (tArg.router) {
    //                         case 'Permissionless':
    //                             // const cpa = tArg.createPermissionlessPoolParam;
    //                             // assert(cpa !== undefined, "CreatePermissionless args not provided");
    //                             // const contributors = Array.from([formatAddr(address)]);
    //                             // args.concat([contributors, tArg.commonParam.unit, cpa.quorum, cpa.durationInHours, cpa.colCoverage, true, contractAddress]);
    //                             break;
    //                         case 'Permissioned':
    //                             // const cpp = tArg.createPermissionlessPoolParam;
    //                             // assert(cpp !== undefined, "CreatePermissioned args not provided");
    //                             // args.concat([cpa?.contributors, tArg.commonParam.unit, cpp.contributors.length, cpp.durationInHours, cpp.colCoverage, false, contractAddress]);
    //                             break;
    //                         default:
    //                             break;
    //                     }
    //                     break;
    //                 case 'editPool':
    //                     abi = factory.abi.filter((item) => item.name === functionName);
    //                     // const cpa = tArg.createPermissionlessPoolParam;
    //                     // assert(cpa !== undefined, "EditPool: CreatePermissionless args not provided");
    //                     // args.concat([tArg.commonParam.unit, cpa.quorum, cpa.durationInHours, cpa.colCoverage]);
    //                     break;
    //                 default:
    //                     // args.push(tArg.commonParam.unit);
    //                     abi = factory.abi.filter((item) => item.name === functionName);
    //                     break;
    //             }
    //             break;
    //     }
    //     // console.log("functionName: ", functionName);
    //     // console.log("Abi: ", abi);
    //     return {contractAddress, abi};
    // }, [functionName]);
    setmessage('');
    const handleSendTransaction = async() => {
        transactions.forEach(async({abi, value, functionName, contractAddress: address, args}) => {
             await writeContractAsync({
                abi,
                functionName,
                address,
                account,
                args,
                value
            });
        });
        // const { runMain, requireApproval, withdrawBase, args: approvalArgs, contractAddress: token, withdrawCollateral, abi: approvalAbi, functionName: approvalFunctionName } = await getAmountToApprove({
        //     account,
        //     config,
        //     factory: factory.address,
        //     functionName,
        //     providers: providers.address,
        //     unit: tArg.commonParam.unit,
        //     callback,
        //     collateralContractAddress: tArg.collateralAsset
        // });
        // console.log("result.requireApproval", result.requireApproval)
        // console.log("Result: ", result);
        // if(requireApproval) {
        //     callback({message: displayMessages['Approve']});
        //     await writeContractAsync({
        //         abi: approvalAbi,
        //         functionName: approvalFunctionName,
        //         address: token,
        //         account,
        //         args: approvalArgs
        //     });
        // }

       
        // if(runMain) {
        //     console.log("Main run");
        //     callback({message: displayMessages[functionName]});
        // }

        // if(withdrawBase || withdrawCollateral) {
        //     console.log("two run");
        //     let owner = tArg.safe;
        //     const key = withdrawCollateral? 'WithdrawCollateral' : 'WithdrawLoan';
        //     withdrawCollateral && assert(tArg.collateralAsset !== undefined, "Collateral asset not found");
        //     const address = formatAddr(withdrawCollateral? tArg.collateralAsset : getBaseContract(chainId || 44787));
        //     const withdrawLoanAbi = withdrawCollateral? transferFromAbi : withdrawCUSDAbi;
        //     if(functionName !== 'removeLiquidity'){
        //         assert(owner !== undefined, 'Safe, allowance not valid');
        //     } else {
        //         owner = providers.address;
        //     }
        //     const allowance = withdrawBase? (await getAllowanceInCUSD({...tArg.commonParam, owner, spender: account})).allowance : await getAllowance({contractAddress: tArg.collateralAsset, ...tArg.commonParam, owner, spender: account});
        //     console.log("allowamce", allowance);
        //     if(allowance > 0n) {
        //         callback({message: displayMessages[key]});
        //         await writeContractAsync({
        //             abi: withdrawLoanAbi,
        //             functionName: 'transferFrom',
        //             address,
        //             account,
        //             args: [owner, account, allowance]
        //         });
        //     }
        // }
    }

    return (
        <Drawer 
            title={ !loading? (displayMessage || 'Transaction request') : 'Transaction sent' }
            openDrawer={openDrawer} 
            setDrawerState={toggleDrawer}
            onClickAction={handleCloseDrawer}
            styles={{padding:'22px', borderLeft: '1px solid #2e3231', height: "100%", background: isDark? '#121212' : '#F9F4F4'}}
        >
            <div className="bg-white1 dark:bg-green1/90 space-y-4 text-green1/90 dark:text-orange-300 text-center">
                { optionalDisplay && optionalDisplay }
                {/* {
                    isGetFinance && !loading && <SelectComponent data='convertible' callback={setConvertible} label="Asset holding" placeholder="Which asset are you holding?"/>
                }  */}
                <Message />
                <Button variant={'outline'} disabled={loading} className="w-full max-w-sm dark:text-orange-200" onClick={handleSendTransaction}>{loading? <Spinner color={"white"} /> : actionButtonText || "Proceed"}</Button>
            </div>
        </Drawer>
    );
}

export type Transaction = {
    functionName: FunctionName,
    contractAddress: Address,
    args: any[],
    abi: any[] | Readonly<any[]>;
    value?: bigint;
};

                // switch (transactionArgs.router) {
                //     case 'Permissioned':
                //         break;
                        
                //     default:
                //         break;
                // }
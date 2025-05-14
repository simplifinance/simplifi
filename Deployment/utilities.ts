import { ethers } from "ethers";
import type { 
  Address, 
  ReadDataReturnValue, 
  FormattedCData, 
  FormattedContributor, 
  FormattedPoolData, 
  FormattedProvider, 
  FormattedProviders,
  FormattedSlot, 
  ContributorStruct,
  ProviderStruct,
  SlotStruct,
  GetAmountToApprove,
  FunctionName,
  TransactionCallback,
  ABI, 
} from "@/interfaces";
import getCurrentDebt from "./apis/read/getCurrentDebt";
import getCollateralQuote from "./apis/read/getCollateralQuote";
import BigNumber from "bignumber.js";
import { Router, StageStr } from "./constants";
import { formatEther, zeroAddress } from "viem";
import getAllowanceInCUSD from "./apis/update/cUSD/getAllowanceInCUSD";
import { approveAbi, approveCUSDAbi } from "./apis/utils/abis";
import rawData from "@/contractsData.json";
import assert from "assert";

export type TransactionData = {
  contractAddress: string;
  inputCounts: number;
  inputs: string[];
  functionName: string;
  abi: ABI;
  requireArgUpdate: boolean;
};

export type FilterTransactionDataProps = {
  chainId: number | undefined;
  functionNames?: FunctionName[];
  callback?: TransactionCallback;
  filter: boolean;
}

/**
 * @dev Converts an undefined string object to a default string value
 * @param arg : string or undefined;
 * @returns string
*/
export const str = (arg: string | undefined | number) => String(arg);

/**
 * @dev Converts an undefined number object to a default string value
 * @param arg : string or undefined;
 * @returns number
*/
export const num = (arg: number | undefined) => Number(arg);

/**
 * Converts value of their string representation.
 * @param value : Value to convert.
 * @returns Formatted value.
 */
export const formatValue = (arg: string | number | ethers.BigNumberish | bigint | undefined) => {
  const valueInBigNumber = toBN(formatEther(toBigInt(arg))).decimalPlaces(4)
  return {
    toStr: valueInBigNumber.toString(),
    toNum: valueInBigNumber.toNumber()
  }
}

/**
 * @dev Formats an undefined address type object to a defined one
 * @param arg : string or undefined;
 * @returns Address
*/
export const formatAddr = (x: string | (Address | undefined)) : Address => {
  if(!x || x === "") return `0x${'0'.repeat(40)}`;
  return `0x${x.substring(2, 42)}`;
};

/**
 * @dev Converts an argument to a bigInt value
 * @param arg : Argument to convert;
 * @returns BigInt
*/
export const toBigInt = (x: string | number | ethers.BigNumberish | bigint | undefined) : bigint => {
  if(!x) return 0n;
  return BigInt(toBN(x).toString());
} 

/**
 * @dev Converts an argument to a Big Number value
 * @param arg : Argument to convert;
 * @returns BigNumber
*/
export const toBN = (x: string | number | BigNumber | any) => {
  return new BigNumber(x);
}

/**
 * @dev Converts onchain timestamp to a date object
 * @param arg : onchain time in seconds;
 * @returns Date string object
*/
export function getTimeFromEpoch(onchainUnixTime: number) {
  var date = new Date(onchainUnixTime * 1000);
  return (onchainUnixTime === 0? 'Not Set' : `${date.toLocaleDateString("en-GB")} ${date.toLocaleTimeString("en-US")}`);
}

/**
 * @dev Filter abi of 'any' type that contains the functionName
 * @param abi: JSONInterface or abi
 * @param functionName : Function name to call
 * @returns : Filtered abi
 */
export const filterAbi = (abi: any[], functionName: FunctionName) => {
  const funcName = functionName as string;
  return abi.filter((item) => item.name === funcName);
}

/**
 * @dev Filter transaction data such as abis, contract addresses, inputs etc. If the filter parameter is true, it creates transaction data for 
 * the parsed function names. Default to false.
 * @param param0 : Parameters
 * @returns object containing array of transaction data and approved functions
 */
export function filterTransactionData({chainId, filter, functionNames, callback}: FilterTransactionDataProps) {
  const { approvedFunctions, chainIds, data, contracts } = rawData;
  const index = chainIds.indexOf(chainId || chainIds[0]);
  let transactionData : TransactionData[] = [];
  const contractAddresses = contracts[index];
  const isCelo = chainId === chainIds[0];

  if(filter) {
    assert(functionNames !== undefined, "FunctionNames not provided");
    functionNames.forEach((functionName) => {
      if(!approvedFunctions.includes(functionName)) {
        const errorMessage = `Operation ${functionName} is not supported`;
        callback?.({errorMessage});
        throw new Error(errorMessage);
      }
      const filteredData = data[index].filter(({functionName : fName}) => fName === functionName);
      transactionData.push(filteredData[0]);
    });
  }
  return {
    transactionData,
    approvedFunctions,
    contractAddresses,
    isCelo
  }
}

/**
 * @dev Check which transaction needs approval first, and approve.
 * @param functionName : Name of the function to execute on the provided Abi reference
 * @param unit : place holder for unit contribution or amount to approve
 * @param account : Current user or connected account
 * @param config : Wagmi config. Can be extracted from useConfig hook from wagmi library
 * @param callback : A callback function
 * @param collateralAsset : Collateral asset contract
 */
export const getAmountToApprove = async({account, callback, factory, providers, config, collateralContractAddress, functionName, unit} : GetAmountToApprove) => {
  let requireApproval = true;
  let args : any[] = [];
  let abi : Readonly<any[]> = approveCUSDAbi;
  let contractAddress = collateralContractAddress || zeroAddress;
  let withdrawBase = false;
  let runMain = true;
  let withdrawCollateral = false;

  switch (functionName) {
    case 'createPool':
      args = [factory, unit];
      const result = await getAllowanceInCUSD({config, account, callback, owner: account, spender: factory, });
      console.log("result.allowance", result.allowance);
      console.log("unit", unit);
      contractAddress = result.address;
      break;
    case 'payback':
      const debt = await getCurrentDebt({config, unit});
      args = [factory, debt];
      const result1 = await getAllowanceInCUSD({config, account, callback, owner: account, spender: factory,});
      // requireApproval = result1.allowance < debt;
      // requireApproval = true;
      contractAddress = result1.address;
      
      break;
    case 'liquidate':
      const debt_ = await getCurrentDebt({config, unit});
      args = [factory, debt_];
      const result2 = await getAllowanceInCUSD({config, account, callback, owner: account, spender: factory,});
      // requireApproval = result2.allowance < debt_;
      // requireApproval = true;
      contractAddress = result2.address;
      break;
    case 'getFinance':
      abi = approveAbi;
      const collateral = await getCollateralQuote({config, unit});
      args = [factory, collateral[0]];
      // const prevAllowance = await getAllowance({config, account, owner: account, spender: factory, contractAddress: collateralContractAddress, callback});
      // requireApproval = prevAllowance < collateral[0];
      // requireApproval = true;
      withdrawBase = true;
      break;
    case 'provideLiquidity':
      args = [providers, unit];
      const result3 = await getAllowanceInCUSD({config, account, callback, owner: account, spender: providers});
      // requireApproval = result3.allowance < unit;
      contractAddress = result3.address;
      break;
    case 'contribute':
      args = [factory, unit];
      const result4 = await getAllowanceInCUSD({config, account, callback, owner: account, spender: factory});
      // requireApproval = result4.allowance < unit;
      contractAddress = result4.address;
      break;
    case 'removeLiquidity':
      withdrawBase = true;
      requireApproval = false;
      break;
    case 'Cashout':
      withdrawBase = true;
      requireApproval = false;
      runMain = false;
      // assert(safe !== undefined, 'Safe address not found');
      // args = [safe, account, unit];
    case 'closePool':
      withdrawBase = true;
      break;
    case 'payback':
      withdrawCollateral = true;
      break;
    default:
      requireApproval = false;
      break;
  }

  return {
    requireApproval,
    abi,
    args,
    contractAddress,
    functionName: 'approve',
    withdrawBase,
    runMain,
    withdrawCollateral
  };
}


/**
 * Accepts raw blockchain data and converts it to usable data that can be rendered in the DOM, and easily
 * work with.
 * @param pool : Pool data
 * @returns : Formatted data
*/
export const formatPoolData = (pool: ReadDataReturnValue): FormattedPoolData => {
  const {
    pool: {
      big: { unit, currentPool, unitId, recordId},
      low: { maxQuorum, allGh, userCount, duration, colCoverage, selector },
      addrs: { admin, colAsset, lastPaid, safe },
      router,
      stage
    },
    cData
  } = pool;
  
  let formattedCData : FormattedCData[] = [];
  const isPermissionless = toBN(router.toString()).toNumber() === Router.PERMISSIONLESS;
  const userCountToNumber = toBN(userCount.toString()).toNumber();
  const allGetFinance  = toBN(allGh.toString()).toNumber() === userCountToNumber;
  const quorumToNumber = toBN(maxQuorum.toString()).toNumber();
  const expectedPoolAmount = toBigInt(toBN(unit.toString()).times(toBN(maxQuorum.toString())).toString());
  const poolFilled = userCountToNumber === quorumToNumber;
  const stageInNum = toBN(stage.toString()).toNumber();

  if(cData && cData.length > 0) {
    cData.forEach((data) => {
      formattedCData.push(
        {
          profile: formatContributor(data.profile),
          providers: formatProviders(data.providers),
          slot: formatSlot(data.slot)
        }
      );
    });
  }

  const durationInSec = toBN(duration.toString()).toNumber();;
  return {
    pool: {
      big: { 
        unit: {big: toBigInt(unit), inEther: formatEther(toBigInt(unit))}, 
        currentPool: {big: toBigInt(currentPool), inEther: formatEther(toBigInt(currentPool))},
        unitId: {big: toBigInt(unitId), str: unitId.toString()}, 
        recordId: {big: toBigInt(recordId), str: recordId.toString()},
      },
      low: { 
        maxQuorum: toBN(maxQuorum.toString()).toNumber(), 
        allGh: toBN(allGh.toString()).toNumber(),
        userCount: userCountToNumber, 
        duration: {inSec: durationInSec, inHour: durationInSec / 60}, 
        colCoverage: toBN(colCoverage.toString()).toNumber(),
        selector : toBN(selector.toString()).toNumber()
      },
      addrs: { 
        admin: formatAddr(admin.toString()), 
        colAsset: formatAddr(colAsset.toString()),
        lastPaid: formatAddr(lastPaid.toString()), 
        safe: formatAddr(safe.toString())
      },
      router: Router[toBN(router.toString()).toNumber()],
      stage: {toNum: stageInNum, inStr: StageStr[stageInNum]},
      poolFilled,
      allGetFinance,
      isPermissionless,
      expectedPoolAmount,
    },
    cData: formattedCData
  }
}

/**
 * @dev Format contributors' data to usable form
 * @param arg : Data of type Common.ContributorStruct. See @/typechain-types
 * @returns  Formatted data of type  FormattedContributor. See @/interface.ts
 */
export const formatContributor = (arg: ContributorStruct) : FormattedContributor => {
  const { paybackTime, colBals, turnStartTime, sentQuota, id, loan, getFinanceTime } = arg;
  const paybackTimeInSec = toBN(paybackTime.toString()).toNumber();
  const turnStartTimeInSec = toBN(turnStartTime.toString()).toNumber();
  const getFinanceTimeInSec = toBN(getFinanceTime.toString()).toNumber();
  const colBalsInEther = formatEther(toBigInt(colBals));
  const loanInBN = toBN(loan.toString());
  const loanInEther = formatEther(toBigInt(loan));
  const paybackTimeInDateFormat = getTimeFromEpoch(paybackTimeInSec);
  const turnStartTimeInDateFormat = getTimeFromEpoch(turnStartTimeInSec);
  const getFinanceTimeInDateFormat = getTimeFromEpoch(getFinanceTimeInSec);

  return {
    paybackTime: {inSec: paybackTimeInSec, inDate: paybackTimeInDateFormat},
    turnStartTime: { inSec: turnStartTimeInSec, inDate: turnStartTimeInDateFormat},
    getFinanceTime: {inSec: getFinanceTimeInSec, inDate: getFinanceTimeInDateFormat},
    loan: { inBN: loanInBN, inEther: loanInEther},
    colBals: colBalsInEther,
    id: formatAddr(id.toString()),
    sentQuota: sentQuota? 'Sent' : 'Not Sent',
  }
}

/**
 * @dev Format providers' data to usable form
 * @param arg : Data of type ProviderStruct. See @/typechain-types
 * @returns  Formatted data of type  FormattedProvider. See @/interface.ts
 */
const formatProvider = (arg: ProviderStruct) : FormattedProvider => {
  const { 
    account,
    accruals: { fullInterest, intPerSec },
    amount,
    earnStartDate,
    rate,
    slot
  } = arg;
  const earnStartDateInSec = toBN(earnStartDate.toString()).toNumber();
  return {
    account: formatAddr(account.toString()),
    accruals: { fullInterest: formatEther(toBigInt(fullInterest)), intPerSec: formatEther(toBigInt(intPerSec)) },
    amount: formatEther(toBigInt(amount)),
    earnStartDate: {inSec: earnStartDateInSec, inDate: getTimeFromEpoch(earnStartDateInSec)},
    rate: toBN(rate.toString()).div(100).toString(),
    slot: toBN(slot.toString()).toNumber()
  }
}

/**
 * @dev Format slot data to usable form
 * @param arg : Data of type SlotStruct. See @/typechain-types
 * @returns  Formatted data of type  FormattedSlot. See @/interface.ts
*/
const formatSlot = ({ isAdmin, isMember, value }: SlotStruct) : FormattedSlot => {
  return {
    isAdmin,
    isMember,
    value: toBN(value.toString()).toNumber()
  }
}

/**
 * @dev Format a list of providers data to usable form
 * @param arg : Data of type ProviderStruct[]. See @/typechain-types
 * @returns  Formatted data of type  FormattedProviders. See @/interface.ts
*/
export const formatProviders = (providers: Readonly<ProviderStruct[]>): FormattedProviders => {
  let formattedProviders : FormattedProviders = [];
  if(providers && providers.length > 0) {
    providers.forEach((provider) => {
      formattedProviders.push(
        formatProvider(provider)
      );
    })
  }
 
  return (formattedProviders);
}








// /**
//  * @dev Check which transaction needs approval first, and approve.
//  * @param txnType : Incoming transaction type
//  * @param unit : place holder for unit contribution or amount to approve
//  * @param account : Current user or connected account
//  * @param config : Wagmi config. Can be extracted from useConfig hook from wagmi library
//  * @param callback : A callback function
//  * @param collateralAsset : Collateral asset contract
//  */
// export const checkAndApprove = async({account, callback, config, txnType, contractAddress, unit} : CheckAndApproveParam, selectedAsset?: Address) => {
//   let { factory, providers, } = getContractData(config.state.chainId);
//   let amtToApprove : bigint = 0n;
//   let owner = account;
//   let spender = factory;
//   let previousAllowance : bigint = 0n;
//   // let canProceed = true;

//   switch (txnType) {
//     case 'Create':
//       amtToApprove = unit;
//       previousAllowance = (await getAllowanceInCUSD({config, account, callback, owner, spender, })).allowance;
//       break;
//     case 'Payback':
//       amtToApprove = await getCurrentDebt({config, unit});
//       previousAllowance = (await getAllowanceInCUSD({config, account, callback, owner, spender, requestedAmount: amtToApprove})).allowance;
//       break;
//     case 'Liquidate':
//       amtToApprove = await getCurrentDebt({config, unit});
//       previousAllowance = (await getAllowanceInCUSD({config, account, callback, owner, spender, requestedAmount: amtToApprove})).allowance;
//       break;
//     case 'GetFinance':
//       const collateral = await getCollateralQuote({config, unit});
//       amtToApprove = collateral[0];
//       // Expected contractAddress is the collateral asset that was selected during pool creation
//       assert(contractAddress !== undefined, "Collateral asset not provided");
//       if(selectedAsset !== supportedCeloCollateralAsset[1].address && selectedAsset !== supportedCeloCollateralAsset[0].address){
//         assert(selectedAsset !== undefined, "SelectedAsset is undefined");
//         await checkAndConvertAssetHolding({selectedAsset, amountIn: amtToApprove, config: {account, config, callback}});

//       }
//       previousAllowance = await getAllowance({config, account, owner, spender, contractAddress, callback});
//       break;
//     case 'ProvideLiquidity':
//       amtToApprove = unit;
//       spender = providers;
//       previousAllowance = (await getAllowanceInCUSD({config, account, callback, owner, spender, requestedAmount: amtToApprove})).allowance;
//       break;
//     case 'Contribute':
//       amtToApprove = unit;
//       previousAllowance = (await getAllowanceInCUSD({config, account, callback, owner, spender, requestedAmount: amtToApprove})).allowance;
//       break;
//     default:
//       break;
//     }

//     // console.log("contractAddress", contractAddress)
//     if(previousAllowance < amtToApprove) {
//       if(txnType === 'GetFinance'){
//         await approve({account, config, callback, amountToApprove: amtToApprove, contractAddress});
//       } else {
//         await approveToSpendCUSD({ account,  amount: amtToApprove, config, spender, callback,});
//       }
//     }
// }









// /**
//  * @dev Utility to run state changing transactions on the blockchain.
//  * Arguments are spread in the `param` arg to avoid overloading the function
//  * @param param : Contains the different function parameters
//  */
// export const handleTransact = async(param: HandleTransactionParam) => {
//   const { 
//     safe, 
//     rate,
//     txnType,
//     router, 
//     providersSlots,
//     createPermissionedPoolParam, 
//     createPermissionlessPoolParam,
//     commonParam, 
//     selectedAsset
//   } = param;
//   let result : SendTransactionResult = { errored:false, error: {} };
//   let error : any = {};
//   const {unit, ...rest} = commonParam;
//   const { providers } = getContractData(rest.config.state.chainId);
//   try {
//     await checkAndApprove({txnType, unit, ...rest}, selectedAsset);
//     switch (txnType) {
//       case 'Contribute':
//         await addToPool({unit, ...rest});
//         break;
//       case 'GetFinance':
//         assert(safe !== undefined, "Safe address not provided");
//         assert(rest.callback !== undefined, "Callback function is undefined");
//         const get = await getFinance({unit, ...rest});
//         if(get === 'success') await withdrawLoanInCUSD({owner: safe, ...rest});
//         break;
//       case 'Payback':
//         assert(safe !== undefined, "Safe contract not provided");
//         const pay = await payback({unit, ...rest}); 
//         if(pay === 'success') await withdrawCollateral({...rest, safe});
//         break;
//       case 'Remove':
//         assert(safe !== undefined, "Safe contract not provided");
//         const removedPool = await removePool({unit, ...rest}); 
//         if(removedPool === 'success') await withdrawLoanInCUSD({owner: safe, ...rest});
//         break;
//       case 'Liquidate':
//         assert(safe !== undefined, "Safe contract not provided");
//         const liquidated = await liquidate({unit, ...rest});
//         if(liquidated === 'success') await withdrawCollateral({...rest, safe});
//         break;
//       case 'Borrow':
//         assert(providersSlots !== undefined, "Safe address is undefined");
//         // console.log("providersSlots", providersSlots)
//         await borrow({unit, ...rest, providersSlots});
//         break;
//       case 'Get Tokens':
//         await claimTestTokens({...rest});
//         break;
//       case 'ProvideLiquidity':
//         assert(rate !== undefined, "Safe address is undefined");
//         await provideLiquidity({...rest, rate, unit});
//         break;
//       case 'Withdraw Collateral':
//         assert(safe !== undefined, "Safe address is undefined");
//         await withdrawCollateral({...rest, safe});
//         break;
//       case 'Cashout':
//         assert(safe !== undefined, "Safe address is undefined");
//         assert(rest.callback !== undefined, "Safe address is undefined");
//         await withdrawLoanInCUSD({owner: safe, ...rest});
//         break;
//       case 'RemoveLiquidity':
//         const removed = await removeLiquidity({...rest, unit });
//         if(removed === 'success') await withdrawLoanInCUSD({owner: providers, ...rest});
//         break;
//       case 'SignUp':
//         await registerToEarnPoints({...rest, unit });
//         break;
//       case 'Create':
//         assert(router, "Utilities: Router was not provider");
//         switch (router) {
//           case 'Permissioned':
//             assert(createPermissionedPoolParam, "Utilities: createPermissionedPoolParam: Param not found");
//             await createPermissioned(createPermissionedPoolParam, commonParam);
//             break;
//           case 'Permissionless':
//             assert(createPermissionlessPoolParam, "Utilities: createPermissionless parameters not found");
//             await createPermissionless(createPermissionlessPoolParam, commonParam)
//             break;
//           default:
//             break;
//         }
//         break;
//       default:
//         break;
//     }
//   } catch (error: any) {
//     console.log("Error", error)
//     result = {errored: true, error};
//   }
//   return result;
// }

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
  FunctionName,
  TransactionData,
  FilterTransactionDataProps,
  ProviderResult,
} from "@/interfaces";
import BigNumber from "bignumber.js";
import { Router, Stage, StageStr } from "./constants";
import { formatEther, Hex } from "viem";
import globalContractData from "@/contractsData/global.json";
import assert from "assert";
import { getStepData } from "./stepsData";
import { getDataSuffix as getDivviDataSuffix, submitReferral } from "@divvi/referral-sdk";

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
  const valueInBigNumber = toBN(formatEther(toBigInt(arg))).decimalPlaces(6)
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
  const { approvedFunctions, chainIds, contractAddresses } = globalContractData;
  let transactionData : TransactionData[] = [];
  const index = chainIds.indexOf(chainId || chainIds[0]);
  const isCelo = chainId === chainIds[0];
  if(filter) {
    assert(functionNames !== undefined, "FunctionNames not provided");
    functionNames.forEach((functionName) => {
      if(!approvedFunctions.includes(functionName)) {
        const errorMessage = `Operation ${functionName} is not supported`;
        callback?.({errorMessage});
        throw new Error(errorMessage);
      }
      const data = getStepData(functionName, chainId);
      transactionData.push(data);
    })
  }

  return {
    transactionData,
    approvedFunctions,
    contractAddresses: contractAddresses[index],
    isCelo  
  }
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
        unit: {big: toBigInt(unit), inEther: toBN(formatEther(toBigInt(unit) || 0n)).decimalPlaces(5).toString()}, 
        currentPool: {big: toBigInt(currentPool), inEther: toBN(formatEther(toBigInt(currentPool) || 0n)).decimalPlaces(5).toString()},
        unitId: {big: toBigInt(unitId), str: unitId.toString()}, 
        recordId: {big: toBigInt(recordId), str: recordId.toString()},
      },
      low: {
        maxQuorum: toBN(maxQuorum.toString()).toNumber(), 
        allGh: toBN(allGh.toString()).toNumber(),
        userCount: userCountToNumber, 
        duration: {inSec: durationInSec, inHour: durationInSec / 3600}, 
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

/**
 * @dev Search all the pools that the current connected account is participating or has participated
 * @param pools : Total concatenated pools i.e a list of current and past pools.
 * @param currentUser : Connected user.
 * @param providers : Array of all providers.
 * @returns Found pools
 */
export function filterPoolForCurrentUser(pools: ReadDataReturnValue[], providers: ProviderResult[], currentUser: Address) {
  const filteredPools = pools.filter(({cData}) => {
    const filteredProfile = cData.filter(({profile}) => profile.id.toLowerCase() === currentUser.toLowerCase());
    return filteredProfile && filteredProfile.length > 0;
  });

  const filteredProviders = providers.filter(({account}) => account.toLowerCase() === currentUser.toLowerCase());
  return {
    filteredPools,
    filteredProviders
  }  
}

/**
 * @dev Search for all past pools
 * @param pools : Total concatenated pools i.e a list of current and past pools.
 * @returns Found pools
 */
export function filterPools(pools: ReadDataReturnValue[]) {
  const pastPools = pools.filter(({pool}) => pool.stage === Stage.ENDED || pool.stage === Stage.CANCELED);
  const currentPools = pools.filter(({pool}) => pool.stage !== Stage.ENDED && pool.stage !== Stage.CANCELED);
  const permissioned = pools.filter(({pool}) => pool.router === Router.PERMISSIONED);
  const permissionless = pools.filter(({pool}) => pool.router === Router.PERMISSIONLESS);
  return { pastPools, currentPools, permissioned, permissionless }
}

/**
 * @dev Return the total liquidity in the providers smart contract
 * @param providers : Array of providers data fetched from the blockchain
 * @param pools: Array of onchain pools data fetched from the blockchain 
 * @returns : Object containing extracted and formatted values
 */
export function getAnalytics(providers: ProviderResult[], pools: ReadDataReturnValue[]){
  let totalProvidedLiquidity = 0n;
  let totalAccruedInterest = 0n;
  let averageRate = 0n;
  let totalPermissioned = 0;
  let totalPermissionless = 0;
  let tvlInContribution = 0n;
  let tvlInCollateral = 0n;
  let activeUsers = 0;
  let totalPayout = 0n;
  let totalLiquidatablePool = 0;
  let totalBorrowedFromProviders = 0n;
  const allProviders = providers.length;

  providers.forEach(({amount, accruals, rate}) => {
    totalProvidedLiquidity += amount;
    totalAccruedInterest += accruals.fullInterest;
    averageRate += rate;
  });

  pools.forEach(({pool: {big: {currentPool}, router}, cData}) => {
    const isPermissionless = router === Router.PERMISSIONLESS;
    tvlInContribution += currentPool;
    activeUsers += cData.length;
    isPermissionless? totalPermissionless += 1 : totalPermissioned += 1;
    cData.forEach(({providers, profile: {colBals, loan, paybackTime}}) => {
      const paybackTime_ = toBN(paybackTime.toString()).times(toBN(1000)).toNumber();
      const onchainPaybackTime = new Date(paybackTime_).getTime();
      const currentTime = new Date().getTime();
      if(currentTime > onchainPaybackTime) totalLiquidatablePool += 1;
      totalPayout += loan;
      tvlInCollateral += colBals;
      
      providers.forEach(({amount, accruals}) => {
        totalBorrowedFromProviders += amount;
        totalAccruedInterest += accruals.fullInterest;
      });
    })
  });

  const avgRate = providers.length === 0? '0' : BigInt((averageRate / BigInt(providers.length)/100n)).toString();
  return {
    tvlProviders: formatValue(totalProvidedLiquidity).toStr,
    unpaidInterest: formatValue(totalAccruedInterest).toStr,
    averageRate: avgRate,
    totalPermissioned,
    totalPermissionless,
    tvlInBase: formatValue(tvlInContribution).toStr,
    tvlInCollateral: formatValue(tvlInCollateral).toStr,
    activeUsers,
    totalPayout: formatValue(totalPayout).toStr,
    totalLiquidatablePool,
    totalBorrowedFromProviders: formatValue(totalBorrowedFromProviders).toStr,
    totalProviders: allProviders
  };
}

// consumer is your Divvi Identifier
// providers are the addresses of the Rewards Campaigns that you signed up for on the previous page
export function getDivviReferralUtilities() {
  const getDataSuffix = () => {
    const consumer = process.env.NEXT_PUBLIC_DIVVI_IDENTIFIER as Address;
    const campaign1 = process.env.NEXT_PUBLIC_CAMPAIGN_1 as string;
    const campaign2 = process.env.NEXT_PUBLIC_CAMPAIGN_2 as string;
    const providers = Array.from([campaign1, campaign2]) as Address[];
    return getDivviDataSuffix({
      consumer,
      providers,
    }) as Address;
  }
  
  const submitReferralData = async(txHash:`0x${string}`, chainId: number) => {
    return await submitReferral({
      txHash,
      chainId,
    })
  }
  return {
    getDataSuffix,
    submitReferralData
  }
}

// Encode multiple values in binary format
// export function encodeUserData(campaignHash: Hex): string {
//   // Frontend: Creating user defined data
//   const actionData = {
//     action: 1,
//     campaignHash: campaignHash,
//   };

//   const userDefinedData = "0x" + Buffer.from(
//     JSON.stringify(actionData)
//   ).toString('hex').padEnd(128, '0'); 
  
//   return userDefinedData;
// }
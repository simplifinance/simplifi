import { ethers } from "ethers";
import { Address, AmountToApproveParam, FormattedCData, FormattedContributor, FormattedPoolData, FormattedProvider, FormattedProviders, FormattedSlot, HandleTransactionParam, } from "@/interfaces";
import getCurrentDebt from "./apis/read/getCurrentDebt";
import getAllowance from "./apis/update/collateralToken/getAllowance";
import getCollateralQuote from "./apis/read/getCollateralQuote";
import approve from "./apis/update/collateralToken/approve";
import addToPool from "./apis/update/factory/addToPool";
import getFinance from "./apis/update/factory/getFinance";
import liquidate from "./apis/update/factory/liquidate";
import payback from "./apis/update/factory/payback";
import { Common } from "./typechain-types/Contributor";
import createPermissioned from "./apis/update/factory/createPermissioned";
import createPermissionless from "./apis/update/factory/createPermissionless";
import assert from "assert";
import { getContractData } from "./apis/utils/getContractData";
import removePool from "./apis/update/factory/removePool";
import BigNumber from "bignumber.js";
import { Router, Stage, StageStr, supportedChainIds } from "./constants";
import approveToSpendCUSD, { getAllowanceInCUSD } from "./apis/update/cUSD/approveToSpendCUSD";
import withdrawLoanInCUSD from "./apis/update/cUSD/withdrawLoanInCUSD";
import { formatEther } from "viem";

export type Operation = 'Open' | 'Closed';

/**
 * Converts value of 'value' of type string to 'ether' representation.
 * @param value : Value to convert.
 * @returns Formatted value.
 */
export const formatValue = (value: string | undefined): string => {
  if(value === "undefined" || value === undefined) {
    return '0';
  } 
  return ethers.formatEther(value);
}

export const isSuportedChain = (chainId: number) => {
  return supportedChainIds.includes(chainId);
}

export const str = (arg: string | undefined) => String(arg);
export const num = (arg: number | undefined) => Number(arg);

export const formatAddr = (x: string | (Address | undefined)) : Address => {
  if(!x || x === "") return `0x${'0'.repeat(40)}`;
  return `0x${x.substring(2, 42)}`;
};

export const toBigInt = (x: string | number | ethers.BigNumberish | bigint | undefined) : bigint => {
  if(!x) return 0n;
  return ethers.toBigInt(x);
} 

export const toBN = (x: string | number ) => {
  return new BigNumber(x);
}

export function getTimeFromEpoch(onchainUnixTime: number) {
  var date = new Date(onchainUnixTime * 1000);
  return (onchainUnixTime === 0? 'Not Set' : `${date.toLocaleDateString("en-GB")} ${date.toLocaleTimeString("en-US")}`);
}

export const commonStyle = (props?: {}) => {
  return {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
    p: 2,
    ...props
  };
} 

/**
 * Filter and calculate amount to approve
 * Note: If trxnType is 'PAY', we provide for 60 minutes contingency between now and 
 * transaction time. This is to avoid the trx being reverted. User should not worry as 
 * what the contract takes is the exact debt to date.
 * @param param 
 * @returns 
*/
export const getAmountToApprove = async(param: AmountToApproveParam) => {
  const { txnType, unit, avgIntPerSec, account, config, contractAddress } = param;
  let amtToApprove : bigint = 0n;
  let owner = account;
  let spender = getContractData(config.state.chainId).factory;
  let previousAllowance : bigint = 0n;

  switch (txnType) {
    case 'PAYBACK':
      assert(avgIntPerSec !== undefined, "Utilities: Average interest per second not provided");
      amtToApprove = await getCurrentDebt({config, unit}) + avgIntPerSec;
      previousAllowance = await getAllowanceInCUSD();
      break;
    case 'LIQUIDATE':
      assert(avgIntPerSec !== undefined, "Utilities: Average interest per second not provided");
      amtToApprove = await getCurrentDebt({config, unit}) + avgIntPerSec;
      previousAllowance = await getAllowanceInCUSD();
      break;
    case 'GET FINANCE':
      const collateral = await getCollateralQuote({config, unit});
      amtToApprove = collateral[0];
      previousAllowance = await getAllowance({config, account, owner, spender, contractAddress});
      break;
    default:
      amtToApprove = unit;
      previousAllowance = await getAllowanceInCUSD();
      break;
    }
    if(previousAllowance > amtToApprove) {
      amtToApprove = 0n;
    }
  return amtToApprove;
}

export const handleTransact = async(param: HandleTransactionParam) => {
  const { callback, safe, collateralAsset, router, createPermissionedPoolParam, createPermissionlessPoolParam, otherParam} = param;
  const amountToApprove = await getAmountToApprove(otherParam);
  const { account, config, unit, txnType } = otherParam;
  if(amountToApprove > 0n) {
    switch (txnType) {
      case 'CREATE':
        await approveToSpendCUSD(amountToApprove);
        break;
      case 'ADD LIQUIDITY':
        await approveToSpendCUSD(amountToApprove);
        break;
      case 'PAYBACK':
        await approveToSpendCUSD(amountToApprove);
        break;
      case 'LIQUIDATE':
        await approveToSpendCUSD(amountToApprove);
        break;
      case 'GET FINANCE':
        assert(collateralAsset !== undefined, "CollateralAsset parameter undefined");
        await approve({account, config, callback, amountToApprove: amountToApprove, contractAddress: collateralAsset});
        break;
      default:
        break;
    }
  }
 
  switch (txnType) {
    case 'ADD LIQUIDITY':
      await addToPool({account, config, unit, callback});
      break;
    case 'GET FINANCE':
      assert(safe !== undefined, "Safe address is undefined");
      const get = await getFinance({account, config, unit, callback});
      if(get === 'success') await withdrawLoanInCUSD(safe, callback);
      break;
    case 'PAYBACK':
      assert(safe !== undefined, "Bank address is undefined");
      await payback({account, config, unit, callback});
      // if(pay === 'success') { 
      //   await withdrawCollateral({account, config, bank, callback});
      // }  
      break;
    case 'REMOVE':
      await removePool({account, config, unit}); 
      break;
    case 'LIQUIDATE':
      await liquidate({account, config, unit, callback});
      break;
    case 'CREATE':
      assert(router, "Utilities: Router was not provider");
      switch (router) {
        case 'Permissioned':
          assert(createPermissionedPoolParam, "Utilities: createPermissionedPoolParam: Param not found");
          await createPermissioned(createPermissionedPoolParam);
          break;
        case 'Permissionless':
          assert(createPermissionlessPoolParam, "Utilities: createPermissionless parameters not found");
          await createPermissionless(createPermissionlessPoolParam)
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }
}

/**
 * Accepts raw blockchain data and converts it to usable data that can be rendered in the DOM, and easily
 * work with.
 * @param pool : Pool data
 * @returns : Formatted data
*/
export const formatPoolData = (pool: Common.ReadPoolDataReturnValueStruct): FormattedPoolData => {
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
export const formatContributor = (arg: Common.ContributorStruct) : FormattedContributor => {
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
 * @param arg : Data of type Common.ProviderStruct. See @/typechain-types
 * @returns  Formatted data of type  FormattedProvider. See @/interface.ts
 */
const formatProvider = (arg: Common.ProviderStruct) : FormattedProvider => {
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
 * @param arg : Data of type Common.SlotStruct. See @/typechain-types
 * @returns  Formatted data of type  FormattedSlot. See @/interface.ts
*/
const formatSlot = ({ isAdmin, isMember, value }: Common.SlotStruct) : FormattedSlot => {
  return {
    isAdmin,
    isMember,
    value: toBN(value.toString()).toNumber()
  }
}

/**
 * @dev Format a list of providers data to usable form
 * @param arg : Data of type Common.ProviderStruct[]. See @/typechain-types
 * @returns  Formatted data of type  FormattedProviders. See @/interface.ts
*/
export const formatProviders = (providers: Common.ProviderStruct[]): FormattedProviders => {
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


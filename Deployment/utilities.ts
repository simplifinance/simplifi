import { ethers } from "ethers";
import { Address, AmountToApproveParam, HandleTransactionParam, } from "@/interfaces";
import getCurrentDebt from "./apis/read/getCurrentDebt";
import getAllowance from "./apis/update/collateralToken/getAllowance";
import getCollateralQuote from "./apis/read/getCollateralQuote";
import approve from "./apis/update/collateralToken/approve";
import addToPool from "./apis/update/factory/addToPool";
import getFinance from "./apis/update/factory/getFinance";
import liquidate from "./apis/update/factory/liquidate";
import payback from "./apis/update/factory/payback";
// import { formatEther,} from "viem";
// import { Common } from "./typechain-types/IFactory";
import createPermissioned from "./apis/update/factory/createPermissioned";
import createPermissionless from "./apis/update/factory/createPermissionless";
import assert from "assert";
import { getContractData } from "./apis/utils/getContractData";
// import withdrawLoan from "./apis/update/collateralToken/withdrawCollateral";
import removePool from "./apis/update/factory/removePool";
import BigNumber from "bignumber.js";
import { supportedChainIds } from "./constants";
import approveToSpendCUSD, { getAllowanceInCUSD } from "./apis/update/cUSD/approveToSpendCUSD";
import withdrawLoanInCUSD from "./apis/update/cUSD/withdrawLoanInCUSD";

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

// /**
//  * Formats pool data
//  * @param pool : Pool data
//  * @returns : Formatted data
//  */
// export const formatPoolContent = (pool: ReadDataReturnValue, formatProfiles: boolean, currentUser: Address) : FormattedPoolContentProps => {
//   const {
//     pool: {
//       big: { unit, currentPool, unitId: unitId_, recordId},
//       low: { maxQuorum, allGh, userCount, duration, colCoverage, selector },
//       addrs: { admin, colAsset, lastPaid, safe },
//       router,
//       stage
//     },
//     cData
//   } = pool;
  
//   let cDataFormatted : FormattedData[] = [];
//   const isPermissionless = toBN(router.toString()).toNumber() === Router.PERMISSIONLESS;
//   const selectorToNumber = toBN(selector.toString()).toNumber();
//   const colCoverageInString = toBN(colCoverage.toString()).toString();
//   const currentPoolInEther = formatEther(toBigInt(toBN(currentPool.toString()).toString()));
//   const allGetBool  = toBN(allGh.toString()).eq(toBN(userCount.toString()));
//   const allGhToNumber = toBN(allGh.toString()).toNumber();
//   const unitIdToNumber = toBN(unitId_.toString()).toNumber();
//   const quorumToNumber = toBN(quorum.toString()).toNumber();
//   const unitIdBigint = toBigInt(unitId_);
//   const stageToNumber = toBN(stage.toString()).toNumber();
//   const expectedPoolAmtBigint = toBigInt(toBN(unit.toString()).times(toBN(quorum.toString())).toString());
//   const unitInEther =  formatEther(toBigInt(toBN(unit.toString()).toString())).toString();
//   const userCountToNumber = toBN(userCount.toString()).toNumber();
//   const intPercentString = toBN(intRate.toString()).div(100).toString();
//   const durationToNumber = toBN(duration.toString()).div(3600).toNumber();
//   const poolFilled = userCountToNumber === quorumToNumber;
//   let isMember = false;

//   if(formatProfiles && cData.length > 0) {
//     cData.forEach((data) => {
//       cDataFormatted.push(formatProfileData(data));
//       if(data.id.toString().toLowerCase() === currentUser.toString().toLowerCase()) {
//         isMember = true;
//       }
//     });
//   }

//   return {
//     unit,
//     unit_bigint: BigInt(unit.toString()),
//     rId: BigInt(recordId.toString()),
//     quorumToNumber,
//     userCountToNumber,
//     allGetBool,
//     allGhToNumber,
//     unitIdToNumber,
//     unitIdBigint,
//     stageToNumber,
//     expectedPoolAmtBigint,
//     unitInEther,
//     intPercentString,
//     durationToNumber,
//     poolFilled,
//     isPermissionless,
//     selectorToNumber,
//     colCoverageInString,
//     fullInterestInEther,
//     intPerSecInEther,
//     currentPoolInEther,
//     unitInBN: toBN(unit.toString()),
//     currentPoolInBN: toBN(currentPool.toString()),
//     adminLowerCase: admin.toString().toLowerCase(),
//     assetLowerCase: asset.toString().toLowerCase(),
//     admin,
//     asset,
//     isMember,
//     isAdmin: currentUser.toString().toLowerCase() === admin.toString().toLowerCase(),
//     cDataFormatted,
//     intPerSec,
//     formattedSafe: formatAddr(bank.toString()),
//     lastPaid: formatAddr(lastPaid.toString())
//   }
// }

// export const formatProfileData = (param: Common.ContributorStruct) : FormattedData => {
//   const { paybackTime, colBals, turnStartTime, durOfChoice, interestPaid, sentQuota, id, loan, } = param;
//   const paybackTimeInSec = toBN(paybackTime.toString()).toNumber();
//   const turnStartTimeInSec = toBN(turnStartTime.toString()).toNumber();
//   const durOfChoiceInSec = toBN(durOfChoice.toString()).toNumber();
//   const colBalsInEther = formatEther(toBigInt(toBN(colBals.toString()).toString()));
//   const loanInEther = formatEther(toBigInt(toBN(loan.toString()).toString()));
//   const loanInBN = toBN(loan.toString());
//   const interestPaidInEther = formatEther(toBigInt(toBN(interestPaid.toString()).toString()));
//   const paybackTimeInDateFormat = getTimeFromEpoch(paybackTimeInSec);
//   const turnStartTimeInDateFormat = getTimeFromEpoch(turnStartTimeInSec);
//   const idLowerCase = id.toString().toLowerCase()

//   return {
//     paybackTimeInDateFormat,
//     paybackTimeInSec,
//     turnStartTimeInDateFormat,
//     turnStartTimeInSec,
//     durOfChoiceInSec,
//     colBalsInEther,
//     loanInEther,
//     interestPaidInEther,
//     idLowerCase,
//     idToString: id.toString(),
//     loanInBN,
//     sentQuota
//   }
// }



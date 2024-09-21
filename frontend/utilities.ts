import { type BigNumberish, ethers } from "ethers";
import type { Address, AmountToApproveParam, ButtonText, FormattedData, LiquidityPool, TransactionCallback, WagmiConfig } from "@/interfaces";
import BigNumber from 'bignumber.js';
import { getCurrentDebt } from "./apis/factory/read/getCurrentDebt";
import { getAllowance } from "./apis/factory/transact/testToken/getAllowance";
import { getCollateralQuote } from "./apis/factory/read/getCollateralQuote";
import { approve } from "./apis/factory/transact/testToken/approve";
import { addToPool } from "./apis/factory/transact/addToPool";
import { getFinance } from "./apis/factory/transact/getFinance";
import { liquidate } from "./apis/factory/transact/liquidate";
import { payback } from "./apis/factory/transact/payback";
import { formatEther } from "viem";
import { Common } from "../contract/typechain-types/contracts/apis/IFactory";

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

export function getTimeFromEpoch(onchainUnixTime: bigint | BigNumberish) {
  var newDate = new Date(toBN(onchainUnixTime.toString()).toNumber());
  return `${newDate.toLocaleDateString("en-GB")} ${newDate.toLocaleTimeString("en-US")}`;
}

/**
 * Filter and calculate amount to approve
 * Note: If trxnType is 'PAY', we provide for 60 minutes contingency between now and 
 * transaction time. This is to avoid the trx being reverted. User should not worry as 
 * what will be taken will be the exact debt to date.
 * @param param 
 * @returns 
*/
export const getAmountToApprove = async(param: AmountToApproveParam) => {
  const { txnType, unit, intPerSec, lastPaid, epochId, account, config } = param;
  let amtToApprove : BigNumber = toBN(0);
  switch (txnType) {
    case 'ADD':
      amtToApprove = toBN(unit.toString());
      break;
    case 'PAY':
      const curDebt = toBN((await getCurrentDebt({config, epochId, account})).toString());
      amtToApprove = curDebt.plus(toBN(intPerSec.toString()).times(60)); 
      break;
    case 'LIQUIDATE':
      const debtOfLastPaid = toBN((await getCurrentDebt({config, epochId, account: lastPaid})).toString());
      amtToApprove = debtOfLastPaid.plus(toBN(intPerSec.toString()).times(60));
      break;
    case 'GET':
      const collateral = await getCollateralQuote({config, epochId});
      amtToApprove = toBN(collateral[0].toString());
      break;
    default:
      break;
  }
  const prevAllowance = toBN((await getAllowance({config, account})).toString());
  if(prevAllowance.gte(amtToApprove)) {
    amtToApprove = toBN(0);
  }

  return amtToApprove;
}
// toBigInt(amtToApprove.toString())

interface HandleTransactionParam {
  otherParam: AmountToApproveParam;
  preferredDuration: string; 
  callback: TransactionCallback;
}

export const handleTransact = async(param: HandleTransactionParam) => {
  const { callback, preferredDuration, otherParam} = param;
  const amountToApprove = await getAmountToApprove(otherParam);
  const { account, config, epochId, txnType } = otherParam;

  if(txnType === 'ADD' || txnType === 'PAY' || txnType === 'LIQUIDATE') {
    if(amountToApprove.gt(0)) {
      await approve({
          account,
          config,
          callback,
          amountToApprove: toBigInt(amountToApprove.toString())
      });
    }
  }
  switch (txnType) {
    case 'ADD':
      await addToPool({account, config, epochId, callback});
      break;
    case 'GET':
      await getFinance({account, value: toBigInt(amountToApprove.toString()), config, epochId, daysOfUseInHr: toBN(preferredDuration).toNumber(), callback});
      break;
    case 'PAY':
      await payback({account, config, epochId, callback});
      break;
    case 'LIQUIDATE':
      await liquidate({account, config, epochId, callback});
      break;
    default:
      break;
  }
}

/**
 * Formats pool data
 * @param pool : Pool data
 * @returns : Formatted data
 */
export const formatPoolContent = (pool: LiquidityPool, formatProfiles: boolean) => {
  const {
    uint256s: { unit, currentPool, intPerSec, fullInterest, epochId: epochId_, },
    uints: { intRate, quorum, duration, colCoverage, selector },
    addrs: { admin, asset, lastPaid },
    isPermissionless,
    stage,
    cData,
    allGh,
    userCount : { _value : userCount }
  } = pool;

  let cData_formatted : FormattedData[] = [];
  const selector_toNumber = toBN(selector.toString()).toNumber();
  const colCoverage_InEther = formatEther(toBigInt(toBN(colCoverage.toString()).toString()));
  const fullInterest_InEther = formatEther(toBigInt(toBN(fullInterest.toString()).toString()));
  const intPerSec_InEther = formatEther(toBigInt(toBN(intPerSec.toString()).toString()));
  const currentPool_InEther = formatEther(toBigInt(toBN(currentPool.toString()).toString()));
  const allGET_bool  = toBN(allGh.toString()).eq(toBN(userCount.toString()));
  const allGh_toNumber = toBN(allGh.toString()).toNumber();
  const epochId_toNumber = toBN(epochId_.toString()).toNumber();
  const quorum_toNumber = toBN(quorum.toString()).toNumber();
  const epochId_bigint = toBigInt(epochId_);
  const stage_toNumber = toBN(stage.toString()).toNumber();
  const expectedPoolAmt_bigint = toBigInt(toBN(unit.toString()).times(toBN(quorum.toString())).toString());
  const unit_InEther =  formatEther(toBigInt(toBN(unit.toString()).toString())).toString();
  const userCount_toNumber = toBN(userCount.toString()).toNumber();
  const intPercent_string = toBN(intRate.toString()).div(100).toString();
  const duration_toNumber = toBN(duration.toString()).div(toBN(3600)).toNumber();
  const poolFilled = userCount_toNumber === quorum_toNumber;

  if(formatProfiles) {
    cData.forEach((data) => {
      cData_formatted.push(formatProfileData(data));
    });
  }

  return {
    unit,
    pair: "USDT/XFI",
    quorum_toNumber,
    userCount_toNumber,
    allGET_bool,
    allGh_toNumber,
    epochId_toNumber,
    epochId_bigint,
    stage_toNumber,
    expectedPoolAmt_bigint,
    unit_InEther,
    intPercent_string,
    duration_toNumber,
    poolFilled,
    isPermissionless,
    selector_toNumber,
    colCoverage_InEther,
    fullInterest_InEther,
    intPerSec_InEther,
    currentPool_InEther,
    admin_lowerCase: admin.toString().toLowerCase(),
    asset_lowerCase: asset.toString().toLowerCase(),
    admin,
    asset,
    cData_formatted,
    intPerSec,
    lastPaid: formatAddr(lastPaid.toString())
  }
}

export const formatProfileData = (param: Common.ContributorDataStruct) : FormattedData => {
  const { cData : { payDate, colBals, turnTime, durOfChoice, expInterest, id, loan}, slot, rank: { member, admin }} = param;
  const payDate_InSec = toBN(payDate.toString()).toNumber();
  const slot_toNumber = toBN(slot.toString()).toNumber();
  const turnTime_InSec = toBN(payDate.toString()).toNumber();
  const durOfChoice_InSec = toBN(durOfChoice.toString()).toNumber();
  const colBals_InEther = formatEther(toBigInt(toBN(colBals.toString()).toString()));
  const loan_InEther = formatEther(toBigInt(toBN(loan.toString()).toString()));
  const loan_InBN = toBN(loan.toString());
  const expInterest_InEther = formatEther(toBigInt(toBN(expInterest.toString()).toString()));
  const payDate_InDateFormat = getTimeFromEpoch(payDate);
  const turnTime_InDateFormat = getTimeFromEpoch(turnTime);
  const id_lowerCase = id.toString().toLowerCase()

  return {
    payDate_InDateFormat,
    payDate_InSec,
    slot_toNumber,
    turnTime_InDateFormat,
    turnTime_InSec,
    durOfChoice_InSec,
    colBals_InEther,
    loan_InEther,
    expInterest_InEther,
    id_lowerCase,
    isMember: member,
    isAdmin: admin,
    loan_InBN
  }
}
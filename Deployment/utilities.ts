import { type BigNumberish, ethers } from "ethers";
import type { Address, AmountToApproveParam, ButtonText, CreatePermissionedPoolParams, CreatePermissionLessPoolParams, FormattedData, FormattedPoolContentProps, HandleTransactionParam, LiquidityPool, Router, TransactionCallback, WagmiConfig } from "@/interfaces";
import BigNumber from 'bignumber.js';
import { getCurrentDebt } from "./apis/read/getCurrentDebt";
import { getAllowance } from "./apis/transact/testToken/getAllowance";
import { getCollateralQuote } from "./apis/read/getCollateralQuote";
import { approve } from "./apis/transact/testToken/approve";
import { addToPool } from "./apis/transact/factory/addToPool";
import { getFinance } from "./apis/transact/factory/getFinance";
import { liquidate } from "./apis/transact/factory/liquidate";
import { payback } from "./apis/transact/factory/payback";
import { formatEther, zeroAddress } from "viem";
import { Common } from "../contract/typechain-types/contracts/apis/IFactory";
import { createPermissionedLiquidityPool } from "./apis/transact/factory/createPermissionedLiquidityPool";
import { createPermissionlessLiquidityPool } from "./apis/transact/factory/createPermissionless";
import assert from "assert";
import { getFactoryAddress } from "./apis/contractAddress";
import { withdrawLoan } from "./apis/transact/testToken/withdrawLoan";
import { withdrawCollateral } from "./apis/transact/factory/withdrawCollateral";

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
  let amtToApprove : BigNumber = toBN(unit.toString());
  let owner : Address = account;
  let spender : Address = getFactoryAddress();

  try {
    switch (txnType) {
      case 'ADD':
        amtToApprove = amtToApprove;
        break;
      case 'PAY':
        assert(epochId !== undefined && intPerSec !== undefined, "Utilities: EpochId not given");
        const curDebt = toBN((await getCurrentDebt({config, epochId, account})).toString());
        amtToApprove = curDebt.plus(toBN(intPerSec.toString()).times(60)); 
        break;
      case 'LIQUIDATE':
        assert(epochId !== undefined && intPerSec !== undefined && lastPaid, "Utilities: EpochId and IntPerSec parameters missing.");
        const debtOfLastPaid = toBN((await getCurrentDebt({config, epochId, account: lastPaid})).toString());
        amtToApprove = debtOfLastPaid.plus(toBN(intPerSec.toString()).times(60));
        break;
      case 'GET':
        assert(epochId !== undefined, "Utilities: EpochId not given");
        const collateral = await getCollateralQuote({config, epochId});
        console.log("collateral", collateral[0].toString());
        amtToApprove = toBN(collateral[0].toString());
        break;
      default:
        break;
    }
  } catch (error: any) {
    console.log("Error", error?.message || error?.data.message);
  }
  if(txnType !== 'GET') {
    const prevAllowance = toBN((await getAllowance({config, account, owner, spender})).toString());
    if(prevAllowance.gte(amtToApprove)) {
      amtToApprove = toBN(0);
    }
  }

  return amtToApprove;
}

export const handleTransact = async(param: HandleTransactionParam) => {
  const { callback, strategy, preferredDuration, router, createPermissionedPoolParam, createPermissionlessPoolParam, otherParam} = param;
  const amountToApprove = await getAmountToApprove(otherParam);
  const { account, config, epochId, txnType } = otherParam;

  if(txnType === 'ADD' || txnType === 'PAY' || txnType === 'LIQUIDATE' || txnType === 'AWAIT PAYMENT') {
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
      assert(epochId !== undefined, "Utilities: EpochId and IntPerSec parameters missing.");
      await addToPool({account, config, epochId, callback});
      break;
    case 'GET':
      assert(epochId !== undefined, "Utilities: EpochId and IntPerSec parameters missing.");
      assert(preferredDuration !== undefined && strategy !== undefined, "Utilities: PreferredDuration not set");
      await getFinance({account, value: toBigInt(amountToApprove.toString()), config, epochId, daysOfUseInHr: toBN(preferredDuration).toNumber(), callback});
      await withdrawLoan({config, account, strategy, callback});
      break;
    case 'PAY':
      assert(epochId !== undefined, "Utilities: EpochId and IntPerSec parameters missing.");
      await payback({account, config, epochId, callback});
      await withdrawCollateral({account, config, epochId, callback});
      break;
    case 'LIQUIDATE':
      assert(epochId !== undefined, "Utilities: EpochId and IntPerSec parameters missing.");
      await liquidate({account, config, epochId, callback});
      break;
    case 'CREATE':
      assert(router, "Utilities: Router was not provider");
      switch (router) {
        case 'Permissioned':
          assert(createPermissionedPoolParam !== undefined, "Utilities: createPermissionedPoolParam: Param not found");
          await createPermissionedLiquidityPool(createPermissionedPoolParam);
          break;
        case 'Permissionless':
          assert(createPermissionlessPoolParam !== undefined, "Utilities: createPermissionless parameters not found");
          await createPermissionlessLiquidityPool(createPermissionlessPoolParam);
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
 * Formats pool data
 * @param pool : Pool data
 * @returns : Formatted data
 */
export const formatPoolContent = (pool: LiquidityPool, formatProfiles: boolean) : FormattedPoolContentProps => {
  const {
    uint256s: { unit, currentPool, intPerSec, fullInterest, epochId: epochId_, },
    uints: { intRate, quorum, duration, colCoverage, selector },
    addrs: { admin, asset, lastPaid, strategy },
    isPermissionless,
    stage,
    cData,
    allGh,
    userCount : { _value : userCount }
  } = pool;

  let cData_formatted : FormattedData[] = [];
  const selector_toNumber = toBN(selector.toString()).toNumber();
  const colCoverage_InString = toBN(colCoverage.toString()).toString();
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
  const duration_toNumber = toBN(duration.toString()).div(3600).toNumber();
  const poolFilled = userCount_toNumber === quorum_toNumber;

  if(formatProfiles) {
    cData.forEach((data) => {
      if(data.cData.id !== zeroAddress) {
        cData_formatted.push(formatProfileData(data));
      }
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
    colCoverage_InString,
    fullInterest_InEther,
    intPerSec_InEther,
    currentPool_InEther,
    admin_lowerCase: admin.toString().toLowerCase(),
    asset_lowerCase: asset.toString().toLowerCase(),
    admin,
    asset,
    cData_formatted,
    intPerSec,
    formatted_strategy: formatAddr(strategy.toString()),
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
    id_toString: id.toString(),
    isMember: member,
    isAdmin: admin,
    loan_InBN
  }
}

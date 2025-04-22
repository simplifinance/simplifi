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
  HandleTransactionParam, 
  ButtonText, 
  WagmiConfig, 
  TransactionCallback,
  SendTransactionResult, 
} from "@/interfaces";
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
import { Router, StageStr, supportedChainIds } from "./constants";
import approveToSpendCUSD from "./apis/update/cUSD/approveToSpendCUSD";
import withdrawLoanInCUSD from "./apis/update/cUSD/withdrawLoanInCUSD";
import { formatEther } from "viem";
import getAllowanceInCUSD from "./apis/update/cUSD/getAllowanceInCUSD";
import borrow from "./apis/update/providers/borrow";
import claimTestTokens from "./apis/update/faucet/claimTestTokens";
import provideLiquidity from "./apis/update/providers/providerLiquidity";
import removeLiquidity from "./apis/update/providers/removeLiquidity";
import registerToEarnPoints from "./apis/update/points/registerToEarnPoints";
import withdrawCollateral from "./apis/update/collateralToken/withdrawCollateral";

/**
 * @dev Check if the current chain is supported
 * @param chainId : Chain Id from the current network
 * @returns : boolean value
 */
export const isSuportedChain = (chainId: number) => {
  return supportedChainIds.includes(chainId);
}

/**
 * @dev Converts an undefined string object to a default string value
 * @param arg : string or undefined;
 * @returns string
*/
export const str = (arg: string | undefined) => String(arg);

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
  const valueInBigNumber = toBN(formatEther(toBigInt(arg))).decimalPlaces(2)
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
  return ethers.toBigInt(x);
} 

/**
 * @dev Converts an argument to a Big Number value
 * @param arg : Argument to convert;
 * @returns BigNumber
*/
export const toBN = (x: string | number ) => {
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
 * @dev Check which transaction needs approval first, and approve.
 * @param txnType : Incoming transaction type
 * @param unit : place holder for unit contribution or amount to approve
 * @param account : Current user or connected account
 * @param config : Wagmi config. Can be extracted from useConfig hook from wagmi library
 * @param callback : A callback function
 * @param collateralAsset : Collateral asset contract
 */
export const checkAndApprove = async(
  txnType: ButtonText,
  unit: bigint,
  account: Address,
  config: WagmiConfig,
  callback: TransactionCallback,
  collateralAsset?: Address
) => {
  let { factory, providers, } = getContractData(config.state.chainId);
  let amtToApprove : bigint = 0n;
  let owner = account;
  let spender = factory;
  let previousAllowance : bigint = 0n;

  switch (txnType) {
    case 'Create':
      amtToApprove = unit;
      previousAllowance = (await getAllowanceInCUSD(account, factory)).allowance;
      break;
    case 'Payback':
      amtToApprove = await getCurrentDebt({config, unit});
      previousAllowance = (await getAllowanceInCUSD(account, factory)).allowance;
      break;
    case 'Liquidate':
      amtToApprove = await getCurrentDebt({config, unit});
      previousAllowance = (await getAllowanceInCUSD(account, factory)).allowance;
      break;
    case 'GetFinance':
      const collateral = await getCollateralQuote({config, unit});
      amtToApprove = collateral[0];
      previousAllowance = await getAllowance({config, account, owner, spender: factory, contractAddress: collateralAsset, callback});
      break;
    case 'ProvideLiquidity':
      amtToApprove = unit;
      previousAllowance = (await getAllowanceInCUSD(account, providers)).allowance;
      spender = providers;
      break;
    case 'Contribute':
      amtToApprove = unit;
      previousAllowance = (await getAllowanceInCUSD(account, factory)).allowance;
      spender = providers;
      break;
    default:
      break;
    }
    if(previousAllowance < amtToApprove) {
      txnType !== 'GetFinance'? await approveToSpendCUSD(spender, amtToApprove, callback) : await approve({account, config, callback, amountToApprove: amtToApprove, contractAddress: collateralAsset});
    }
}

/**
 * @dev Utility to run state changing transactions on the blockchain.
 * Arguments are spread in the `param` arg to avoid overloading the function
 * @param param : Contains the different function parameters
 */
export const handleTransact = async(param: HandleTransactionParam) => {
  const { 
    safe, 
    rate,
    txnType,
    router, 
    providersSlots,
    createPermissionedPoolParam, 
    createPermissionlessPoolParam,
    commonParam, 
  } = param;
  let result : SendTransactionResult = { errored:false, error: {} };
  const {contractAddress, unit, config, account, callback} = commonParam;
  try {
    await checkAndApprove(txnType, unit, account, config, callback!, contractAddress);
    switch (txnType) {
      case 'Contribute':
        await addToPool({account, config, unit, callback, contractAddress});
        break;
      case 'GetFinance':
        assert(safe !== undefined, "Safe address is undefined");
        assert(callback !== undefined, "Callback is undefined");
        const get = await getFinance({account, config, unit, callback, contractAddress});
        if(get === 'success') await withdrawLoanInCUSD(safe, callback);
        break;
      case 'Payback':
        assert(safe !== undefined, "Bank address is undefined");
        await payback({account, config, unit, callback, contractAddress}); 
        break;
      case 'Remove':
        await removePool({account, config, unit, callback, contractAddress}); 
        break;
      case 'Liquidate':
        await liquidate({account, config, unit, callback,contractAddress});
        break;
      case 'Borrow':
        assert(providersSlots !== undefined, "Safe address is undefined");
        await borrow({account, config, unit, callback, contractAddress, providersSlots});
        break;
      case 'Get Tokens':
        await claimTestTokens({account, config, callback, contractAddress});
        break;
      case 'ProvideLiquidity':
        assert(rate !== undefined, "Safe address is undefined");
        await provideLiquidity({account, config, callback, contractAddress, rate, unit});
        break;
      case 'Withdraw Collateral':
        assert(safe !== undefined, "Safe address is undefined");
        await withdrawCollateral({account, config, callback, contractAddress, safe});
        break;
      case 'Cashout':
        assert(safe !== undefined, "Safe address is undefined");
        assert(callback !== undefined, "Safe address is undefined");
        await withdrawLoanInCUSD(safe, callback);
        break;
      case 'RemoveLiquidity':
        await removeLiquidity({account, config, callback, contractAddress, unit });
        break;
      case 'SignUp':
        await registerToEarnPoints({account, config, callback, contractAddress, unit });
        break;
      case 'Create':
        assert(router, "Utilities: Router was not provider");
        switch (router) {
          case 'Permissioned':
            assert(createPermissionedPoolParam, "Utilities: createPermissionedPoolParam: Param not found");
            await createPermissioned(createPermissionedPoolParam, commonParam);
            break;
          case 'Permissionless':
            assert(createPermissionlessPoolParam, "Utilities: createPermissionless parameters not found");
            await createPermissionless(createPermissionlessPoolParam, commonParam)
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  } catch (error) {
    result = {errored: true, error};
  }
  return result;
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
export const formatProviders = (providers: Readonly<Common.ProviderStruct[]>): FormattedProviders => {
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


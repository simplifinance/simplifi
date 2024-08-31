// import { Contract, ContractTransactionResponse } from "ethers";
import type { Address, Addresses, AssetClassReturnType, BandParam, ContractResponse, FundAccountParam, FundStrategyParam, GetPaidParam, GetPaidResultParam, JoinABandParam, Null, PrivateBandParam, PublicBandParam, Signer } from "./types";
import { CREATION_FEE, AMOUNT_SENT_TO_ACCOUNT_ONE, AMOUNT_SENT_TO_EACH_ACCOUNT_FROM_ALC1, formatAddr, } from "./utilities";
import { balances, initiateTransaction, signAndExecuteTransaction, transfer, transferMultiple } from "./tokenUtils";
import { expect } from "chai";
import { Common } from "../typechain-types/contracts/apis/IFactory";

/**
 * @dev Create public pool
 * @param x : Parameters of type PublicBandParam
 * @returns ContractResponse
 */
export const createPermissionlessPool = async(x: PublicBandParam) : Promise<bigint> => {
  await x.factory.connect(x.signer).createPermissionlessPool(x.quorum, x.durationInHours, x.colCoverageRatio, x.amount, x.asset);
  return await x.factory.currentPoolId();
}

/**
 * @dev Create private pool
 * @param x : Parameters of type PrivateBandParam
 * @returns ContractResponse
 */
export const createPermissionedPool = async(x: PrivateBandParam) : Promise<bigint> => {
  await x.factory.connect(x.signer).createPermissionedPool(
    x.durationInHours, 
    x.colCoverageRatio, 
    x.amount, 
    x.asset, 
    x.participants
  );
  return await x.factory.currentPoolId();
}

/**
 * @dev Get finance
 * @param x : Parameters of type BandParam
 * @returns ContractResponse
 */
export const getFinance = async(x: BandParam) : ContractResponse => {
  return await x.factory.connect(x.signer).getFinance(x.poolId);
}

/**
 * @dev Payback
 * @param x : Parameters of type BandParam
 * @returns ContractResponse
 */
export const payback = async(x: BandParam) : ContractResponse => {
  return await x.factory.connect(x.signer).payback(x.poolId);
}

/**
 * @dev Liquidate
 * @param x : Parameters of type BandParam
 * @returns ContractResponse
 */
export const liquidate = async(x: BandParam) : ContractResponse => {
  return await x.factory.connect(x.signer).liquidate(x.poolId);
}

/**
 * @dev Check whether there is a defaulter at the `x.pool`
 * @param x : Parameters of type BandParam
 * @returns ContractResponse
 */
export async function enquireLiquidation(x: BandParam) : Promise<Common.LiquidationStructOutput> {
  return await x.factory.connect(x.signer).enquireLiquidation(x.poolId);
}

// /**
//  * @dev Create stretegy
//  * @param strategyAdmin : The strategy admin contract 
//  * @param signer : Signer
//  * @returns ContractResponse
//  */
// export const createStrategies = async(arg: CreateStrategyParam) : Promise<Addresses>  => {
//   let result : Addresses = [];

//   for (let i = 0; i < arg.signers.length; i++) {
//     const from : Signer = arg.signers[i];
//     await arg.strategyAdmin.connect(from).createStrategy({value: CREATION_FEE});
//     result.push(formatAddr(await arg.strategyAdmin.getStrategy(from.address)));
//     arg.callback();
//   }
//   return result;
// }

/**
 * @dev Support new asset
 * @param assetAdmin : Asset contract
 * @param token : Any ERC20 compatible contract
 * @returns ContractResponse
 */

export const setSupportedToken = async(assetAdmin: AssetClassReturnType, token: Address) : ContractResponse => {
  return assetAdmin.supportAsset(token);
}

/**
 * @dev Send tokens to the accounts provided as signers in `x`.
 * We sent two different tokens : SFT and Test USD. 
 * Sending SFT requires that we first approve a transaction in `TokenDistributor`,
 * and the token is sent to signer1. 
 * 
 * From signer1 we send token to other signers.
 * 
 * @param x : Parameters of type FundAccountParam
 * @returns : Promise<{amtSentToEachAccount: Hex, amtSentToAlc1: Hex}>
 */
export async function fundAccount(x: FundAccountParam) : Null {
  let reqId = 0;
  await initiateTransaction({
    initTokenReceiver: x.initTokenReceiver,
    tokenAddr: x.tokenAddr,
    recipient: x.recipient,
    deployer: x.deployer,
    from: x.signer1,
    amount: AMOUNT_SENT_TO_ACCOUNT_ONE,
    // reqId: reqId,
    trxnType: 0,
    callback: () => {
      reqId ++;
    }
  });
  await signAndExecuteTransaction({reqId, signers: [x.signer2, x.signer3], initTokenReceiver: x.initTokenReceiver});
  // Send SFT to the rest of the signers
  await transferMultiple(
    x.token,
    [
      formatAddr(x.signer2.address), 
      formatAddr(x.signer3.address)
    ]
  ,
    x.signer1,
    [AMOUNT_SENT_TO_EACH_ACCOUNT_FROM_ALC1, AMOUNT_SENT_TO_EACH_ACCOUNT_FROM_ALC1] 
  );

  await x.testUSD.mintBatch(
    Array.from([x.signer1.address, x.signer2.address, x.signer3.address]),
    AMOUNT_SENT_TO_EACH_ACCOUNT_FROM_ALC1
  );
}

/**
 * @dev Send testUSD and collateral to strategies. 
 * Note: Transaction should be send from the list participants
 * @param x : Parameter of type FundStrategyParam
 */
export async function sendToken(x: FundStrategyParam) {
  const fromZize = x.froms.length;
  expect(fromZize).to.equal(x.recipients.length, "Froms differ from recipients");
  for (let i = 0; i < fromZize; i++) {
    await transfer(x.tUSD, x.recipients[i], x.froms[i], x.amount);
  }

  console.log(`Operation: ${x.operation}`);
  }

/**
 * @dev Join a band
 * @param x : Parameters of type JoinABandParam
 * @returns void
*/
export async function joinBand(x: JoinABandParam) {

  for(let i= 0; i < x.signers.length; i++) {
    // console.log("callabl", await x.factory.callable(1, 0));
    await x.factory.connect(x.signers[i]).joinBand(x.poolId)
  }
}

/**
 * @dev Get finance and payback
 * @param x : Parameters of type GetPaidParam
 * @returns void
*/
export async function getFinanceAndPayback(x: GetPaidParam) : Promise<GetPaidResultParam> {
  let result : GetPaidResultParam = {
    tokenB4: [],
    tokenAfter: [],
    usdB4: [],
    usdAfter: []
  }
  
  for(let i = 0; i < x.signers.length; i++) {
    const toB4 = await balances(x.token, [x.trusteeAddr, x.strategies[i]]);
    const tcB4 = await balances(x.tcUSD, [x.trusteeAddr, x.strategies[i]]);
    result.usdB4.push(... tcB4);
    result.tokenB4.push(... toB4)

    console.log(`Account:${i} with strategy ${x.strategies[i]} getting finance ...`);
    await x.factory.connect(x.signers[i]).getFinance(x.poolId);
    if(x.runPayback) {
      console.log(`Account:${i} with strategy ${x.strategies[i]} paying back ...`);
      await payback({poolId:x.poolId, factory: x.factory, signer: x.signers[i]});
      // await x.factory.connect(x.signers[i]).payback(x.poolId);
    }
    const tcAfter = await balances(x.tcUSD, [x.trusteeAddr, x.strategies[i]]);
    const toAfter = await balances(x.token, [x.trusteeAddr, x.strategies[i]]);
    result.usdAfter.push(... tcAfter);
    result.tokenAfter.push(... toAfter)
  }

  return result;
}


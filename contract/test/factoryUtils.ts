// import { Contract, ContractTransactionResponse } from "ethers";
import type { 
  Address, 
  Addresses,
  BandParam, 
  // ContractResponse, 
  FundAccountParam, 
  JoinABandParam, 
  LiquidateParam, 
  Null, 
  PermissionedBandParam, 
  PermissionLessBandParam, 
  Signer, 
  TestAssetContract, 
  AssetManagerContract, 
  PaybackParam, 
  RemoveLiquidityParam, 
  GetFinanceParam,
  FactoryTxReturn,
  FactoryContract, } from "./types";

import { bn, formatAddr, } from "./utilities";
import { Common } from "../typechain-types/contracts/apis/IFactory";

/**
 * @dev Create public pool
 * @param x : Parameters of type PermissionLessBandParam
 * @returns ContractResponse
*/
export async function createPermissionlessPool (
  x: PermissionLessBandParam
) 
  : Promise<FactoryTxReturn> 
{
  const factoryAddr = formatAddr(await x.factory.getAddress());

  await transferAsset({
    amount: x.unitLiquidity,
    asset: x.asset,
    recipients: [formatAddr(x.signer.address)],
    sender: x.deployer
  });

  await approve({
    owner: x.signer,
    amount: x.unitLiquidity,
    spender: factoryAddr,
    testAsset: x.asset
  }) 
  await x.factory.connect(x.signer).createPermissionlessPool(
    x.intRate,
    x.quorum,
    x.durationInHours,
    x.colCoverage,
    x.unitLiquidity,
    x.asset
  );
  const epochId = await x.factory.epoches();
  const balances = await x.factory.getBalances(epochId);
  const pool = await x.factory.getPoolData(epochId);
  const profile = await x.factory.getProfile(epochId, x.signer.address);
  return { pool, epochId, balances, profile};
}

/**
 * @dev Create private pool
 * @param x : Parameters of type PermissionedBandParam
 * @returns ContractResponse
 */
export async function createPermissionedPool(
  x: PermissionedBandParam
) 
  : Promise<FactoryTxReturn>
{
  const factoryAddr = formatAddr(await x.factory.getAddress());

  await transferAsset({
    amount: x.unitLiquidity,
    asset: x.asset,
    recipients: x.contributors,
    sender: x.deployer
  });

  await approve({
    owner: x.signer,
    amount: x.unitLiquidity,
    spender: factoryAddr,
    testAsset: x.asset
  }) 
  await x.factory.connect(x.signer).createPermissionedPool(
    x.intRate,  
    x.durationInHours, 
    x.colCoverage, 
    x.unitLiquidity, 
    x.asset, 
    x.contributors
  );
  const epochId = await x.factory.epoches();
  const balances = await x.factory.getBalances(epochId);
  const pool = await x.factory.getPoolData(epochId);
  const profile = await x.factory.getProfile(epochId, x.signer.address);
  return { pool, epochId, balances, profile };
}

/**
 * @dev Get finance
 * @param x : Parameters of type BandParam
 * @returns ContractResponse
 */
export async function getFinance(
  x: GetFinanceParam
)
 : Promise<FactoryTxReturn>
{
  // const factoryAddr = await x.factory.getAddress();
  const getCol = await x.factory.getCollaterlQuote(x.epochId);
  console.log("GetQuote", getCol);
  // let txReturn : GetFinanceReturn = [];
  const signer = x.signers[0];
  await x.factory.connect(signer).getFinance(
    x.epochId,
    x.hrsOfUse_choice!,
    {value: getCol.collateral}
  );
  const balances = await x.factory.getBalances(x.epochId);
  const pool = await x.factory.getPoolData(x.epochId);
  const profile = await x.factory.getProfile(x.epochId, signer.address);

  return { balances, pool, profile, epochId: x.epochId };
}

/**
 * @dev Payback
 * @param x : Parameters of type BandParam
 * @returns ContractResponse
 */
export async function payback(
  x: PaybackParam
) 
: Promise<{
    pool: Common.PoolStructOutput;
    balances: Common.BalancesStructOutput;
    profile: Common.ContributorDataStructOutput;
 }>
{
  const factoryAddr = formatAddr(await x.factory.getAddress());
  const signer = x.signers[0];
  await x.factory.getCurrentDebt(x.epochId, signer.address);
  // console.log(`GetCurrentDebt: ${debt}\n Calculated debt: ${x.debt}`);
  const bal = await x.asset.balanceOf(signer.address);
  if(bn(x.debt).gt(bn(bal))){
    await transferAsset({
      amount: BigInt(bn(x.debt).minus(bn(bal)).toString()),
      asset: x.asset,
      recipients: [formatAddr(signer.address)],
      sender: x.deployer
    });
  }
  await approve({
    owner: signer,
    amount: x.debt!,
    spender: factoryAddr,
    testAsset: x.asset
  });
  console.log("Allowance", await x.asset.allowance(signer.address, factoryAddr));
  await x.factory.connect(signer).payback(x.epochId);
  const balances = await x.factory.getBalances(x.epochId);
  const pool = await x.factory.getPoolData(x.epochId);
  const profile = await x.factory.getProfile(x.epochId, signer.address);
  return {
    pool,
    balances,
    profile
  }
}

export async function approve(
  {owner, spender, amount, testAsset} 
    : 
      {owner: Signer, spender: Address, testAsset: TestAssetContract, amount: bigint}) 
{
  await testAsset.connect(owner).approve(spender, amount);
}

/**
 * @dev Liquidate
 * @param x : Parameters of type BandParam
 * @returns ContractResponse
 */
export async function liquidate(
  x: LiquidateParam
) 
  : Promise<{liq: FactoryTxReturn, balB4Liq: bigint}>
{
  const factoryAddr = formatAddr(await x.factory.getAddress());
  const signer = x.signers[0];
  await transferAsset({
    amount: x.debt!,
    asset: x.asset,
    recipients: [formatAddr(signer.address)],
    sender: x.deployer
  });
  const balB4Liq = await x.asset.balanceOf(signer.address);
  console.log(`x.debt: ${x.debt}\nbaa: ${balB4Liq}`);
  await approve({
    owner: signer,
    amount: x.debt!,
    spender: factoryAddr,
    testAsset: x.asset
  });
  await x.factory.connect(signer).liquidate(x.epochId);
  const balances = await x.factory.getBalances(x.epochId);
  const pool = await x.factory.getPoolData(x.epochId);
  const profile = await x.factory.getProfile(x.epochId, signer.address);
  return {
    liq: {
      pool,
      balances,
      profile,
      epochId: x.epochId
    },
    balB4Liq
  }
}

/**
 * @dev Check whether there is a defaulter at a specified `epoch`
 * @param x : Parameters of type BandParam
 * @returns ContractResponse
 */
export async function enquireLiquidation(
  x: BandParam
) 
  : Promise<[Common.ContributorStructOutput, boolean, bigint]> 
{
  return await x.factory.enquireLiquidation(x.epochId);
}

/**
 * @dev Support new asset
 * @param assetMgr : Asset contract
 * @param token : Any ERC20 compatible contract
 * @returns ContractResponse
 */

export const setSupportedToken = async(assetMgr: AssetManagerContract, asset: Address) => {
  assetMgr.supportAsset(asset);
}

/**
 * @dev Send CTRIB tokens to the accounts provided as signers in `x`.
 * 
 * @param x : Parameters of type FundAccountParam
 * @returns : Promise<{amtSentToEachAccount: Hex, amtSentToAlc1: Hex}>
 */
export async function transferAsset(x: FundAccountParam) : Null {
  // x.recipients.forEach(async(addr) => {
  //   x.asset.connect(x.sender).transfer(formatAddr(addr), x.amount);
  //   const BalSent = await x.asset.balanceOf(addr);
  //   console.log(`BalSent: ${BalSent}`);
  // })

  for(let i = 0; i < x.recipients.length; i++) {
    x.asset.connect(x.sender).transfer(formatAddr(x.recipients[i]), x.amount);
    // const BalSent = await x.asset.balanceOf(x.recipients[i]);
    // console.log(`BalSent: ${BalSent}`);
  }
  for(let i = 0; i < x.recipients.length; i++) {
    const BalSent = await x.asset.balanceOf(x.recipients[i]);
    console.log(`BalSent: ${BalSent}`);
  }

  
}

/**
 * @dev Claim CTRIB tokens as loan after getFinance successful.
 * 
 * @param x : Parameters 
 * @returns : Promise<{amtSentToEachAccount: Hex, amtSentToAlc1: Hex}>
 */
export async function withdraw(
  x: 
  {
    owner: Address,
    asset: TestAssetContract,
    factory: FactoryContract,
    spender: Signer,
    epochId: bigint,
    value: bigint
  }
) : Promise<{balancesInStrategy: Common.BalancesStructOutput, signerBalB4: bigint, signerBalAfter: bigint}>
{
  const { asset, owner, factory, spender, epochId, value } = x;
  const signerBalB4 = await asset.balanceOf(spender.address);
  await asset.connect(spender).transferFrom(owner, spender.address, value);
  const balancesInStrategy = await factory.getBalances(epochId);
  const signerBalAfter = await asset.balanceOf(spender.address);
  return { balancesInStrategy, signerBalAfter, signerBalB4 };
}

export async function removeLiquidityPool(x: RemoveLiquidityParam) {
  await x.factory.connect(x.signer).removeLiquidityPool(x.epochId);
  return await x.factory.getPoolData(x.epochId);
}

export function getAddressFromSigners(signers: Signer[]) {
  let addrs : Addresses = [];
  for(let i = 0; i < signers.length; i++) {
    addrs.push(formatAddr(signers[i].address));
  }
  return addrs;
}

/**
 * @dev Join a band
 * @param x : Parameters of type JoinABandParam
 * @returns void
*/
export async function joinEpoch(
  x: JoinABandParam
) 
  : Promise<{
    pool: Common.PoolStructOutput;
    balances: Common.BalancesStructOutput;
    profile: Common.ContributorDataStructOutput;
  }>
{
  const testAssetAddr = formatAddr(await x.testAsset.getAddress());
  const factoryAddr = await x.factory.getAddress();
  await transferAsset({
    amount: x.contribution,
    asset: x.testAsset,
    recipients: getAddressFromSigners(x.signers),
    sender: x.deployer,
    testAssetAddr
  });
  for(let i= 0; i < x.signers.length; i++) {
    const signer = x.signers[i];
    await approve({
      amount: x.contribution,
      owner: signer,
      spender: x.factoryAddr,
      testAsset: x.testAsset
    });
    await x.factory.connect(x.signers[i]).joinAPool(x.epochId);
  }

  const balances = await x.factory.getBalances(x.epochId);
  const pool = await x.factory.getPoolData(x.epochId);
  const profile = await x.factory.getProfile(x.epochId, factoryAddr);
  return {
    pool,
    balances,
    profile
  }
}

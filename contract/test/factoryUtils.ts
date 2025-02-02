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

import { bn, formatAddr, Status, ZERO, } from "./utilities";
import { C3 } from "../typechain-types/contracts/apis/IFactory";

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
  const unitId = await x.factory.getEpoches();
  const balances = await x.factory.getBalances(x.unitLiquidity);
  const pool = await x.factory.getPoolData(unitId);
  const profile = await x.factory.getProfile(x.unitLiquidity, x.signer.address);
  const slot = await x.factory.getSlot(x.signer.address, x.unitLiquidity);
  return { pool, balances, profile, slot};
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
  const unitId = await x.factory.getEpoches();
  const balances = await x.factory.getBalances(x.unitLiquidity);
  const pool = await x.factory.getPoolData(unitId);
  const profile = await x.factory.getProfile(x.unitLiquidity, x.signer.address);
  const slot = await x.factory.getSlot(x.signer.address, x.unitLiquidity);

  return { pool, balances, profile, slot };
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
  // const getCol = await x.factory.getCollaterlQuote(x.unit);
  // console.log("GetQuote", getCol);
  const signer = x.signers[0];
  await x.factory.connect(signer).getFinance(
    x.unit,
    x.hrsOfUse_choice!,
    {value: x.colQuote}
  );
  const unitId = await x.factory.getEpoches();
  const balances = await x.factory.getBalances(x.unit);
  const pool = await x.factory.getPoolData(unitId);
  const profile = await x.factory.getProfile(x.unit, signer.address);
  const slot = await x.factory.getSlot(signer.address, x.unit);

  return { balances, pool, profile, slot };
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
    pool: C3.ReadDataReturnValueStructOutput;
    balances: C3.BalancesStructOutput | undefined;
    profile: C3.ContributorStructOutput;
 }>
{
  const factoryAddr = formatAddr(await x.factory.getAddress());
  const signer = x.signers[0];
  await x.factory.getCurrentDebt(x.unit, signer.address);
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
  // console.log("Allowance", await x.asset.allowance(signer.address, factoryAddr));
  const unitId = await x.factory.getEpoches();
  await x.factory.connect(signer).payback(x.unit);
  let balances : C3.BalancesStructOutput | undefined = undefined;
  const status = await x.factory.getStatus(x.unit);
  if(status === 'TAKEN'){
    balances = await x.factory.getBalances(x.unit);
  }
  const pool = await x.factory.getPoolData(unitId);
  const profile = await x.factory.getProfile(x.unit, signer.address);
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
  // console.log(`x.debt: ${x.debt}\nbaa: ${balB4Liq}`);
  await approve({
    owner: signer,
    amount: x.debt!,
    spender: factoryAddr,
    testAsset: x.asset
  });
  const unitId = await x.factory.getEpoches();
  await x.factory.connect(signer).liquidate(x.unit);
  let balances : C3.BalancesStructOutput | undefined = undefined;
  const status = await x.factory.getStatus(x.unit);
  if(status === 'TAKEN'){
    balances = await x.factory.getBalances(x.unit);
  }
  const pool = await x.factory.getPoolData(unitId);
  const profile = await x.factory.getProfile(x.unit, signer.address);
  const slot = await x.factory.getSlot(signer.address, x.unit);

  return {
    liq: {
      pool,
      balances,
      profile,
      slot
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
  : Promise<[C3.ContributorStructOutput, boolean, bigint, C3.SlotStructOutput, string]> 
{
  return await x.factory.enquireLiquidation(x.unit);
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
    // console.log(`BalSent: ${BalSent}`);
  }

  
}

/**
 * @dev Withdraws loan after getFinance successful.
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
    unit: bigint
  }
) : Promise<{balancesInStrategy?: C3.BalancesStructOutput, signerBalB4: bigint, signerBalAfter: bigint}>
{
  const { asset, owner, factory, spender, unit} = x;
  const allowance = await asset.allowance(owner, spender);
  // expect(bn(allowance).gt(0)).to.be.true;
  // console.log("Allowance: ", allowance.toString());
  const signerBalB4 = await asset.balanceOf(spender.address);
  await asset.connect(spender).transferFrom(owner, spender.address, allowance);
  let balancesInStrategy : C3.BalancesStructOutput | undefined = undefined;
  const status = await x.factory.getStatus(unit);
  if(status === 'TAKEN'){
    balancesInStrategy = await x.factory.getBalances(x.unit);
  }
  const signerBalAfter = await asset.balanceOf(spender.address);
  return { balancesInStrategy, signerBalAfter, signerBalB4 };
}

export async function removeLiquidityPool(
  x: RemoveLiquidityParam
) {
  await x.factory.connect(x.signer).removeLiquidityPool(x.unit);
  // const unitId = await x.factory.getEpoches();
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
    pool: C3.ReadDataReturnValueStructOutput;
    balances: C3.BalancesStructOutput;
    profiles: C3.ContributorStructOutput[];
  }>
{
  const testAssetAddr = formatAddr(await x.testAsset.getAddress());
  // const factoryAddr = await x.factory.getAddress();
  await transferAsset({
    amount: x.contribution,
    asset: x.testAsset,
    recipients: getAddressFromSigners(x.signers),
    sender: x.deployer,
    testAssetAddr
  });
  let profiles : C3.ContributorStructOutput[] = [];
  for(let i= 0; i < x.signers.length; i++) {
    const signer = x.signers[i];
    await approve({
      amount: x.contribution,
      owner: signer,
      spender: x.factoryAddr,
      testAsset: x.testAsset
    });
    await x.factory.connect(x.signers[i]).joinAPool(x.unit);
    const profile = await x.factory.getProfile(x.unit, x.signers[i].address);
    profiles.push(profile);
  }
  const unitId = await x.factory.getEpoches();
  const balances = await x.factory.getBalances(x.unit);
  const pool = await x.factory.getPoolData(unitId);
  return {
    pool,
    balances,
    profiles
  }
}

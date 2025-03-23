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
  AssetBaseContract, 
  PaybackParam, 
  RemoveLiquidityParam, 
  GetFinanceParam,
  ViewFactoryData,
  FactoryContract,
  CollateralBaseContract, } from "./types";

import { bn, formatAddr, ZERO, } from "./utilities";
import { Common } from "../typechain-types/contracts/apis/ISimplifi";
import { TestBaseAsset, SimpliToken } from "../typechain-types";

/**
 * @dev Create public pool
 * @param x : Parameters of type PermissionLessBandParam
 * @returns ContractResponse
*/
export async function createPermissionlessPool (
  x: PermissionLessBandParam
) {
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
    x.unitLiquidity,
    x.quorum,
    x.intRate,
    x.durationInHours,
    x.colCoverage,
    x.asset
  );
  const pool = await x.factory.getCurrentPool(x.unitLiquidity);
  const profile = await x.factory.getProfile(x.unitLiquidity, x.signer.address);
  const slot = await x.factory.getSlot(x.signer.address, x.unitLiquidity);
  return { pool, profile, slot};
}

/**
 * @dev Create private pool
 * @param x : Parameters of type PermissionedBandParam
 * @returns ContractResponse
 */
export async function createPermissionedPool(
  x: PermissionedBandParam
) {
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
    x.asset, 
    x.contributors,
    x.unitLiquidity, 
    x.intRate,  
    x.durationInHours, 
    x.colCoverage, 
  );
  let profiles : Common.ContributorStructOutput[] = [];
  let slots : bigint[] = [];
  x.contributors.forEach(async(addr) => {
    const profile = await x.factory.getProfile(x.unitLiquidity, addr);
    const slot = await x.factory.getSlot(addr, x.unitLiquidity);
    slots.push(slot);
    profiles.push(profile);
  });
  const pool = await x.factory.getCurrentPool(x.unitLiquidity);

  return { pool, profiles, slots };
}

/**
 * @dev Get finance
 * @param x : Parameters of type BandParam
 * @returns ContractResponse
 */
export async function getFinance(
  x: GetFinanceParam
){
  // const getCol = await x.factory.getCollaterlQuote(x.unit);
  // console.log("GetQuote", getCol);
  const signer = x.signers[0];
  await x.factory.connect(signer).getFinance(
    x.unit,
    x.hrsOfUse_choice!
  );
  const pool = await x.factory.getCurrentPool(x.unit);
  const profile = await x.factory.getProfile(x.unit, signer.address);
  const slot = await x.factory.getSlot(signer.address, x.unit);

  return { pool, profile, slot };
}

/**
 * @dev Payback
 * @param x : Parameters of type BandParam
 * @returns ContractResponse
 */
export async function payback(x: PaybackParam){
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
  await x.factory.connect(signer).payback(x.unit);
  const pool = await x.factory.getCurrentPool(x.unit);
  const profile = await x.factory.getProfile(x.unit, signer.address);
  return { pool, profile }
}

export async function approve(
  {owner, spender, amount, testAsset} 
    : 
      {owner: Signer, spender: Address, testAsset: TestBaseAsset, amount: bigint}) 
{
  await testAsset.connect(owner).approve(spender, amount);
}

export async function getBalance({target, testAsset, collateralAsset} : {target: Address, testAsset: TestBaseAsset, collateralAsset: SimpliToken})
{
  const assetBaseBalance = await testAsset.balanceOf(target);
  const collateralBalance = await collateralAsset.balanceOf(target);
  return { assetBaseBalance, collateralBalance };
}

/**
 * @dev Liquidate
 * @param x : Parameters of type BandParam
 * @returns ContractResponse
 */
export async function liquidate(
  x: LiquidateParam
) {
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
  await x.factory.connect(signer).liquidate(x.unit);
  const pool = await x.factory.getCurrentPool(x.unit);
  const profile = await x.factory.getProfile(x.unit, signer.address);
  const slot = await x.factory.getSlot(signer.address, x.unit);

  return {
    liq: {
      pool,
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
export async function enquireLiquidation(x: BandParam) {
  return await x.factory.enquireLiquidation(x.unit);
}

/**
 * @dev Support new asset
 * @param assetMgr : Asset contract
 * @param token : Any ERC20 compatible contract
 * @returns ContractResponse
 */

export const setSupportedToken = async(factory: FactoryContract, asset: Address) => {
  factory.supportAsset(asset);
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
    assetBase: TestBaseAsset,
    collateral: SimpliToken,
    spender: Signer
  }
) {
  const { assetBase, owner, spender, collateral} = x;
  const assetBaseAllowance = await assetBase.allowance(owner, spender);
  const collateralAllowance = await collateral.allowance(owner, spender);
  const assetBaseBalB4 = await assetBase.balanceOf(spender.address);
  const collateralBalB4 = await collateral.balanceOf(spender.address);
  if(assetBaseAllowance !== ZERO) await assetBase.connect(spender).transferFrom(owner, spender.address, assetBaseAllowance);
  if(collateralAllowance !== ZERO) await collateral.connect(spender).transferFrom(owner, spender.address, collateralAllowance);
  const assetBaseBalAfter = await assetBase.balanceOf(spender.address);
  const collateralBalAfter = await collateral.balanceOf(spender.address);
  return { assetBaseBalB4, collateralBalB4, assetBaseBalAfter, collateralBalAfter };
}

export async function removeLiquidityPool(x: RemoveLiquidityParam) {
  await x.factory.connect(x.signer).removeLiquidity(x.unit);
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
export async function joinEpoch(x: JoinABandParam) {
  const testAssetAddr = formatAddr(await x.testAsset.getAddress());
  // const factoryAddr = await x.factory.getAddress();
  await transferAsset({
    amount: x.contribution,
    asset: x.testAsset,
    recipients: getAddressFromSigners(x.signers),
    sender: x.deployer,
    testAssetAddr
  });
  let profiles : Common.ContributorStructOutput[] = [];
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
  const pool = await x.factory.getCurrentPool(x.unit);
  return { pool, profiles }
}

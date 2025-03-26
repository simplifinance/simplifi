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
    TestBaseAssetContract, 
    AssetManagerContract, 
    PaybackParam, 
    RemoveLiquidityParam, 
    GetFinanceParam,
    FactoryTxReturn,
    FactoryContract,
    Balances,
    SimpliTokenContract, } from "./types";
  
  import { bn, formatAddr } from "./utilities";
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
    const unitId = await x.factory.getEpoches();
    const pool = await x.factory.getPoolData(unitId);
    const base = await x.asset.balanceOf(pool.pool.addrs.bank);
    const collateral = await x.collateralToken.balanceOf(pool.pool.addrs.bank);
    const balances : Balances = { base, collateral };
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
    // console.log("UnitId", unitId);
    const pool = await x.factory.getPoolData(unitId);
    // console.log("pool", pool);
    const base = await x.asset.balanceOf(pool.pool.addrs.bank);
    const collateral = await x.collateralToken.balanceOf(pool.pool.addrs.bank);
    const balances : Balances = { base, collateral };
    const profile = await x.factory.getProfile(x.unitLiquidity, x.signer.address);
    const slot = await x.factory.getSlot(x.signer.address, x.unitLiquidity);
  
    return { pool, balances, profile, slot };
  }
  
  /**
   * @dev Get finance
   * @param x : Parameters of type BandParam
   * @returns ContractResponse
   */
  export async function getFinance(x: GetFinanceParam)
   : Promise<FactoryTxReturn>
  {
    // const getCol = await x.factory.getCollaterlQuote(x.unit); 1500000000000000000
    // console.log("GetQuote", getCol);x.colQuote 1500000000000000000
    const signer = x.signers[0];
    const spender = await x.factory.getAddress() as Address;
    // console.log(",x.colQuote:", x.colQuote);
    // console.log("Bal of deployer", await x.collateral.balanceOf(x.deployer.address));
    await transferAsset({
      amount: x.colQuote * 2n,
      asset: x.collateral,
      recipients: [signer.address] as Address[],
      sender: x.deployer
    });
    // console.log("Bal of signer", await x.collateral.balanceOf(signer.address));
    await approve({
      owner: signer,
      amount: x.colQuote,
      spender,
      testAsset: x.collateral
    });
    // console.log("Ballll", await x.collateral.allowance(signer.address, spender));
    await x.factory.connect(signer).getFinance(x.unit, x.hrsOfUse_choice!);
    const unitId = await x.factory.getEpoches();
    const pool = await x.factory.getPoolData(unitId);
    const base = await x.asset.balanceOf(pool.pool.addrs.bank);
    const collateral = await x.collateral.balanceOf(pool.pool.addrs.bank);
    const balances : Balances = { base, collateral };
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
      pool: Common.ReadDataReturnValueStructOutput;
      balances: Balances;
      profile: Common.ContributorStructOutput;
   }>
  {
    const factoryAddr = formatAddr(await x.factory.getAddress());
    const signer = x.signers[0];
    await x.factory.getCurrentDebt(x.unit, signer.address);
    const bal = await x.asset.balanceOf(signer.address);
    if(bn(x.debt).gt(bn(bal))){
      await transferAsset({
        amount: x.debt! - bal,
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
    const pool = await x.factory.getPoolData(unitId);
    const base = await x.asset.balanceOf(pool.pool.addrs.bank);
    const collateral = await x.collateral.balanceOf(pool.pool.addrs.bank);
    const balances : Balances = { base, collateral };
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
        {owner: Signer, spender: Address, testAsset: TestBaseAssetContract | SimpliTokenContract, amount: bigint, }) 
  {
    await testAsset.connect(owner).approve(spender, amount);
  }
  
  /**
   * @dev Liquidate
   * @param x : Parameters of type BandParam
   * @returns ContractResponse
   */
  export async function liquidate(x: LiquidateParam)  {
    const factoryAddr = formatAddr(await x.factory.getAddress());
    const signer = x.signers[0];
    let baseBalB4Liq : bigint = 0n;
    // console.log(`Bal b4 trf: `, await x.asset.balanceOf(signer.address));
    await transferAsset({
      amount: x.debt!,
      asset: x.asset,
      recipients: [formatAddr(signer.address)],
      sender: x.deployer
    }).then(async() => baseBalB4Liq = await x.asset.balanceOf(signer.address));
    // console.log(`Bal After trf: `, await x.asset.balanceOf(signer.address));
    const colBalB4Liq = await x.collateral.balanceOf(signer.address);
    await approve({
      owner: signer,
      amount: x.debt!,
      spender: factoryAddr,
      testAsset: x.asset
    });
    const unitId = await x.factory.getEpoches();
    // console.log(`baseBalB4Liq: `, baseBalB4Liq);
    await x.factory.connect(signer).liquidate(x.unit);
    // console.log(`Bal Af Liq: `, await x.asset.balanceOf(signer.address))
    const pool = await x.factory.getPoolData(unitId);
    const base = await x.asset.balanceOf(pool.pool.addrs.bank);
    const collateral = await x.collateral.balanceOf(pool.pool.addrs.bank);
    const balances : Balances = { base, collateral };
    const profile = await x.factory.getProfile(x.unit, signer.address);
    const slot = await x.factory.getSlot(signer.address, x.unit);
    const baseBalAfterLiq = await x.asset.balanceOf(signer.address);
    const colBalAfterLiq = await x.collateral.balanceOf(signer.address);
  
    return {
      liq: {
        pool,
        balances,
        profile,
        slot
      },
      baseBalB4Liq,
      baseBalAfterLiq,
      colBalAfterLiq,
      colBalB4Liq
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
    : Promise<[Common.ContributorStructOutput, boolean, bigint, Common.SlotStructOutput, string]> 
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
   * @dev Send Collateral or base tokens to the accounts provided as signers in `x`.
   * 
   * @param x : Parameters of type FundAccountParam
   * @returns : Promise<{amtSentToEachAccount: Hex, amtSentToAlc1: Hex}>
   */
  export async function transferAsset(x: FundAccountParam) : Null {
    for(let i = 0; i < x.recipients.length; i++) {
      x.asset.connect(x.sender).transfer(formatAddr(x.recipients[i]), x.amount);
      // console.log("transferAsset", await x.asset.balanceOf(x.recipients[i]));
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
      asset: TestBaseAssetContract,
      factory: FactoryContract,
      spender: Signer,
      collateral: SimpliTokenContract
    }
  ){
    const { asset, owner, collateral: collateralToken, factory, spender} = x;
    const baseBalB4 = await asset.balanceOf(spender);
    const colBalB4 = await collateralToken.balanceOf(spender);
    const baseAllowance = await asset.allowance(owner, spender);
    if(baseAllowance > 0)  await asset.connect(spender).transferFrom(owner, spender.address, baseAllowance);
    const collateralAllowance = await collateralToken.allowance(owner, spender);
    if(collateralAllowance > 0)  await collateralToken.connect(spender).transferFrom(owner, spender.address, collateralAllowance);
    const baseBalAfter = await asset.balanceOf(spender);
    const colBalAfter = await collateralToken.balanceOf(spender);

    const unitId = await factory.getEpoches();
    const pool = await factory.getPoolData(unitId);
    const base = await asset.balanceOf(pool.pool.addrs.bank);
    const collateral = await collateralToken.balanceOf(pool.pool.addrs.bank);
    const balances : Balances = { base, collateral };
    return { balances, baseBalB4, colBalB4, colBalAfter, baseBalAfter };
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
      pool: Common.ReadDataReturnValueStructOutput;
      balances: Balances;
      profiles: Common.ContributorStructOutput[];
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
    const unitId = await x.factory.getEpoches();
    const pool = await x.factory.getPoolData(unitId);
    
    
    const base = await x.testAsset.balanceOf(pool.pool.addrs.bank);
    const collateral = await x.collateral.balanceOf(pool.pool.addrs.bank);
    const balances : Balances = { base, collateral };
    ;
    return {
      pool,
      balances,
      profiles
    }
  }
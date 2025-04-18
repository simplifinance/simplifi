// import { Contract, ContractTransactionResponse } from "ethers";
import { expect } from "chai";
import { Common } from "../typechain-types/contracts/implementation/celo/FlexpoolFactory";
import type { 
    Address, 
    BandParam, 
    JoinABandParam, 
    LiquidateParam, 
    Null, 
    PermissionedBandParam, 
    PermissionLessBandParam, 
    Signer, 
    BaseAsset, 
    SupportedAssetManager, 
    PaybackParam, 
    RemoveLiquidityParam, 
    GetFinanceParam,
    FactoryTxReturn,
    FlexpoolFactory,
    Balances,
    SimpliToken,
    TransferParam,
    TokenDistributor, } from "./types";
  
  import { bn, formatAddr, TrxnType } from "./utilities";
  
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
    const signerAddr = await x.signer.getAddress() as Address;
    const users : Address[] = [];
    users.push(signerAddr);
    const isPermissionless = true;
    await transferAsset({
      amount: x.unitLiquidity,
      asset: x.asset,
      recipients: [signerAddr],
      sender: x.deployer
    });
  
    await approve({
      owner: x.signer,
      amount: x.unitLiquidity,
      spender: factoryAddr,
      testAsset: x.asset
    }) 
    await x.factory.connect(x.signer).createPool( users, x.unitLiquidity, x.quorum, x.durationInHours, x.colCoverage, isPermissionless, x.collateralToken);
    const pool = await x.factory.getPoolData(x.unitLiquidity);
    const base = await x.asset.balanceOf(pool.pool.addrs.safe);
    const collateral = await x.collateralToken.balanceOf(pool.pool.addrs.safe);
    const balances : Balances = { base, collateral };
    const profile = (await x.factory.getProfile(x.unitLiquidity, signerAddr)).profile;
    const slot = await x.factory.getSlot(signerAddr, x.unitLiquidity);
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
    const signerAddr = await x.signer.getAddress();
    const recipients = await getAddressFromSigners(x.contributors);
    const isPermissionless = false;
    await transferAsset({
      amount: x.unitLiquidity,
      asset: x.asset,
      recipients: recipients,
      sender: x.deployer
    });
    
    await approve({
      owner: x.signer,
      amount: x.unitLiquidity,
      spender: factoryAddr,
      testAsset: x.asset
    }) 
    await x.factory.connect(x.signer).createPool(
      x.contributors,
      x.unitLiquidity, 
      x.contributors.length,
      x.durationInHours, 
      x.colCoverage, 
      isPermissionless,
      x.collateralToken
    );
    // const unitId = await x.factory.getEpoches();
    const pool = await x.factory.getPoolData(x.unitLiquidity);
    const base = await x.asset.balanceOf(pool.pool.addrs.safe);
    const collateral = await x.collateralToken.balanceOf(pool.pool.addrs.safe);
    const balances : Balances = { base, collateral };
    const profile = (await x.factory.getProfile(x.unitLiquidity, signerAddr)).profile;
    const slot = await x.factory.getSlot(signerAddr, x.unitLiquidity);
  
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
    const signer = x.signers[0];
    const signerAddr = await signer.getAddress();
    const recipients = await getAddressFromSigners([signer]);
    const spender = await x.factory.getAddress() as Address;
    await transferAsset({
      amount: x.colQuote * 2n,
      asset: x.collateral,
      recipients: recipients,
      sender: x.deployer
    });

    await approve({
      owner: signer,
      amount: x.colQuote,
      spender,
      testAsset: x.collateral
    });
    await x.factory.connect(signer).getFinance(x.unit);
    // const unitId = await x.factory.getEpoches();
    const pool = await x.factory.getPoolData(x.unit);
    const base = await x.asset.balanceOf(pool.pool.addrs.safe);
    const collateral = await x.collateral.balanceOf(pool.pool.addrs.safe);
    const balances : Balances = { base, collateral };
    const profile = (await x.factory.getProfile(x.unit, signerAddr)).profile;
    const slot = await x.factory.getSlot(signerAddr, x.unit);
  
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
    const signerAddr = await signer.getAddress();
    const recipients = await getAddressFromSigners([signer]);
    await x.factory.getCurrentDebt(x.unit);
    const bal = await x.asset.balanceOf(signerAddr);
    if(bn(x.debt).gt(bn(bal))){
      await transferAsset({
        amount: x.debt! - bal,
        asset: x.asset,
        recipients: recipients,
        sender: x.deployer
      });
    }
    await approve({
      owner: signer,
      amount: x.debt!,
      spender: factoryAddr,
      testAsset: x.asset
    });
    // const unitId = await x.factory.getEpoches();
    await x.factory.connect(signer).payback(x.unit);
    const pool = await x.factory.getPoolData(x.unit);
    const base = await x.asset.balanceOf(pool.pool.addrs.safe);
    const collateral = await x.collateral.balanceOf(pool.pool.addrs.safe);
    const balances : Balances = { base, collateral };
    const profile = (await x.factory.getProfile(x.unit, signerAddr)).profile;
    return {
      pool,
      balances,
      profile
    }
  }
  
  export async function approve(
    {owner, spender, amount, testAsset} 
      : 
        {owner: Signer, spender: Address, testAsset: BaseAsset | SimpliToken, amount: bigint, }) 
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
    const recipients = await getAddressFromSigners([signer]);
    const signerAddr = await signer.getAddress();
    let baseBalB4Liq : bigint = 0n;

    await transferAsset({
      amount: x.debt!,
      asset: x.asset,
      recipients: recipients,
      sender: x.deployer
    }).then(async() => baseBalB4Liq = await x.asset.balanceOf(signerAddr));
    const colBalB4Liq = await x.collateral.balanceOf(signerAddr);
    await approve({
      owner: signer,
      amount: x.debt!,
      spender: factoryAddr,
      testAsset: x.asset
    });
    await x.factory.connect(signer).liquidate(x.unit);
    const pool = await x.factory.getPoolData(x.unit);
    const base = await x.asset.balanceOf(pool.pool.addrs.safe);
    const collateral = await x.collateral.balanceOf(pool.pool.addrs.safe);
    const balances : Balances = { base, collateral };
    const profile = (await x.factory.getProfile(x.unit, signerAddr)).profile;
    const slot = await x.factory.getSlot(signerAddr, x.unit);
    const baseBalAfterLiq = await x.asset.balanceOf(signerAddr);
    const colBalAfterLiq = await x.collateral.balanceOf(signerAddr);
  
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
    : Promise<[Common.ContributorStructOutput, boolean, Common.SlotStructOutput]> 
  {
    return await x.factory.enquireLiquidation(x.unit);
  }
  
  /**
   * @dev Support new asset
   * @param assetMgr : Asset contract
   * @param token : Any ERC20 compatible contract
   * @returns ContractResponse
   */
  
  export const setSupportedToken = async(assetMgr: SupportedAssetManager, asset: Address) => {
    assetMgr.supportAsset(asset);
  }
  
  /**
   * @dev Send Collateral or base tokens to the accounts provided as signers in `x`.
   * 
   * @param x : Parameters of type FundAccountParam
   * @returns : Promise<{amtSentToEachAccount: Hex, amtSentToAlc1: Hex}>
   */
  export async function transferAsset(x: TransferParam) : Null {
    for(let i = 0; i < x.recipients.length; i++) {
      x.asset.connect(x.sender).transfer(formatAddr(x.recipients[i]), x.amount);
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
      asset: BaseAsset,
      factory: FlexpoolFactory,
      spender: Signer,
      collateral: SimpliToken,
      unit: bigint
    }
  ){
    const { asset, owner, collateral: collateralToken, unit, factory, spender} = x;
    const spenderAddr = await spender.getAddress();
    const baseBalB4 = await asset.balanceOf(spender);
    const colBalB4 = await collateralToken.balanceOf(spender);
    const baseAllowance = await asset.allowance(owner, spender);
    if(baseAllowance > 0)  await asset.connect(spender).transferFrom(owner, spenderAddr, baseAllowance);
    const collateralAllowance = await collateralToken.allowance(owner, spender);
    if(collateralAllowance > 0)  await collateralToken.connect(spender).transferFrom(owner, spenderAddr, collateralAllowance);
    const baseBalAfter = await asset.balanceOf(spender);
    const colBalAfter = await collateralToken.balanceOf(spender);

    const pool = await factory.getPoolData(unit);
    const base = await asset.balanceOf(pool.pool.addrs.safe);
    const collateral = await collateralToken.balanceOf(pool.pool.addrs.safe);
    const balances : Balances = { base, collateral };
    return { balances, baseBalB4, colBalB4, colBalAfter, baseBalAfter };
  }
  
  /**
   * @dev Remove a pool
   * @param x : Remove liquidity parameter.
  */
  export async function removeLiquidityPool(
    x: RemoveLiquidityParam
  ) {
    await x.factory.connect(x.signer).closePool(x.unit);
  }
  
  export async function getAddressFromSigners(signers: Signer[]) {
    let addrs : Address[] = [];
    for(let i = 0; i < signers.length; i++) {
      const addr = await signers[i].getAddress() as Address;
      addrs.push(addr);
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
    // const testAssetAddr = formatAddr(await x.testAsset.getAddress());
    const recipients = await getAddressFromSigners(x.signers);
    await transferAsset({
      amount: x.contribution,
      asset: x.testAsset,
      recipients: recipients,
      sender: x.deployer
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
      await x.factory.connect(signer).contribute(x.unit);
      const signerAddr = await signer.getAddress();
      const profile = (await x.factory.getProfile(x.unit, signerAddr)).profile;
      profiles.push(profile);
    }
    const pool = await x.factory.getPoolData(x.unit);
    const base = await x.testAsset.balanceOf(pool.pool.addrs.safe);
    const collateral = await x.collateral.balanceOf(pool.pool.addrs.safe);
    const balances : Balances = { base, collateral };

    return {
      pool,
      balances,
      profiles
    }
  }

  // Propose a new transaction
export async function proposeTransaction (
  {signer, contract, recipient, amount, delayInHrs, trxType} 
  : 
  {contract: TokenDistributor, signer: Signer, recipient: Address, amount: bigint, delayInHrs: number, trxType: TrxnType}
)
{
  await contract.connect(signer).proposeTransaction(recipient, amount, delayInHrs, trxType);
  const reqId = await contract.requestIDs();
  const request = await contract.getTransactionRequest(reqId);
  expect(reqId).to.be.eq(request.id);
  return request;
}

// Sign transaction
export async function signTransaction (
  {signer, contract, requestId} 
    : 
    {contract: TokenDistributor, signer: Signer, requestId: bigint}
)
{
    await contract.connect(signer).signTransaction(requestId);
    const request = await contract.getTransactionRequest(requestId);
    return request;
}

/**
 * Execute pending transactions
 */
export async function executeTransaction(
  { contract, signer, reqId } 
    : 
  {contract: TokenDistributor, signer: Signer, reqId: bigint}) 
{
  // Execute transaction
  await contract.connect(signer).executeTransaction(reqId);
  const request = await contract.getTransactionRequest(reqId);
  return request; 
}


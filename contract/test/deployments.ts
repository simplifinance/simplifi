import { ethers } from "hardhat";
import type {
   Address, 
   AssetManagerContract, 
   FactoryContract, 
   OwnershipManagerContract, 
   Signer, 
   Signers,
   StrategyManagerContract,
   TestAssetContract
   } from "./types";
import { CREATION_FEE, FEETO, formatAddr, MAKER_RATE, MINIMUM_LIQUIDITY, QUORUM,} from "./utilities";
import { expect } from "chai";

/**
 * Deploys and return an instance of the Reserve contract
 * @param deployer : Deployer address
 * @returns : Contract instance
 */
export async function deployOwnershipManager(deployer: Signer) : Promise<OwnershipManagerContract> {
  const OwnershipManager = await ethers.getContractFactory("OwnerShip");
  return (await OwnershipManager.connect(deployer).deploy()).waitForDeployment();
}

/**
 * Deploys and return an instance of the StrategyAdmin contract.
 * @param deployer : Deployer address
 * @returns Contract instance
 */
export async function deployStrategyManager(ownershipManager: Address, deployer: Signer) : Promise<StrategyManagerContract> {
  const StrategyAdmin = await ethers.getContractFactory("StrategyManager");
  return (await StrategyAdmin.connect(deployer).deploy(ownershipManager)).waitForDeployment();
}

/**
 * Deploys and return an instance of the Asset contract
 * @param deployer : Deployer address
 * @returns Contract instance
 */
export async function deployAssetClass(testAddr: Address, ownershipManager: Address, deployer: Signer) :Promise< AssetManagerContract> {
  const AssetMgr = await ethers.getContractFactory("AssetClass");
  return (await AssetMgr.connect(deployer).deploy(testAddr, ownershipManager)).waitForDeployment();
}

/**
 * Deploys and return an address instance of the AcountStrategy
 * @param deployer : Deployer address
 * @returns Contract address
 */
export async function deployStrategy(ownershipManager: Address, deployer: Signer) {
  const SmartStrategy = await ethers.getContractFactory("Strategy");
  return await (await (await SmartStrategy.connect(deployer).deploy(ownershipManager)).waitForDeployment()).getAddress();
}

/**
 * Deploys and return an address instance of the AcountStrategy
 * @param deployer : Deployer address
 * @returns Contract address
 */
export async function deployTestAsset(deployer: Signer): Promise<TestAssetContract> {
  const testAsset = await ethers.getContractFactory("TestAsset");
  return (await testAsset.connect(deployer).deploy()).waitForDeployment();
}

/**
 * @returns : Library address : Type - Address
 */
export async function deployLibrary(): Promise<Address> {
  const RouterLib = await ethers.getContractFactory("FactoryLib");
  return formatAddr(await (await (await RouterLib.deploy()).waitForDeployment()).getAddress());
}

/**
 * Deploy public router
 *
 * @param deployer : Deployer.
 * @param token : JFT Token contract.
 * @param assetMgr : Asset contract.
 * @param strategyMgr : Strategy admin contract.
 * @returns Contract instance.
 */
export async function deployFactory(assetMgr: Address, strategyMgr: Address, library: Address, ownershipMgr: Address, deployer: Signer) : Promise<FactoryContract> {
  const Factory = await ethers.getContractFactory("Factory", {
    // libraries: {
    //   factoryLib: library
    // }
  });
  return (await Factory.connect(deployer).deploy(
    MAKER_RATE, 
    MINIMUM_LIQUIDITY, 
    CREATION_FEE, 
    FEETO, 
    assetMgr, 
    strategyMgr, 
    ownershipMgr
  )).waitForDeployment();
}

export async function deployContracts(getSigners_: () => Signers) {
  const [deployer, alc1, alc2, alc3, routeTo, feeTo, signer1, signer2, signer3, devAddr ] = await getSigners_();
  const libAddr = await deployLibrary();
  const ownershipMgr = await deployOwnershipManager(deployer);
  const ownershipMgrAddr = await ownershipMgr.getAddress();

  const tAsset = await deployTestAsset(deployer);
  const testAssetAddr = await tAsset.getAddress();

  const assetMgr = await deployAssetClass(formatAddr(testAssetAddr), formatAddr(ownershipMgrAddr), deployer);
  const assetMgrAddr = await assetMgr.getAddress();

  // const strategy = await deployStrategy(formatAddr(ownershipMgrAddr), deployer);
  const strategyMgr = await deployStrategyManager(
    formatAddr(ownershipMgrAddr), 
      // formatAddr(strategy),
      deployer
  );
  const strategyMgrAddr = await strategyMgr.getAddress();

  const factory = await deployFactory(
    formatAddr(assetMgrAddr), 
      formatAddr(strategyMgrAddr), 
        formatAddr(libAddr), 
          formatAddr(ownershipMgrAddr),
          deployer
  );

  const factoryAddr = await factory.getAddress();
  await ownershipMgr.connect(deployer).addNewOwner(factoryAddr);
  await ownershipMgr.connect(deployer).addNewOwner(strategyMgrAddr);
  await assetMgr.connect(deployer).supportAsset(testAssetAddr);
  const isListed = await assetMgr.listed(testAssetAddr);
  expect(isListed).to.be.true;

  return {
    strategyMgr,
    assetMgr,
    testAssetAddr,
    tAsset,
    factory,
    assetMgrAddr,
    factoryAddr,
    strategyMgrAddr,
    signers: { deployer, alc1, alc2, alc3, routeTo, feeTo, signer1, signer2, signer3, devAddr }
  };
}

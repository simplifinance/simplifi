import { ethers } from "hardhat";
import type {
   Address, 
   AssetManagerContract, 
   FactoryContract, 
   OwnershipManagerContract, 
   Signer, 
   Signers,
   BankFactoryContract,
   TestAssetContract
   } from "./types";
import { FEETO, formatAddr, MAKER_RATE, MINIMUM_LIQUIDITY, } from "./utilities";
import { expect } from "chai";
import { abi } from "../artifacts/contracts/implementations/strategies/Bank.sol/Bank.json";
import { zeroAddress } from "viem";

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
 * Deploys and return an instance of the BankFactory contract.
 * @param deployer : Deployer address
 * @returns Contract instance
 */
export async function deployBankFactory(ownershipManager: Address, deployer: Signer) : Promise<BankFactoryContract> {
  const BankFactory = await ethers.getContractFactory("BankFactory");
  return (await BankFactory.connect(deployer).deploy(ownershipManager)).waitForDeployment();
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
 * Deploys and return an address instance of the Bank
 * @param deployer : Deployer address
 * @returns Contract address
 */
export async function deployBank(ownershipManager: Address, deployer: Signer) {
  const SmartBank = await ethers.getContractFactory("Bank");
  return await (await (await SmartBank.connect(deployer).deploy(ownershipManager)).waitForDeployment()).getAddress();
}

/**
 * Deploys and return an address instance of the Bank
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
  const RouterLib = await ethers.getContractFactory("FactoryLibV3");
  return formatAddr(await (await (await RouterLib.deploy()).waitForDeployment()).getAddress());
}

/**
 * Deploy public router
 *
 * @param deployer : Deployer.
 * @param token : JFT Token contract.
 * @param assetMgr : Asset contract.
 * @param bankFactory : Bank admin contract.
 * @returns Contract instance.
 */
export async function deployFactory(assetMgr: Address, bankFactory: Address, library: Address, ownershipMgr: Address, deployer: Signer) : Promise<FactoryContract> {
  const Factory = await ethers.getContractFactory("Factory", {
    // libraries: {
    //   factoryLib: library
    // }
  });
  return (await Factory.connect(deployer).deploy(
    MAKER_RATE, 
    MINIMUM_LIQUIDITY, 
    FEETO, 
    assetMgr, 
    bankFactory, 
    ownershipMgr,
    zeroAddress
  )).waitForDeployment();
}

export async function retrieveContract(bank: Address) {
  return ethers.getContractAt('Bank', bank);
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

  // const strategy = await deployBank(formatAddr(ownershipMgrAddr), deployer);
  const bankFactory = await deployBankFactory(
    formatAddr(ownershipMgrAddr), 
      // formatAddr(strategy),
      deployer
  );
  const bankFactoryAddr = await bankFactory.getAddress();

  const factory = await deployFactory(
    formatAddr(assetMgrAddr), 
      formatAddr(bankFactoryAddr), 
        formatAddr(libAddr), 
          formatAddr(ownershipMgrAddr),
          deployer
  );

  const factoryAddr = await factory.getAddress();
  await ownershipMgr.connect(deployer).setPermission([factoryAddr, bankFactoryAddr]);
  const isSupported = await assetMgr.isSupportedAsset(testAssetAddr);
  const isListed = await assetMgr.listed(testAssetAddr);
  expect(isListed).to.be.true;
  expect(isSupported).to.be.true;

  return {
    bankFactory,
    assetMgr,
    testAssetAddr,
    tAsset,
    factory,
    assetMgrAddr,
    factoryAddr,
    bankFactoryAddr,
    signers: { deployer, alc1, alc2, alc3, routeTo, feeTo, signer1, signer2, signer3, devAddr }
  };
}

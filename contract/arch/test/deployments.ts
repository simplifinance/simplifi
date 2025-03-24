import { ethers } from "hardhat";
import type {
   Address, 
   AssetBaseContract, 
   FactoryContract, 
   OwnershipContract,
   CollateralBaseContract,
   AttorneyContract,
   TokenDistributorContract,
   EscapeContract,
   SafeContract,
   Signer, 
   Signers,
   } from "./types";
import { FEE, formatAddr, MAKER_RATE } from "./utilities";
import { expect } from "chai";
// import { abi } from "../artifacts/contracts/implementations/strategies/Bank.sol/Bank.json";
// import { zeroAddress } from "viem";
// import { IBank, IERC20, IOwnerShip } from "../typechain-types/contracts/apis";
// import { TestBaseAsset } from "../typechain-types";

/**
 * Deploys and return an instance of the Reserve contract
 * @param deployer : Deployer address
 * @returns : Contract instance
 */
async function deployOwnershipManager(deployer: Signer) : Promise<OwnershipContract> {
  const OwnershipManager = await ethers.getContractFactory("OwnerShip");
  return (await OwnershipManager.connect(deployer).deploy()).waitForDeployment();
}

/**
 * Deploys and return an instance of the Escape contract.
 * @param deployer : Deployer address
 * @param ownershipManager : OwnerShip contract
 * @returns Contract instance
 */
async function deployEscape(ownershipManager: Address, deployer: Signer) : Promise<EscapeContract> {
  const BankFactory = await ethers.getContractFactory("Escape");
  return (await BankFactory.connect(deployer).deploy(ownershipManager)).waitForDeployment();
}

/**
 * Deploys and return an instance of the Reserve contract.
 * @param deployer : Deployer address
 * @param ownershipManager : OwnerShip contract
 * @returns Contract instance
 */
async function deployReserve(ownershipManager: Address, deployer: Signer) : Promise<EscapeContract> {
  const BankFactory = await ethers.getContractFactory("Reserve");
  return (await BankFactory.connect(deployer).deploy(ownershipManager)).waitForDeployment();
}

/**
 * Deploys and return an instance of the Attorney contract.
 * @param deployer : Deployer address
 * @param fee : Attorney fee
 * @param feeTo : Fee receiver
 * @param ownershipManager : OwnerShip contract
 * @returns Contract instance
 */
async function deployAttorney(
  deployer: Signer,
  fee: bigint,
  feeTo: Address,
  ownershipManager: Address
) : Promise<AttorneyContract> {
  const BankFactory = await ethers.getContractFactory("Attorney");
  return (await BankFactory.connect(deployer).deploy(fee, feeTo, ownershipManager)).waitForDeployment();
}

/**
 * Deploys and return an instance of the Token Distributor contract.
 * @param deployer : Deployer address
 * @param fee : Attorney fee
 * @param feeTo : Fee receiver
 * @param ownershipManager : OwnerShip contract
 * @returns Contract instance
 */
async function deployTokenDistributor(
  deployer: Signer,
  ownershipManager: Address,
  signers: Address[],
  quorum: number,
) : Promise<TokenDistributorContract> {
  const BankFactory = await ethers.getContractFactory("TokenDistributor");
  return (await BankFactory.connect(deployer).deploy(ownershipManager, signers, quorum)).waitForDeployment();
}

/**
 * Deploys and return an instance of the Asset contract
 * @param deployer : Deployer address
 * @returns Contract instance
*/
async function deployCollateralAsset(
  deployer: Signer,
  attorney: Address,
  reserve: Address,
  tokenDistributor: Address,
  ownershipManager: Address, 
) :Promise<CollateralBaseContract> {
  const AssetMgr = await ethers.getContractFactory("SimpliToken");
  return (await AssetMgr.connect(deployer).deploy(attorney, reserve, tokenDistributor, ownershipManager)).waitForDeployment();
}

// /**
//  * Deploys and return an address instance of the Bank
//  * @param deployer : Deployer address
//  * @returns Contract address
//  */
// async function deploySafe(ownershipManager: Address, deployer: Signer) {
//   const Safe = await ethers.getContractFactory("Bank");
//   return await (await (await Safe.connect(deployer).deploy(ownershipManager)).waitForDeployment()).getAddress();
// }

/**
 * Deploys and return an address instance of the Bank
 * @param deployer : Deployer address
 * @param ownershipManager : Ownership contract
 * @param collateralToken :Simplitoken contract
 * @returns Contract address
 */
async function deployAssetBase(
  deployer: Signer, 
  ownershipManager : Address, 
  collateralToken:  Address
): Promise<AssetBaseContract> {
  const testBaseAsset = await ethers.getContractFactory("TestBaseAsset");
  return (await testBaseAsset.connect(deployer).deploy(ownershipManager, collateralToken)).waitForDeployment();
}

// /**
//  * @returns : Library address : Type - Address
//  */
// export async function deployLibrary(): Promise<Address> {
//   const RouterLib = await ethers.getContractFactory("FactoryLibV3");
//   return formatAddr(await (await (await RouterLib.deploy()).waitForDeployment()).getAddress());
// }

/**
 * Deploy public router
 *
 * @param deployer : Deployer.
 * @param token : JFT Token contract.
 * @param assetMgr : Asset contract.
 * @param bankFactory : Bank admin contract.
 * @returns Contract instance.
 */
async function deployFactory(collateralToken:  Address, supportedAsset:  Address, ownershipMgr:  Address, deployer: Signer, feeTo: Address) : Promise<FactoryContract> {
  const Factory = await ethers.getContractFactory("Simplifi");
  return (await Factory.connect(deployer).deploy(
    collateralToken,
    supportedAsset,
    ownershipMgr,
    feeTo, 
    MAKER_RATE, 
  )).waitForDeployment();
}

/**
 * Retrieves Safe contract from deployed address
 * @param bank : Contract address
 * @returns SafeContract
 */
export async function retrieveSafe(bank: Address) : Promise<SafeContract> {
  return (await ethers.getContractAt('Bank', bank)).waitForDeployment();
}

export async function deployContracts(getSigners_: () => Signers) {
  const [deployer, alc1, alc2, alc3, routeTo, feeTo, signer1, signer2, signer3, devAddr ] = await getSigners_();
  const signers = [deployer.address, devAddr.address, signer3.address] as Address[];
  const QUORUM = 2;
  const ownershipMgr = await deployOwnershipManager(deployer);
  const ownershipMgrAddr = await ownershipMgr.getAddress() as Address;

  const attorney = await deployAttorney(deployer, FEE, feeTo.address as Address, ownershipMgrAddr as Address);
  const attorneyAddr = await attorney.getAddress() as Address;
 
  const reserve = await deployReserve(ownershipMgrAddr, deployer);
  const reserveAddr = await reserve.getAddress() as Address;
  
  const escape = await deployEscape(ownershipMgrAddr, deployer);
  const escapeAddr = await escape.getAddress() as Address;
  
  const distributor = await deployTokenDistributor(deployer, ownershipMgrAddr, signers, QUORUM);
  const distributorAddr = await distributor.getAddress() as Address;
  
  const collateralToken = await deployCollateralAsset(deployer, attorneyAddr, reserveAddr, distributorAddr, ownershipMgrAddr);
  const collateralTokenAddr = await collateralToken.getAddress() as Address;
  
  const assetBase = await deployAssetBase(deployer, ownershipMgrAddr, collateralTokenAddr);
  const assetBaseAddr = await assetBase.getAddress() as Address;

  const factory = await deployFactory(collateralTokenAddr, assetBaseAddr, ownershipMgrAddr,deployer, feeTo.address as Address);
  const factoryAddr = await factory.getAddress();

  await ownershipMgr.connect(deployer).setPermission([factoryAddr, deployer.address, attorneyAddr, reserveAddr, escapeAddr, distributorAddr]);
  const isSupported = await factory.isSupportedAsset(assetBaseAddr);
  expect(isSupported).to.be.true;

  return {
    escapeAddr,
    escape,
    assetBase,
    assetBaseAddr,
    collateralToken,
    collateralTokenAddr,
    factory,
    factoryAddr,
    reserve,
    reserveAddr,
    distributor,
    distributorAddr,
    attorney,
    attorneyAddr,
    ownershipMgr,
    ownershipMgrAddr,
    retrieveSafe,
    approvers: signers,
    feeTo : feeTo.address as Address,
    FEE,
    signers: { deployer, alc1, alc2, alc3, routeTo, feeTo, signer1, signer2, signer3, devAddr }
  };
}

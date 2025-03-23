import { ethers } from "hardhat";
import type {
   Address, 
   AssetManagerContract, 
   FactoryContract, 
   OwnershipManagerContract, 
   Signer, 
   Signers,
   BankFactoryContract,
   TestBaseAssetContract,
   EscapeContract,
   ReserveContract,
   AttorneyContract,
   TokenDistributorContract,
   SimpliTokenContract,
   BankContract
} from "./types";

import { FEE, formatAddr, MAKER_RATE, QUORUM, } from "./utilities";
import { expect } from "chai";
// import { abi } from "../artifacts/contracts/implementations/strategies/Bank.sol/Bank.json";
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
export async function deployBankFactory(ownershipManager: Address, feeTo: Address, deployer: Signer) : Promise<BankFactoryContract> {
  const BankFactory = await ethers.getContractFactory("BankFactory");
  return (await BankFactory.connect(deployer).deploy(ownershipManager, feeTo)).waitForDeployment();
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
export async function deployTestAsset(deployer: Signer, ownershipManager: Address, collateralToken: Address): Promise<TestBaseAssetContract> {
  const testAsset = await ethers.getContractFactory("TestBaseAsset");
  return (await testAsset.connect(deployer).deploy(ownershipManager, collateralToken)).waitForDeployment();
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
async function deployReserve(ownershipManager: Address, deployer: Signer) : Promise<ReserveContract> {
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
) :Promise<SimpliTokenContract> {
  const AssetMgr = await ethers.getContractFactory("SimpliToken");
  return (await AssetMgr.connect(deployer).deploy(attorney, reserve, tokenDistributor, ownershipManager)).waitForDeployment();
}


/**
 * Deploy public router
 *
 * @param deployer : Deployer.
 * @param collateralToken : Simplifinance Token address.
 * @param assetMgr : Asset address.
 * @param bankFactory : Bank admin address.
 * @param ownershipMgr : Ownership manager address.
 * @param feeTo : Fee receiver.
 * @returns Contract instance.
*/

export async function deployFactory(
  assetMgr: Address, 
  bankFactory: Address, 
  feeTo: Address, 
  ownershipMgr: Address, 
  deployer: Signer, 
  collateralToken: Address
) : Promise<FactoryContract> {
  const Factory = await ethers.getContractFactory("Factory");
  return (await Factory.connect(deployer).deploy(
    MAKER_RATE, 
    feeTo, 
    assetMgr, 
    bankFactory, 
    ownershipMgr,
    zeroAddress,
    collateralToken 
  )).waitForDeployment();
}

export async function retrieveContract(bank: Address) : Promise<BankContract> {
  return ethers.getContractAt('Bank', bank);
}

export async function deployContracts(getSigners_: () => Signers) {
  const [deployer, alc1, alc2, alc3, routeTo, feeTo, signer1, signer2, signer3, devAddr ] = await getSigners_();
  const signers = [deployer.address, devAddr.address, signer3.address] as Address[];
  const ownershipMgr = await deployOwnershipManager(deployer);
  const ownershipMgrAddr = await ownershipMgr.getAddress() as Address;
  
  const attorney = await deployAttorney(deployer, FEE, feeTo.address as Address, ownershipMgrAddr);
  const attorneyAddr = await attorney.getAddress() as Address;
 
  const reserve = await deployReserve(ownershipMgrAddr, deployer);
  const reserveAddr = await reserve.getAddress() as Address;

  const distributor = await deployTokenDistributor(deployer, ownershipMgrAddr, signers, QUORUM);
  const distributorAddr = await distributor.getAddress() as Address;
  
  const collateralToken = await deployCollateralAsset(deployer, attorneyAddr, reserveAddr, distributorAddr, ownershipMgrAddr);
  const collateralTokenAddr = await collateralToken.getAddress() as Address;

  const tAsset = await deployTestAsset(deployer, ownershipMgrAddr, collateralTokenAddr);
  const testAssetAddr = await tAsset.getAddress() as Address;

  const assetMgr = await deployAssetClass(formatAddr(testAssetAddr), ownershipMgrAddr, deployer);
  const assetMgrAddr = await assetMgr.getAddress() as Address;

  
  const escape = await deployEscape(ownershipMgrAddr, deployer);
  const escapeAddr = await escape.getAddress() as Address;
  
  

  // const strategy = await deployBank(formatAddr(ownershipMgrAddr), deployer);
  const bankFactory = await deployBankFactory(ownershipMgrAddr, feeTo.address as Address, deployer);
  const bankFactoryAddr = await bankFactory.getAddress() as Address;
  const factory = await deployFactory(assetMgrAddr, bankFactoryAddr, feeTo.address as Address, ownershipMgrAddr, deployer, collateralTokenAddr);

  const factoryAddr = await factory.getAddress();
  await ownershipMgr.connect(deployer).setPermission([factoryAddr, bankFactoryAddr, deployer.address,]);
  const isSupported = await assetMgr.isSupportedAsset(testAssetAddr);
  const isListed = await assetMgr.listed(testAssetAddr);
  expect(isListed).to.be.true;
  expect(isSupported).to.be.true;

  return {
    bankFactory,
    assetMgr,
    testAssetAddr,
    tAsset,
    reserve,
    escape,
    escapeAddr,
    reserveAddr,
    distributor,
    distributorAddr,
    collateralToken,
    collateralTokenAddr,
    factory,
    assetMgrAddr,
    factoryAddr,
    bankFactoryAddr,
    signers_distributor: signers,
    signers: { deployer, alc1, alc2, alc3, routeTo, feeTo, signer1, signer2, signer3, devAddr }
  };
}
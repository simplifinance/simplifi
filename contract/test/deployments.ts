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

import { executeTransaction, FEE, formatAddr, MAKER_RATE, proposeTransaction, QUORUM, signTransaction, TrxnType, } from "./utilities";
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
 * @param signers : List of Signers
 * @param quorum : Number of signers required to execute a transaction
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
  const [deployer, alc1, alc2, feeTo, signer1, signer2, signer3, extra ] = await getSigners_();
  const deployerAddr = await deployer.getAddress();
  const extraAddr = await extra.getAddress();
  const signer3Addr = await signer3.getAddress();
  const signer1Addr = await signer1.getAddress();
  const feeToAddr = await feeTo.getAddress();
  const alc1Addr = await alc1.getAddress();
  const alc2Addr = await alc2.getAddress();
  const signer2Addr = await signer2.getAddress();
  const signers = [deployerAddr, extraAddr, signer3Addr, signer1Addr] as Address[];
  const INITIAL_MINT : bigint = 200000000000000000000000n;
  const ownershipMgr = await deployOwnershipManager(deployer);
  const ownershipMgrAddr = await ownershipMgr.getAddress() as Address;
  
  const attorney = await deployAttorney(deployer, FEE, feeToAddr as Address, ownershipMgrAddr);
  const attorneyAddr = await attorney.getAddress() as Address;
 
  const reserve = await deployReserve(ownershipMgrAddr, deployer);
  const reserveAddr = await reserve.getAddress() as Address;

  const distributor = await deployTokenDistributor(deployer, ownershipMgrAddr, signers, QUORUM-1);
  const distributorAddr = await distributor.getAddress() as Address;
  
  const collateralToken = await deployCollateralAsset(deployer, attorneyAddr, reserveAddr, distributorAddr, ownershipMgrAddr);
  const collateralTokenAddr = await collateralToken.getAddress() as Address;

  const tAsset = await deployTestAsset(deployer, ownershipMgrAddr, collateralTokenAddr);
  const testAssetAddr = await tAsset.getAddress() as Address;

  const assetMgr = await deployAssetClass(formatAddr(testAssetAddr), ownershipMgrAddr, deployer);
  const assetMgrAddr = await assetMgr.getAddress() as Address;

  
  const escape = await deployEscape(ownershipMgrAddr, deployer);
  const escapeAddr = await escape.getAddress() as Address;
  
  await distributor.connect(deployer).setToken(collateralTokenAddr);
  await attorney.connect(deployer).setToken(collateralTokenAddr);
  const request = await proposeTransaction({signer: deployer, contract: distributor, amount: INITIAL_MINT, delayInHrs: 0, recipient: deployerAddr as Address, trxType: TrxnType.ERC20});
  await signTransaction({signer: signer3, contract: distributor, requestId: request.id});
  await executeTransaction({contract: distributor, reqId: request.id, signer: extra});
  
  const bankFactory = await deployBankFactory(ownershipMgrAddr, feeToAddr as Address, deployer);
  const bankFactoryAddr = await bankFactory.getAddress() as Address;
  const factory = await deployFactory(assetMgrAddr, bankFactoryAddr, feeToAddr as Address, ownershipMgrAddr, deployer, collateralTokenAddr);
  const factoryAddr = await factory.getAddress();
  await ownershipMgr.connect(deployer).setPermission([factoryAddr, bankFactoryAddr, deployerAddr,]);
  const isSupported = await assetMgr.isSupportedAsset(testAssetAddr);
  const isListed = await assetMgr.listed(testAssetAddr);
  expect(isListed).to.be.true;
  expect(isSupported).to.be.true;

  return {
    attorney,
    attorneyAddr,
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
    INITIAL_MINT,
    assetMgrAddr,
    factoryAddr,
    bankFactoryAddr,
    signers_distributor: signers,
    signers: { deployer, alc1, alc2, feeTo, signer1, signer2, signer3, extra, deployerAddr, alc1Addr, alc2Addr, feeToAddr, signer1Addr, signer2Addr, signer3Addr, extraAddr }
  };
}
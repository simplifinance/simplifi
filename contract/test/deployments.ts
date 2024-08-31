import { ethers } from "hardhat";
import type { Address, Addresses, AssetClassReturnType, AttorneyReturnType, FactoryReturnType, ReserveReturnType, Signers, SimpliTokenReturnType, SmartStrategyAdminReturnType, TestUSDTReturnType, TokenDistributorReturnType, TrusteeReturnType } from "./types";
import { CREATION_FEE, FEETO, formatAddr, MAKER_RATE, MINIMUM_CONTRIBUTION, QUORUM,} from "./utilities";
// import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

/**
 * Deploys and return an instance of the Reserve contract
 * @param deployer : Deployer address
 * @returns : Contract instance
 */
export async function deployReserve() : Promise<ReserveReturnType> {
  const Reserve = await ethers.getContractFactory("Reserve");
  return (await Reserve.deploy());
}

/**
 * Deploys and return an instance of the Attorney contract
 * @param deployer : Deployer address
 * @returns : Contract instance
 */
export async function deployAttorney(devAddr: Address, fee: string) : Promise<AttorneyReturnType> {
  const Attorney = await ethers.getContractFactory("Attorney");
  return (await Attorney.deploy(fee, devAddr));
}

/**
 * Deploys and return an instance of the Trustee contract
 * @param deployer : Deployer address
 * @returns : Contract instance
 */
export async function deployTrustee() : Promise<TrusteeReturnType> {
  const Trustee = await ethers.getContractFactory("Trustee");
  return (await Trustee.deploy());
}

/**
 * Deploys and return an instance of the Token distributor contract.
 * @param signers : List of signers
 * @param quorum : Number of signers required to execute a transaction
 * @returns : Contract instance
 */
export async function deployInitialTokenReceiver(signers: Addresses, quorum: number) : Promise<TokenDistributorReturnType> {
  const Distributor = await ethers.getContractFactory("TokenDistributor");
  return (await Distributor.deploy(signers, quorum));
}

/**
 * Deploys and return an instance of the Jointfinance Token
 * @param deployer : Deployer address
 * @param args : Constructor arguments
 * @returns Contract instance
 */
export async function deployToken(attorney: Address, reserve: Address, initTokenReceiver: Address) : Promise<SimpliTokenReturnType> {
  const Token = await ethers.getContractFactory("SimpliToken");
  return (await Token.deploy(attorney, reserve, initTokenReceiver));
}

/**
 * Deploys and return an instance of the StrategyAdmin contract.
 * @param deployer : Deployer address
 * @returns Contract instance
 */
export async function deploySmartStrategyAdmin(token: Address, assetAdmin: Address, smartStrategyInstance: Address) : Promise<SmartStrategyAdminReturnType> {
  const StrategyAdmin = await ethers.getContractFactory("SmartStrategyAdmin");
  return (await StrategyAdmin.deploy(CREATION_FEE, FEETO, token, assetAdmin, smartStrategyInstance));
}

/**
 * Deploys and return an instance of the Asset contract
 * @param deployer : Deployer address
 * @returns Contract instance
 */
export async function deployAssetClass(testAddr: Address) :Promise< AssetClassReturnType> {
  const AssetAdmin = await ethers.getContractFactory("AssetClass");
  return (await AssetAdmin.deploy(testAddr));
}

/**
 * Deploys and return an address instance of the AcountStrategy
 * @param deployer : Deployer address
 * @returns Contract address
 */
export async function deploySmartStrategy() {
  const SmartStrategy = await ethers.getContractFactory("SmartStrategy");
  return await (await (await SmartStrategy.deploy()).waitForDeployment()).getAddress();
}

/**
 * Deploys and return an address instance of the AcountStrategy
 * @param deployer : Deployer address
 * @returns Contract address
 */
export async function deployTestcUSD(): Promise<TestUSDTReturnType> {
  const TcUSD = await ethers.getContractFactory("TestUSDT");
  return (await TcUSD.deploy()).waitForDeployment();
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
 * @param assetAdmin : Asset contract.
 * @param strategyAdmin : Strategy admin contract.
 * @returns Contract instance.
 */
export async function deployFactory(token: Address, assetAdmin: Address, strategyAdmin: Address, library: Address, trustee: Address) : Promise<FactoryReturnType> {
  const Factory = await ethers.getContractFactory("Factory", {
    libraries: {
      FactoryLib: library
    }
  });
  return (await Factory.deploy(MAKER_RATE, MINIMUM_CONTRIBUTION, token, FEETO, assetAdmin, strategyAdmin, trustee));
}

export async function deployContracts(getSigners_: () => Signers) {
  const [deployer, alc1, alc2, alc3, routeTo, feeTo, signer1, signer2, signer3, devAddr ] = await getSigners_();
  const libAddr = await deployLibrary();
  const attorney = await deployAttorney(formatAddr(devAddr.address), feeTo.address);
  const attorneyAddr = await attorney.getAddress();

  const reserve = await deployReserve();
  const reserveAddr = await reserve.getAddress();

  const tcUSD = await deployTestcUSD();
  const tUSDAddr = await tcUSD.getAddress();

  const trustee = await deployTrustee();
  const trusteeAddr = await trustee.getAddress();

  const initTokenReceiver = await deployInitialTokenReceiver(
    [
      formatAddr(signer1.address), 
        formatAddr(signer2.address), 
          formatAddr(signer3.address)
    ], 
      QUORUM 
  );
  const initTokenReceiverAddr = await initTokenReceiver.getAddress();

  const token = await deployToken(
    formatAddr(attorneyAddr), 
      formatAddr(reserveAddr), 
        formatAddr(initTokenReceiverAddr)
  );
  const tokenAddr = await token.getAddress();

  const assetAdmin = await deployAssetClass(formatAddr(tUSDAddr));
  const assetAdminAddr = await assetAdmin.getAddress();

  const strategy = await deploySmartStrategy();
  const strategyAdmin = await deploySmartStrategyAdmin(
    formatAddr(tokenAddr), 
      formatAddr(assetAdminAddr), 
        formatAddr(strategy)
  );
  const strategyAdminAddr = await strategyAdmin.getAddress();

  const factory = await deployFactory(
    formatAddr(tokenAddr), 
      formatAddr(assetAdminAddr), 
        formatAddr(strategyAdminAddr), 
          formatAddr(libAddr), 
            formatAddr(trusteeAddr)
  );

  const factoryAddr = await factory.getAddress();
  await trustee.setAddresses(factoryAddr, strategyAdminAddr, feeTo.address);

  return {
    initTokenReceiverAddr,
    initTokenReceiver,
    strategyAdmin,
    attorneyAddr,
    assetAdmin,
    attorney,
    tUSDAddr,
    token,
    reserve,
    tcUSD,
    trustee,
    tokenAddr,
    factory,
    assetAdminAddr,
    factoryAddr,
    // permissionedRouterAddr,
    strategyAdminAddr,
    signers: { deployer, alc1, alc2, alc3, routeTo, feeTo, signer1, signer2, signer3, devAddr }
  };
}

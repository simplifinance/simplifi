import { HardhatRuntimeEnvironment, } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { config as dotconfig } from "dotenv";
import { QUORUM } from '../test/utilities';
import { parseEther, parseUnits, zeroAddress } from 'viem';
import { baseContractABI, getContractData, NetworkName } from "../getSupportedAssets";
import { ethers } from 'hardhat'
import { Contract } from 'ethers';

dotconfig();

type ConstructorArg = {
  feeTo: string; 
  makerRate: string | number;
  roleManager: string; 
  assetManager: string; 
  baseAsset: string;
  pointFactory: string;
  safeFactory: string;
  oracle: string;
  supportedAssets: string[];
};


const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
	const {deploy, execute, read, getNetworkName } = deployments;
	let {deployer, baseContributionAsset, feeTo } = await getNamedAccounts();

  const networkName = getNetworkName().toLowerCase() as NetworkName;
  const serviceRate = 10; // 0.1%
  const FEE = parseEther('10');
  const initialLaunchAmout = parseUnits('1', 15);
  const baseAmount = parseEther('1000');
  const collacteralAmount = parseEther('3000');
  const amountToFaucet = parseEther('3000000');
  const signers = ["0x16101742676EC066090da2cCf7e7380f917F9f0D", "0x85AbBd0605F9C725a1af6CA4Fb1fD4dC14dBD669", "0xef55Bc253297392F1a2295f5cE2478F401368c27"].concat([deployer]);

  /**
   * Deploy Ownership Manager
   */
    const roleManager = await deploy("RoleManager", {
      from: deployer,
      args: [],
      log: true,
    });
    console.log(`RoleManager deployed to: ${roleManager.address}`);

    // Base asset for testing on CrossFi
    const baseAsset = await deploy("BaseAsset", {
      from: deployer,
      args: [],
      log: true,
    });
    console.log(`BaseAsset contract deployed to: ${baseAsset.address}`);

    if(baseContributionAsset === zeroAddress) baseContributionAsset = baseAsset.address;

    const escape = await deploy("Escape", {
      from: deployer,
      args: [roleManager.address],
      log: true,
    });
    console.log(`Escape contract deployed to: ${escape.address}`);

    const reserve = await deploy("Reserve", {
      from: deployer,
      args: [roleManager.address],
      log: true,
    });
    console.log(`Reserve contract deployed to: ${reserve.address}`);

    const distributor = await deploy("TokenDistributor", {
      from: deployer,
      args: [
        roleManager.address,
        signers,
        QUORUM - 1
      ],
      log: true,
    });
    console.log(`TokenDistributor deployed to: ${distributor.address}`);
                                                                    
    const attorney = await deploy("Attorney", {
      from: deployer,
      args: [
        FEE,
        feeTo,
        roleManager.address
      ],
      log: true,
    });
    console.log(`Attorney contract deployed to: ${attorney.address}`);

  /**
   * Deploy FactoryLib
   */
  const collateralToken = await deploy("SimpliToken", {
    from: deployer,
    args: [
      attorney.address,
      reserve.address,
      distributor.address,
      roleManager.address
    ],
    log: true,
  });
  console.log(`SimpliToken deployed to: ${collateralToken.address}`);

  // Deploy token faucet contract
  const faucet = await deploy("Faucet", {
    from: deployer,
    args: [roleManager.address, collateralToken.address, baseAsset.address, baseAmount, collacteralAmount],
    log: true,
  });
  console.log(`Faucet contract deployed to: ${faucet.address}`);

  /**
   * Deploy AssetManager
   */
  const reward = await deploy("Points", {
    from: deployer,
    args: [roleManager.address],
    log: true,
  });
  console.log(`Points contract deployed to: ${reward.address}`);
  
  /**
   * Deploy SafeFactory
   */
  const safeFactory = await deploy("SafeFactory", {
    from: deployer,
    args: [roleManager.address, feeTo],
    log: true,
  });
  console.log(`SafeFactory deployed to: ${safeFactory.address}`);  

  const { flexpool, oracleAddress, isNotHardhat, priceData, wrappedAssetMetadata } = getContractData(networkName);
  /**
   * Wrapped asset
  */ 
   const wrappedNative = await deploy("WrappedNative", {
    from: deployer,
    args: [ roleManager.address, wrappedAssetMetadata.name, wrappedAssetMetadata.symbol ],
    log: true,
  });

  console.log(`WrappedNative token deployed to: ${wrappedNative.address}`);
  
  // SupportedAsset manager
  const supportAssetManger = await deploy("SupportedAssetManager", {
    from: deployer,
    args: [[collateralToken.address, wrappedNative.address], roleManager.address],
    log: true,
  });
  console.log(`SupportedAssetManager contract deployed to: ${supportAssetManger.address}`);

  // Set up stateManager args
  const stateManagerArgs = [
    feeTo,
    serviceRate,
    roleManager.address,
    safeFactory.address,
    supportAssetManger.address,
    baseContributionAsset,
    reward.address
  ];

  /**
   * Deploy Strategy Manager
  */
  console.log(`Deploying StateManager`);
  const stateManager = await deploy('StateManager', {
    from: deployer,
    args: [...stateManagerArgs],
    log: true,
  });
  console.log(`Factory deployed to: ${stateManager.address}`);

  // Prepare the arguments to parse to the Flexpool constructor
  const flexpoolArgs = [
    roleManager.address,
    stateManager.address,
    oracleAddress,
    [wrappedNative.address],
    priceData
  ];

  const hardhatArg = [
    roleManager.address,
    stateManager.address,
  ];

  const constructorArgs = isNotHardhat? flexpoolArgs : hardhatArg;
  
  console.log(`Deploying ${flexpool}`);
  const factory = await deploy(flexpool, {
    from: deployer,
    args: [...constructorArgs],
    log: true,
  });
  console.log(`Factory deployed to: ${factory.address}`);

  /**
   * Deploy SafeFactory
  */
  const providers = await deploy("Providers", {
    from: deployer,
    args: [stateManager.address, factory.address, roleManager.address],
    log: true,
  });

  console.log(`Providers deployed to: ${providers.address}`);

  await execute("RoleManager", {from: deployer}, "setRole", [factory.address, roleManager.address, deployer, safeFactory.address, supportAssetManger.address, distributor.address, providers.address]);
  await execute("BaseAsset", {from: deployer}, "transfer", faucet.address, amountToFaucet);
  // await execute(supportedManagerAndOracle, {from: deployer}, 'updatePriceFeed', priceQuoteAsset);
  
  // Every supported collateral assets on the Celo network has a corresponding mapped oracle address on the Chainlink network
  if(networkName !== 'hardhat') {
    await execute(flexpool, {from: deployer}, "updateQuote", initialLaunchAmout, wrappedNative.address);
    const result = await read(flexpool, {from: deployer}, "quotes", initialLaunchAmout);
    console.log("Quote", result);
  }
};

export default func;

func.tags = ["RoleBase", "supportAssetManger", "SimpliToken", "Reserve", "PriceOracle", "FlexpoolFactory", "Points", "Providers", "Attorney", "TokenDistributor", "SafeFactory", "Escape"];


// Pyth network ids
// 0x7d669ddcdd23d9ef1fa9a9cc022ba055ec900e91c4cb960f3c20429d4447a411  Crypto.CELO/USD
// 0x8f218655050a1476b780185e89f19d2b1e1f49e9bd629efad6ac547a946bf6ab Crypto.CUSD/USD
// oracle addreses
// 0xff1a0f4744e8582DF1aE09D5611b887B6a12925C celo mainnet
// Celo Alfajores (testnet)	0x74f09cb3c7e2A01865f424FD14F6dc9A14E3e94E

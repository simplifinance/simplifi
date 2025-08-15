import { HardhatRuntimeEnvironment, } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { config as dotconfig } from "dotenv";
import { QUORUM } from '../test/utilities';
import { parseEther, zeroAddress } from 'viem';
import { getContractData, NetworkName } from "../getSupportedAssets";
import { toBigInt } from 'ethers';

dotconfig();

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
	const {deploy, execute, read, getNetworkName } = deployments;
	let {deployer, baseContributionAsset, identityVerificationHub } = await getNamedAccounts();

  console.log("Deployer", deployer)
  const networkName = getNetworkName().toLowerCase() as NetworkName;
  const serviceRate = 10; // 0.1%
  const FEE = parseEther('10');
  const baseAmount = parseEther('1000');
  const collacteralAmount = parseEther('3000');
  const amountToFaucet = parseEther('3000000');
  // const scopeSeed = 'simplifinance-simplifi';
  const scopeValue = networkName === 'alfajores'? BigInt('11093060884784780800910785808741096496213751621594761261038373606241471145350') : BigInt('');
	const verificationConfig = '0x8475d3180fa163aec47620bfc9cd0ac2be55b82f4c149186a34f64371577ea58'; // Accepts all countries. Filtered individuals from the list of sanctioned countries using ofac1, 2, and 3

  // Minimum Liquidity is $1 for Flexpool and providers
  const minimumLiquidity = parseEther('1');
  const signers = ["0x16101742676EC066090da2cCf7e7380f917F9f0D", "0x85AbBd0605F9C725a1af6CA4Fb1fD4dC14dBD669", "0xef55Bc253297392F1a2295f5cE2478F401368c27"].concat([deployer]);

  /**
   * Deploy Ownership Manager
   */
    const verifier = await deploy("Verifier", {
      from: deployer,
      args: [identityVerificationHub],
      log: true,
    });
    console.log(`Verifier deployed to: ${verifier.address}`);

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
        distributor.address,
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
    args: [roleManager.address, distributor.address, distributor.address],
    log: true,
  });
  console.log(`SafeFactory deployed to: ${safeFactory.address}`);  

  const { flexpool, isNotHardhat, priceData, wrappedAssetMetadata } = getContractData(networkName);
  /**
   * Wrapped asset
  */ 
   const wrappedNative = await deploy("WrappedNative", {
    from: deployer,
    args: [ wrappedAssetMetadata.name, wrappedAssetMetadata.symbol ],
    log: true,
  });

  console.log(`WrappedNative token deployed to: ${wrappedNative.address}`);

  // SupportedAsset manager
  const supportAssetManger = await deploy("SupportedAssetManager", {
    from: deployer,
    args: [
      [
        {asset: collateralToken.address, isWrappedAsset: false}, 
        {asset: wrappedNative.address, isWrappedAsset: true}, 
      ], 
      roleManager.address
    ],
    log: true,
  });
  console.log(`SupportedAssetManager contract deployed to: ${supportAssetManger.address}`);

  // Set up stateManager args
  const stateManagerArgs = [
    distributor.address,
    serviceRate,
    roleManager.address,
    supportAssetManger.address,
    baseContributionAsset,
    reward.address,
    verifier.address,
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
    [wrappedNative.address],
    priceData,
    safeFactory.address,
    minimumLiquidity
  ];

  const hardhatArg = [
    roleManager.address,
    stateManager.address,
    safeFactory.address
  ];

  const constructorArgs = isNotHardhat? flexpoolArgs : hardhatArg;
  
  const factory = await deploy(flexpool, {
    from: deployer,
    args: [...constructorArgs],
    log: true,
  });
  console.log(`Factory deployed to: ${factory.address}`);

  /**
   * Deploy Providers
  */
  const providers = await deploy("Providers", {
    from: deployer,
    args: [stateManager.address, factory.address, roleManager.address, minimumLiquidity],
    log: true,
  });

  console.log(`Providers deployed to: ${providers.address}`);

	await execute('Verifier', {from: deployer}, 'setConfigId', verificationConfig);
	await execute('Verifier', {from: deployer}, 'setScope', scopeValue);
  
	const isWalletVerificationRequired = await read('Verifier', 'isWalletVerificationRequired');
	const config = await read('Verifier', 'configId');
	const scope = await read('Verifier', 'scope');

	console.log("scope", toBigInt(scope.toString()));
	console.log("isWalletVerificationRequired", isWalletVerificationRequired);
	console.log("config", config);

  await execute("SafeFactory", {from: deployer}, 'setProviderContract', providers.address);
  const receipt = await execute("RoleManager", {from: deployer}, "setRole", [factory.address, roleManager.address, deployer, safeFactory.address, supportAssetManger.address, distributor.address, providers.address, stateManager.address]);
  console.log("Confirmation block", receipt.confirmations);
  
  // Every supported collateral assets on the Celo network has a corresponding mapped oracle address on the Chainlink network
  if(networkName !== 'hardhat') {
    const result = await read(flexpool, {from: deployer}, "getPriceData", wrappedNative.address);
    console.log("Quote", result?.any.toString() || result?.[3].toString());
  } else {
    await execute("BaseAsset", {from: deployer}, "transfer", faucet.address, amountToFaucet);
  }
};

export default func;

func.tags = ["RoleBase", "supportAssetManger", "SimpliToken", "Reserve", "FlexpoolFactory", "Points", "Providers", "Attorney", "TokenDistributor", "SafeFactory", "Escape"];

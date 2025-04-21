import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { config as dotconfig } from "dotenv";
import { QUORUM } from '../test/utilities';
import { parseEther } from 'viem';

dotconfig();
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
	const {deploy, execute, read, } = deployments;
	const {deployer, oracle, feeTo, cUSDAddr} = await getNamedAccounts();
  const serviceRate = 10; // 0.1%
  const FEE = parseEther('10');
  const baseAmount = parseEther('1000');
  const collacteralAmount = parseEther('3000');
  const amountToFaucet = parseEther('3000000');
  const signers = ["0x16101742676EC066090da2cCf7e7380f917F9f0D", "0x85AbBd0605F9C725a1af6CA4Fb1fD4dC14dBD669", "0xef55Bc253297392F1a2295f5cE2478F401368c27", deployer];

  // console.log("Oracle: ", oracle);
  /**
   * Deploy Ownership Manager
   */
    const roleManager = await deploy("RoleManager", {
      from: deployer,
      args: [],
      log: true,
    });
    console.log(`RoleManager deployed to: ${roleManager.address}`);

    const baseAsset = await deploy("BaseAsset", {
      from: deployer,
      args: [],
      log: true,
    });
    console.log(`BaseAsset contract deployed to: ${baseAsset.address}`);

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

  /**
  * Deploy Test Asset
  */
  const supportedAssetManager = await deploy("SupportedAssetManager", {
    from: deployer,
    args: [
      collateralToken.address,
      roleManager.address,
    ],
    log: true,
  });
  console.log(`SupportedAssetManager deployed to: ${supportedAssetManager.address}`);
  

  /**
   * Deploy Strategy Manager
  */
  const factory = await deploy("FlexpoolFactory", {
    from: deployer,
    args: [
      feeTo,
      serviceRate,
      oracle,
      roleManager.address,
      supportedAssetManager.address,
      cUSDAddr,
      reward.address,
      safeFactory.address,
    ],
    log: true,
  });
  console.log(`Factory deployed to: ${factory.address}`);

  /**
   * Deploy SafeFactory
  */
  const providers = await deploy("Providers", {
    from: deployer,
    args: [factory.address, roleManager.address, cUSDAddr, supportedAssetManager.address, safeFactory.address],
    log: true,
  });
  console.log(`Providers deployed to: ${providers.address}`);  
  

  await execute("RoleManager", {from: deployer}, "setRole", [factory.address, roleManager.address, deployer, safeFactory.address, supportedAssetManager.address, distributor.address, providers.address]);
  await execute("BaseAsset", {from: deployer}, "transfer", faucet.address, amountToFaucet);
};

export default func;

func.tags = ["RoleBase", "SupportedAssetManager", "SimpliToken", "Reserve", "FlexpoolFactory", "Points", "Providers", "Attorney", "TokenDistributor", "SafeFactory", "Escape"];

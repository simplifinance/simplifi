import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { config as dotconfig } from "dotenv";

const CONTEXT = "TEST";
dotconfig();
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
	const {deploy, execute, read, } = deployments;
	const {deployer} = await getNamedAccounts();
  const serviceRate = 10; // 0.1%
  const minContribution = 1_000_000_000_000_000;
  const setUpFee = 0;

  /**
   * Deploy Ownership Manager
   */
    const ownershipManager = await deploy("OwnerShip", {
      from: deployer,
      args: [],
      log: true,
    });
    console.log(`OwnershipManager deployed to: ${ownershipManager.address}`);
 
    /**
   * Deploy Test Asset
   */
    const testAsset = await deploy("TestAsset", {
      from: deployer,
      args: [],
      log: true,
    });
    console.log(`Test Asset deployed to: ${testAsset.address}`);


  /**
   * Deploy AssetManager
   */
  const assertMgr = await deploy("AssetClass", {
    from: deployer,
    args: [testAsset.address, ownershipManager.address],
    log: true,
  });
  console.log(`AssertMgr deployed to: ${assertMgr.address}`);
  
  /**
   * Deploy Strategy Manager
   */
  const strategyManager = await deploy("StrategyManager", {
    from: deployer,
    args: [ownershipManager.address],
    log: true,
  });
  console.log(`strategyManager deployed to: ${strategyManager.address}`);  

  /**
   * Deploy FactoryLib
   */
  const factoryLib = await deploy("FactoryLib", {
    from: deployer,
    args: [],
    log: true,
  });
  console.log(`factoryLib deployed to: ${factoryLib.address}`);
  
  /**
   * Deploy Strategy Manager
   */
  const factory = await deploy("Factory", {
    libraries: {
      FactoryLib: factoryLib.address
    },
    from: deployer,
    args: [
      serviceRate,
      minContribution,
      setUpFee,
      deployer, /// feeTo,
      assertMgr.address,
      strategyManager.address,
      ownershipManager.address
    ],
    log: true,
  });
  console.log(`Factory deployed to: ${factory.address}`);

  await execute("OwnerShip", {from: deployer}, "setPermission", [factory.address, ownershipManager.address]);
  const cData = await read("Factory", "getContractData");
  console.log(cData);
};

export default func;

func.tags = ["OwnerShip", "TestAsset", "AssetClass", "StrategyManager", "Factory"];

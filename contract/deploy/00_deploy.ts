import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { config as dotconfig } from "dotenv";

dotconfig();
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
	const {deploy, execute, read, } = deployments;
	const {deployer, diaOracle} = await getNamedAccounts();
  const serviceRate = 10; // 0.1%
  const minContribution = 1_000_000_000_000_000;
  const setUpFee = 0;

  console.log("Dia Oracle: ", diaOracle);
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
   * Deploy BankFactory
   */
  const bankFactory = await deploy("BankFactory", {
    from: deployer,
    args: [ownershipManager.address],
    log: true,
  });
  console.log(`BankFactory deployed to: ${bankFactory.address}`);  

  /**
   * Deploy FactoryLib
   */
  const factoryLibV2 = await deploy("FactoryLibV2", {
    from: deployer,
    args: [],
    log: true,
  });
  console.log(`factoryLibV2 deployed to: ${factoryLibV2.address}`);
  
  /**
   * Deploy Strategy Manager
   */
  const factory = await deploy("Factory", {
    libraries: {
      FactoryLib: factoryLibV2.address
    },
    from: deployer,
    args: [
      serviceRate,
      minContribution,
      deployer, /// We use the deployer as feeReceiver /feeTo,
      assertMgr.address,
      bankFactory.address,
      ownershipManager.address,
      diaOracle
    ],
    log: true,
  });
  console.log(`Factory deployed to: ${factory.address}`);

  await execute("OwnerShip", {from: deployer}, "setPermission", [factory.address, ownershipManager.address]);
  const cData = await read("Factory", "getFactoryData");
  console.log(cData);
};

export default func;

func.tags = ["OwnerShip", "TestAsset", "AssetClass", "BankFactory", "Factory"];

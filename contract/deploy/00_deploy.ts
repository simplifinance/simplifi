import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { config as dotconfig } from "dotenv";
import { QUORUM } from '../arch/test/utilities';
import { zeroAddress } from 'viem';

dotconfig();
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
	const {deploy, execute, read, } = deployments;
	const {deployer, oracle, feeTo} = await getNamedAccounts();
  const serviceRate = 10; // 0.1%
  const FEE = '10000000000000000000';
  const signers = ["0x16101742676EC066090da2cCf7e7380f917F9f0D", "0x85AbBd0605F9C725a1af6CA4Fb1fD4dC14dBD669", "0xef55Bc253297392F1a2295f5cE2478F401368c27", deployer];

  // console.log("Oracle: ", oracle);
  /**
   * Deploy Ownership Manager
   */
    const ownershipManager = await deploy("OwnerShip", {
      from: deployer,
      args: [],
      log: true,
    });
    console.log(`OwnershipManager deployed to: ${ownershipManager.address}`);

    const escape = await deploy("Escape", {
      from: deployer,
      args: [ownershipManager.address],
      log: true,
    });
    console.log(`Escape contract deployed to: ${escape.address}`);

    const reserve = await deploy("Reserve", {
      from: deployer,
      args: [ownershipManager.address],
      log: true,
    });
    console.log(`Reserve contract deployed to: ${reserve.address}`);

    const distributor = await deploy("TokenDistributor", {
      from: deployer,
      args: [
        ownershipManager.address,
        signers,
        QUORUM
      ],
      log: true,
    });
    console.log(`TokenDistributor contract deployed to: ${distributor.address}`);
                                                                    
    const attorney = await deploy("Attorney", {
      from: deployer,
      args: [
        FEE,
        feeTo,
        ownershipManager.address
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
      ownershipManager.address
    ],
    log: true,
  });
  console.log(`SimpliToken deployed to: ${collateralToken.address}`);
  
 
    /**
   * Deploy Test Asset
   */
    const testAsset = await deploy("TestBaseAsset", {
      from: deployer,
      args: [
        ownershipManager.address,
        collateralToken.address
      ],
      log: true,
    });
    console.log(`TestBaseAsset deployed to: ${testAsset.address}`);


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
    args: [ownershipManager.address, feeTo],
    log: true,
  });
  console.log(`BankFactory deployed to: ${bankFactory.address}`);  

  /**
   * Deploy Strategy Manager
   */
  const factory = await deploy("Factory", {
    // libraries: {
    //   FactoryLib: factoryLibV3.address
    // },
    from: deployer,
    args: [
      serviceRate,
      feeTo,
      assertMgr.address,
      bankFactory.address,
      ownershipManager.address,
      zeroAddress,
      collateralToken.address,
      // oracle
    ],
    log: true,
  });
  console.log(`Factory deployed to: ${factory.address}`);

  await execute("OwnerShip", {from: deployer}, "setPermission", [factory.address, ownershipManager.address, deployer, bankFactory.address, assertMgr.address]);
  const cData = await read("Factory", "getFactoryData");
  console.log(cData);
};

export default func;

func.tags = ["OwnerShip", "TestAsset", "AssetClass", "BankFactory", "Factory"];

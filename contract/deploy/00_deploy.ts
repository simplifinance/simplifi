import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { DENOMINATIONS } from '../denominations';
import { config as dotconfig } from "dotenv";
import { keyHashes } from '../chains';
import { toBigInt } from 'web3-utils';

const CONTEXT = "TEST";
dotconfig();
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
	const {deploy, getNetworkName, execute, read, } = deployments;
	const {deployer, vrf, forwarder } = await getNamedAccounts();
  const useNativePayment = false;
  const networkName = getNetworkName();
  console.log("Network Name", networkName); 
  
  const keyhash = CONTEXT === "TEST"? keyHashes.testnet : keyHashes.mainnet;
  const subId = toBigInt(String(process.env.NEXT_PUBLIC_APP_SUB_ID));
  
  const testToken = await deploy("TestToken", {
    from: deployer,
    args: [],
    log: true,
  });
  
  console.log("TestToken.address", testToken.address);

  const feeManager = await deploy("FeeReceiver", {
    from: deployer,
    args: [testToken.address, deployer],
    log: true,
  });
  console.log(`FeeManager deployed to: ${feeManager.address}`)

  const walletFactory = await deploy("IWalletFactory", {
    from: deployer,
    args: [testToken.address, feeManager.address],
    log: true,
  });
  console.log(`WalletFactory deployed to: ${walletFactory.address}`)
  
  const randoFutures = await deploy("RandoFutures", {
    from: deployer,
    args: [testToken.address, feeManager.address, DENOMINATIONS, walletFactory.address, 0],
    log: true,
  });

  console.log(`RandoFutures deployed to: ${randoFutures.address}`)

  const randoInstant = await deploy("RandoInstant", {
    from: deployer,
    args: [testToken.address, feeManager.address, walletFactory.address],
    log: true,
  });
  console.log(`RandoInstant deployed to: ${randoInstant.address}`)

  const vrfSetUp = await deploy("VRFSetUp", {
    from: deployer,
    args: [subId, vrf, keyhash, [randoFutures.address, randoInstant.address], useNativePayment],
    log: true,
  });
  console.log(`VrfSetUp deployed to: ${vrfSetUp.address}`);
  
  // Update VrfSetUp address in RandoFutures
  await execute("RandoFutures", {from: deployer}, "setIVRFCoordinator", vrfSetUp.address);
  await execute("RandoFutures", {from: deployer}, "setForwarder", forwarder);
 
  // Update VrfSetUp address in RandoFutures
  await execute("RandoInstant", {from: deployer}, "setIVRFCoordinator", vrfSetUp.address);
  
  // Update permitted contracts to interact with IWallet
  await execute("IWalletFactory", {from: deployer}, "setPermitted", randoFutures.address, randoInstant.address);
  
  const vrfCoordinatorFut = await read("RandoFutures", "vrfCoordinator");
  const vrfCoordinatorIns = await read("RandoFutures", "vrfCoordinator");
  console.log("NewVRFSetup", vrfCoordinatorFut);
  console.log("NewVRFSetupIns", vrfCoordinatorIns);

};

export default func;

func.tags = ["RandoFutures", "RandoInstant"];


// 7451234688088722016653757927285632629432115686365417202965430263952494187411633245gbymmrnmmko
// 0x511996ac76E72b8B30a8dAE70dEbb150927f531E
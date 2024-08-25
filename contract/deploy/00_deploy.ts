import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { config as dotconfig } from "dotenv";
import { toBigInt } from 'web3-utils';

const CONTEXT = "TEST";
dotconfig();
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
	const {deploy, getNetworkName, execute, read, } = deployments;

  
  // Update contract state
  // await execute();

};

export default func;

func.tags = [];

import { HardhatRuntimeEnvironment, } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { config as dotconfig } from "dotenv";
import { QUORUM } from '../test/utilities';
import { parseEther, parseUnits, zeroAddress } from 'viem';
import { getSupportedAssets, PriceData, NetworkName, linkContractABI } from "../getSupportedAssets";
import { ethers } from "hardhat"
import { Contract } from 'ethers';

dotconfig();
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
	const {deploy, execute, read, getNetworkName } = deployments;
	let {deployer, baseContributionAsset, feeTo, linkToken } = await getNamedAccounts();

  const networkName = getNetworkName().toLowerCase() as NetworkName;
  let supportedManagerAndOracle = '';
  let wrappedAsset : {symbol: string, name: string} = {symbol: '', name: ''};
  let supportedAssets : {assets: string[], priceData: PriceData[]} = {assets: [], priceData: []};
  let supportedManagerAndOracleArgs : any[] = [];
  let priceQuoteAsset = '';
  let link : Contract | any = {};

  if(networkName !== 'hardhat'){
    const signer = await ethers.getSigner(deployer);
    const provider = new ethers.JsonRpcProvider("https://alfajores-forno.celo-testnet.org");
    const linkContract = await ethers.getContractAt(linkContractABI, linkToken, signer);
    link = await linkContract.waitForDeployment();
    const deployerBalance = await link.balanceOf(deployer);
    console.log("deployerBalance", deployerBalance);
  }

  switch (networkName) {
    case 'alfajores':
      supportedManagerAndOracle = 'CeloSupportedAssetManager';
      wrappedAsset = { name: 'Wrapped Test Celo', symbol: 'TCELO'};
      
      break;
    case 'celo':
      supportedManagerAndOracle = 'CeloSupportedAssetManager';
      wrappedAsset = { name: 'Wrapped Celo', symbol: 'WCELO'};
      break;
    case 'crosstestnet':
      supportedManagerAndOracle = 'CrossFiSupportedAssetManager';
      wrappedAsset = { name: 'Wrapped Test XFI', symbol: 'TXFI'};
      break;
    case 'crossfimainnet':
      supportedManagerAndOracle = 'CrossFiSupportedAssetManager';
      wrappedAsset = { name: 'Wrapped XFI', symbol: 'WXFI'};
      break;
            
    // Defaults to Hardhat
    default:
      supportedManagerAndOracle = 'HardhatSupportedAssetManager';
      wrappedAsset = { name: 'Wrapped Token', symbol: 'WToken'};
      break;
  }

  console.log(`NetworkName: ${networkName}`);

  const serviceRate = 10; // 0.1%
  const FEE = parseEther('10');
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

  /**
   * Price Oracle
  */ 
   const wrappedNative = await deploy("WrappedNative", {
    from: deployer,
    args: [ roleManager.address, wrappedAsset.name, wrappedAsset.symbol ],
    log: true,
  });

  console.log(`WrappedNative token deployed to: ${wrappedNative.address}`);  

  switch (networkName) {
    case 'hardhat':
      supportedAssets = getSupportedAssets(networkName, [collateralToken.address]);
      supportedManagerAndOracleArgs = [ supportedAssets.assets, roleManager.address ];
      priceQuoteAsset = collateralToken.address;
      break;
    default:
      supportedAssets = getSupportedAssets(networkName, [collateralToken.address, wrappedNative.address]);
      supportedManagerAndOracleArgs = [ supportedAssets.assets, roleManager.address, supportedAssets.priceData ];
      priceQuoteAsset = wrappedNative.address;
      break;
  }

  /**
  * Deploy Test Asset
  */
  const supportedAssetManager = await deploy(supportedManagerAndOracle, {
    from: deployer,
    args: supportedManagerAndOracleArgs,
    log: true,
  });
  console.log(`${supportedManagerAndOracle} deployed to: ${supportedAssetManager.address}`);
  
  /**
   * Deploy Strategy Manager
  */

  const factory = await deploy("FlexpoolFactory", {
    from: deployer,
    args: [
      feeTo,
      serviceRate,
      roleManager.address,
      supportedAssetManager.address,
      baseContributionAsset === zeroAddress? baseAsset.address : baseContributionAsset,
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
    args: [factory.address, roleManager.address, baseContributionAsset === zeroAddress? baseAsset.address : baseContributionAsset, supportedAssetManager.address, safeFactory.address],
    log: true,
  });
  console.log(`Providers deployed to: ${providers.address}`);  

  if(networkName !== 'hardhat'){
    await link.transfer(supportedAssetManager.address, parseUnits('1', 17));
    const supportedAssetManagerBal = await link.balanceOf(supportedAssetManager.address);
    console.log("supportedAssetManagerBal", supportedAssetManagerBal);
  }
  console.log("supportedManagerAndOracle", supportedManagerAndOracle);
  await execute("RoleManager", {from: deployer}, "setRole", [factory.address, roleManager.address, deployer, safeFactory.address, supportedAssetManager.address, distributor.address, providers.address]);
  await execute("BaseAsset", {from: deployer}, "transfer", faucet.address, amountToFaucet);
  await execute(supportedManagerAndOracle, {from: deployer}, 'updatePriceFeed', priceQuoteAsset);

  // Every supported collateral assets on the Celo network has a corresponding mapped oracle address on the Chainlink network
  const result = await read(supportedManagerAndOracle, {from: deployer}, "getPriceQuote", priceQuoteAsset);
  console.log("Price", result[0].toString());
  console.log("InTime", result[1]);
};

export default func;

func.tags = ["RoleBase", "SupportedAssetManager", "SimpliToken", "Reserve", "PriceOracle", "FlexpoolFactory", "Points", "Providers", "Attorney", "TokenDistributor", "SafeFactory", "Escape"];


// 0xd07294e6E917e07dfDcee882dd1e2565085C2ae0  chainlink token on Celo mainet
// 0x32E08557B14FaD8908025619797221281D439071  chainlink token on Celo ALfajores
//  Band Alfajores 0x3d00deA966314E47aC3D4ACd2f00121351Cec1C5 
// Band Mainnet  0xDA7a001b254CD22e46d3eAB04d937489c93174C3



// pragma solidity ^0.8.0;
 
// import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
// import "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";
 
// contract SomeContract {
//   IPyth pyth;
 
//   /**
//    * @param pythContract The address of the Pyth contract
//    */
//   constructor(address pythContract) {
//     // The IPyth interface from pyth-sdk-solidity provides the methods to interact with the Pyth contract.
//     // Instantiate it with the Pyth contract address from https://docs.pyth.network/price-feeds/contract-addresses/evm
//     pyth = IPyth(pythContract);
//   }
 
//   /**
//      * This method is an example of how to interact with the Pyth contract.
//      * Fetch the priceUpdate from Hermes and pass it to the Pyth contract to update the prices.
//      * Add the priceUpdate argument to any method on your contract that needs to read the Pyth price.
//      * See https://docs.pyth.network/price-feeds/fetch-price-updates for more information on how to fetch the priceUpdate.
 
//      * @param priceUpdate The encoded data to update the contract with the latest price
//      */
//   function exampleMethod(bytes[] calldata priceUpdate) public payable {
//     // Submit a priceUpdate to the Pyth contract to update the on-chain price.
//     // Updating the price requires paying the fee returned by getUpdateFee.
//     // WARNING: These lines are required to ensure the getPriceNoOlderThan call below succeeds. If you remove them, transactions may fail with "0x19abf40e" error.
//     uint fee = pyth.getUpdateFee(priceUpdate);
//     pyth.updatePriceFeeds{ value: fee }(priceUpdate);
 
//     // Read the current price from a price feed if it is less than 60 seconds old.
//     // Each price feed (e.g., ETH/USD) is identified by a price feed ID.
//     // The complete list of feed IDs is available at https://pyth.network/developers/price-feed-ids
//     bytes32 priceFeedId = 0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace; // ETH/USD
//     PythStructs.Price memory price = pyth.getPriceNoOlderThan(priceFeedId, 60);
//   }
// }
 


// Pyth network ids
// 0x7d669ddcdd23d9ef1fa9a9cc022ba055ec900e91c4cb960f3c20429d4447a411  Crypto.CELO/USD
// 0x8f218655050a1476b780185e89f19d2b1e1f49e9bd629efad6ac547a946bf6ab Crypto.CUSD/USD
// oracle addreses
// 0xff1a0f4744e8582DF1aE09D5611b887B6a12925C celo mainnet
// Celo Alfajores (testnet)	0x74f09cb3c7e2A01865f424FD14F6dc9A14E3e94E

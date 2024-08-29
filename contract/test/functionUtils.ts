// /** Hi dev, I created these custom utilities to make work easier for me.
//  * Most time, I find it time-consuming trying to work with complex libraries that do not
//  * provide a comprehensive way of using them.
//  * To use any library effectively, one needs to understand the inbuilt and underlying contexts
//  * and how data or returns are wrapped. This is just my way of doing stuffs. Sometimes I found those
//  * libraries useful as well.
//  */

// import { 
//   AMOUNT
//  } from "./Index";
// // import { expect } from "chai";
// import { Hex } from "web3-utils";
// import { Contract } from "ethers";
// import BigNumber from "bignumber.js";
// import { PayableTx, EventOptions, BaseContract, NonPayableTx, ContractEventLog, EstimateGasOptions, PayableTransactionObject, NonPayableTransactionObject } from "../types/types";

// import { Null, Signer, Signers, Address, CReceipt, Addresses, Liquidation, AddressReturn, FunctionParam, CreateRouterParam } from "./types";

// const { bn, wrap, getSigners, assertTrue, assertFalse, convertToHex, CREATION_FEE, ZERO_ADDRESS, VALUE_TO_SEND, deployContracts, convertFromHex, compareEqualString, MINIMUM_CONTRIBUTION, assertIsCorrectAddress, INITIAL_ACCOUNT_BALANCE } = testUtils;

// async function loadFixtures() {
//   // Routers
//   const createStrategy = async (sender: Signer, strategyAdmin: Contract): Null => {
//     await strategyAdmin.connect(sender).createStrategy({ value: VALUE_TO_SEND });
//   };

//   const getStrategy = async (account: Address, strategyAdmin: Contract): AddressReturn => {
//     assertIsCorrectAddress(account);
//     return await strategyAdmin?.getStrategy(account);
//   };

//   const supportAsset = async (newAsset: Address, assetAdmin: Contract, owner: Signer): Null => {
//     await assetAdmin.connect(owner).supportAsset(newAsset);
//   };

//   const transferAsset = async (from: Signer, to: Address, amount: Hex, token: Contract) => {
//     await token.connect(from).transfer(to, amount);
//   };

//   const createMultipleStrategies = async (senders: Signers, strategyAdmin: Contract, count: number): Null => {
//     for (let i = 0; i < count; i++) {
//       await createStrategy(senders[i], strategyAdmin);
//     }
//   };

//   const createPool = async (router: CreateRouterParam) => {
//     return await router.contract.connect(router.creator).createPool(router.quorum, router.durationInHours, router.colCoverageRatio, router.amount, router.asset);
//   };

//   const joinABand = async (param: FunctionParam): CReceipt => {
//     return await param.router.connect(param.from).joinABand(param.poolId);
//   };

//   const getFinance = async (param: FunctionParam): CReceipt => {
//     return await param.router.connect(param.from).getFinance(param.poolId);
//   };

//   const payback = async (param: FunctionParam): CReceipt => {
//     return await param.router.connect(param.from).payback(param.poolId);
//   };

//   const cancelBand = async (param: FunctionParam): CReceipt => {
//     return await param.router.connect(param.from).cancelBand(param.poolId);
//   };

//   const liquidate = async (param: FunctionParam): CReceipt => {
//     return await param.router.connect(param.from).cancelBand(param.poolId);
//   };

//   const enquireLiquidation = async (param: FunctionParam): Promise<Liquidation> => {
//     return await param.router.enquireLiquidation(param.poolId);
//   };

//   const creationFee = async (param: FunctionParam): Promise<BigNumber> => {
//     return await param.router.creationFee();
//   };

//   const totalPoolCreated = async (param: FunctionParam): Promise<BigNumber> => {
//     return await param.router.pools();
//   };

//   const minContribution = async (param: FunctionParam): Promise<BigNumber> => {
//     return await param.router.minContribution();
//   };

//   const pauseRouter = async (param: FunctionParam): CReceipt => {
//     return await param.router.connect(param.from).pause();
//   };

//   const unpauseRouter = async (param: FunctionParam): CReceipt => {
//     return await param.router.connect(param.from).unpause();
//   };

//   const confirmStrategyStatus = async (strategyAdmin: Contract, account: Address): Promise<void> => {
//     const strategy = await getStrategy(account, strategyAdmin);
//     assertIsCorrectAddress(strategy);
//   };

//   /**
//    * @dev Return strategy admin contract
//    * @param param : Function parameters
//    * @returns Contract receipt
//    */
//   const getStrategyAdmin = async (param: FunctionParam): Promise<Address> => {
//     return await param.router.strategyAdmin();
//   };

//   /**
//    * Parse the strategyAdmin to activate param.account
//    * @param param : Function parameters
//    * @returns Contract receipt
//    */
//   const activateStrategy = async (param: FunctionParam): CReceipt => {
//     return await param.router.connect(param.from).activateStrategy(param?.account);
//   };

//   /**
//    * Parse the strategyAdmin to deactivate param.account
//    * @param param : Function parameters
//    * @returns Contract receipt
//    */
//   const deactivateStrategy = async (param: FunctionParam): CReceipt => {
//     return await param.router.connect(param.from).deaactivateStrategy(param?.account);
//   };

//   /**
//    * @dev Upgrade strategy.
//    * param.router => strategyAdmin.
//    * To upgrade a strategy, user will have to call the strategyAdmin.
//    * @param param : Function parameters
//    */
//   const upgrageStrategy = async (param: FunctionParam): CReceipt => {
//     return await param.router.connect(param.from).deaactivateStrategy(param?.account);
//   };

//   /**
//    * @dev Update Implementation address in StrategyAdmin.
//    * param.router => strategyAdmin.
//    * To upgrade a strategy, user will have to call the strategyAdmin.
//    * @param param : Function parameters
//    */
//   const setImplementation = async (param: FunctionParam): CReceipt => {
//     return await param.router.connect(param.from).setImplementation(param?.account);
//   };

//   /**
//    * @dev Pick a strategy instead of creating a new one.
//    * param.router => strategyAdmin.
//    * To upgrade a strategy, user will have to call the strategyAdmin.
//    * @param param : Function parameters
//    * Note: param.poolId should be the strategy index.
//    */
//   const handpickStrategy = async (param: FunctionParam): CReceipt => {
//     return await param.router.connect(param.from).handpickStrategy(param?.poolId);
//   };

//   const deploy = async (deployer: Signer, devAddr: Address) => {
//     return await deployContracts(deployer, devAddr);
//   };

//   return {
//     deactivateStrategy,
//     setImplementation,
//     handpickStrategy,
//     activateStrategy,
//     upgrageStrategy,
//     creationFee,
//     getFinance,
//     joinABand,
//     deploy,
//     payback,
//     liquidate,
//     createPool,
//     cancelBand,
//     getStrategy,
//     pauseRouter,
//     supportAsset,
//     transferAsset,
//     unpauseRouter,
//     createStrategy,
//     minContribution,
//     getStrategyAdmin,
//     enquireLiquidation,
//     confirmStrategyStatus,
//     createMultipleStrategies

//     // createPoolAndAssert : async(param: PublicPoolParam) => {
//     //   const contributionAmount = convertToHex("1000000000000000000000");
//     //   const transferAmount = convertToHex("10000000000000000000000")
//     //   await createStrategy(param.accountFor, param.poolCreator, param.strategyAdmin);
//     //   const account = await getStrategy(param.accountFor, param.strategyAdmin);
//     //   await setSupportedToken(param.asset, param.digesu, param.deployer);
//     //   // console.log("Issupported", isSupportedToken);
//     //   expect(await param.digesu.supportedToken(param.asset)).to.be.equal(true);
//     //   await sendTestToken(account, transferAmount, param.assetContract);

//     //   let tx = await createPublicPool(
//     //     2,
//     //     1,
//     //     1000,
//     //     convertToHex(contributionAmount),
//     //     param.asset,
//     //     param.digesu,
//     //     param.accountFor
//     //   );
//     //   const result = await tx.wait();
//     //   console.log("Result", tx.wait());
//     //   const poolData = await fetchPoolData(param.digesu);
//     //   console.log("poolData", poolData);

//     //   return tx;
//     // },
//   };
// }

// export const loadCustomDigesuFixtures = loadFixtures;

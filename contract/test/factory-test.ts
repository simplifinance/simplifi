import { 
  // deploySmartStrategyAdmin, 
  // deployAssetClass, 
  // deployAttorney, 
  // deploySmartStrategy, 
  // deployInitialTokenReceiver, 
  // deployLibrary, 
  // deployReserve, 
  // deployFactory, 
  // deployTestAsset, 
  // deployToken, 
  // deployTrustee 
  deployContracts
} from "./deployments";

import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
// import { balanceOf, balances,} from "./tokenUtils";
import type { SignersArr } from "./types";
import { ethers } from "hardhat";
import { expect } from "chai";
  import { 
    compareEqualString,
    reduce,
    bn,
    AMOUNT_SENT_TO_STRATEGY_FROM_STRATEGY_OWNER,
    UNIT_LIQUIDITY,
    ZERO_ADDRESS,
    COLLATER_COVERAGE_RATIO,
    DURATION_IN_HOURS,
    QUORUM,
    FEE,
    ZERO,
    INTEREST_RATE,
    formatAddr,
    convertStringsToAddresses,
    DURATION_IN_SECS,
    TOTAL_LIQUIDITY
  } from "./utilities";

import { 
  createPermissionedPool, 
  createPermissionlessPool, 
  approve, 
  payback, 
  getFinance, 
  liquidate,
  enquireLiquidation,
  joinEpoch,
  removeLiquidityPool,
  transferAsset,
  setSupportedToken, 
  getAddressFromSigners
} from "./factoryUtils";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { toBigInt } from "ethers";

describe("Factory", function () {
  async function deployContractsFixcture() {
    // const [deployer, feeTo, signer1, signer2, signer3] = await ethers.getSignersArr();
    // const libAddr = await deployLibrary();
    // const attorney = await deployAttorney(formatAddr(feeTo.address), FEE);
    // const attorneyAddr = await attorney.getAddress();
  
    // const reserve = await deployReserve();
    // const reserveAddr = await reserve.getAddress();
    // const tAsset = await deployTestAsset();
    // const testAssetAddr = await tAsset.getAddress();
  
    // const trustee = await deployTrustee();
    // const trusteeAddr = await trustee.getAddress();
  
    // const initTokenReceiver = await deployInitialTokenReceiver(
    //   Array.from([
    //     signer1.address, 
    //     signer2.address, 
    //     signer3.address
    //   ]),
    //   QUORUM
    // );
    // const initTokenReceiverAddr = await initTokenReceiver.getAddress();
  
    // const token = await deployToken(Array.from([attorneyAddr, reserveAddr, initTokenReceiverAddr]));
    // const tokenAddr = await token.getAddress();
  
    // const assetMgr = await deployAssetClass(testAssetAddr);
    // const assetMgrAddr = await assetMgr.getAddress();
  
    // const strategy = await deploySmartStrategy();
    // const strategyMgr = await deploySmartStrategyAdmin(tokenAddr, assetMgrAddr, strategy);
    // const strategyMgrAddr = await strategyMgr.getAddress();
  
    // const factory = await deployFactory(tokenAddr, assetMgrAddr, strategyMgrAddr, libAddr, trusteeAddr);
  
    // const factoryAddr = await factory.getAddress();
    // // const permissionlessRouterAddr = await permissionlessRouter.getAddress();
    // await trustee.setAddresses(factoryAddr, strategyMgrAddr, formatAddr(feeTo.address));
    return { ...await deployContracts(ethers.getSigners) };
  }
  
  describe("Creating pools...", function () {
    it("Should create Permissionless pool successfully", async function () {
      const {
        tAsset,
        factory,
        signers : { signer1 },
      } = await loadFixture(deployContractsFixcture);
    
      const assetAddr = await tAsset.getAddress();
      const initialEpoch = await factory.epoches();
      expect(initialEpoch).to.be.equal(ZERO); // We expect initial epoch to be zero
      /**
       * After creation of liquidity first pool, epoch should be zero
       * this is to ensure that the our epoch generator utility works as expected so
       * that it will not throw out-of-bound error when parsed to 'data.poolArr' list.  
       */
      const { 
        balances : { erc20, xfi }, 
        epochId, 
        pool: { 
          addrs: { asset, strategy, lastPaid, admin }, 
          allGh, 
          uints: { colCoverage, duration, quorum, selector }, 
          uint256s: { currentPool, fullInterest, intPerSec, unit }
        },
        profile: { cData, slot, rank }
      } = await createPermissionlessPool(
        {
          asset: tAsset,
          colCoverage: COLLATER_COVERAGE_RATIO,
          durationInHours: DURATION_IN_HOURS,
          factory: factory,
          intRate: INTEREST_RATE,
          quorum: QUORUM,
          signer: signer1,
          unitLiquidity: UNIT_LIQUIDITY
        }
      );

      // Assertions
      expect(epochId).to.be.equal(0n);
      expect(strategy).to.be.not(ZERO_ADDRESS, "Strategy was not created");
      expect(admin).to.be.equal(signer1.address, "Error: Admin is zero address");
      expect(asset).to.be.equal(assetAddr, "Error: Asset was zero address");
      expect(xfi).to.be.equal(ZERO, `Error: xfi balance is ${xfi.toString()}`); // XFI balance in strategy should be zero.
      expect(erc20).to.be.equal(UNIT_LIQUIDITY, `Error: ERC20 balance is ${erc20.toString()} as against ${UNIT_LIQUIDITY.toString()}`); // ERC20 balance in this epoch should correspond to the liquidity supplied.
      expect(lastPaid).to.be.equal(ZERO_ADDRESS, "Error: lastpaid was not zero address");

      expect(unit).to.be.equal(UNIT_LIQUIDITY);
      expect(currentPool).to.be.equal(UNIT_LIQUIDITY);
      expect(intPerSec).to.be.equal(ZERO);
      expect(fullInterest).to.be.equal(ZERO);
      expect(quorum).to.be.equal(QUORUM, `Quorum parsed: ${QUORUM.toString()}, Quorum returned: ${quorum.toString()}`);
      expect(colCoverage).to.be.equal(COLLATER_COVERAGE_RATIO);
      expect(duration.toString()).to.be.equal(DURATION_IN_SECS, `Duration ${duration.toString()} was not durationInSec ${DURATION_IN_SECS}`);
      expect(allGh).to.be.equal(ZERO);
      expect(selector).to.be.equal(ZERO);

      expect(cData.id).to.be.equal(signer1.address);
      expect(slot).to.be.equal(0, `Slot was different. Slot in contract is: ${slot}`);
      expect(rank.admin).to.be.true;
      expect(rank.member).to.be.true;

      // Router
      const router = await factory.getRouter(epochId);
      expect(router).to.be.equal("PERMISSIONLESS", `Error: Router different. Actual is ${router}`);
    });

    it("Should create permissioned pool successfully", async function () {
      const {
        tAsset,
        factory,
        signers : { signer1, signer2, signer3 },
      } = await loadFixture(deployContractsFixcture);

      const assetAddr = await tAsset.getAddress();
      const {
        balances : { erc20, xfi }, 
        epochId, 
        pool: { 
          addrs: { asset, strategy, lastPaid, admin }, 
          allGh, 
          uints: { colCoverage, duration, quorum, selector }, 
          uint256s: { currentPool, fullInterest, intPerSec, unit }
        },
        profile: { cData, slot, rank }
      } = await createPermissionedPool(
        {
          asset: tAsset,
          colCoverage: COLLATER_COVERAGE_RATIO,
          durationInHours: DURATION_IN_HOURS,
          factory: factory,
          intRate: INTEREST_RATE,
          signer: signer1,
          unitLiquidity: UNIT_LIQUIDITY,
          contributors: getAddressFromSigners([signer1, signer2, signer3])
        }
      );

      // Assertions
      expect(epochId).to.be.equal(0n);
      expect(strategy).to.be.not(ZERO_ADDRESS, "Strategy was not created");
      expect(admin).to.be.equal(signer1.address, "Error: Admin is zero address");
      expect(asset).to.be.equal(assetAddr, "Error: Asset was zero address");
      expect(xfi).to.be.equal(ZERO, `Error: xfi balance is ${xfi.toString()}`); // XFI balance in strategy should be zero.
      expect(erc20).to.be.equal(UNIT_LIQUIDITY, `Error: ERC20 balance is ${erc20.toString()} as against ${UNIT_LIQUIDITY.toString()}`); // ERC20 balance in this epoch should correspond to the liquidity supplied.
      expect(lastPaid).to.be.equal(ZERO_ADDRESS, "Error: lastpaid was not zero address");

      expect(unit).to.be.equal(UNIT_LIQUIDITY);
      expect(currentPool).to.be.equal(UNIT_LIQUIDITY);
      expect(intPerSec).to.be.equal(ZERO);
      expect(fullInterest).to.be.equal(ZERO);
      expect(quorum).to.be.equal(toBigInt(3), `Quorum parsed: ${QUORUM.toString()}, Quorum returned: ${quorum.toString()}`);
      expect(colCoverage).to.be.equal(COLLATER_COVERAGE_RATIO);
      expect(duration.toString()).to.be.equal(DURATION_IN_SECS, `Duration ${duration.toString()} was not DURATION_IN_SECS ${DURATION_IN_SECS}`);
      expect(allGh).to.be.equal(ZERO);
      expect(selector).to.be.equal(ZERO);

      expect(cData.id).to.be.equal(signer1.address);
      expect(slot).to.be.equal(0, `Slot was different. Slot in contract is: ${slot}`);
      expect(rank.admin).to.be.true;
      expect(rank.member).to.be.true;

      const prof_2 = await factory.getProfile(epochId, signer2.address);
      const prof_3 = await factory.getProfile(epochId, signer3.address);

      // Equal address
      expect(prof_2.cData.id).to.be.equal(signer2.address);
      expect(prof_3.cData.id).to.be.equal(signer3.address);

      // Ranks
      expect(prof_2.rank.member).to.be.true;
      expect(prof_2.rank.admin).to.be.false;
      expect(prof_3.rank.member).to.be.true;
      expect(prof_3.rank.admin).to.be.false;

      // Slots
      expect(prof_2.slot).to.be.equal(1n);
      expect(prof_3.slot).to.be.equal(2n);
      
      // Router
      const router = await factory.getRouter(epochId);
      expect(router).to.be.equal("PERMISSIONED", `Error: Router different. Actual is ${router}`);
    });
  });

  describe("Join Epoch", function () {
    it("Should add signers 2 & 3 to permissioned community", async function () {
      const {
        tAsset,
        factory,
        testAssetAddr,
        assetMgr,
        signers : { signer1, signer2, signer3, deployer },
        strategyMgr,
        factoryAddr } = await loadFixture(deployContractsFixcture);
        
        const create = await createPermissionedPool({
          asset: tAsset,
          colCoverage: COLLATER_COVERAGE_RATIO,
          durationInHours: DURATION_IN_HOURS,
          factory: factory,
          intRate: INTEREST_RATE,
          signer: signer1,
          unitLiquidity: UNIT_LIQUIDITY,
          contributors: getAddressFromSigners([signer1, signer2, signer3])
        });

        const {
          balances: { erc20, xfi }, 
          pool: { 
            addrs: { strategy, lastPaid, asset, admin }, 
            allGh, 
            uint256s: { currentPool, unit, fullInterest, intPerSec }, 
            uints: { quorum, colCoverage, duration, selector }
          },
          profile: { 
            cData: {
              colBals, id, turnTime, durOfChoice, expInterest, hasGH, loan, payDate
            },
            rank,
            slot
          }
        } = await joinEpoch({
          contribution: create.pool.uint256s.unit,
          deployer,
          epochId: create.epochId,
          factory,
          factoryAddr: formatAddr(factoryAddr),
          signers: [signer2, signer3],
          testAsset: tAsset
        });

        expect(currentPool).to.be.equal(TOTAL_LIQUIDITY);
        expect(erc20).to.be.equal(TOTAL_LIQUIDITY);
        expect(xfi).to.be.equal(ZERO);
      
    });

    it("Should add signer2 to permissionless liquidity pool", async function () {
      const {
        tAsset,
        factory,
        testAssetAddr,
        assetMgr,
        signers : { signer1, signer2, signer3, deployer },
        strategyMgr,
        factoryAddr } = await loadFixture(deployContractsFixcture);
      
      const create = await createPermissionlessPool(
        {
          asset: tAsset,
          colCoverage: COLLATER_COVERAGE_RATIO,
          durationInHours: DURATION_IN_HOURS,
          factory: factory,
          intRate: INTEREST_RATE,
          quorum: QUORUM,
          signer: signer1,
          unitLiquidity: UNIT_LIQUIDITY
        }
      );

      const prof2_before = await factory.getProfile(create.epochId, signer2.address);
      
      const {
        balances: { erc20, xfi }, 
        pool: { 
          addrs: { strategy, lastPaid, asset, admin }, 
          allGh, 
          uint256s: { currentPool, unit, fullInterest, intPerSec }, 
          uints: { quorum, colCoverage, duration, selector }
        },
        profile: { 
          cData: {
            colBals, id, turnTime, durOfChoice, expInterest, hasGH, loan, payDate
          },
          rank,
          slot
        }
      } = await joinEpoch({
        contribution: create.pool.uint256s.unit,
        deployer,
        epochId: create.epochId,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset
      });

      const prof2_After = await factory.getProfile(create.epochId, signer2.address);

      expect(currentPool.toString()).to.be.equal(bn(unit).times(2).toString());
      expect(erc20.toString()).to.be.equal(bn(unit).times(2).toString());
      expect(xfi).to.be.equal(ZERO);
      expect(prof2_After.slot).to.be.equal(1n);
      expect(prof2_After.rank.member).to.be.true;
      expect(prof2_After.rank.admin).to.be.false;
      expect(prof2_After.cData.id).to.be.equal(signer2.address);
    });
  });

  describe("Signer Getfinance", function () {
    it("Signer1 should get finance successfully from the permissioned community", async function () {
      // const {
      //   tAsset,
      //   factory,
      //   testAssetAddr,
      //   assetMgr,
      //   tokenAddr,
      //   signers : accounts,
      //   strategyMgr,
      //   token,
      //   trustee,
      //   initTokenReceiver,
      //   factoryAddr } = await loadFixture(deployContractsFixcture);

      // expect(await balFeeTo).to.be.gt(0);
      // expect(trusteeBalTUSDAfter).to.be.lt(trusteeBalTUSDB4, "Trustee");
      // expect(strategyBalTUSDAfter).to.be.gt(strategyBalTUSDB4, "Strategy");
      // expect(trusteeBalTokenAfter).to.be.gt(trusteeBalTokenB4, "Trustee Balb4");
      // expect(strategyBalTokenAfter).to.be.lt(strategyBalTokenB4, "Trustee Balb4");
    });
  });

  describe("Signer1 Payback", function () {
    it("Signer1 should get finance and pay back successfully from the permissioned community", async function () {
      // const {
      //   tAsset,
      //   factory,
      //   testAssetAddr,
      //   assetMgr,
      //   tokenAddr,
      //   signers : accounts,
      //   strategyMgr,
      //   token,
      //   trustee,
      //   initTokenReceiver,
      //   factoryAddr } = await loadFixture(deployContractsFixcture);

      // const { signer1, signer2, signer3, deployer, feeTo } = accounts;
  
      // expect(await balFeeTo).to.be.gt(0);
      // expect(trusteeBalTUSDAfter).to.be.equal(trusteeBalTUSDB4, "Trustee");
      // expect(strategyBalTUSDAfter).to.be.lt(strategyBalTUSDB4, "Strategy");
      // expect(trusteeBalTokenAfter).to.be.equal(trusteeBalTokenB4, "Trustee Balb4");
      // expect(strategyBalTokenAfter).to.be.equal(strategyBalTokenB4, "Trustee Balb4");
    });
  });

  describe("All Signers getfinance and payback, roundup and reclaim", function () {
    it("Signer 1, 2 and 3 should get finance and pay back successfully from the permissioned community", async function () {
      // const {
      //   tAsset,
      //   factory,
      //   testAssetAddr,
      //   assetMgr,
      //   tokenAddr,
      //   signers : accounts,
      //   strategyMgr,
      //   token,
      //   trustee,
      //   initTokenReceiver,
      //   factoryAddr } = await loadFixture(deployContractsFixcture);

      // const { signer1, signer2, signer3, deployer, feeTo } = accounts;
      
      
      // expect(await balFeeTo).to.be.gt(0);
      // expect(trusteeBalTUSDAfter).to.be.equal(trusteeBalTUSDB4, "Trustee");
      // expect(strategyBalTUSDAfter).to.be.lt(strategyBalTUSDB4, "Strategy");
      // expect(trusteeBalTokenAfter).to.be.equal(trusteeBalTokenB4, "Trustee Balb4");
      // expect(strategyBalTokenAfter).to.be.equal(strategyBalTokenB4, "Trustee Balb4");
    });

    it("Should round up the cycle and reclaim constribution successfully", async function () {
      // const {
      //   tAsset,
      //   factory,
      //   testAssetAddr,
      //   assetMgr,
      //   tokenAddr,
      //   signers : accounts,
      //   strategyMgr,
      //   token,
      //   trustee,
      //   initTokenReceiver,
      //   factoryAddr } = await loadFixture(deployContractsFixcture);

      // const { signer1, signer2, signer3, deployer, feeTo } = accounts;
    

      // expect(trusteeBalTUSDAfter).to.be.gt(trusteeBalAfterClaim, `${trusteeBalTUSDAfter} is not ${trusteeBalAfterClaim}`);
      // expect(trusteeBalAfterClaim).to.be.equal(0, `${trusteeBalAfterClaim} is not 0`);
      // expect(strategy1BalAfterClaim).to.be.gt(strategyBalTUSDAfter, `${strategy1BalAfterClaim} is less than ${strategyBalTUSDAfter}`);
      // expect(await trustee.connect(signer1).claimable(poolId)).to.be.equal(0, `PoolId: ${poolId} not claimable`);
    });
  });

  describe("Reverting transactions", function () {
    describe("Asset contract", function () { 
      it("Should revert if asset is not supported", async function() {
        // const {
        //   tAsset,
        //   factory,
        //   testAssetAddr,
        //   assetMgr,
        //   tokenAddr,
        //   signers : accounts,
        //   strategyMgr,
        //   strategyMgrAddr,
        //   token,
        //   trustee,
        //   initTokenReceiver,
        //   factoryAddr } = await loadFixture(deployContractsFixcture);
  
        // const { signer1, signer2, signer3, deployer, feeTo } = accounts;
        
       
      });
      
      it("Should revert if Pool is filled", async function () {
        // const {
        //   tAsset,
        //   factory,
        //   testAssetAddr,
        //   assetMgr,
        //   tokenAddr,
        //   signers : accounts,
        //   strategyMgr,
        //   token,
        //   initTokenReceiver,
        //   factoryAddr } = await loadFixture(deployContractsFixcture);
  
        // const { signer1, signer2, signer3, deployer } = accounts;
       
      //   await expect(factory.connect(deployer).joinBand(poolId))
      //   .to.be.revertedWithCustomError(factory, "FunctionNotCallable");
      });
    });
  });                                                                       
});

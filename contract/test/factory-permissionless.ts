import { deployContracts } from "./deployments";
import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { 
  bn,
  UNIT_LIQUIDITY,
  ZERO_ADDRESS,
  COLLATER_COVERAGE_RATIO,
  DURATION_IN_HOURS,
  QUORUM,
  ZERO,
  INTEREST_RATE,
  formatAddr,
  DURATION_IN_SECS,
  mulToString,
  sumToString,
  DURATION_OF_CHOICE_IN_HR,
  DURATION_OF_CHOICE_IN_SECS,
  FuncTag,
  locker,
  ONE_HOUR_ONE_MINUTE
} from "./utilities";

import { 
  createPermissionlessPool, 
  payback, 
  getFinance, 
  liquidate,
  enquireLiquidation,
  joinEpoch,
  withdraw,
  removeLiquidityPool
} from "./factoryUtils";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { ZeroAddress } from "ethers";
import { zeroAddress } from "viem";

describe("Factory", function () {

  async function deployContractsFixcture() {
    return { ...await deployContracts(ethers.getSigners) };
  }
  
  describe("PermissionLess Liquidity Pool...", function () {
    it("PermissionLess: Should create pool successfully", async function () {
      const {
        tAsset,
        factory,
        signers : { signer1, deployer },
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
        balances, 
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
          unitLiquidity: UNIT_LIQUIDITY,
          deployer
        }
      );

      // Assertions
      expect(epochId).to.be.equal(0n);
      expect(strategy === ZERO_ADDRESS).to.be.false;
      expect(admin).to.be.equal(signer1.address, "Error: Admin is zero address");
      expect(asset).to.be.equal(assetAddr, "Error: Asset was zero address");
      expect(balances?.xfi).to.be.equal(ZERO, `Error: xfi balance is ${balances?.xfi.toString()}`); // XFI balance in strategy should be zero.
      expect(balances?.erc20).to.be.equal(UNIT_LIQUIDITY, `Error: ERC20 balance is ${balances?.erc20.toString()} as against ${UNIT_LIQUIDITY.toString()}`); // ERC20 balance in this epoch should correspond to the liquidity supplied.
      expect(lastPaid).to.be.equal(ZERO_ADDRESS, "Error: lastpaid was not zero address");

      expect(unit).to.be.equal(UNIT_LIQUIDITY);
      expect(currentPool).to.be.equal(UNIT_LIQUIDITY);
      expect(intPerSec).to.be.greaterThan(ZERO);
      expect(fullInterest).to.be.greaterThan(ZERO);
      // console.log(`IntPerSec: ${intPerSec.toString()}\nFullInterest: ${fullInterest.toString()}`)
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

    it("PermissionLess: Should add signer2 to permissionless liquidity pool", async function () {
      const {
        tAsset,
        factory,
        signers : { signer1, signer2, signer3, deployer },
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
          unitLiquidity: UNIT_LIQUIDITY,
          deployer
        }
      );

      // const prof2_before = await factory.getProfile(create.epochId, signer2.address);
      
      const {
        balances: { erc20, xfi }, 
        pool: { 
          uint256s: { currentPool, unit }, 
        },
      } = await joinEpoch({
        contribution: create.pool.uint256s.unit,
        deployer,
        epochId: create.pool.uint256s.epochId,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset
      });

      const prof2_After = await factory.getProfile(create.epochId, signer2.address);

      expect(sumToString(currentPool, 0)).to.be.equal(mulToString(unit, 2));
      expect(sumToString(erc20, 0)).to.be.equal(bn(unit).times(2).toString());
      expect(xfi).to.be.equal(ZERO);
      expect(prof2_After.slot).to.be.equal(1n);
      expect(prof2_After.rank.member).to.be.true;
      expect(prof2_After.rank.admin).to.be.false;
      expect(prof2_After.cData.id).to.be.equal(signer2.address);
    });

    it("PermissionLess: Should conclude the epoch", async function () {
      const {
        tAsset,
        factory,
        signers : { signer1, signer2, deployer },
        factoryAddr } = await loadFixture(deployContractsFixcture);

      // const signers = [signer1, signer2];
      const create = await createPermissionlessPool(
        {
          asset: tAsset,
          colCoverage: COLLATER_COVERAGE_RATIO,
          durationInHours: DURATION_IN_HOURS,
          factory: factory,
          intRate: INTEREST_RATE,
          quorum: QUORUM - 1,
          signer: signer1,
          unitLiquidity: UNIT_LIQUIDITY,
          deployer
        }
      );

      const join = await joinEpoch({
        contribution: create.pool.uint256s.unit,
        deployer,
        epochId: create.epochId,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset
      });

      /**
       * Signer1 borrow and paback.
       */
      const gf = await getFinance({
        epochId: create.epochId,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR 
      });
      
      await withdraw({
        asset: tAsset,
        epochId: create.epochId,
        factory,
        owner: formatAddr(gf.pool.addrs.strategy),
        spender: signer1,
        value: gf.profile.cData.loan
      });

      /**
       * We need to fastrack the block time to near the duration of choice of the borrower
       * to avoid being liquidated.
       * Note: DURATION_OF_CHOICE_IN_SEC is same as DURATION_OF_CHOICE_IN_HR but we 
       * reduce DURATION_OF_CHOICE_IN_SEC by 2sec to account for execution time.
       */
      const durOfChoiceInSec = BigInt((await time.latest()) + (DURATION_OF_CHOICE_IN_SECS));
      await time.increaseTo(durOfChoiceInSec);
      const debtToDate = await factory.getCurrentDebt(create.epochId, signer1.address);
      // console.log("debtToDate", debtToDate.toString());

      /**
       * We increase the time to give 3 sec for execution which is why we multiply interest per sec
       * by the number of seconds we increased by. This is to enable us give enough allowance to the 
       * factory contract since factory will always reply on the interest up to the current block. 
       */
      const debt = BigInt(bn(debtToDate).plus(bn(gf.pool.uint256s.intPerSec).times(bn(3))).toString());
      const pay = await payback({
        asset: tAsset,
        deployer,
        epochId: create.epochId,
        factory,
        debt,
        signers: [signer1]
      }); 

      // const profB4 = await factory.getProfile(create.epochId, signer1.address);
      // Before withdrawing collateral, the balance should be intact.
      expect(pay.profile.cData.colBals).to.be.equal(gf.profile.cData.colBals);

      await factory.connect(signer1).withdrawCollateral(create.epochId);
      const prof = await factory.getProfile(create.epochId, signer1.address);

      // Before withdrawing collateral, the balance should be intact.
      expect(prof.cData.colBals).to.be.equal(ZERO);

      /**
       * Signer2 Borrow and payback
       */
      const gf_2 = await getFinance({
        epochId: create.epochId,
        factory,
        signers: [signer2],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR 
      });
      
      await withdraw({
        asset: tAsset,
        epochId: create.epochId,
        factory,
        owner: formatAddr(gf_2.pool.addrs.strategy),
        spender: signer2,
        value: gf_2.profile.cData.loan
      });

      const durOfChoiceInSec_2 = BigInt((await time.latest()) + (DURATION_OF_CHOICE_IN_SECS));
      await time.increaseTo(durOfChoiceInSec_2);
      const debtToDate_2 = await factory.getCurrentDebt(create.epochId, signer2.address);
      // console.log("debtToDate", debtToDate.toString());

      /**
       * We increase the time to give 3 sec for execution which is why we multiply interest per sec
       * by the number of seconds we increased by. This is to enable us give enough allowance to the 
       * factory contract since factory will always reply on the interest up to the current block. 
       */
      const debt_2 = BigInt(bn(debtToDate_2).plus(bn(gf_2.pool.uint256s.intPerSec).times(bn(3))).toString());
      const pay_2 = await payback({
        asset: tAsset,
        deployer,
        epochId: create.epochId,
        factory,
        debt: debt_2,
        signers: [signer2]
      }); 

      // Before withdrawing collateral, the balance should be intact.
      // console.log(`Left: ${pay_2.profile.cData.colBals}\nRight: ${gf_2.profile.cData.colBals}`);
      expect(pay_2.profile.cData.colBals).to.be.equal(gf_2.profile.cData.colBals);

      // await factory.connect(signer1).withdrawCollateral(create.epochId); // If uncomment execution should fail.
      await factory.connect(signer2).withdrawCollateral(create.epochId);
      const prof_2 = await factory.getProfile(create.epochId, signer2.address);

      // Before withdrawing collateral, the balance should be intact.
      expect(prof_2.cData.colBals).to.be.equal(ZERO);

      /**
       * After all providers have borrowed, the pool balance should be zero.
       * All functions related to the epochId should not work
       */
      expect(pay_2.pool.uint256s.currentPool).to.be.equal(ZERO);

      expect(await factory.isFunctionCallable(create.epochId, FuncTag.JOIN)).to.be.equal(locker.LOCKED);
      expect(await factory.isFunctionCallable(create.epochId, FuncTag.GET)).to.be.equal(locker.LOCKED);
      expect(await factory.isFunctionCallable(create.epochId, FuncTag.PAYBACK)).to.be.equal(locker.LOCKED);
    });

    it("PermissionLess: Enquiring liquidation should return empty profile", async function () {
      const {
        tAsset,
        factory,
        signers : { signer1, signer2, signer3, deployer },
        factoryAddr } = await loadFixture(deployContractsFixcture);

      // const signers = [signer1, signer2];
      const create = await createPermissionlessPool(
        {
          asset: tAsset,
          colCoverage: COLLATER_COVERAGE_RATIO,
          durationInHours: DURATION_IN_HOURS,
          factory: factory,
          intRate: INTEREST_RATE,
          quorum: QUORUM - 1,
          signer: signer1,
          unitLiquidity: UNIT_LIQUIDITY,
          deployer
        }
      );

      await joinEpoch({
        contribution: create.pool.uint256s.unit,
        deployer,
        epochId: create.epochId,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset
      });

      const gf = await getFinance({
        epochId: create.epochId,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR 
      });
      
      await withdraw({
        asset: tAsset,
        epochId: create.epochId,
        factory,
        owner: formatAddr(gf.pool.addrs.strategy),
        spender: signer1,
        value: gf.profile.cData.loan
      });

      // Decrease the duration
      const durOfChoiceInSec_2 = BigInt((await time.latest()) + (DURATION_OF_CHOICE_IN_SECS - ONE_HOUR_ONE_MINUTE));
      await time.increaseTo(durOfChoiceInSec_2);

      /**
       * When the paydate is yet to come, enquiry should return nothing
       */
      const [profile, isDefaulted, value] = await enquireLiquidation({
        epochId: create.epochId,
        factory,
        signers: []
      });
      expect(profile.id).to.be.equal(ZeroAddress);
      expect(isDefaulted).to.be.false;
      expect(value).to.be.eq(ZERO);
    });

    it("PermissionLess: Enquiring liquidation should return defaiulter's profile", async function () {
      const {
        tAsset,
        factory,
        signers : { signer1, signer2, signer3, deployer },
        factoryAddr } = await loadFixture(deployContractsFixcture);

      // const signers = [signer1, signer2];
      const create = await createPermissionlessPool(
        {
          asset: tAsset,
          colCoverage: COLLATER_COVERAGE_RATIO,
          durationInHours: DURATION_IN_HOURS,
          factory: factory,
          intRate: INTEREST_RATE,
          quorum: QUORUM - 1,
          signer: signer1,
          unitLiquidity: UNIT_LIQUIDITY,
          deployer
        }
      );

      await joinEpoch({
        contribution: create.pool.uint256s.unit,
        deployer,
        epochId: create.epochId,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset
      });

      const gf = await getFinance({
        epochId: create.epochId,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR 
      });
      
      await withdraw({
        asset: tAsset,
        epochId: create.epochId,
        factory,
        owner: formatAddr(gf.pool.addrs.strategy),
        spender: signer1,
        value: gf.profile.cData.loan
      });

      // Increase the duration
      const future = BigInt((await time.latest()) + DURATION_OF_CHOICE_IN_SECS + ONE_HOUR_ONE_MINUTE);
      await time.increaseTo(future);

      /**
       * When the paydate has passed, enquiry should return defaulter's profile.
      */
      const debtToDate = await factory.getCurrentDebt(create.epochId, signer1.address);
      const [prof, defaulted, val] = await enquireLiquidation({
        epochId: create.epochId,
        factory,
        signers: []
      });
      // const [prof, defaulted, val] = await factory.enquireLiquidation(create.epochId);
      console.log(`DebtTodate: ${debtToDate.toString()}\nFromLiq: ${val.toString()}`);
      
      expect(prof.id).to.be.equal(signer1.address);
      expect(defaulted).to.be.true;
      expect(val).to.be.gte(debtToDate);     
    });

    /**
     * NOTE: IN THE FACTORY CONTRACT, WHEN THE REQUIRED QUORUM IS ACHIEVED, GETFINANCE IS OPENED 
     * TO THE NEXT BORROWER IN THE CONTRACT. IT HAPPENS ON FIRST-COME-FIRST-SERVED BASIS USING THE
     * SELECTOR. EXPECTED BORROWER HAVE AT LEAST ONE HOUR FROM THE TIME QUORUM IS ACHIEVED TO GF
     * OTHERWISE THEY CAN BE LIQUIDATED.
    */
    
    it("PermissionLess: Should liquidate borrower if defaulted", async function () {
      const {
        tAsset,
        factory,
        signers : { signer1, signer2, signer3, deployer },
        factoryAddr } = await loadFixture(deployContractsFixcture);

      const create = await createPermissionlessPool(
        {
          asset: tAsset,
          colCoverage: COLLATER_COVERAGE_RATIO,
          durationInHours: DURATION_IN_HOURS,
          factory: factory,
          intRate: INTEREST_RATE,
          quorum: QUORUM - 1,
          signer: signer1,
          unitLiquidity: UNIT_LIQUIDITY,
          deployer
        }
      );

      const join = await joinEpoch({
        contribution: create.pool.uint256s.unit,
        deployer,
        epochId: create.epochId,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset
      });

      const gf = await getFinance({
        epochId: create.epochId,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR 
      });
      
      await withdraw({
        asset: tAsset,
        epochId: create.epochId,
        factory,
        owner: formatAddr(gf.pool.addrs.strategy),
        spender: signer1,
        value: gf.profile.cData.loan
      });

      // Fastrack block time
      const future = BigInt((await time.latest()) + DURATION_OF_CHOICE_IN_SECS + ONE_HOUR_ONE_MINUTE);
      await time.increaseTo(future);

      const debtToDate = await factory.getCurrentDebt(create.epochId, signer1.address);
      const debt = BigInt(bn(debtToDate).plus(bn(gf.pool.uint256s.intPerSec).times(bn(ONE_HOUR_ONE_MINUTE + 3))).toString());
      const def = await factory.getProfile(create.epochId, signer1.address);
      const { liq: { balances: bal, pool: pl, profile: pr }, balB4Liq } = await liquidate({
        asset: tAsset,
        deployer,
        epochId: create.epochId,
        factory,
        signers: [signer3],
        debt: debt,
      });

      const balAferLiq = await tAsset.balanceOf(signer3.address);
      /** 
       * Liquidator should inherit the profile data of expected borrower except for id.
      */
      expect(pr.cData.id).to.be.equal(signer3.address);
      expect(pr.cData.colBals).to.be.equal(gf.profile.cData.colBals);
      expect(pr.cData.payDate).to.be.equal(def.cData.payDate);
      expect(pr.cData.durOfChoice).to.be.equal(def.cData.durOfChoice);
     
      expect(balAferLiq).to.be.lessThan(balB4Liq);
      
      // console.log(`balAferLiq: ${balAferLiq}\nbalB4Liq: ${balB4Liq}`);
      // console.log(`pr.cData.colBals: ${pr.cData.colBals.toString()}\nbalB4Liq: ${gf.profile.cData.colBals.toString()}`);
      expect(pr.cData.colBals).to.be.equal(gf.profile.cData.colBals);

      const xfiB4Withdrawal = await signer3.provider.getBalance(signer3.address);
      await factory.connect(signer3).withdrawCollateral(create.epochId);
      const prof_3 = await factory.getProfile(create.epochId, signer3.address);

      const balAfterWithdrawal = await tAsset.balanceOf(signer3.address);
      expect(balAfterWithdrawal).to.be.lt(balB4Liq);

      const xfiBalAfterWithdrawal = await signer3.provider.getBalance(signer3.address);
      expect(xfiBalAfterWithdrawal).to.be.gt(xfiB4Withdrawal);
      expect(prof_3.cData.colBals).to.be.equal(ZERO);
      expect(pl.uint256s.currentPool).to.be.equal(join.pool.uint256s.currentPool);

      expect(await factory.isFunctionCallable(create.epochId, FuncTag.JOIN)).to.be.equal(locker.LOCKED);
      expect(await factory.isFunctionCallable(create.epochId, FuncTag.GET)).to.be.equal(locker.UNLOCKED);
      expect(await factory.isFunctionCallable(create.epochId, FuncTag.PAYBACK)).to.be.equal(locker.LOCKED);
    });

    it("PermissionLess: Process should go as intended after liquidation", async function () {
      const {
        tAsset,
        factory,
        signers : { signer1, signer2, signer3, deployer },
        factoryAddr } = await loadFixture(deployContractsFixcture);

      const create = await createPermissionlessPool(
        {
          asset: tAsset,
          colCoverage: COLLATER_COVERAGE_RATIO,
          durationInHours: DURATION_IN_HOURS,
          factory: factory,
          intRate: INTEREST_RATE,
          quorum: QUORUM - 1,
          signer: signer1,
          unitLiquidity: UNIT_LIQUIDITY,
          deployer
        }
      );

      const join = await joinEpoch({
        contribution: create.pool.uint256s.unit,
        deployer,
        epochId: create.epochId,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset
      });

      const gf = await getFinance({
        epochId: create.epochId,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR 
      });
      
      await withdraw({
        asset: tAsset,
        epochId: create.epochId,
        factory,
        owner: formatAddr(gf.pool.addrs.strategy),
        spender: signer1,
        value: gf.profile.cData.loan
      });

      // Fastrack block time
      const future = BigInt((await time.latest()) + DURATION_OF_CHOICE_IN_SECS + ONE_HOUR_ONE_MINUTE);
      await time.increaseTo(future);

      const debtToDate = await factory.getCurrentDebt(create.epochId, signer1.address);
      const debt = BigInt(bn(debtToDate).plus(bn(gf.pool.uint256s.intPerSec).times(bn(ONE_HOUR_ONE_MINUTE + 3))).toString());
      const def = await factory.getProfile(create.epochId, signer1.address);
      const { liq: { balances: bal, pool: pl, profile: pr }, balB4Liq } = await liquidate({
        asset: tAsset,
        deployer,
        epochId: create.epochId,
        factory,
        signers: [signer3],
        debt: debt,
      });

      const gf_2 = await getFinance({
        epochId: create.epochId,
        factory,
        signers: [signer2],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR 
      });
      
      await withdraw({
        asset: tAsset,
        epochId: create.epochId,
        factory,
        owner: formatAddr(gf_2.pool.addrs.strategy),
        spender: signer2,
        value: gf_2.profile.cData.loan
      });

      const durOfChoiceInSec_2 = BigInt((await time.latest()) + (DURATION_OF_CHOICE_IN_SECS));
      await time.increaseTo(durOfChoiceInSec_2);
      const debtToDate_2 = await factory.getCurrentDebt(create.epochId, signer2.address);
      const debt_2 = BigInt(bn(debtToDate_2).plus(bn(gf_2.pool.uint256s.intPerSec).times(bn(3))).toString());
      const pay_2 = await payback({
        asset: tAsset,
        deployer,
        epochId: create.epochId,
        factory,
        debt: debt_2,
        signers: [signer2]
      }); 

      // Before withdrawing collateral, the balance should be intact.
      expect(pay_2.profile.cData.colBals).to.be.equal(gf_2.profile.cData.colBals);

      // await factory.connect(signer1).withdrawCollateral(create.epochId); // If uncomment execution should fail.
      await factory.connect(signer2).withdrawCollateral(create.epochId);
      const prof_2 = await factory.getProfile(create.epochId, signer2.address);

      // Before withdrawing collateral, the balance should be intact.
      expect(prof_2.cData.colBals).to.be.equal(ZERO);

      /**
       * After all providers have borrowed, the pool balance should be zero.
       * All functions related to the epochId should not work
       */
      expect(pay_2.pool.uint256s.currentPool).to.be.equal(ZERO);
      expect(await factory.isFunctionCallable(create.epochId, FuncTag.JOIN)).to.be.equal(locker.LOCKED);
      expect(await factory.isFunctionCallable(create.epochId, FuncTag.GET)).to.be.equal(locker.LOCKED);
      expect(await factory.isFunctionCallable(create.epochId, FuncTag.PAYBACK)).to.be.equal(locker.LOCKED);
    });

    it("PermissionLess: Should swap provider if they delay to GF", async function () {
      const {
        tAsset,
        factory,
        signers : { signer1, signer2, signer3, deployer },
        factoryAddr } = await loadFixture(deployContractsFixcture);

      // const signers = [signer1, signer2];
      const create = await createPermissionlessPool(
        {
          asset: tAsset,
          colCoverage: COLLATER_COVERAGE_RATIO,
          durationInHours: DURATION_IN_HOURS,
          factory: factory,
          intRate: INTEREST_RATE,
          quorum: QUORUM,
          signer: signer1,
          unitLiquidity: UNIT_LIQUIDITY,
          deployer
        }
      );

      const join = await joinEpoch({
        contribution: create.pool.uint256s.unit,
        deployer,
        epochId: create.epochId,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset
      });

      const join_3 = await joinEpoch({
        contribution: create.pool.uint256s.unit,
        deployer,
        epochId: create.epochId,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer3],
        testAsset: tAsset
      });

      /**
       * Uncomment this line before the GF time elapses should revert the transaction.
       */
      // const gf = await getFinance({
      //   epochId: create.epochId,
      //   factory,
      //   signers: [signer3],
      //   hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR 
      // });
      
      /**
       * NOTE: IN THE FACTORY CONTRACT, WHEN THE REQUIRED QUORUM IS ACHIEVED, GETFINANCE IS OPENED 
       * TO THE NEXT BORROWER IN THE CONTRACT. IT HAPPENS ON FIRST-COME-FIRST-SERVED BASIS USING THE
       * SELECTOR. EXPECTED BORROWER HAVE AT LEAST ONE HOUR FROM THE TIME QUORUM IS ACHIEVED TO GF
       * OTHERWISE THEY CAN BE LIQUIDATED.
      */

      const futureGthanTurnTime = BigInt((await time.latest()) + ONE_HOUR_ONE_MINUTE);
      await time.increaseTo(futureGthanTurnTime);

      /**
       * Signer1 borrow and paback.
       */
      const gf = await getFinance({
        epochId: create.epochId,
        factory,
        signers: [signer3],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR 
      });
      
      await withdraw({
        asset: tAsset,
        epochId: create.epochId,
        factory,
        owner: formatAddr(gf.pool.addrs.strategy),
        spender: signer3,
        value: gf.profile.cData.loan
      });

      /**
       * We need to fastrack the block time to near the duration of choice of the borrower
       * to avoid being liquidated.
       * Note: DURATION_OF_CHOICE_IN_SEC is same as DURATION_OF_CHOICE_IN_HR but we 
       * reduce DURATION_OF_CHOICE_IN_SEC by 2sec to account for execution time.
       */
      const durOfChoiceInSec = BigInt((await time.latest()) + (DURATION_OF_CHOICE_IN_SECS));
      await time.increaseTo(durOfChoiceInSec);
      // await time.increaseTo(durOfChoiceInSec);
      const debtToDate = await factory.getCurrentDebt(create.epochId, signer3.address);
      // console.log("debtToDate", debtToDate.toString());

      /**
       * We increase the time to give 3 sec for execution which is why we multiply interest per sec
       * by the number of seconds we increased by. This is to enable us give enough allowance to the 
       * factory contract since factory will always reply on the interest up to the current block. 
       */
      // console.log("debtToDate", debtToDate.toString())
      // console.log("gf.pool.uint256s.intPerSec", gf.pool.uint256s.intPerSec.toString())
      // const debt = BigInt(bn(debtToDate).plus(bn(gf.pool.uint256s.intPerSec).times(bn(3))).toString());
      const debt = BigInt(bn(debtToDate).plus(bn(gf.pool.uint256s.intPerSec).times(bn(3))).toString());
      const pay = await payback({
        asset: tAsset,
        deployer,
        epochId: create.epochId,
        factory,
        debt,
        signers: [signer3]
      }); 

      // const profB4 = await factory.getProfile(create.epochId, signer3.address);
      // Before withdrawing collateral, the balance should be intact.
      expect(pay.profile.cData.colBals).to.be.equal(gf.profile.cData.colBals);

      await factory.connect(signer3).withdrawCollateral(create.epochId);
      const prof = await factory.getProfile(create.epochId, signer3.address);

      // Before withdrawing collateral, the balance should be intact.
      expect(prof.cData.colBals).to.be.equal(ZERO);

      /**
       * Signer2 Borrow and payback
       */
      const gf_2 = await getFinance({
        epochId: create.epochId,
        factory,
        signers: [signer2],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR 
      });
      
      await withdraw({
        asset: tAsset,
        epochId: create.epochId,
        factory,
        owner: formatAddr(gf_2.pool.addrs.strategy),
        spender: signer2,
        value: gf_2.profile.cData.loan
      });

      const durOfChoiceInSec_2 = BigInt((await time.latest()) + (DURATION_OF_CHOICE_IN_SECS));
      await time.increaseTo(durOfChoiceInSec_2);
      const debtToDate_2 = await factory.getCurrentDebt(create.epochId, signer2.address);
      // console.log("debtToDate", debtToDate.toString());

      /**
       * We increase the time to give 3 sec for execution which is why we multiply interest per sec
       * by the number of seconds we increased by. This is to enable us give enough allowance to the 
       * factory contract since factory will always reply on the interest up to the current block. 
       */
      const debt_2 = BigInt(bn(debtToDate_2).plus(bn(gf_2.pool.uint256s.intPerSec).times(bn(3))).toString());
      const pay_2 = await payback({
        asset: tAsset,
        deployer,
        epochId: create.epochId,
        factory,
        debt: debt_2,
        signers: [signer2]
      }); 

      // console.log(`Left: ${pay_2.profile.cData.colBals}\nRight: ${gf_2.profile.cData.colBals}`);
      expect(pay_2.profile.cData.colBals).to.be.equal(gf_2.profile.cData.colBals);

      await factory.connect(signer2).withdrawCollateral(create.epochId);
      const prof_2 = await factory.getProfile(create.epochId, signer2.address);

      expect(prof_2.cData.colBals).to.be.equal(ZERO);
      expect(pay_2.pool.uint256s.currentPool).to.be.equal(join_3.pool.uint256s.currentPool);

      expect(await factory.isFunctionCallable(create.epochId, FuncTag.JOIN)).to.be.equal(locker.LOCKED);
      expect(await factory.isFunctionCallable(create.epochId, FuncTag.GET)).to.be.equal(locker.UNLOCKED);
      expect(await factory.isFunctionCallable(create.epochId, FuncTag.PAYBACK)).to.be.equal(locker.LOCKED);
    });
    
    it("PermissionLess: Should cancel band successfully", async function () {
      const {
        tAsset,
        factory,
        signers : { signer1, deployer }, } = await loadFixture(deployContractsFixcture);

      const create = await createPermissionlessPool(
        {
          asset: tAsset,
          colCoverage: COLLATER_COVERAGE_RATIO,
          durationInHours: DURATION_IN_HOURS,
          factory: factory,
          intRate: INTEREST_RATE,
          quorum: QUORUM,
          signer: signer1,
          unitLiquidity: UNIT_LIQUIDITY,
          deployer
        }
      );

      const signerB4Removal = await tAsset.balanceOf(signer1.address);
      
      await removeLiquidityPool({
        factory,
        epochId: create.epochId,
        signer: signer1
      });
      
      const signerBalAfterRemoval = await tAsset.balanceOf(signer1.address);
      
      // Balances after removal should remain intact
      expect(signerBalAfterRemoval).to.be.equal(signerB4Removal);

      /**
       * This is an indication that a pool was removed.
       */
      expect((await factory.getPoolData(create.epochId)).uints.quorum).to.be.equal(ZERO);
      
      await withdraw({
        asset: tAsset,
        epochId: create.epochId,
        factory,
        owner: formatAddr(create.pool.addrs.strategy),
        spender: signer1,
        value: create.pool.uint256s.unit
      });
      /**
       * Calling withdraw collateral should fail if uncommented.
       */
      // await factory.connect(signer1).withdrawCollateral(create.epochId);
      const signerBalAfterWithdrawal = await tAsset.balanceOf(signer1.address);
      const { erc20 } = await factory.getBalances(create.epochId);
      
      // Balances after withdrawal
      expect(erc20).to.be.equal(ZERO);
      expect(signerBalAfterWithdrawal).to.be.gt(signerBalAfterRemoval);

      expect(await factory.isFunctionCallable(create.epochId, FuncTag.JOIN)).to.be.equal(locker.LOCKED);
      expect(await factory.isFunctionCallable(create.epochId, FuncTag.GET)).to.be.equal(locker.LOCKED);
      expect(await factory.isFunctionCallable(create.epochId, FuncTag.PAYBACK)).to.be.equal(locker.LOCKED);
    });

  });
});

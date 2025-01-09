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
  TOTAL_LIQUIDITY,
  mulToString,
  DURATION_OF_CHOICE_IN_HR,
  DURATION_OF_CHOICE_IN_SECS,
  FuncTag,
  locker,
  ONE_HOUR_ONE_MINUTE
} from "./utilities";

import { 
  createPermissionedPool, 
  payback, 
  getFinance, 
  liquidate,
  enquireLiquidation,
  joinEpoch,
  getAddressFromSigners,
  withdraw,
  removeLiquidityPool
} from "./factoryUtils";
import { toBigInt, ZeroAddress } from "ethers";

describe("Permissioned", function () {

  async function deployContractsFixcture() {
    return { ...await deployContracts(ethers.getSigners) };
  }
  
  describe("Testing Permissioned Liquidity Pool", function () {
    it("Permissioned: Should create permissioned pool successfully", async function () {
      const {
        tAsset,
        factory,
        signers : { signer1, signer2, signer3, deployer },
      } = await loadFixture(deployContractsFixcture);

      const assetAddr = await tAsset.getAddress();
      const {
        balances, 
        epochId, 
        pool: { 
          addrs: { asset, strategy, lastPaid, admin }, 
          allGh, 
          uints: { colCoverage, duration, quorum, selector }, 
          uint256s: { currentPool, fullInterest, intPerSec, unit },
          cData: members
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
          contributors: getAddressFromSigners([signer1, signer2, signer3]),
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
      console.log(`IntPerSec: ${intPerSec.toString()}\nFullInterest: ${fullInterest.toString()}`)
      expect(quorum).to.be.equal(QUORUM, `Quorum parsed: ${QUORUM.toString()}, Quorum returned: ${quorum.toString()}`);
      expect(quorum).to.be.equal(toBigInt(3), `Quorum parsed: ${QUORUM.toString()}, Quorum returned: ${quorum.toString()}`);
      expect(colCoverage).to.be.equal(COLLATER_COVERAGE_RATIO);
      expect(duration.toString()).to.be.equal(DURATION_IN_SECS, `Duration ${duration.toString()} was not DURATION_IN_SECS ${DURATION_IN_SECS}`);
      expect(allGh).to.be.equal(ZERO);
      expect(selector).to.be.equal(ZERO);

      const prof_1 = await factory.getProfile(epochId, signer1.address);
      expect(prof_1.cData.id).to.be.equal(signer1.address);
      expect(members[0].cData.id).to.be.equal(signer1.address);
      expect(prof_1.rank.admin).to.be.true;
      expect(prof_1.slot).to.be.equal(ZERO);

      expect(cData.id).to.be.equal(signer1.address);
      expect(members[0].rank.admin).to.be.true;
      expect(members[0].slot).to.be.equal(ZERO);
      expect(slot).to.be.equal(ZERO, `Slot was different. Slot in contract is: ${slot}`);
      expect(rank.admin).to.be.true;
      expect(rank.member).to.be.true;

      const prof_2 = await factory.getProfile(epochId, signer2.address);
      const prof_3 = await factory.getProfile(epochId, signer3.address);

      // Equal address
      expect(prof_2.cData.id).to.be.equal(signer2.address);
      expect(prof_3.cData.id).to.be.equal(signer3.address);
      expect(members[1].cData.id).to.be.equal(signer2.address);
      expect(members[2].cData.id).to.be.equal(signer3.address);
      
      // Ranks
      expect(prof_2.rank.member).to.be.true;
      expect(prof_2.rank.admin).to.be.false;
      expect(members[1].rank.admin).to.be.false;
      expect(members[1].rank.member).to.be.true;
      expect(prof_3.rank.member).to.be.true;
      expect(prof_3.rank.admin).to.be.false;
      expect(members[2].rank.admin).to.be.false;
      expect(members[2].rank.member).to.be.true;
      
      // Slots
      expect(prof_2.slot).to.be.equal(1n);
      expect(prof_3.slot).to.be.equal(2n);
      expect(members[1].slot).to.be.equal(1n);
      expect(members[2].slot).to.be.equal(2n);
      
      // Router
      const router = await factory.getRouter(epochId);
      expect(router).to.be.equal("PERMISSIONED", `Error: Router different. Actual is ${router}`);
    });

    it("Permissioned: Should add providers successfully", async function () {
      const {
        tAsset,
        factory,
        signers : { signer1, signer2, signer3, deployer },
        factoryAddr } = await loadFixture(deployContractsFixcture);
        
      const create = await createPermissionedPool({
        asset: tAsset,
        colCoverage: COLLATER_COVERAGE_RATIO,
        durationInHours: DURATION_IN_HOURS,
        factory: factory,
        intRate: INTEREST_RATE,
        signer: signer1,
        unitLiquidity: UNIT_LIQUIDITY,
        contributors: getAddressFromSigners([signer1, signer2, signer3]),
        deployer
      });

      console.log("Create", create)

      const {
        balances: { erc20, xfi }, 
        pool: { uint256s: { currentPool,}},
       
      } = await joinEpoch({
        contribution: create.pool.uint256s.unit,
        deployer,
        epochId: create.pool.uint256s.epochId,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2, signer3],
        testAsset: tAsset
      });

      expect(currentPool).to.be.equal(TOTAL_LIQUIDITY);
      expect(erc20).to.be.equal(TOTAL_LIQUIDITY);
      expect(xfi).to.be.equal(ZERO);
    });

    it("Permissioned: Signer1 should borrow successfully", async function () {
      const {
        tAsset,
        factory,
        signers : { signer1, signer2, deployer },
        factoryAddr } = await loadFixture(deployContractsFixcture);

        const create = await createPermissionedPool({
          asset: tAsset,
          colCoverage: COLLATER_COVERAGE_RATIO,
          durationInHours: DURATION_IN_HOURS,
          factory: factory,
          intRate: INTEREST_RATE,
          signer: signer1,
          unitLiquidity: UNIT_LIQUIDITY,
          contributors: getAddressFromSigners([signer1, signer2]),
          deployer
        });
        // 9990000000000000000
        // 10000000000000000000
      const join = await joinEpoch({
        contribution: create.pool.uint256s.unit,
        deployer,
        epochId: create.pool.uint256s.epochId,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset
      });
      const turnTime = await time.latest();
      
      // Join function should be locked
      
      // GetFinance should be unlocked

      /**
       * Collateral required to getFinance;
       */
      const quoted = await factory.getCollaterlQuote(create.pool.uint256s.epochId);
      const gf = await getFinance({
        epochId: create.pool.uint256s.epochId,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR 
      });
      
      // Join function should remain locked
    
      // GetFinance should be be ulocked
      
      // Payback should be be ulocked
      
      expect(gf.balances?.xfi).to.be.equal(quoted.collateral);

      // ERC20 balances in strategy should remain thesame before claim.
      expect(gf.balances?.erc20).to.be.lt(join.balances.erc20); 
      expect(gf.pool.uints.selector).to.be.equal(BigInt(1));
      expect(gf.pool.uints.selector).to.be.greaterThan(join.pool.uints.selector);

      // console.log(`CData: ${gf.profile.cData}`);
      // console.log(`ColBal: ${gf.profile.cData.colBals.toString()} \nQuoted: ${quoted.collateral}`);
      expect(bn(gf.profile.cData.colBals).gte(bn((quoted.colCoverage)))).to.be.true;
      expect(gf.profile.rank.admin).to.be.true;
      expect(gf.profile.rank.member).to.be.true;

      // console.log(`CTurnTime: ${bn(gf.profile.cData.turnTime).toNumber()} \nLTurnTime: ${turnTime}`);
      expect(bn(gf.profile.cData.turnTime).toNumber()).to.be.gte(turnTime);
      
      // console.log(`CPayDate: ${bn(bn(gf.profile.cData.payDate).toNumber()).toNumber()} \nLPayDate: ${turnTime + DURATION_OF_CHOICE_IN_SECS}`);
      expect(bn(gf.profile.cData.payDate).toNumber()).to.be.gte(turnTime + DURATION_OF_CHOICE_IN_SECS);
      
      // console.log(`CurrentPool: ${gf.pool.uint256s.currentPool.toString()} \nLoan: ${gf.profile.cData.loan.toString()}`);
      expect(gf.pool.uint256s.currentPool).to.be.equal(ZERO);
      
      // console.log(`C.ExpInterest: ${gf.profile.cData.expInterest.toString()} \nLInterest: ${mulToString(gf.pool.uint256s.intPerSec, DURATION_OF_CHOICE_IN_SECS)}`);
      expect(gf.profile.cData.expInterest.toString()).to.be.approximately(mulToString(gf.pool.uint256s.intPerSec, DURATION_OF_CHOICE_IN_SECS), bn('12500000000000000'));

      expect(gf.profile.cData.durOfChoice).to.be.equal(BigInt(DURATION_OF_CHOICE_IN_SECS));

      const { balancesInStrategy, signerBalB4, signerBalAfter} = await withdraw({
        asset: tAsset,
        epochId: create.pool.uint256s.epochId,
        factory,
        owner: formatAddr(gf.pool.addrs.strategy),
        spender: signer1
        // value: gf.profile.cData.loan
      });
      
      console.log(`signerBalB4: ${signerBalB4.toString()} \nsignerBalAfter: ${signerBalAfter.toString()}\n `);
      // XFI balances in strategy should remain unchanged
      expect(balancesInStrategy.xfi).to.be.equal(quoted.collateral);
      
      expect(balancesInStrategy.erc20).to.be.equal(ZERO);
      expect(signerBalAfter).to.be.gt(signerBalB4);
      expect(signerBalAfter).to.be.lt(gf.profile.cData.loan);
    });

    it("Permissioned: Borrower should payback", async function () {
      const {
        tAsset,
        factory,
        signers : { signer1, signer2, deployer },
        factoryAddr } = await loadFixture(deployContractsFixcture);

      const signers = [signer1, signer2];
      const create = await createPermissionedPool({
        asset: tAsset,
        colCoverage: COLLATER_COVERAGE_RATIO,
        durationInHours: DURATION_IN_HOURS,
        factory: factory,
        intRate: INTEREST_RATE,
        signer: signer1,
        unitLiquidity: UNIT_LIQUIDITY,
        contributors: getAddressFromSigners(signers),
        deployer
      });

       // JOIN should be be unlocked
      
      // Payback should be be locked

      // Payback should be be locked

      // Payback should be be ulocked

      const join = await joinEpoch({
        contribution: create.pool.uint256s.unit,
        deployer,
        epochId: create.pool.uint256s.epochId,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset
      });

      // GetFinance should be be unlocked

      const gf = await getFinance({
        epochId: create.pool.uint256s.epochId,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR 
      });

      expect(gf.pool.uint256s.currentPool).to.be.equal(ZERO);

      // Payback should be be unlocked
      
      await withdraw({
        asset: tAsset,
        epochId: create.pool.uint256s.epochId,
        factory,
        owner: formatAddr(gf.pool.addrs.strategy),
        spender: signer1,
        // value: gf.profile.cData.loan
      });
      
      /**
       * We need to fastrack the block time to near the duration of choice of the borrower
       * to avoid being liquidated.
       * Note: DURATION_OF_CHOICE_IN_SEC is same as DURATION_OF_CHOICE_IN_HR but we 
       * reduce DURATION_OF_CHOICE_IN_SEC by 2sec to account for execution time.
       */
      const durOfChoiceInSec = BigInt((await time.latest()) + (DURATION_OF_CHOICE_IN_SECS));
      await time.increaseTo(durOfChoiceInSec);
      const debtToDate = await factory.getCurrentDebt(create.pool.uint256s.epochId, signer1.address);
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
        epochId: create.pool.uint256s.epochId,
        factory,
        debt,
        signers: [signer1]
      });

      // Payback should be be locked

      // After borrower repaid loan, the pool balance should be replenished.
      expect(pay.pool.uint256s.currentPool).to.be.equal(join.pool.uint256s.currentPool);
      
      // Before withdrawing collateral, the balance should be intact.
      expect(pay.profile.cData.colBals).to.be.equal(gf.profile.cData.colBals);
      
      expect(pay.balances.xfi).to.be.equal(gf.balances?.xfi);
      const balB4Withdrawal = await signer1.provider.getBalance(signer1.address);

      /**
       * After payback, borrower can now withdraw collateral from the contract.
       * Collateral balance after payback should be intact/equal after getFinance.
       */
      await factory.connect(signer1).withdrawCollateral(create.pool.uint256s.epochId);
      const prof = await factory.getProfile(create.pool.uint256s.epochId, signer1.address);
      const balAfterWithdrawal = await signer1.provider.getBalance(signer1.address);

      expect(prof.cData.colBals).to.be.equal(ZERO);
      expect(await signer1.provider.getBalance(pay.pool.addrs.strategy)).to.be.equal(ZERO);
      expect(balAfterWithdrawal).to.be.gt(balB4Withdrawal);
      // expect(prof.cData.hasGH).to.be.true;
      // expect((await factory.getProfile(create.pool.uint256s.epochId, signer2.address)).cData.hasGH).to.be.false;
    });

    it("Permissioned: Should conclude the epoch", async function () {
      const {
        tAsset,
        factory,
        signers : { signer1, signer2, deployer },
        factoryAddr } = await loadFixture(deployContractsFixcture);

      const signers = [signer1, signer2];
      const create = await createPermissionedPool({
        asset: tAsset,
        colCoverage: COLLATER_COVERAGE_RATIO,
        durationInHours: DURATION_IN_HOURS,
        factory: factory,
        intRate: INTEREST_RATE,
        signer: signer1,
        unitLiquidity: UNIT_LIQUIDITY,
        contributors: getAddressFromSigners(signers),
        deployer
      });

      await joinEpoch({
        contribution: create.pool.uint256s.unit,
        deployer,
        epochId: create.pool.uint256s.epochId,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset
      });

      /**
       * Signer1 borrow.
       */
      const gf = await getFinance({
        epochId: create.pool.uint256s.epochId,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR 
      });
      
      await withdraw({
        asset: tAsset,
        epochId: create.pool.uint256s.epochId,
        factory,
        owner: formatAddr(gf.pool.addrs.strategy),
        spender: signer1,
        // value: gf.profile.cData.loan
      });

      /**
       * We need to fastrack the block time to near the duration of choice of the borrower
       * to avoid being liquidated.
       * Note: DURATION_OF_CHOICE_IN_SEC is same as DURATION_OF_CHOICE_IN_HR but we 
       * reduce DURATION_OF_CHOICE_IN_SEC by 2sec to account for execution time.
       */
      const durOfChoiceInSec = BigInt((await time.latest()) + (DURATION_OF_CHOICE_IN_SECS));
      await time.increaseTo(durOfChoiceInSec);
      const debtToDate = await factory.getCurrentDebt(create.pool.uint256s.epochId, signer1.address);
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
        epochId: create.pool.uint256s.epochId,
        factory,
        debt,
        signers: [signer1]
      }); 

      // const profB4 = await factory.getProfile(create.pool.uint256s.epochId, signer1.address);
      // Before withdrawing collateral, the balance should be intact.
      expect(pay.profile.cData.colBals).to.be.equal(gf.profile.cData.colBals);

      await factory.connect(signer1).withdrawCollateral(create.pool.uint256s.epochId);
      const prof = await factory.getProfile(create.pool.uint256s.epochId, signer1.address);

      // Before withdrawing collateral, the balance should be intact.
      expect(prof.cData.colBals).to.be.equal(ZERO);

      /**
       * Signer2 Borrow and payback
       */
      const gf_2 = await getFinance({
        epochId: create.pool.uint256s.epochId,
        factory,
        signers: [signer2],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR 
      });
      
      await withdraw({
        asset: tAsset,
        epochId: create.pool.uint256s.epochId,
        factory,
        owner: formatAddr(gf_2.pool.addrs.strategy),
        spender: signer2,
        // value: gf_2.profile.cData.loan
      });

      const durOfChoiceInSec_2 = BigInt((await time.latest()) + (DURATION_OF_CHOICE_IN_SECS));
      await time.increaseTo(durOfChoiceInSec_2);
      const debtToDate_2 = await factory.getCurrentDebt(create.pool.uint256s.epochId, signer2.address);
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
        epochId: create.pool.uint256s.epochId,
        factory,
        debt: debt_2,
        signers: [signer2]
      }); 

      // Before withdrawing collateral, the balance should be intact.
      // console.log(`Left: ${pay_2.profile.cData.colBals}\nRight: ${gf_2.profile.cData.colBals}`);
      expect(pay_2.profile.cData.colBals).to.be.equal(gf_2.profile.cData.colBals);

      // await factory.connect(signer1).withdrawCollateral(create.pool.uint256s.epochId); // If uncomment execution should fail.
      await factory.connect(signer2).withdrawCollateral(create.pool.uint256s.epochId);
      const prof_2 = await factory.getProfile(create.pool.uint256s.epochId, signer2.address);

      // Before withdrawing collateral, the balance should be intact.
      expect(prof_2.cData.colBals).to.be.equal(ZERO);

      /**
       * After all providers have borrowed, the pool balance should be zero.
       * All functions related to the epochId should not work
       */
      expect(pay_2.pool.uint256s.currentPool).to.be.equal(ZERO);
    });

    it("Permissioned: Enquiring liquidation should return empty profile", async function () {
      const {
        tAsset,
        factory,
        signers : { signer1, signer2, signer3, deployer },
        factoryAddr } = await loadFixture(deployContractsFixcture);

      const signers = [signer1, signer2];
      const create = await createPermissionedPool({
        asset: tAsset,
        colCoverage: COLLATER_COVERAGE_RATIO,
        durationInHours: DURATION_IN_HOURS,
        factory: factory,
        intRate: INTEREST_RATE,
        signer: signer1,
        unitLiquidity: UNIT_LIQUIDITY,
        contributors: getAddressFromSigners(signers),
        deployer
      });

      await joinEpoch({
        contribution: create.pool.uint256s.unit,
        deployer,
        epochId: create.pool.uint256s.epochId,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset
      });

      const gf = await getFinance({
        epochId: create.pool.uint256s.epochId,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR 
      });
      
      await withdraw({
        asset: tAsset,
        epochId: create.pool.uint256s.epochId,
        factory,
        owner: formatAddr(gf.pool.addrs.strategy),
        spender: signer1,
        // value: gf.profile.cData.loan
      });

      // Decrease the duration
      const durOfChoiceInSec_2 = BigInt((await time.latest()) + (DURATION_OF_CHOICE_IN_SECS - ONE_HOUR_ONE_MINUTE));
      await time.increaseTo(durOfChoiceInSec_2);

      /**
       * When the paydate is yet to come, enquiry should return nothing
       */
      const [profile, isDefaulted, value] = await enquireLiquidation({
        epochId: create.pool.uint256s.epochId,
        factory,
        signers: []
      });
      expect(profile.cData.id).to.be.equal(ZeroAddress);
      expect(isDefaulted).to.be.false;
      expect(value).to.be.eq(ZERO);
    });

    it("Permissioned: Enquiring liquidation should return defaiulter's profile", async function () {
      const {
        tAsset,
        factory,
        signers : { signer1, signer2, signer3, deployer },
        factoryAddr } = await loadFixture(deployContractsFixcture);

      const signers = [signer1, signer2];
      const create = await createPermissionedPool({
        asset: tAsset,
        colCoverage: COLLATER_COVERAGE_RATIO,
        durationInHours: DURATION_IN_HOURS,
        factory: factory,
        intRate: INTEREST_RATE,
        signer: signer1,
        unitLiquidity: UNIT_LIQUIDITY,
        contributors: getAddressFromSigners(signers),
        deployer
      });

      await joinEpoch({
        contribution: create.pool.uint256s.unit,
        deployer,
        epochId: create.pool.uint256s.epochId,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset
      });

      const gf = await getFinance({
        epochId: create.pool.uint256s.epochId,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR 
      });
      
      await withdraw({
        asset: tAsset,
        epochId: create.pool.uint256s.epochId,
        factory,
        owner: formatAddr(gf.pool.addrs.strategy),
        spender: signer1,
        // value: gf.profile.cData.loan
      });

      // Increase the duration
      const future = BigInt((await time.latest()) + DURATION_OF_CHOICE_IN_SECS + ONE_HOUR_ONE_MINUTE);
      await time.increaseTo(future);

      /**
       * When the paydate has passed, enquiry should return defaulter's profile.
      */
      const debtToDate = await factory.getCurrentDebt(create.pool.uint256s.epochId, signer1.address);
      const [prof, defaulted, val] = await enquireLiquidation({
        epochId: create.pool.uint256s.epochId,
        factory,
        signers: []
      });
      // const [prof, defaulted, val] = await factory.enquireLiquidation(create.pool.uint256s.epochId);
      console.log(`DebtTodate: ${debtToDate.toString()}\nFromLiq: ${val.toString()}`);
      
      expect(prof.cData.id).to.be.equal(signer1.address);
      expect(defaulted).to.be.true;
      expect(val).to.be.gte(debtToDate);     
    });
    
    it("Permissioned: Should liquidate borrower if defaulted", async function () {
      const {
        tAsset,
        factory,
        signers : { signer1, signer2, signer3, deployer },
        factoryAddr } = await loadFixture(deployContractsFixcture);

      const signers = [signer1, signer2];
      const create = await createPermissionedPool({
        asset: tAsset,
        colCoverage: COLLATER_COVERAGE_RATIO,
        durationInHours: DURATION_IN_HOURS,
        factory: factory,
        intRate: INTEREST_RATE,
        signer: signer1,
        unitLiquidity: UNIT_LIQUIDITY,
        contributors: getAddressFromSigners(signers),
        deployer
      });

      const join = await joinEpoch({
        contribution: create.pool.uint256s.unit,
        deployer,
        epochId: create.pool.uint256s.epochId,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset
      });

      const gf = await getFinance({
        epochId: create.pool.uint256s.epochId,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR 
      });
      
      await withdraw({
        asset: tAsset,
        epochId: create.pool.uint256s.epochId,
        factory,
        owner: formatAddr(gf.pool.addrs.strategy),
        spender: signer1,
        // value: gf.profile.cData.loan
      });

      // Fastrack block time
      const future = BigInt((await time.latest()) + DURATION_OF_CHOICE_IN_SECS + ONE_HOUR_ONE_MINUTE);
      await time.increaseTo(future);

      const debtToDate = await factory.getCurrentDebt(create.pool.uint256s.epochId, signer1.address);
      const debt = BigInt(bn(debtToDate).plus(bn(gf.pool.uint256s.intPerSec).times(bn(ONE_HOUR_ONE_MINUTE + 3))).toString());
      const def = await factory.getProfile(create.pool.uint256s.epochId, signer1.address);
      const { liq: { balances: bal, pool: pl, profile: pr }, balB4Liq } = await liquidate({
        asset: tAsset,
        deployer,
        epochId: create.pool.uint256s.epochId,
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
      await factory.connect(signer3).withdrawCollateral(create.pool.uint256s.epochId);
      const prof_3 = await factory.getProfile(create.pool.uint256s.epochId, signer3.address);

      const balAfterWithdrawal = await tAsset.balanceOf(signer3.address);
      expect(balAfterWithdrawal).to.be.lt(balB4Liq);

      const xfiBalAfterWithdrawal = await signer3.provider.getBalance(signer3.address);
      expect(xfiBalAfterWithdrawal).to.be.gt(xfiB4Withdrawal);
      expect(prof_3.cData.colBals).to.be.equal(ZERO);
      expect(pl.uint256s.currentPool).to.be.equal(join.pool.uint256s.currentPool);
    });

    it("Permissioned: Process should go as intended after liquidation", async function () {
      const {
        tAsset,
        factory,
        signers : { signer1, signer2, signer3, deployer },
        factoryAddr } = await loadFixture(deployContractsFixcture);

      const signers = [signer1, signer2];
      const create = await createPermissionedPool({
        asset: tAsset,
        colCoverage: COLLATER_COVERAGE_RATIO,
        durationInHours: DURATION_IN_HOURS,
        factory: factory,
        intRate: INTEREST_RATE,
        signer: signer1,
        unitLiquidity: UNIT_LIQUIDITY,
        contributors: getAddressFromSigners(signers),
        deployer
      });

      await joinEpoch({
        contribution: create.pool.uint256s.unit,
        deployer,
        epochId: create.pool.uint256s.epochId,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset
      });

      const gf = await getFinance({
        epochId: create.pool.uint256s.epochId,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR 
      });
      
      await withdraw({
        asset: tAsset,
        epochId: create.pool.uint256s.epochId,
        factory,
        owner: formatAddr(gf.pool.addrs.strategy),
        spender: signer1,
        // value: gf.profile.cData.loan
      });

      // Fastrack block time
      const future = BigInt((await time.latest()) + DURATION_OF_CHOICE_IN_SECS + ONE_HOUR_ONE_MINUTE);
      await time.increaseTo(future);

      const debtToDate = await factory.getCurrentDebt(create.pool.uint256s.epochId, signer1.address);
      const debt = BigInt(bn(debtToDate).plus(bn(gf.pool.uint256s.intPerSec).times(bn(ONE_HOUR_ONE_MINUTE + 3))).toString());
      const def = await factory.getProfile(create.pool.uint256s.epochId, signer1.address);
      const { liq: { balances: bal, pool: pl, profile: pr }, balB4Liq } = await liquidate({
        asset: tAsset,
        deployer,
        epochId: create.pool.uint256s.epochId,
        factory,
        signers: [signer3],
        debt: debt,
      });

      const gf_2 = await getFinance({
        epochId: create.pool.uint256s.epochId,
        factory,
        signers: [signer2],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR 
      });
      
      await withdraw({
        asset: tAsset,
        epochId: create.pool.uint256s.epochId,
        factory,
        owner: formatAddr(gf_2.pool.addrs.strategy),
        spender: signer2,
        // value: gf_2.profile.cData.loan
      });

      const durOfChoiceInSec_2 = BigInt((await time.latest()) + (DURATION_OF_CHOICE_IN_SECS));
      await time.increaseTo(durOfChoiceInSec_2);
      const debtToDate_2 = await factory.getCurrentDebt(create.pool.uint256s.epochId, signer2.address);
      const debt_2 = BigInt(bn(debtToDate_2).plus(bn(gf_2.pool.uint256s.intPerSec).times(bn(3))).toString());
      const pay_2 = await payback({
        asset: tAsset,
        deployer,
        epochId: create.pool.uint256s.epochId,
        factory,
        debt: debt_2,
        signers: [signer2]
      }); 

      // Before withdrawing collateral, the balance should be intact.
      expect(pay_2.profile.cData.colBals).to.be.equal(gf_2.profile.cData.colBals);

      // await factory.connect(signer1).withdrawCollateral(create.pool.uint256s.epochId); // If uncomment execution should fail.
      await factory.connect(signer2).withdrawCollateral(create.pool.uint256s.epochId);
      const prof_2 = await factory.getProfile(create.pool.uint256s.epochId, signer2.address);

      // Before withdrawing collateral, the balance should be intact.
      expect(prof_2.cData.colBals).to.be.equal(ZERO);

      /**
       * After all providers have borrowed, the pool balance should be zero.
       * All functions related to the epochId should not work
       */
      expect(pay_2.pool.uint256s.currentPool).to.be.equal(ZERO);
    });

    it("Permissioned: Should swap provider if they delay to GF", async function () {
      const {
        tAsset,
        factory,
        signers : { signer1, signer2, signer3, deployer },
        factoryAddr } = await loadFixture(deployContractsFixcture);

      const signers = [signer1, signer2, signer3];
      const create = await createPermissionedPool({
        asset: tAsset,
        colCoverage: COLLATER_COVERAGE_RATIO,
        durationInHours: DURATION_IN_HOURS,
        factory: factory,
        intRate: INTEREST_RATE,
        signer: signer1,
        unitLiquidity: UNIT_LIQUIDITY,
        contributors: getAddressFromSigners(signers),
        deployer
      });

      await joinEpoch({
        contribution: create.pool.uint256s.unit,
        deployer,
        epochId: create.pool.uint256s.epochId,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset
      });

      const join_3 = await joinEpoch({
        contribution: create.pool.uint256s.unit,
        deployer,
        epochId: create.pool.uint256s.epochId,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer3],
        testAsset: tAsset
      });

      /**
       * Uncomment this line before the GF time elapses should make the test failed.
       * This is because signer3 is not expected at this time but signer 1.
       */
      // await getFinance({
      //   epochId: create.pool.uint256s.epochId,
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
        epochId: create.pool.uint256s.epochId,
        factory,
        signers: [signer3],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR 
      });
      
      await withdraw({
        asset: tAsset,
        epochId: create.pool.uint256s.epochId,
        factory,
        owner: formatAddr(gf.pool.addrs.strategy),
        spender: signer3,
        // value: gf.profile.cData.loan
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
      const debtToDate = await factory.getCurrentDebt(create.pool.uint256s.epochId, signer3.address);
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
        epochId: create.pool.uint256s.epochId,
        factory,
        debt,
        signers: [signer3]
      }); 

      // const profB4 = await factory.getProfile(create.pool.uint256s.epochId, signer3.address);
      // Before withdrawing collateral, the balance should be intact.
      expect(pay.profile.cData.colBals).to.be.equal(gf.profile.cData.colBals);

      await factory.connect(signer3).withdrawCollateral(create.pool.uint256s.epochId);
      const prof = await factory.getProfile(create.pool.uint256s.epochId, signer3.address);

      // Before withdrawing collateral, the balance should be intact.
      expect(prof.cData.colBals).to.be.equal(ZERO);

      /**
       * Signer2 Borrow and payback
       */
      const gf_2 = await getFinance({
        epochId: create.pool.uint256s.epochId,
        factory,
        signers: [signer2],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR 
      });
      
      await withdraw({
        asset: tAsset,
        epochId: create.pool.uint256s.epochId,
        factory,
        owner: formatAddr(gf_2.pool.addrs.strategy),
        spender: signer2,
        // value: gf_2.profile.cData.loan
      });

      const durOfChoiceInSec_2 = BigInt((await time.latest()) + (DURATION_OF_CHOICE_IN_SECS));
      await time.increaseTo(durOfChoiceInSec_2);
      const debtToDate_2 = await factory.getCurrentDebt(create.pool.uint256s.epochId, signer2.address);
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
        epochId: create.pool.uint256s.epochId,
        factory,
        debt: debt_2,
        signers: [signer2]
      }); 

      // console.log(`Left: ${pay_2.profile.cData.colBals}\nRight: ${gf_2.profile.cData.colBals}`);
      expect(pay_2.profile.cData.colBals).to.be.equal(gf_2.profile.cData.colBals);

      await factory.connect(signer2).withdrawCollateral(create.pool.uint256s.epochId);
      const prof_2 = await factory.getProfile(create.pool.uint256s.epochId, signer2.address);

      expect(prof_2.cData.colBals).to.be.equal(ZERO);
      expect(pay_2.pool.uint256s.currentPool).to.be.equal(join_3.pool.uint256s.currentPool);
    });

    it("Permissioned: Should cancel band successfully", async function () {
      const {
        tAsset,
        factory,
        signers : { signer1, signer2, deployer }, } = await loadFixture(deployContractsFixcture);

      const create = await createPermissionedPool({
        asset: tAsset,
        colCoverage: COLLATER_COVERAGE_RATIO,
        durationInHours: DURATION_IN_HOURS,
        factory: factory,
        intRate: INTEREST_RATE,
        signer: signer1,
        unitLiquidity: UNIT_LIQUIDITY,
        contributors: getAddressFromSigners([signer1, signer2]),
        deployer
      });

      const signerB4Removal = await tAsset.balanceOf(signer1.address);
      
      await removeLiquidityPool({
        factory,
        epochId: create.pool.uint256s.epochId,
        signer: signer1
      });
      
      const signerBalAfterRemoval = await tAsset.balanceOf(signer1.address);
      
      // Balances after removal should remain intact
      expect(signerBalAfterRemoval).to.be.equal(signerB4Removal);

      /**
       * This is an indication that a pool was removed.
       */
      expect((await factory.getPoolData(create.pool.uint256s.epochId)).uints.quorum).to.be.equal(ZERO);
      
      await withdraw({
        asset: tAsset,
        epochId: create.pool.uint256s.epochId,
        factory,
        owner: formatAddr(create.pool.addrs.strategy),
        spender: signer1,
        // value: create.pool.uint256s.unit
      });
      /**
       * Calling withdraw collateral should fail if uncommented.
       */
      // await factory.connect(signer1).withdrawCollateral(create.pool.uint256s.epochId);
      const signerBalAfterWithdrawal = await tAsset.balanceOf(signer1.address);
      const { erc20 } = await factory.getBalances(create.pool.uint256s.epochId);
      
      // Balances after withdrawal
      expect(erc20).to.be.equal(ZERO);
      expect(signerBalAfterWithdrawal).to.be.gt(signerBalAfterRemoval);
    });

  });                                                                       
});

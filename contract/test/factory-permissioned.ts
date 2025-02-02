import { deployContracts, retrieveContract } from "./deployments";
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
  ONE_HOUR_ONE_MINUTE,
  FuncTag,
  Status
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
import { ZeroAddress, } from "ethers";

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
        pool: { 
          pool: {
            addrs: { asset, bank, lastPaid, admin }, 
            status,
            stage, 
            uints: { colCoverage, duration, selector, allGh, }, 
            uint256s: { currentPool, fullInterest, intPerSec, unit, rId, unitId },
          },
          cData: members
        },
        profile: { id },
        slot: { value: position, isAdmin, isMember}
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

      const slot2 = await factory.getSlot(signer2.address, unit);
      const slot3 = await factory.getSlot(signer3.address, unit);
      const bankContract = await retrieveContract(formatAddr(bank));
      const bankData = await bankContract.getData();
      // Assertions
      expect(bankData.aggregateFee).to.be.eq(ZERO);
      expect(bankData.totalClients).to.be.eq(1n);
      expect(bn(status).toNumber()).to.be.equal(Status.TAKEN)

      expect(UNIT_LIQUIDITY).to.be.equal(unit);
      expect(bank === ZERO_ADDRESS).to.be.false;
      expect(admin).to.be.equal(signer1.address, "Error: Admin is zero address");
      expect(asset).to.be.equal(assetAddr, "Error: Asset was zero address");
      expect(balances?.xfi).to.be.equal(ZERO, `Error: xfi balance is ${balances?.xfi.toString()}`); // XFI balance in bank should be zero.
      expect(balances?.erc20).to.be.equal(UNIT_LIQUIDITY, `Error: ERC20 balance is ${balances?.erc20.toString()} as against ${UNIT_LIQUIDITY.toString()}`); // ERC20 balance in this epoch should correspond to the liquidity supplied.
      expect(lastPaid).to.be.equal(ZERO_ADDRESS, "Error: lastpaid was not zero address");

      expect(currentPool).to.be.equal(UNIT_LIQUIDITY);
      expect(intPerSec).to.be.greaterThan(ZERO);
      expect(fullInterest).to.be.greaterThan(ZERO);
      expect(colCoverage).to.be.equal(COLLATER_COVERAGE_RATIO);
      expect(duration.toString()).to.be.equal(DURATION_IN_SECS, `Duration ${duration.toString()} was not DURATION_IN_SECS ${DURATION_IN_SECS}`);
      expect(allGh).to.be.equal(ZERO);
      expect(selector).to.be.equal(ZERO);

      const prof_1 = await factory.getProfile(unit, signer1.address);
      expect(prof_1.id).to.be.equal(signer1.address);
      expect(members[0].id).to.be.equal(signer1.address);
      expect(members[1].id).to.be.equal(signer2.address);
      expect(members[2].id).to.be.equal(signer3.address);
      expect(id).to.be.equal(signer1.address);

      expect(isAdmin).to.be.true;
      expect(isMember).to.be.true;

      // Slots
      expect(slot2.isAdmin).to.be.false;
      expect(slot3.isAdmin).to.be.false;
      expect(slot2.isMember).to.be.true;
      expect(slot3.isMember).to.be.true;
      expect(slot2.value).to.be.eq(1n);
      expect(slot3.value).to.be.eq(2n);
      expect(position).to.be.equal(ZERO);
      

      const prof_2 = await factory.getProfile(unit, signer2.address);
      const prof_3 = await factory.getProfile(unit, signer3.address);

      // Equal address
      expect(prof_2.id).to.be.equal(signer2.address);
      expect(prof_3.id).to.be.equal(signer3.address);
      
      // Router
      const router = await factory.getRouter(unit);
      expect(router).to.be.equal("PERMISSIONED", `Error: Router different. Actual is ${router}`);
    });

    it("Permissioned: Should add users successfully", async function () {
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

      const {
        balances: { erc20, xfi }, 
        pool: { 
          pool: {
            uint256s: { currentPool,}
          }
        },
        profiles: [s1, s2]
      } = await joinEpoch({
        contribution: create.pool.pool.uint256s.unit,
        deployer,
        unit: create.pool.pool.uint256s.unit,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2, signer3],
        testAsset: tAsset
      });

      expect(currentPool).to.be.equal(TOTAL_LIQUIDITY);
      expect(erc20).to.be.equal(TOTAL_LIQUIDITY);
      expect(xfi).to.be.equal(ZERO);
      expect(s1.id).to.be.equal(signer2.address);
      expect(s2.id).to.be.equal(signer3.address);

      const bankContract = await retrieveContract(formatAddr(create.pool.pool.addrs.bank));
      const bankData = await bankContract.getData();
      // Assertions
      expect(bankData.aggregateFee).to.be.eq(ZERO);
      expect(bankData.totalClients).to.be.eq(3n);
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

      const join = await joinEpoch({
        contribution: create.pool.pool.uint256s.unit,
        deployer,
        unit: create.pool.pool.uint256s.unit,
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
      const quoted = await factory.getCollaterlQuote(create.pool.pool.uint256s.unit);
      const gf = await getFinance({
        unit: create.pool.pool.uint256s.unit,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR ,
        colQuote: quoted.collateral
      });
      
      // Join function should remain locked
    
      // GetFinance should be be ulocked
      
      // Payback should be be ulocked
      
      expect(gf.balances?.xfi).to.be.equal(quoted.collateral);

      // ERC20 balances in bank should remain thesame before claim.
      expect(gf.balances?.erc20).to.be.eq(join.balances.erc20); 
      expect(gf.pool.pool.uints.selector).to.be.eq(BigInt(1));
      expect(gf.pool.pool.uints.selector).to.be.greaterThan(join.pool.pool.uints.selector);

      expect(bn(gf.profile.colBals).gte(bn((quoted.colCoverage)))).to.be.true;
      expect(bn(gf.profile.turnTime).toNumber()).to.be.gte(turnTime);
      expect(bn(gf.profile.payDate).toNumber()).to.be.gte(turnTime + DURATION_OF_CHOICE_IN_SECS);
      expect(gf.pool.pool.uint256s.currentPool).to.be.equal(ZERO);
      expect(gf.profile.expInterest.toString()).to.be.approximately(mulToString(gf.pool.pool.uint256s.intPerSec, DURATION_OF_CHOICE_IN_SECS), bn('12500000000000000'));
      expect(gf.profile.durOfChoice).to.be.equal(BigInt(DURATION_OF_CHOICE_IN_SECS));

      const bankContract = await retrieveContract(formatAddr(gf.pool.pool.addrs.bank));
      const { aggregateFee,} = await bankContract.getData();
      const userData = await bankContract.getUserData(signer1.address, gf.pool.pool.uint256s.rId);
      expect(bn(aggregateFee).gt(0)).to.be.true;
      expect(userData.access).to.be.true;
      expect(userData.collateral.balance).to.be.eq(quoted.collateral);
      expect(userData.collateral.withdrawable).to.be.eq(0n);

      const { balancesInStrategy, signerBalB4, signerBalAfter} = await withdraw({
        asset: tAsset,
        unit: create.pool.pool.uint256s.unit,
        factory,
        owner: formatAddr(gf.pool.pool.addrs.bank),
        spender: signer1
      });
      
      expect(balancesInStrategy?.xfi).to.be.equal(quoted.collateral);
      expect(balancesInStrategy?.erc20).to.be.equal(aggregateFee);
      expect(signerBalAfter).to.be.gt(signerBalB4);
      expect(signerBalAfter).to.be.lt(gf.profile.loan);
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

      const join = await joinEpoch({
        contribution: create.pool.pool.uint256s.unit,
        deployer,
        unit: create.pool.pool.uint256s.unit,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset
      });

      const quoted = await factory.getCollaterlQuote(create.pool.pool.uint256s.unit);
      const gf = await getFinance({
        unit: create.pool.pool.uint256s.unit,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quoted.collateral
      });

      expect(gf.pool.pool.uint256s.currentPool).to.be.equal(ZERO);
      await withdraw({
        asset: tAsset,
        unit: create.pool.pool.uint256s.unit,
        factory,
        owner: formatAddr(gf.pool.pool.addrs.bank),
        spender: signer1,
      });
      
      /**
       * We need to fastrack the block time to near the duration of choice of the borrower
       * to avoid being liquidated.
       * Note: DURATION_OF_CHOICE_IN_SEC is same as DURATION_OF_CHOICE_IN_HR but we 
       * reduce DURATION_OF_CHOICE_IN_SEC by 2sec to account for execution time.
       */
      const durOfChoiceInSec = BigInt((await time.latest()) + (DURATION_OF_CHOICE_IN_SECS));
      await time.increaseTo(durOfChoiceInSec);
      const debtToDate = await factory.getCurrentDebt(create.pool.pool.uint256s.unit, signer1.address);

      /**
       * We increase the time to give 3 sec for execution which is why we multiply interest per sec
       * by the number of seconds we increased by. This is to enable us give enough allowance to the 
       * factory contract since factory will always reply on the interest up to the current block. 
       */
      const debt = BigInt(bn(debtToDate).plus(bn(gf.pool.pool.uint256s.intPerSec).times(bn(3))).toString());
      const pay = await payback({
        asset: tAsset,
        deployer,
        unit: create.pool.pool.uint256s.unit,
        factory,
        debt,
        signers: [signer1]
      });
      
      // console.log("Join: ", join.pool.pool.uint256s.currentPool.toString());
      // console.log("PAy: ", pay.pool.pool.uint256s.currentPool.toString());
      // After borrower repaid loan, the pool balance should be replenished.
      expect(pay.pool.pool.uint256s.currentPool).to.be.equal(join.pool.pool.uint256s.currentPool);
      
      // Collateral balances.
      expect(bn(pay.profile.colBals).isZero()).to.be.true;

      // We check the user's collateral balances with the bank are intact
      const bankContract = await retrieveContract(formatAddr(gf.pool.pool.addrs.bank));
      const { access, collateral: { balance, withdrawable }} = await bankContract.getUserData(signer1.address, create.pool.pool.uint256s.rId);
      expect(access).to.be.true;
      expect(balance).to.be.eq(0n);
      expect(withdrawable).to.be.eq(gf.profile.colBals);

      expect(pay.balances?.xfi).to.be.equal(gf.balances?.xfi);
      const balB4Withdrawal = await signer1.provider.getBalance(signer1.address);
      
      // Withdraw collateral from the bank and test
      await bankContract.connect(signer1).withdrawCollateral(create.pool.pool.uint256s.rId);
      const rs = await bankContract.getUserData(signer1.address, create.pool.pool.uint256s.rId);
      expect(rs.collateral.withdrawable).to.be.eq(0n);
      expect(rs.collateral.balance).to.be.eq(0n);
      
      const prof = await factory.getProfile(create.pool.pool.uint256s.unit, signer1.address);
      const balAfterWithdrawal = await signer1.provider.getBalance(signer1.address);

      expect(prof.colBals).to.be.equal(ZERO);
      expect(await signer1.provider.getBalance(pay.pool.pool.addrs.bank)).to.be.equal(ZERO);
      expect(balAfterWithdrawal).to.be.gt(balB4Withdrawal);
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
        contribution: create.pool.pool.uint256s.unit,
        deployer,
        unit: create.pool.pool.uint256s.unit,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset
      });

      /**
       * Signer1 borrow.
       */
      const quoted = await factory.getCollaterlQuote(create.pool.pool.uint256s.unit);
      const gf = await getFinance({
        unit: create.pool.pool.uint256s.unit,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quoted.collateral
      });
      
      await withdraw({
        asset: tAsset,
        unit: create.pool.pool.uint256s.unit,
        factory,
        owner: formatAddr(gf.pool.pool.addrs.bank),
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
      const debtToDate = await factory.getCurrentDebt(create.pool.pool.uint256s.unit, signer1.address);

      /**
       * We increase the time to give 3 sec for execution which is why we multiply interest per sec
       * by the number of seconds we increased by. This is to enable us give enough allowance to the 
       * factory contract since factory will always reply on the interest up to the current block. 
       */
      const debt = BigInt(bn(debtToDate).plus(bn(gf.pool.pool.uint256s.intPerSec).times(bn(3))).toString());
      const pay = await payback({
        asset: tAsset,
        deployer,
        unit: create.pool.pool.uint256s.unit,
        factory,
        debt,
        signers: [signer1]
      }); 

      // const profB4 = await factory.getProfile(create.pool.pool.uint256s.unit, signer1.address);
      // Before withdrawing collateral, the balance should be intact.
      expect(bn(pay.profile.colBals).lt(bn(gf.profile.colBals))).to.be.true;

      // await factory.connect(signer1).withdrawCollateral(create.pool.pool.uint256s.unit);
      const prof = await factory.getProfile(create.pool.pool.uint256s.unit, signer1.address);

      // Before withdrawing collateral, the balance should be intact.
      expect(prof.colBals).to.be.equal(ZERO);

      /**
       * Signer2 Borrow and payback
       */
      const gf_2 = await getFinance({
        unit: create.pool.pool.uint256s.unit,
        factory,
        signers: [signer2],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quoted.collateral
      });
      
      await withdraw({
        asset: tAsset,
        unit: create.pool.pool.uint256s.unit,
        factory,
        owner: formatAddr(gf_2.pool.pool.addrs.bank),
        spender: signer2,
        // value: gf_2.profile.cData.loan
      });

      const durOfChoiceInSec_2 = BigInt((await time.latest()) + (DURATION_OF_CHOICE_IN_SECS));
      await time.increaseTo(durOfChoiceInSec_2);
      const debtToDate_2 = await factory.getCurrentDebt(create.pool.pool.uint256s.unit, signer2.address);

      /**
       * We increase the time to give 3 sec for execution which is why we multiply interest per sec
       * by the number of seconds we increased by. This is to enable us give enough allowance to the 
       * factory contract since factory will always reply on the interest up to the current block. 
       */
      const debt_2 = BigInt(bn(debtToDate_2).plus(bn(gf_2.pool.pool.uint256s.intPerSec).times(bn(3))).toString());
      const pay_2 = await payback({
        asset: tAsset,
        deployer,
        unit: create.pool.pool.uint256s.unit,
        factory,
        debt: debt_2,
        signers: [signer2]
      }); 

      // When the last participant GF, the epoch is finalized, and th whole pool is wiped out. So collateral balances should read zero.
      expect(pay_2.profile.colBals).to.be.equal(ZERO);
      expect(pay_2.pool.pool.uint256s.currentPool).to.be.equal(ZERO);

      // We check the user's collateral balances with the bank are intact
      const bankContract = await retrieveContract(formatAddr(gf.pool.pool.addrs.bank));
      const s1 = await bankContract.getUserData(signer1.address, create.pool.pool.uint256s.rId);
      const s2 = await bankContract.getUserData(signer2.address, create.pool.pool.uint256s.rId);
      expect(s1.access).to.be.true;
      expect(s2.access).to.be.true;
      expect(s1.collateral.balance).to.be.eq(ZERO);
      expect(s2.collateral.balance).to.be.eq(ZERO);
      expect(s1.collateral.withdrawable).to.be.gt(ZERO);
      expect(s2.collateral.withdrawable).to.be.gt(ZERO);

      await bankContract.connect(signer1).withdrawCollateral(create.pool.pool.uint256s.rId);
      await bankContract.connect(signer2).withdrawCollateral(create.pool.pool.uint256s.rId);

      const s1After = await bankContract.getUserData(signer1.address, create.pool.pool.uint256s.rId);
      const s2After = await bankContract.getUserData(signer2.address, create.pool.pool.uint256s.rId);

      expect(s1After.access).to.be.false;
      expect(s2After.access).to.be.false;
      expect(s1After.collateral.balance).to.be.eq(ZERO);
      expect(s2After.collateral.balance).to.be.eq(ZERO);
      expect(s1After.collateral.withdrawable).to.be.eq(ZERO);
      expect(s2After.collateral.withdrawable).to.be.eq(ZERO);

      const { aggregateFee, totalClients} = await bankContract.getData();
      expect(totalClients).to.be.eq(ZERO);
      expect(aggregateFee).to.be.gt(ZERO);

      const bankBalance = await tAsset.balanceOf(gf.pool.pool.addrs.bank);
      expect(aggregateFee).to.be.lt(bankBalance);

      // Participants withdraw from the bank
      await withdraw({
        asset: tAsset,
        unit: create.pool.pool.uint256s.unit,
        factory,
        owner: formatAddr(gf_2.pool.pool.addrs.bank),
        spender: signer1,
      });
      await withdraw({
        asset: tAsset,
        unit: create.pool.pool.uint256s.unit,
        factory,
        owner: formatAddr(gf_2.pool.pool.addrs.bank),
        spender: signer2,
      });

      const data = await bankContract.getData();
      const bankBalance2 = await tAsset.balanceOf(gf.pool.pool.addrs.bank);
      expect(bn(bankBalance2).gte(bn(data.aggregateFee))).to.be.true;
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
        contribution: create.pool.pool.uint256s.unit,
        deployer,
        unit: create.pool.pool.uint256s.unit,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset
      });

      const quoted = await factory.getCollaterlQuote(create.pool.pool.uint256s.unit);
      const gf = await getFinance({
        unit: create.pool.pool.uint256s.unit,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quoted.collateral
      });
      
      await withdraw({
        asset: tAsset,
        unit: create.pool.pool.uint256s.unit,
        factory,
        owner: formatAddr(gf.pool.pool.addrs.bank),
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
        unit: create.pool.pool.uint256s.unit,
        factory,
        signers: []
      });
      expect(profile.id).to.be.equal(ZeroAddress);
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
        contribution: create.pool.pool.uint256s.unit,
        deployer,
        unit: create.pool.pool.uint256s.unit,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset
      });

      const quoted = await factory.getCollaterlQuote(create.pool.pool.uint256s.unit);
      const gf = await getFinance({
        unit: create.pool.pool.uint256s.unit,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quoted.collateral
      });
      
      await withdraw({
        asset: tAsset,
        unit: create.pool.pool.uint256s.unit,
        factory,
        owner: formatAddr(gf.pool.pool.addrs.bank),
        spender: signer1,
      });

      // Increase the duration
      const future = BigInt((await time.latest()) + DURATION_OF_CHOICE_IN_SECS + ONE_HOUR_ONE_MINUTE);
      await time.increaseTo(future);

      /**
       * When the paydate has passed, enquiry should return defaulter's profile.
      */
      const debtToDate = await factory.getCurrentDebt(create.pool.pool.uint256s.unit, signer1.address);
      const [prof, defaulted, val] = await enquireLiquidation({
        unit: create.pool.pool.uint256s.unit,
        factory,
        signers: []
      });
      expect(prof.id).to.be.equal(signer1.address);
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
        contribution: create.pool.pool.uint256s.unit,
        deployer,
        unit: create.pool.pool.uint256s.unit,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset
      });

      const quoted = await factory.getCollaterlQuote(create.pool.pool.uint256s.unit);
      const gf = await getFinance({
        unit: create.pool.pool.uint256s.unit,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quoted.collateral
      });
      
      await withdraw({
        asset: tAsset,
        unit: create.pool.pool.uint256s.unit,
        factory,
        owner: formatAddr(gf.pool.pool.addrs.bank),
        spender: signer1,
      });

      // Fastrack block time
      const future = BigInt((await time.latest()) + DURATION_OF_CHOICE_IN_SECS + ONE_HOUR_ONE_MINUTE);
      await time.increaseTo(future);

      const debtToDate = await factory.getCurrentDebt(create.pool.pool.uint256s.unit, signer1.address);
      const debt = BigInt(bn(debtToDate).plus(bn(gf.pool.pool.uint256s.intPerSec).times(bn(ONE_HOUR_ONE_MINUTE + 3))).toString());
      // const defaulter = await factory.getProfile(create.pool.pool.uint256s.unit, signer1.address);
      const bankContract = await retrieveContract(formatAddr(gf.pool.pool.addrs.bank));
      const s3BfLiq = await bankContract.getUserData(signer3.address, create.pool.pool.uint256s.rId);
      expect(s3BfLiq.access).to.be.false;
      const { liq: { balances: bal, pool: pl, profile: pr }, balB4Liq } = await liquidate({
        asset: tAsset,
        deployer,
        unit: create.pool.pool.uint256s.unit,
        factory,
        signers: [signer3],
        debt: debt,
      });
      const s3AfterLiq = await bankContract.getUserData(signer3.address, create.pool.pool.uint256s.rId);
      expect(s3AfterLiq.access).to.be.true;
      expect(s3AfterLiq.collateral.balance).to.be.eq(ZERO);
      expect(s3AfterLiq.collateral.withdrawable).to.be.eq(gf.profile.colBals);

      const balAferLiq = await tAsset.balanceOf(signer3.address);
      /** 
       * Liquidator should inherit the profile data of expected borrower except for id.
      */
      expect(pr.id).to.be.equal(signer3.address);
      expect(pr.colBals).to.be.equal(ZERO);
      expect(pr.payDate).to.be.equal(gf.profile.payDate);
      expect(pr.durOfChoice).to.be.equal(gf.profile.durOfChoice);
      expect(balAferLiq).to.be.lessThan(balB4Liq);
      
      const xfiB4Withdrawal = await signer3.provider.getBalance(signer3.address);
      await bankContract.connect(signer3).withdrawCollateral(create.pool.pool.uint256s.rId);

      // const balAfterWithdrawal = await tAsset.balanceOf(signer3.address);
      // expect(balAfterWithdrawal).to.be.lt(balB4Liq);
      const xfiBalAfterWithdrawal = await signer3.provider.getBalance(signer3.address);
      expect(xfiBalAfterWithdrawal).to.be.gt(xfiB4Withdrawal);
      expect(pl.pool.uint256s.currentPool).to.be.equal(join.pool.pool.uint256s.currentPool);

      const s1 = await bankContract.getUserData(signer1.address, create.pool.pool.uint256s.rId);
      const s3AfterWit = await bankContract.getUserData(signer3.address, create.pool.pool.uint256s.rId);

      expect(s1.access).to.be.false;
      expect(s1.collateral.balance).to.be.eq(ZERO);
      expect(s1.collateral.withdrawable).to.be.eq(ZERO);
      
      expect(s3AfterWit.access).to.be.false;
      expect(s3AfterWit.collateral.balance).to.be.eq(ZERO);
      expect(s3AfterWit.collateral.withdrawable).to.be.eq(ZERO);

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
        contribution: create.pool.pool.uint256s.unit,
        deployer,
        unit: create.pool.pool.uint256s.unit,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset
      });

      const quoted = await factory.getCollaterlQuote(create.pool.pool.uint256s.unit);
      const gf = await getFinance({
        unit: create.pool.pool.uint256s.unit,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quoted.collateral
      });
      
      await withdraw({
        asset: tAsset,
        unit: create.pool.pool.uint256s.unit,
        factory,
        owner: formatAddr(gf.pool.pool.addrs.bank),
        spender: signer1,
      });

      // Fastrack block time
      const future = BigInt((await time.latest()) + DURATION_OF_CHOICE_IN_SECS + ONE_HOUR_ONE_MINUTE);
      await time.increaseTo(future);

      const debtToDate = await factory.getCurrentDebt(create.pool.pool.uint256s.unit, signer1.address);
      const debt = BigInt(bn(debtToDate).plus(bn(gf.pool.pool.uint256s.intPerSec).times(bn(ONE_HOUR_ONE_MINUTE + 3))).toString());
      // const def = await factory.getProfile(create.pool.pool.uint256s.unit, signer1.address);
      await liquidate({
        asset: tAsset,
        deployer,
        unit: create.pool.pool.uint256s.unit,
        factory,
        signers: [signer3],
        debt: debt,
      });

      const bankContract = await retrieveContract(formatAddr(gf.pool.pool.addrs.bank));
      await bankContract.connect(signer3).withdrawCollateral(create.pool.pool.uint256s.rId);
      const quote2 = await factory.getCollaterlQuote(create.pool.pool.uint256s.unit);
      const gf_2 = await getFinance({
        unit: create.pool.pool.uint256s.unit,
        factory,
        signers: [signer2],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quote2.collateral
      });
      
      await withdraw({
        asset: tAsset,
        unit: create.pool.pool.uint256s.unit,
        factory,
        owner: formatAddr(gf_2.pool.pool.addrs.bank),
        spender: signer2,
      });

      const durOfChoiceInSec_2 = BigInt((await time.latest()) + (DURATION_OF_CHOICE_IN_SECS));
      await time.increaseTo(durOfChoiceInSec_2);
      const debtToDate_2 = await factory.getCurrentDebt(create.pool.pool.uint256s.unit, signer2.address);
      const debt_2 = BigInt(bn(debtToDate_2).plus(bn(gf_2.pool.pool.uint256s.intPerSec).times(bn(3))).toString());
      const pay_2 = await payback({
        asset: tAsset,
        deployer,
        unit: create.pool.pool.uint256s.unit,
        factory,
        debt: debt_2,
        signers: [signer2]
      }); 

      // Before withdrawing collateral, the balance should be intact.
      expect(pay_2.profile.colBals).to.be.equal(ZERO);
      const prof_2 = await factory.getProfile(create.pool.pool.uint256s.unit, signer2.address);

      // Before withdrawing collateral, the balance should be intact.
      expect(prof_2.colBals).to.be.equal(ZERO);
      expect(pay_2.pool.pool.uint256s.currentPool).to.be.equal(ZERO);

      // Checking that the slot for the just-concluded epoch is empty
      const _p = await factory.getPoolData(pay_2.pool.pool.uint256s.unitId);
      expect(_p.pool.uints.allGh).to.be.eq(ZERO);
      expect(_p.pool.uints.colCoverage).to.be.eq(ZERO);
      expect(_p.pool.uints.duration).to.be.eq(ZERO);
      expect(_p.pool.uint256s.unit).to.be.eq(ZERO);
      expect(_p.pool.uint256s.unitId).to.be.eq(ZERO);
      expect(_p.pool.uint256s.currentPool).to.be.eq(ZERO);

      // Checking record
      const recordEpoches = await factory.getRecordEpoches();
      expect(recordEpoches).to.be.eq(1n);
      const record = await factory.getRecord(recordEpoches);
      expect(record.pool.uint256s.unit).to.be.eq(gf_2.pool.pool.uint256s.unit);
      expect(record.cData.length).to.be.eq(2n);

    });

    it("Permissioned: Should swap participant if they delay to GF", async function () {
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
        contribution: create.pool.pool.uint256s.unit,
        deployer,
        unit: create.pool.pool.uint256s.unit,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset
      });

      const join_3 = await joinEpoch({
        contribution: create.pool.pool.uint256s.unit,
        deployer,
        unit: create.pool.pool.uint256s.unit,
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
      //   unit: create.pool.pool.uint256s.unit,
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

      const bankContract = await retrieveContract(formatAddr(join_3.pool.pool.addrs.bank));
      const quoted = await factory.getCollaterlQuote(create.pool.pool.uint256s.unit);

      /**
       * Signer3 takes advantage of signer1 procastination.
       */
      const gf = await getFinance({
        unit: create.pool.pool.uint256s.unit,
        factory,
        signers: [signer3],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quoted.collateral
      });
      
      await withdraw({
        asset: tAsset,
        unit: create.pool.pool.uint256s.unit,
        factory,
        owner: formatAddr(gf.pool.pool.addrs.bank),
        spender: signer3,
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
      const debtToDate = await factory.getCurrentDebt(create.pool.pool.uint256s.unit, signer3.address);

      /**
       * We increase the time to give 3 sec for execution which is why we multiply interest per sec
       * by the number of seconds we increased by. This is to enable us give enough allowance to the 
       * factory contract since factory will always reply on the interest up to the current block. 
       */
      const debt = BigInt(bn(debtToDate).plus(bn(gf.pool.pool.uint256s.intPerSec).times(bn(3))).toString());
      const pay = await payback({
        asset: tAsset,
        deployer,
        unit: create.pool.pool.uint256s.unit,
        factory,
        debt,
        signers: [signer3]
      }); 
      await bankContract.connect(signer3).withdrawCollateral(create.pool.pool.uint256s.rId);
      // const profB4 = await factory.getProfile(create.pool.pool.uint256s.unit, signer3.address);
      // Before withdrawing collateral, the balance should be intact.
      expect(pay.profile.colBals).to.be.equal(ZERO);

      // await factory.connect(signer3).withdrawCollateral(create.pool.pool.uint256s.unit);
      const prof = await factory.getProfile(create.pool.pool.uint256s.unit, signer3.address);

      // Before withdrawing collateral, the balance should be intact.
      expect(prof.colBals).to.be.equal(ZERO);

      const quoted_2 = await factory.getCollaterlQuote(create.pool.pool.uint256s.unit);
      /**
       * Signer2 Borrow and payback
       */
      const gf_2 = await getFinance({
        unit: create.pool.pool.uint256s.unit,
        factory,
        signers: [signer2],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quoted_2.collateral
      });
      
      await withdraw({
        asset: tAsset,
        unit: create.pool.pool.uint256s.unit,
        factory,
        owner: formatAddr(gf_2.pool.pool.addrs.bank),
        spender: signer2,
      });

      const durOfChoiceInSec_2 = BigInt((await time.latest()) + (DURATION_OF_CHOICE_IN_SECS));
      await time.increaseTo(durOfChoiceInSec_2);
      const debtToDate_2 = await factory.getCurrentDebt(create.pool.pool.uint256s.unit, signer2.address);

      /**
       * We increase the time to give 3 sec for execution which is why we multiply interest per sec
       * by the number of seconds we increased by. This is to enable us give enough allowance to the 
       * factory contract since factory will always reply on the interest up to the current block. 
       */
      const debt_2 = BigInt(bn(debtToDate_2).plus(bn(gf_2.pool.pool.uint256s.intPerSec).times(bn(3))).toString());
      const pay_2 = await payback({
        asset: tAsset,
        deployer,
        unit: create.pool.pool.uint256s.unit,
        factory,
        debt: debt_2,
        signers: [signer2]
      }); 
      await bankContract.connect(signer2).withdrawCollateral(create.pool.pool.uint256s.rId);
      expect(pay_2.profile.colBals).to.be.equal(ZERO);

      // Since the pool is not finalized, the currentPool amount to be retained
      expect(pay_2.pool.pool.uint256s.currentPool).to.be.equal(pay.pool.pool.uint256s.currentPool);
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

      const balB4Removal = await tAsset.balanceOf(signer1.address);
      
      await removeLiquidityPool({
        factory,
        unit: create.pool.pool.uint256s.unit,
        signer: signer1
      });
      
      const signerBalAfterRemoval = await tAsset.balanceOf(signer1.address);
      
      // Balances after removal should remain intact
      expect(signerBalAfterRemoval).to.be.equal(balB4Removal);
      const recordEpoches = await factory.getRecordEpoches();
      const record = await factory.getRecord(recordEpoches);
      expect(record.pool.stage).to.be.eq(FuncTag.CANCELED);

      /**
       * This is an indication that a pool was removed.
       */
      expect((await factory.getPoolData(create.pool.pool.uint256s.unit)).pool.uints.quorum).to.be.equal(ZERO);
      
      await withdraw({
        asset: tAsset,
        unit: create.pool.pool.uint256s.unit,
        factory,
        owner: formatAddr(create.pool.pool.addrs.bank),
        spender: signer1,
      });
      /**
       * Calling withdraw collateral should fail if uncommented.
       */
      // await factory.connect(signer1).withdrawCollateral(create.pool.pool.uint256s.unit);
      const signerBalAfterWithdrawal = await tAsset.balanceOf(signer1.address);
      const { erc20 } = await factory.getBalances(create.pool.pool.uint256s.unit);
      
      // Balances after withdrawal
      expect(erc20).to.be.equal(ZERO);
      expect(signerBalAfterWithdrawal).to.be.gt(signerBalAfterRemoval);
    });

    it("Permissioned: Testing for reverts", async function () {
      const {
        tAsset,
        factory,
        signers : { signer1, signer2, deployer }, } = await loadFixture(deployContractsFixcture);

      await createPermissionedPool({
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

      // Remove liquidity
      await removeLiquidityPool({
        factory,
        unit: UNIT_LIQUIDITY,
        signer: signer1
      });

      // After removing liquidity, we should be able to resuse the spot
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

      await factory.getPoolData(create.pool.pool.uint256s.unitId);

      // Calling getFinance should fail
      const quoted_2 = await factory.getCollaterlQuote(create.pool.pool.uint256s.unit);
      await expect(getFinance({
        unit: create.pool.pool.uint256s.unit,
        factory,
        signers: [signer2],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quoted_2.collateral
      })).to.be.revertedWith("Borrow not ready");

      /**
       * This is an indication that a pool was removed.
       */
      expect((await factory.getPoolData(create.pool.pool.uint256s.unit)).pool.uints.quorum).to.be.equal(ZERO);
      
      await withdraw({
        asset: tAsset,
        unit: create.pool.pool.uint256s.unit,
        factory,
        owner: formatAddr(create.pool.pool.addrs.bank),
        spender: signer1,
        // value: create.pool.pool.uint256s.unit
      });
      /**
       * Calling withdraw collateral should fail if uncommented.
       */
      // await factory.connect(signer1).withdrawCollateral(create.pool.pool.uint256s.unit);
      const signerBalAfterWithdrawal = await tAsset.balanceOf(signer1.address);
      const { erc20 } = await factory.getBalances(create.pool.pool.uint256s.unit);
    });

  });                                                                       
});

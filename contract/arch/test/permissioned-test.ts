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
  ONE_HOUR_ONE_MINUTE,
  Stage,
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
  removeLiquidityPool,
  getBalance
} from "./factoryUtils";
import { ZeroAddress, } from "ethers";

describe("Permissioned", function () {

  async function deployContractsFixcture() {
    return { ...await deployContracts(ethers.getSigners) };
  }
  
  describe("Testing Permissioned Liquidity Pool", function () {
    it("Permissioned: Should create permissioned pool successfully", async function () {
      const {
        assetBase,
        assetBaseAddr,
        factory,
        collateralToken,
        signers : { signer1, signer2, signer3, deployer },
        retrieveSafe,
      } = await loadFixture(deployContractsFixcture);

      const {
        pool: {
          addrs: { asset, beneficiary, admin,  }, 
          lInt: { colCoverage, duration, router, quorum, stage, status, allGH }, 
          bigInt: { currentPool, unit, recordId, unitId,},
          interest: { intPerChoiceOfDur, intPerSec, fullInterest}
        },
        profiles: [prof1, prof2, prof3],
        slots
      } = await createPermissionedPool(
        {
          asset: assetBase,
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
      console.log("Duration", duration.toString())

      // await factory.getSlot(signer2.address, unit);
      // await factory.getSlot(signer3.address, unit);
      const bank = formatAddr(await factory.getSafe(unit));
      const safe = await retrieveSafe(bank);
      const bankData = await safe.getData(unitId);
      const userCount = await factory.getUserCount(unit);
      const { assetBaseBalance,collateralBalance } = await getBalance({target: bank, testAsset: assetBase, collateralAsset: collateralToken})
      // Assertions
      expect(bankData.aggregateFee).to.be.eq(ZERO);
      expect(bankData.totalClients).to.be.eq(1n);
      expect(bn(status).toNumber()).to.be.equal(Status.TAKEN)

      expect(UNIT_LIQUIDITY).to.be.equal(unit);
      expect(bank === ZERO_ADDRESS).to.be.false;
      expect(admin).to.be.equal(signer1.address, "Error: Admin is zero address");
      expect(asset).to.be.equal(assetBaseAddr, "Error: Asset was zero address");
      expect(collateralBalance).to.be.equal(ZERO); // Collateral balance in bank should be zero.
      expect(assetBaseBalance).to.be.equal(UNIT_LIQUIDITY); // AssetBase balance in this epoch should correspond to the liquidity supplied.
      expect(beneficiary).to.be.equal(ZERO_ADDRESS, "Error: lastpaid was not zero address");

      expect(currentPool).to.be.equal(UNIT_LIQUIDITY);
      expect(intPerSec).to.be.greaterThan(ZERO);
      expect(fullInterest).to.be.greaterThan(ZERO);
      expect(colCoverage).to.be.equal(COLLATER_COVERAGE_RATIO);
      expect(bn(duration).toNumber()).to.be.equal(DURATION_IN_SECS, `Duration ${duration} was not DURATION_IN_SECS ${DURATION_IN_SECS}`);
      expect(allGH).to.be.equal(ZERO);
      expect(userCount).to.be.equal(3n);

      expect(prof1.id).to.be.equal(signer1.address);
      expect(prof2.id).to.be.equal(signer2.address);
      expect(prof3.id).to.be.equal(signer3.address);
      expect(prof2.isMember).to.be.true;
      expect(prof3.isMember).to.be.true;
      expect(slots[0]).to.be.eq(ZERO);
      expect(slots[1]).to.be.eq(1n);
      expect(slots[2]).to.be.eq(2n);
      
      // Router
      const routerString = await factory.routers(unit);
      expect(router).to.be.eq(1n);
      expect(routerString).to.be.equal("PERMISSIONED", `Error: Router different. Actual is ${router}`);
    });

    it("Permissioned: Should add users successfully", async function () {
      const {
        assetBase,
        factory,
        collateralToken, 
        retrieveSafe,
        signers : { signer1, signer2, signer3, deployer },
        factoryAddr } = await loadFixture(deployContractsFixcture);
        
      const create = await createPermissionedPool({
        asset: assetBase,
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
        pool: { 
          bigInt: { currentPool,}
        },
        profiles: [s1, s2]
      } = await joinEpoch({
        contribution: create.pool.bigInt.unit,
        deployer,
        unit: create.pool.bigInt.unit,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2, signer3],
        testAsset: assetBase
      }); 

      const bank = formatAddr(await factory.getSafe(create.pool.bigInt.unit));
      const { assetBaseBalance,collateralBalance } = await getBalance({target: bank, testAsset: assetBase, collateralAsset: collateralToken})
      expect(currentPool).to.be.equal(TOTAL_LIQUIDITY);
      expect(assetBaseBalance).to.be.equal(TOTAL_LIQUIDITY);
      expect(collateralBalance).to.be.equal(ZERO);
      expect(s1.id).to.be.equal(signer2.address);
      expect(s2.id).to.be.equal(signer3.address);

      const bankContract = await retrieveSafe(bank);
      const bankData = await bankContract.getData(create.pool.bigInt.unitId);
      // Assertions
      expect(bankData.aggregateFee).to.be.eq(ZERO);
      expect(bankData.totalClients).to.be.eq(3n);
    });

    it("Permissioned: Signer1 should borrow successfully", async function () {
      const {
        assetBase,
        factory,
        collateralToken,
        retrieveSafe,
        signers : { signer1, signer2, deployer },
        factoryAddr } = await loadFixture(deployContractsFixcture);

      const create = await createPermissionedPool({
        asset: assetBase,
        colCoverage: COLLATER_COVERAGE_RATIO,
        durationInHours: DURATION_IN_HOURS,
        factory: factory,
        intRate: INTEREST_RATE,
        signer: signer1,
        unitLiquidity: UNIT_LIQUIDITY,
        contributors: getAddressFromSigners([signer1, signer2]),
        deployer
      });
      const bank = formatAddr(await factory.getSafe(create.pool.bigInt.unit));
      const { assetBaseBalance,collateralBalance } = await getBalance({target: bank, testAsset: assetBase, collateralAsset: collateralToken});

      const join = await joinEpoch({
        contribution: create.pool.bigInt.unit,
        deployer,
        unit: create.pool.bigInt.unit,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: assetBase
      });
      const join_aft = await getBalance({target: bank, testAsset: assetBase, collateralAsset: collateralToken});
      const turnTime = await time.latest();
      
      const quoted = await factory.getCollateralQuote(create.pool.bigInt.unit);
      const gf = await getFinance({
        unit: create.pool.bigInt.unit,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR ,
        colQuote: quoted
      });
      
      expect(collateralBalance).to.be.equal(quoted);

      // ERC20 balances in bank should remain thesame before claim.
      expect(assetBaseBalance).to.be.eq(join_aft.assetBaseBalance); 
      expect(gf.pool.lInt.allGH).to.be.eq(BigInt(1));
      expect(bn(gf.profile.colBals).gte(bn((quoted)))).to.be.true;
      expect(bn(gf.profile.turnStartTime).toNumber()).to.be.gte(turnTime); 
      expect(bn(gf.profile.paybackTime).toNumber()).to.be.gte(turnTime + DURATION_OF_CHOICE_IN_SECS);
      expect(gf.pool.bigInt.currentPool).to.be.equal(ZERO);
      expect(gf.profile.interestPaid.toString()).to.be.equal(ZERO);
      // expect(gf.profile.interestPaid.toString()).to.be.approximately(mulToString(gf.pool.interest.intPerSec, DURATION_OF_CHOICE_IN_SECS), bn('12500000000000000'));
      expect(gf.profile.durOfChoice).to.be.equal(BigInt(DURATION_OF_CHOICE_IN_SECS));
      
      const bankContract = await retrieveSafe(bank);
      const { aggregateFee,} = await bankContract.getData(gf.pool.bigInt.unitId);
      const userData = await bankContract.getUserData(signer1.address, gf.pool.bigInt.unitId);
      expect(bn(aggregateFee).gt(0)).to.be.true;
      expect(userData.access).to.be.true;
      expect(userData.collateralBalance).to.be.eq(quoted);

      const { assetBaseBalAfter, assetBaseBalB4, collateralBalAfter, collateralBalB4} = await withdraw({
        assetBase,
        owner: bank,
        spender: signer1,
        collateral: collateralToken
      });
      
      expect(collateralBalB4).to.be.equal(quoted);
      expect(assetBaseBalB4).to.be.equal(aggregateFee);
      expect(assetBaseBalAfter).to.be.gt(assetBaseBalB4);
      expect(assetBaseBalAfter).to.be.lt(gf.profile.loan);
    });

    it("Permissioned: Borrower should payback", async function () {
      const {
        assetBase,
        factory,
        collateralToken,
        retrieveSafe,
        signers : { signer1, signer2, deployer },
        factoryAddr } = await loadFixture(deployContractsFixcture);

      const signers = [signer1, signer2];
      const create = await createPermissionedPool({
        asset: assetBase,
        colCoverage: COLLATER_COVERAGE_RATIO,
        durationInHours: DURATION_IN_HOURS,
        factory: factory,
        intRate: INTEREST_RATE,
        signer: signer1,
        unitLiquidity: UNIT_LIQUIDITY,
        contributors: getAddressFromSigners(signers),
        deployer
      });

      const bank = formatAddr(await factory.getSafe(create.pool.bigInt.unit));

      const join = await joinEpoch({
        contribution: create.pool.bigInt.unit,
        deployer,
        unit: create.pool.bigInt.unit,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: assetBase
      });

      const quoted = await factory.getCollateralQuote(create.pool.bigInt.unit);
      const gf = await getFinance({
        unit: create.pool.bigInt.unit,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quoted
      });
      const gf_bals = await getBalance({target: bank, testAsset: assetBase, collateralAsset: collateralToken});
      expect(gf.pool.bigInt.currentPool).to.be.equal(ZERO);
      await withdraw({
        assetBase,
        owner: bank,
        spender: signer1,
        collateral: collateralToken
      });
      
      /**
       * We need to fastrack the block time to near the duration of choice of the borrower
       * to avoid being liquidated.
       * Note: DURATION_OF_CHOICE_IN_SEC is same as DURATION_OF_CHOICE_IN_HR but we 
       * reduce DURATION_OF_CHOICE_IN_SEC by 2sec to account for execution time.
       */
      const durOfChoiceInSec = BigInt((await time.latest()) + (DURATION_OF_CHOICE_IN_SECS));
      await time.increaseTo(durOfChoiceInSec);
      const debtToDate = await factory.getCurrentDebt(create.pool.bigInt.unit, signer1.address);

      /**
       * We increase the time to give 3 sec for execution which is why we multiply interest per sec
       * by the number of seconds we increased by. This is to enable us give enough allowance to the 
       * factory contract since factory will always reply on the interest up to the current block. 
       */
      const debt = BigInt(bn(debtToDate).plus(bn(gf.pool.interest.intPerSec).times(bn(3))).toString());
      const pay = await payback({
        asset: assetBase,
        deployer,
        unit: create.pool.bigInt.unit,
        factory,
        debt,
        signers: [signer1]
      });
      const { assetBaseBalance, collateralBalance } = await getBalance({target: bank, testAsset: assetBase, collateralAsset: collateralToken});
      expect(pay.pool.bigInt.currentPool).to.be.equal(join.pool.bigInt.currentPool);
      
      // Collateral balances.
      expect(bn(pay.profile.colBals).isZero()).to.be.true;

      // We check the user's collateral balances with the bank are intact
      const bankContract = await retrieveSafe(bank);
      const { access, collateralBalance: colBal } = await bankContract.getUserData(signer1.address, create.pool.bigInt.unitId);
      expect(access).to.be.true;
      expect(colBal).to.be.eq(0n);

      expect(collateralBalance).to.be.equal(gf_bals.collateralBalance);

      // Withdraw collateral from the bank and test
      const { collateralBalAfter, collateralBalB4 } = await withdraw({owner: bank, assetBase, collateral: collateralToken, spender: signer1});
      const rs = await bankContract.getUserData(signer1.address, create.pool.bigInt.unitId);
      expect(rs.collateralBalance).to.be.eq(ZERO);
      
      const prof = await factory.getProfile(create.pool.bigInt.unit, signer1.address);
      const { collateralBalance : bankColBal} = await getBalance({target: bank, testAsset: assetBase, collateralAsset: collateralToken});
      expect(prof.colBals).to.be.equal(ZERO);
      expect(bankColBal).to.be.equal(ZERO);
      expect(bn(collateralBalAfter).gt(bn(collateralBalB4))).to.be.true;
    });

    it("Permissioned: Should conclude the epoch", async function () {
      const {
        assetBase,
        factory,
        collateralToken,
        retrieveSafe,
        signers : { signer1, signer2, deployer },
        factoryAddr } = await loadFixture(deployContractsFixcture);

      const signers = [signer1, signer2];
      const create = await createPermissionedPool({
        asset: assetBase,
        colCoverage: COLLATER_COVERAGE_RATIO,
        durationInHours: DURATION_IN_HOURS,
        factory: factory,
        intRate: INTEREST_RATE,
        signer: signer1,
        unitLiquidity: UNIT_LIQUIDITY,
        contributors: getAddressFromSigners(signers),
        deployer
      });

      const bank = formatAddr(await factory.getSafe(create.pool.bigInt.unit));
      // const { assetBaseBalance,collateralBalance } = await getBalance({target: bank, testAsset: assetBase, collateralAsset: collateralToken});

      await joinEpoch({
        contribution: create.pool.bigInt.unit,
        deployer,
        unit: create.pool.bigInt.unit,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: assetBase
      });

      /**
       * Signer1 borrow.
       */
      const quoted = await factory.getCollateralQuote(create.pool.bigInt.unit);
      const gf = await getFinance({
        unit: create.pool.bigInt.unit,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quoted
      });
      
      await withdraw({
        assetBase,
        owner: bank,
        spender: signer1,
        collateral: collateralToken
      });

      /**
       * We need to fastrack the block time to near the duration of choice of the borrower
       * to avoid being liquidated.
       * Note: DURATION_OF_CHOICE_IN_SEC is same as DURATION_OF_CHOICE_IN_HR but we 
       * reduce DURATION_OF_CHOICE_IN_SEC by 2sec to account for execution time.
       */
      const durOfChoiceInSec = BigInt((await time.latest()) + (DURATION_OF_CHOICE_IN_SECS));
      await time.increaseTo(durOfChoiceInSec);
      const debtToDate = await factory.getCurrentDebt(create.pool.bigInt.unit, signer1.address);

      /**
       * We increase the time to give 3 sec for execution which is why we multiply interest per sec
       * by the number of seconds we increased by. This is to enable us give enough allowance to the 
       * factory contract since factory will always reply on the interest up to the current block. 
       */
      const debt = BigInt(bn(debtToDate).plus(bn(gf.pool.interest.intPerSec).times(bn(3))).toString());
      const pay = await payback({
        asset: assetBase,
        deployer,
        unit: create.pool.bigInt.unit,
        factory,
        debt,
        signers: [signer1]
      }); 

      // const profB4 = await factory.getProfile(create.pool.bigInt.unit, signer1.address);
      // Before withdrawing collateral, the balance should be intact.
      expect(bn(pay.profile.colBals).lt(bn(gf.profile.colBals))).to.be.true;

      // await factory.connect(signer1).withdrawCollateral(create.pool.bigInt.unit);
      const prof = await factory.getProfile(create.pool.bigInt.unit, signer1.address);

      // Before withdrawing collateral, the balance should be intact.
      expect(prof.colBals).to.be.equal(ZERO);

      /**
       * Signer2 Borrow and payback
       */
      const gf_2 = await getFinance({
        unit: create.pool.bigInt.unit,
        factory,
        signers: [signer2],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quoted
      });
      
      await withdraw({
        assetBase,
        owner: bank,
        spender: signer2,
        collateral: collateralToken
      });

      const durOfChoiceInSec_2 = BigInt((await time.latest()) + (DURATION_OF_CHOICE_IN_SECS));
      await time.increaseTo(durOfChoiceInSec_2);
      const debtToDate_2 = await factory.getCurrentDebt(create.pool.bigInt.unit, signer2.address);

      /**
       * We increase the time to give 3 sec for execution which is why we multiply interest per sec
       * by the number of seconds we increased by. This is to enable us give enough allowance to the 
       * factory contract since factory will always reply on the interest up to the current block. 
       */
      const debt_2 = BigInt(bn(debtToDate_2).plus(bn(gf_2.pool.interest.intPerSec).times(bn(3))).toString());
      const pay_2 = await payback({
        asset: assetBase,
        deployer,
        unit: create.pool.bigInt.unit,
        factory,
        debt: debt_2,
        signers: [signer2]
      }); 

      // When the last participant GF, the epoch is finalized, and th whole pool is wiped out. So collateral balances should read zero.
      expect(pay_2.profile.colBals).to.be.equal(ZERO);
      expect(pay_2.pool.bigInt.currentPool).to.be.equal(ZERO);

      // We check the user's collateral balances with the bank are intact
      const bankContract = await retrieveSafe(bank);
      const s1 = await bankContract.getUserData(signer1.address, create.pool.bigInt.unitId);
      const s2 = await bankContract.getUserData(signer2.address, create.pool.bigInt.unitId);
      expect(s1.access).to.be.true;
      expect(s2.access).to.be.true;
      expect(s1.collateralBalance).to.be.eq(ZERO);
      expect(s2.collateralBalance).to.be.eq(ZERO);

      await withdraw({owner: bank, assetBase, collateral: collateralToken, spender: signer1});
      await withdraw({owner: bank, assetBase, collateral: collateralToken, spender: signer2});

      const s1After = await bankContract.getUserData(signer1.address, create.pool.bigInt.unitId);
      const s2After = await bankContract.getUserData(signer2.address, create.pool.bigInt.unitId);

      expect(s1After.access).to.be.false;
      expect(s2After.access).to.be.false;
      expect(s1After.collateralBalance).to.be.eq(ZERO);
      expect(s2After.collateralBalance).to.be.eq(ZERO);

      const { aggregateFee, totalClients} = await bankContract.getData(pay_2.pool.bigInt.unitId);
      expect(totalClients).to.be.eq(ZERO);
      expect(aggregateFee).to.be.gt(ZERO);

      const bankBalance = await assetBase.balanceOf(bank);
      expect(aggregateFee).to.be.lt(ZERO);
      expect(bankBalance).to.be.lt(ZERO);
    });

    it("Permissioned: Enquiring liquidation should return empty profile", async function () {
      const {
        assetBase,
        factory,
        collateralToken,
        retrieveSafe,
        signers : { signer1, signer2, deployer },
        factoryAddr } = await loadFixture(deployContractsFixcture);

      const signers = [signer1, signer2];
      const create = await createPermissionedPool({
        asset: assetBase,
        colCoverage: COLLATER_COVERAGE_RATIO,
        durationInHours: DURATION_IN_HOURS,
        factory: factory,
        intRate: INTEREST_RATE,
        signer: signer1,
        unitLiquidity: UNIT_LIQUIDITY,
        contributors: getAddressFromSigners(signers),
        deployer
      });

      const bank = formatAddr(await factory.getSafe(create.pool.bigInt.unit));
      // const { assetBaseBalance,collateralBalance } = await getBalance({target: bank, testAsset: assetBase, collateralAsset: collateralToken});
      await joinEpoch({
        contribution: create.pool.bigInt.unit,
        deployer,
        unit: create.pool.bigInt.unit,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: assetBase
      });

      const quoted = await factory.getCollateralQuote(create.pool.bigInt.unit);
      const gf = await getFinance({
        unit: create.pool.bigInt.unit,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quoted
      });
      
      await withdraw({
        assetBase,
        owner: bank,
        spender: signer1,
        collateral: collateralToken
      });

      // Decrease the duration
      const durOfChoiceInSec_2 = BigInt((await time.latest()) + (DURATION_OF_CHOICE_IN_SECS - ONE_HOUR_ONE_MINUTE));
      await time.increaseTo(durOfChoiceInSec_2);

      /**
       * When the paydate is yet to come, enquiry should return nothing
       */
      const [profile, isDefaulted, value] = await enquireLiquidation({
        unit: create.pool.bigInt.unit,
        factory,
        signers: []
      });
      expect(profile.id).to.be.equal(ZeroAddress);
      expect(isDefaulted).to.be.false;
      expect(value).to.be.eq(ZERO);
    });

    it("Permissioned: Enquiring liquidation should return defaiulter's profile", async function () {
      const {
        assetBase,
        factory,
        collateralToken,
        retrieveSafe,
        signers : { signer1, signer2, signer3, deployer },
        factoryAddr } = await loadFixture(deployContractsFixcture);

      const signers = [signer1, signer2];
      const create = await createPermissionedPool({
        asset: assetBase,
        colCoverage: COLLATER_COVERAGE_RATIO,
        durationInHours: DURATION_IN_HOURS,
        factory: factory,
        intRate: INTEREST_RATE,
        signer: signer1,
        unitLiquidity: UNIT_LIQUIDITY,
        contributors: getAddressFromSigners(signers),
        deployer
      });
      const bank = formatAddr(await factory.getSafe(create.pool.bigInt.unit));
      await joinEpoch({
        contribution: create.pool.bigInt.unit,
        deployer,
        unit: create.pool.bigInt.unit,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: assetBase
      });

      const quoted = await factory.getCollateralQuote(create.pool.bigInt.unit);
      const gf = await getFinance({
        unit: create.pool.bigInt.unit,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quoted
      });
      
      await withdraw({
        assetBase,
        owner: bank,
        spender: signer1,
        collateral: collateralToken
      });

      // Increase the duration
      const future = BigInt((await time.latest()) + DURATION_OF_CHOICE_IN_SECS + ONE_HOUR_ONE_MINUTE);
      await time.increaseTo(future);

      /**
       * When the paydate has passed, enquiry should return defaulter's profile.
      */
      const debtToDate = await factory.getCurrentDebt(create.pool.bigInt.unit, signer1.address);
      const [prof, defaulted, val] = await enquireLiquidation({
        unit: create.pool.bigInt.unit,
        factory,
        signers: []
      });
      expect(prof.id).to.be.equal(signer1.address);
      expect(defaulted).to.be.true;
      expect(val).to.be.gte(debtToDate);     
    });
    
    it("Permissioned: Should liquidate borrower if defaulted", async function () {
      const {
        assetBase,
        factory,
        collateralToken,
        retrieveSafe,
        signers : { signer1, signer2, signer3, deployer },
        factoryAddr } = await loadFixture(deployContractsFixcture);

      const signers = [signer1, signer2];
      const create = await createPermissionedPool({
        asset: assetBase,
        colCoverage: COLLATER_COVERAGE_RATIO,
        durationInHours: DURATION_IN_HOURS,
        factory: factory,
        intRate: INTEREST_RATE,
        signer: signer1,
        unitLiquidity: UNIT_LIQUIDITY,
        contributors: getAddressFromSigners(signers),
        deployer
      });
      const bank = formatAddr(await factory.getSafe(create.pool.bigInt.unit));
      const join = await joinEpoch({
        contribution: create.pool.bigInt.unit,
        deployer,
        unit: create.pool.bigInt.unit,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: assetBase
      });

      const quoted = await factory.getCollateralQuote(create.pool.bigInt.unit);
      const gf = await getFinance({
        unit: create.pool.bigInt.unit,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quoted
      });
      
      await withdraw({
        assetBase,
        owner: bank,
        spender: signer1,
        collateral: collateralToken
      });

      // Fastrack block time
      const future = BigInt((await time.latest()) + DURATION_OF_CHOICE_IN_SECS + ONE_HOUR_ONE_MINUTE);
      await time.increaseTo(future);

      const debtToDate = await factory.getCurrentDebt(create.pool.bigInt.unit, signer1.address);
      const debt = BigInt(bn(debtToDate).plus(bn(gf.pool.interest.intPerSec).times(bn(ONE_HOUR_ONE_MINUTE + 3))).toString());
      // const defaulter = await factory.getProfile(create.pool.bigInt.unit, signer1.address);
      const bankContract = await retrieveSafe(bank);
      const s3BfLiq = await bankContract.getUserData(signer3.address, create.pool.bigInt.unitId);
      expect(s3BfLiq.access).to.be.false;
      const { liq: { pool: pl, profile: pr }, balB4Liq } = await liquidate({
        asset: assetBase,
        deployer,
        unit: create.pool.bigInt.unit,
        factory,
        signers: [signer3],
        debt: debt,
      });
      const s3AfterLiq = await bankContract.getUserData(signer3.address, create.pool.bigInt.unitId);
      expect(s3AfterLiq.access).to.be.true;
      expect(s3AfterLiq.collateralBalance).to.be.eq(ZERO);
      const balAferLiq = await assetBase.balanceOf(signer3.address);

      /** 
       * Liquidator should inherit the profile data of expected borrower except for id.
      */
      expect(pr.id).to.be.equal(signer3.address);
      expect(pr.colBals).to.be.equal(ZERO);
      expect(pr.paybackTime).to.be.equal(gf.profile.paybackTime);
      expect(pr.durOfChoice).to.be.equal(gf.profile.durOfChoice);
      expect(balAferLiq).to.be.lessThan(balB4Liq);
      
      const { collateralBalAfter, collateralBalB4 } = await withdraw({owner: bank, assetBase, collateral: collateralToken, spender: signer3});
      expect(collateralBalAfter).to.be.gt(collateralBalB4);
      expect(pl.bigInt.currentPool).to.be.equal(join.pool.bigInt.currentPool);

      const s1 = await bankContract.getUserData(signer1.address, create.pool.bigInt.unitId);
      const s3AfterWit = await bankContract.getUserData(signer3.address, create.pool.bigInt.unitId);

      expect(s1.access).to.be.false;
      expect(s1.collateralBalance).to.be.eq(ZERO);      
      expect(s3AfterWit.access).to.be.false;
      expect(s3AfterWit.collateralBalance).to.be.eq(ZERO);
    });

    it("Permissioned: Process should go as intended after liquidation", async function () {
      const {
        assetBase,
        factory,
        collateralToken,
        retrieveSafe,
        signers : { signer1, signer2, signer3, deployer },
        factoryAddr } = await loadFixture(deployContractsFixcture);

      const signers = [signer1, signer2];
      const create = await createPermissionedPool({
        asset: assetBase,
        colCoverage: COLLATER_COVERAGE_RATIO,
        durationInHours: DURATION_IN_HOURS,
        factory: factory,
        intRate: INTEREST_RATE,
        signer: signer1,
        unitLiquidity: UNIT_LIQUIDITY,
        contributors: getAddressFromSigners(signers),
        deployer
      });
      const bank = formatAddr(await factory.getSafe(create.pool.bigInt.unit));
      await joinEpoch({
        contribution: create.pool.bigInt.unit,
        deployer,
        unit: create.pool.bigInt.unit,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: assetBase
      });

      const quoted = await factory.getCollateralQuote(create.pool.bigInt.unit);
      const gf = await getFinance({
        unit: create.pool.bigInt.unit,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quoted
      });
      
      await withdraw({
        assetBase,
        owner: bank,
        spender: signer1,
        collateral: collateralToken
      });

      // Fastrack block time
      const future = BigInt((await time.latest()) + DURATION_OF_CHOICE_IN_SECS + ONE_HOUR_ONE_MINUTE);
      await time.increaseTo(future);

      const debtToDate = await factory.getCurrentDebt(create.pool.bigInt.unit, signer1.address);
      const debt = BigInt(bn(debtToDate).plus(bn(gf.pool.interest.intPerSec).times(bn(ONE_HOUR_ONE_MINUTE + 3))).toString());
      // const def = await factory.getProfile(create.pool.bigInt.unit, signer1.address);
      await liquidate({
        asset: assetBase,
        deployer,
        unit: create.pool.bigInt.unit,
        factory,
        signers: [signer3],
        debt: debt,
      });

      // const bankContract = await retrieveSafe(bank);
      await withdraw({owner: bank, assetBase, collateral: collateralToken, spender: signer3});
      const quote2 = await factory.getCollateralQuote(create.pool.bigInt.unit);
      const gf_2 = await getFinance({
        unit: create.pool.bigInt.unit,
        factory,
        signers: [signer2],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quote2
      });
      
      await withdraw({
        assetBase,
        owner: bank,
        spender: signer2,
        collateral: collateralToken
      });

      const durOfChoiceInSec_2 = BigInt((await time.latest()) + (DURATION_OF_CHOICE_IN_SECS));
      await time.increaseTo(durOfChoiceInSec_2);
      const debtToDate_2 = await factory.getCurrentDebt(create.pool.bigInt.unit, signer2.address);
      const debt_2 = BigInt(bn(debtToDate_2).plus(bn(gf_2.pool.interest.intPerSec).times(bn(3))).toString());
      const pay_2 = await payback({
        asset: assetBase,
        deployer,
        unit: create.pool.bigInt.unit,
        factory,
        debt: debt_2,
        signers: [signer2]
      }); 

      // Before withdrawing collateral, the balance should be intact.
      expect(pay_2.profile.colBals).to.be.equal(ZERO);
      const prof_2 = await factory.getProfile(create.pool.bigInt.unit, signer2.address);

      // Before withdrawing collateral, the balance should be intact.
      expect(prof_2.colBals).to.be.equal(ZERO);
      expect(pay_2.pool.bigInt.currentPool).to.be.equal(ZERO);

      // Checking that the slot for the just-concluded epoch is empty
      const _p = await factory.getCurrentPool(pay_2.pool.bigInt.unit);
      expect(_p.lInt.allGH).to.be.eq(ZERO);
      expect(_p.lInt.colCoverage).to.be.eq(ZERO);
      expect(_p.lInt.duration).to.be.eq(ZERO);
      expect(_p.bigInt.unit).to.be.eq(ZERO);
      expect(_p.bigInt.unitId).to.be.eq(ZERO);
      expect(_p.bigInt.currentPool).to.be.eq(ZERO);

      // Checking record
      const recordId = await factory.getPastEpoches();
      expect(recordId).to.be.eq(1n);
      const record = await factory.getRecord(recordId);
      expect(record.bigInt.unit).to.be.eq(gf_2.pool.bigInt.unit);
    });

    it("Permissioned: Should swap participant if they delay to GF", async function () {
      const {
        assetBase,
        factory,
        collateralToken,
        signers : { signer1, signer2, signer3, deployer },
        factoryAddr } = await loadFixture(deployContractsFixcture);

      const signers = [signer1, signer2, signer3];
      const create = await createPermissionedPool({
        asset: assetBase,
        colCoverage: COLLATER_COVERAGE_RATIO,
        durationInHours: DURATION_IN_HOURS,
        factory: factory,
        intRate: INTEREST_RATE,
        signer: signer1,
        unitLiquidity: UNIT_LIQUIDITY,
        contributors: getAddressFromSigners(signers),
        deployer
      });
      const bank = formatAddr(await factory.getSafe(create.pool.bigInt.unit));
      await joinEpoch({
        contribution: create.pool.bigInt.unit,
        deployer,
        unit: create.pool.bigInt.unit,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: assetBase
      });

      const join_3 = await joinEpoch({
        contribution: create.pool.bigInt.unit,
        deployer,
        unit: create.pool.bigInt.unit,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer3],
        testAsset: assetBase
      });

      /**
       * Uncomment this line before the GF time elapses should make the test failed.
       * This is because signer3 is not expected at this time but signer 1.
       */
      // await getFinance({
      //   unit: create.pool.bigInt.unit,
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

      // const bankContract = await retrieveSafe(formatAddr(join_3.pool.addrs.bank));
      const quoted = await factory.getCollateralQuote(create.pool.bigInt.unit);

      /**
       * Signer3 takes advantage of signer1 procastination.
       */
      const gf = await getFinance({
        unit: create.pool.bigInt.unit,
        factory,
        signers: [signer3],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quoted
      });
      
      await withdraw({
        assetBase,
        owner: bank,
        spender: signer3,
        collateral: collateralToken
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
      const debtToDate = await factory.getCurrentDebt(create.pool.bigInt.unit, signer3.address);

      /**
       * We increase the time to give 3 sec for execution which is why we multiply interest per sec
       * by the number of seconds we increased by. This is to enable us give enough allowance to the 
       * factory contract since factory will always reply on the interest up to the current block. 
       */
      const debt = BigInt(bn(debtToDate).plus(bn(gf.pool.interest.intPerSec).times(bn(3))).toString());
      const pay = await payback({
        asset: assetBase,
        deployer,
        unit: create.pool.bigInt.unit,
        factory,
        debt,
        signers: [signer3]
      }); 
      await withdraw({owner: bank, assetBase, collateral: collateralToken, spender: signer3});
      // await bankContract.connect(signer3).withdrawCollateral(create.pool.bigInt.unitId);
      // const profB4 = await factory.getProfile(create.pool.bigInt.unit, signer3.address);
      // Before withdrawing collateral, the balance should be intact.
      expect(pay.profile.colBals).to.be.equal(ZERO);

      // await factory.connect(signer3).withdrawCollateral(create.pool.bigInt.unit);
      const prof = await factory.getProfile(create.pool.bigInt.unit, signer3.address);

      // Before withdrawing collateral, the balance should be intact.
      expect(prof.colBals).to.be.equal(ZERO);

      const quoted_2 = await factory.getCollateralQuote(create.pool.bigInt.unit);
      /**
       * Signer2 Borrow and payback
       */
      const gf_2 = await getFinance({
        unit: create.pool.bigInt.unit,
        factory,
        signers: [signer2],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quoted_2
      });
      
      await withdraw({
        assetBase,
        owner: bank,
        spender: signer2,
        collateral: collateralToken
      });

      const durOfChoiceInSec_2 = BigInt((await time.latest()) + (DURATION_OF_CHOICE_IN_SECS));
      await time.increaseTo(durOfChoiceInSec_2);
      const debtToDate_2 = await factory.getCurrentDebt(create.pool.bigInt.unit, signer2.address);

      /**
       * We increase the time to give 3 sec for execution which is why we multiply interest per sec
       * by the number of seconds we increased by. This is to enable us give enough allowance to the 
       * factory contract since factory will always reply on the interest up to the current block. 
       */
      const debt_2 = BigInt(bn(debtToDate_2).plus(bn(gf_2.pool.interest.intPerSec).times(bn(3))).toString());
      const pay_2 = await payback({
        asset: assetBase,
        deployer,
        unit: create.pool.bigInt.unit,
        factory,
        debt: debt_2,
        signers: [signer2]
      }); 
      await withdraw({owner: bank, assetBase, collateral: collateralToken, spender: signer2});
      // await bankContract.connect(signer2).withdrawCollateral(create.pool.bigInt.unitId);
      expect(pay_2.profile.colBals).to.be.equal(ZERO);

      // Since the pool is not finalized, the currentPool amount to be retained
      expect(pay_2.pool.bigInt.currentPool).to.be.equal(pay.pool.bigInt.currentPool);
    });

    it("Permissioned: Should cancel band successfully", async function () {
      const {
        assetBase,
        collateralToken,
        factory,
        signers : { signer1, signer2, deployer }, } = await loadFixture(deployContractsFixcture);

      const create = await createPermissionedPool({
        asset: assetBase,
        colCoverage: COLLATER_COVERAGE_RATIO,
        durationInHours: DURATION_IN_HOURS,
        factory: factory,
        intRate: INTEREST_RATE,
        signer: signer1,
        unitLiquidity: UNIT_LIQUIDITY,
        contributors: getAddressFromSigners([signer1, signer2]),
        deployer
      });

      const balB4Removal = await assetBase.balanceOf(signer1.address);
      await removeLiquidityPool({
        factory,
        unit: create.pool.bigInt.unit,
        signer: signer1
      });
      const bank = formatAddr(await factory.getSafe(create.pool.bigInt.unit));
      // const {assetBaseBalAfter} = await withdraw({owner: bank, assetBase, collateral: collateralToken, spender: signer1});
      // const signerBalAfterRemoval = await assetBase.balanceOf(signer1.address);
      // expect(signerBalAfterRemoval).to.be.equal(balB4Removal);
      const pastEpoch = await factory.getPastEpoches();
      const record = await factory.getRecord(pastEpoch);
      expect(record.lInt.stage).to.be.eq(BigInt(Stage.CANCELED));

      const { assetBaseBalAfter } = await withdraw({
        assetBase,
        owner: bank,
        spender: signer1,
        collateral: collateralToken
      });
      expect(assetBaseBalAfter).to.be.gt(balB4Removal);
    });

    it("Permissioned: Testing for reverts", async function () {
      const {
        assetBase,
        factory,
        collateralToken,
        // retrieveSafe,
        signers : { signer1, signer2, deployer }, } = await loadFixture(deployContractsFixcture);

      await createPermissionedPool({
        asset: assetBase,
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
        asset: assetBase,
        colCoverage: COLLATER_COVERAGE_RATIO,
        durationInHours: DURATION_IN_HOURS,
        factory: factory,
        intRate: INTEREST_RATE,
        signer: signer1,
        unitLiquidity: UNIT_LIQUIDITY,
        contributors: getAddressFromSigners([signer1, signer2]),
        deployer
      });
      const bank = formatAddr(await factory.getSafe(create.pool.bigInt.unit));
      // await factory.getPoolData(create.pool.bigInt.unitId);

      // Calling getFinance should fail if the quorum is not achieved
      const quoted_2 = await factory.getCollateralQuote(create.pool.bigInt.unit);
      await expect(getFinance({
        unit: create.pool.bigInt.unit,
        factory,
        signers: [signer2],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quoted_2
      })).to.be.revertedWithCustomError(factory, "GettingFinanceNotReady()");

      await withdraw({
        assetBase,
        collateral: collateralToken,
        owner:bank,
        spender: signer1,
        // value: create.pool.bigInt.unit
      });
    });
  });                                                                       
});

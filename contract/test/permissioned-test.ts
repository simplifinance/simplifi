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
  ZERO,
  INTEREST_RATE,
  formatAddr,
  DURATION_IN_SECS,
  TOTAL_LIQUIDITY,
  DURATION_OF_CHOICE_IN_HR,
  DURATION_OF_CHOICE_IN_SECS,
  ONE_HOUR_ONE_MINUTE,
  FuncTag,
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
} from "./utils";
import { ZeroAddress, } from "ethers";
import { Address } from "./types";

describe("Permissioned", function () {

  async function deployContractsFixcture() {
    return { ...await deployContracts(ethers.getSigners) };
  }
  
  describe("Testing Permissioned Liquidity Pool", function () {
    it("Permissioned: Should create permissioned pool successfully", async function () {
      const {
        tAsset,
        factory,
        collateralToken,
        signers : { signer1, signer2, signer3, deployer, signer1Addr, signer2Addr, signer3Addr },
      } = await loadFixture(deployContractsFixcture);

      const assetAddr = await tAsset.getAddress();
      const {
        balances, 
        pool: { 
          pool: {
            addrs: { asset, bank, lastPaid, admin }, 
            stage, 
            lInt: { colCoverage, duration, selector, allGh, }, 
            bigInt: { currentPool, unit},
            interest: { intPerSec, fullInterest }
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
          contributors: await getAddressFromSigners([signer1, signer2, signer3]),
          deployer,
          collateralToken
        }
      );

      const slot2 = await factory.getSlot(signer2Addr, unit);
      const slot3 = await factory.getSlot(signer3Addr, unit);
      const bankContract = await retrieveContract(formatAddr(bank));
      const bankData = await bankContract.getData();
      // Assertions
      expect(bankData.aggregateFee).to.be.eq(ZERO);
      expect(bankData.totalClients).to.be.eq(1n);

      expect(UNIT_LIQUIDITY).to.be.equal(unit);
      expect(bank === ZERO_ADDRESS).to.be.false;
      expect(admin).to.be.equal(signer1Addr, "Error: Admin is zero address");
      expect(asset).to.be.equal(assetAddr, "Error: Asset was zero address");
      expect(balances?.collateral).to.be.equal(ZERO, `Error: Collateral asset balance is ${balances?.collateral.toString()}`); // XFI balance in bank should be zero.
      expect(balances?.base).to.be.equal(UNIT_LIQUIDITY, `Error: ERC20 balance is ${balances?.base.toString()} as against ${UNIT_LIQUIDITY.toString()}`); // ERC20 balance in this epoch should correspond to the liquidity supplied.
      expect(lastPaid).to.be.equal(ZERO_ADDRESS, "Error: lastpaid was not zero address");

      expect(currentPool).to.be.equal(UNIT_LIQUIDITY);
      expect(bn(intPerSec).gt(bn(ZERO))).to.be.true;
      expect(bn(fullInterest).gt(bn(ZERO))).to.be.true;
      expect(colCoverage).to.be.equal(COLLATER_COVERAGE_RATIO);
      expect(duration.toString()).to.be.equal(DURATION_IN_SECS, `Duration ${duration.toString()} was not DURATION_IN_SECS ${DURATION_IN_SECS}`);
      expect(allGh).to.be.equal(ZERO);
      expect(selector).to.be.equal(ZERO);

      const prof_1 = await factory.getProfile(unit, signer1Addr);
      expect(prof_1.id).to.be.equal(signer1Addr);
      expect(members[0].id).to.be.equal(signer1Addr);
      expect(members[1].id).to.be.equal(signer2Addr);
      expect(members[2].id).to.be.equal(signer3Addr);
      expect(id).to.be.equal(signer1Addr);

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
      

      const prof_2 = await factory.getProfile(unit, signer2Addr);
      const prof_3 = await factory.getProfile(unit, signer3Addr);

      // Equal address
      expect(prof_2.id).to.be.equal(signer2Addr);
      expect(prof_3.id).to.be.equal(signer3Addr);
      
      // Router
      const router = await factory.getRouter(unit);
      expect(router).to.be.equal("PERMISSIONED", `Error: Router different. Actual is ${router}`);
    });

    it("Permissioned: Should add users successfully", async function () {
      const {
        tAsset,
        factory,
        collateralToken,
        signers : { signer1, signer2, signer3, deployer, signer2Addr, signer3Addr },
        factoryAddr } = await loadFixture(deployContractsFixcture);
        
      const create = await createPermissionedPool({
        asset: tAsset,
        colCoverage: COLLATER_COVERAGE_RATIO,
        durationInHours: DURATION_IN_HOURS,
        factory: factory,
        intRate: INTEREST_RATE,
        signer: signer1,
        unitLiquidity: UNIT_LIQUIDITY,
        contributors: await getAddressFromSigners([signer1, signer2, signer3]),
        deployer,
        collateralToken
      });

      const {
        balances: { base, collateral }, 
        pool: { 
          pool: {
            bigInt: { currentPool,}
          }
        },
        profiles: [s1, s2]
      } = await joinEpoch({
        contribution: create.pool.pool.bigInt.unit,
        deployer,
        unit: create.pool.pool.bigInt.unit,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2, signer3],
        testAsset: tAsset,
        collateral: collateralToken
      });

      expect(currentPool).to.be.equal(TOTAL_LIQUIDITY);
      expect(base).to.be.equal(TOTAL_LIQUIDITY);
      expect(collateral).to.be.equal(ZERO);
      expect(s1.id).to.be.equal(signer2Addr);
      expect(s2.id).to.be.equal(signer3Addr);

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
        collateralToken,
        signers : { signer1, signer2, deployer, signer1Addr, },
        factoryAddr } = await loadFixture(deployContractsFixcture);

        const create = await createPermissionedPool({
          asset: tAsset,
          colCoverage: COLLATER_COVERAGE_RATIO,
          durationInHours: DURATION_IN_HOURS,
          factory: factory,
          intRate: INTEREST_RATE,
          signer: signer1,
          unitLiquidity: UNIT_LIQUIDITY,
          contributors: await getAddressFromSigners([signer1, signer2]),
          deployer,
          collateralToken
        });

      const join = await joinEpoch({
        contribution: create.pool.pool.bigInt.unit,
        deployer,
        unit: create.pool.pool.bigInt.unit,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset,
        collateral: collateralToken
      });
      const turnTime = await time.latest();
      const quoted = await factory.getCollaterlQuote(create.pool.pool.bigInt.unit);
      const gf = await getFinance({
        unit: create.pool.pool.bigInt.unit,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR ,
        colQuote: quoted.collateral,
        collateral: collateralToken,
        asset: tAsset,
        deployer
      });
      expect(gf.balances?.collateral).to.be.equal(quoted.collateral);
      expect(gf.balances?.base).to.be.eq(join.balances.base); 
      expect(gf.pool.pool.lInt.selector).to.be.eq(BigInt(1));
      expect(bn(gf.pool.pool.lInt.selector).gt(bn(join.pool.pool.lInt.selector)));

      expect(bn(gf.profile.colBals).gte(bn((quoted.colCoverage)))).to.be.true;
      expect(bn(gf.profile.turnStartTime).toNumber()).to.be.gte(turnTime);
      expect(bn(gf.profile.paybackTime).toNumber()).to.be.gte(turnTime + DURATION_OF_CHOICE_IN_SECS);
      expect(gf.pool.pool.bigInt.currentPool).to.be.equal(ZERO);
      expect(gf.profile.interestPaid).to.be.eq(0n);
      expect(gf.profile.durOfChoice).to.be.equal(BigInt(DURATION_OF_CHOICE_IN_SECS));

      const bankContract = await retrieveContract(formatAddr(gf.pool.pool.addrs.bank));
      const { aggregateFee,} = await bankContract.getData();
      const userData = await bankContract.getUserData(signer1Addr, gf.pool.pool.bigInt.recordId);
      expect(bn(aggregateFee).gt(0)).to.be.true;
      expect(userData.access).to.be.true;
      expect(userData.collateralBalance).to.be.eq(quoted.collateral);

      const { balances, baseBalB4, baseBalAfter} = await withdraw({
        asset: tAsset,
        factory,
        owner: formatAddr(gf.pool.pool.addrs.bank),
        spender: signer1,
        collateral: collateralToken
      });
      
      expect(balances?.collateral).to.be.equal(quoted.collateral);
      expect(balances?.base).to.be.equal(aggregateFee);
      expect(bn(baseBalAfter).gt(bn(baseBalB4))).to.be.true;
      expect(bn(baseBalAfter).lte(bn(gf.profile.loan))).to.be.true;
    });

    it("Permissioned: Borrower should payback", async function () {
      const {
        tAsset,
        factory,
        collateralToken,
        signers : { signer1, signer2, deployer, signer1Addr, },
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
        contributors: await getAddressFromSigners(signers),
        deployer,
        collateralToken
      });

      const join = await joinEpoch({
        contribution: create.pool.pool.bigInt.unit,
        deployer,
        unit: create.pool.pool.bigInt.unit,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset,
        collateral: collateralToken
      });

      const quoted = await factory.getCollaterlQuote(create.pool.pool.bigInt.unit);
      const gf = await getFinance({
        unit: create.pool.pool.bigInt.unit,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quoted.collateral,
        collateral: collateralToken,
        asset: tAsset,
        deployer
      });

      expect(gf.pool.pool.bigInt.currentPool).to.be.equal(ZERO);
      await withdraw({
        asset: tAsset,
        factory,
        owner: formatAddr(gf.pool.pool.addrs.bank),
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
      const debtToDate = await factory.getCurrentDebt(create.pool.pool.bigInt.unit, signer1Addr);

      /**
       * We increase the time to give 3 sec for execution which is why we multiply interest per sec
       * by the number of seconds we increased by. This is to enable us give enough allowance to the 
       * factory contract since factory will always reply on the interest up to the current block. 
       */
      const debt = BigInt(bn(debtToDate).plus(bn(gf.pool.pool.interest.intPerSec).times(bn(3))).toString());
      const pay = await payback({
        asset: tAsset,
        deployer,
        unit: create.pool.pool.bigInt.unit,
        factory,
        debt,
        signers: [signer1],
        collateral: collateralToken
      });
      
      expect(pay.pool.pool.bigInt.currentPool).to.be.equal(join.pool.pool.bigInt.currentPool);
      expect(bn(pay.profile.colBals).isZero()).to.be.true;
      const bankContract = await retrieveContract(formatAddr(gf.pool.pool.addrs.bank));
      const { access, collateralBalance} = await bankContract.getUserData(signer1Addr, create.pool.pool.bigInt.recordId);
      expect(access).to.be.false;
      expect(collateralBalance).to.be.eq(0n);

      expect(pay.balances?.collateral).to.be.equal(gf.balances?.collateral);
      const { colBalAfter, colBalB4 } = await withdraw({
        owner: pay.pool.pool.addrs.bank as Address, 
        asset: tAsset, 
        factory, 
        spender: signer1, 
        collateral: collateralToken
      });
      const rs = await bankContract.getUserData(signer1Addr, create.pool.pool.bigInt.recordId);
      expect(rs.collateralBalance).to.be.eq(0n);
      
      const prof = await factory.getProfile(create.pool.pool.bigInt.unit, signer1Addr);
      expect(prof.colBals).to.be.equal(ZERO);
      expect(await signer1.provider?.getBalance(pay.pool.pool.addrs.bank)).to.be.equal(ZERO);
      expect(bn(colBalAfter).gt(bn(colBalB4))).to.be.true;
    });

    it("Permissioned: Should conclude the epoch", async function () {
      const {
        tAsset,
        factory,
        collateralToken,
        signers : { signer1, signer2, deployer, signer1Addr, signer2Addr, },
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
        contributors: await getAddressFromSigners(signers),
        deployer,
        collateralToken
      });

      await joinEpoch({
        contribution: create.pool.pool.bigInt.unit,
        deployer,
        unit: create.pool.pool.bigInt.unit,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset,
        collateral: collateralToken
      });

      /**
       * Signer1 borrow.
       */
      const quoted = await factory.getCollaterlQuote(create.pool.pool.bigInt.unit);
      const gf = await getFinance({
        unit: create.pool.pool.bigInt.unit,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quoted.collateral,
        collateral: collateralToken,
        asset: tAsset,
        deployer
      });
      
      await withdraw({
        asset: tAsset,
        factory,
        owner: formatAddr(gf.pool.pool.addrs.bank),
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
      const debtToDate = await factory.getCurrentDebt(create.pool.pool.bigInt.unit, signer1Addr);
      const debt = BigInt(bn(debtToDate).plus(bn(gf.pool.pool.interest.intPerSec).times(bn(3))).toString());
      const pay = await payback({
        asset: tAsset,
        deployer,
        unit: create.pool.pool.bigInt.unit,
        factory,
        debt,
        signers: [signer1],
        collateral: collateralToken
      }); 

      expect(bn(pay.profile.colBals).lt(bn(gf.profile.colBals))).to.be.true;
      const prof = await factory.getProfile(create.pool.pool.bigInt.unit, signer1Addr);
      expect(prof.colBals).to.be.equal(ZERO);
      const gf_2 = await getFinance({
        unit: create.pool.pool.bigInt.unit,
        factory,
        signers: [signer2],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quoted.collateral,
        collateral: collateralToken,
        asset: tAsset,
        deployer
      });
      
      await withdraw({
        asset: tAsset,
        factory,
        owner: formatAddr(gf_2.pool.pool.addrs.bank),
        spender: signer2,
        collateral: collateralToken
      });

      const durOfChoiceInSec_2 = BigInt((await time.latest()) + (DURATION_OF_CHOICE_IN_SECS));
      await time.increaseTo(durOfChoiceInSec_2);
      const debtToDate_2 = await factory.getCurrentDebt(create.pool.pool.bigInt.unit, signer2Addr);

      /**
       * We increase the time to give 3 sec for execution which is why we multiply interest per sec
       * by the number of seconds we increased by. This is to enable us give enough allowance to the 
       * factory contract since factory will always reply on the interest up to the current block. 
       */
      const debt_2 = debtToDate_2 + (gf_2.pool.pool.interest.intPerSec * 3n);
      const pay_2 = await payback({
        asset: tAsset,
        deployer,
        unit: create.pool.pool.bigInt.unit,
        factory,
        debt: debt_2,
        signers: [signer2],
        collateral: collateralToken
      }); 

      // When the last participant GF, the epoch is finalized, and th whole pool is wiped out. So collateral balances should read zero.
      expect(pay_2.profile.colBals).to.be.equal(ZERO);
      expect(pay_2.pool.pool.bigInt.currentPool).to.be.equal(ZERO);

      // We check the user's collateral balances with the bank are intact
      const bankContract = await retrieveContract(formatAddr(gf.pool.pool.addrs.bank));
      const s1 = await bankContract.getUserData(signer1Addr, create.pool.pool.bigInt.recordId);
      const s2 = await bankContract.getUserData(signer2Addr, create.pool.pool.bigInt.recordId);
      expect(s1.access).to.be.false;
      expect(s2.access).to.be.false;
      expect(s1.collateralBalance).to.be.eq(ZERO);
      expect(s2.collateralBalance).to.be.eq(ZERO);

      await withdraw({
        asset: tAsset,
        factory,
        owner: formatAddr(gf_2.pool.pool.addrs.bank),
        spender: signer1,
        collateral: collateralToken
      });

      await withdraw({
        asset: tAsset,
        factory,
        owner: formatAddr(gf_2.pool.pool.addrs.bank),
        spender: signer2,
        collateral: collateralToken
      });

      const s1After = await bankContract.getUserData(signer1Addr, create.pool.pool.bigInt.recordId);
      const s2After = await bankContract.getUserData(signer2Addr, create.pool.pool.bigInt.recordId);

      expect(s1After.access).to.be.false;
      expect(s2After.access).to.be.false;
      expect(s1After.collateralBalance).to.be.eq(ZERO);
      expect(s2After.collateralBalance).to.be.eq(ZERO);

      const { aggregateFee, totalClients} = await bankContract.getData();
      expect(totalClients).to.be.eq(ZERO);
      expect(bn(aggregateFee).gt(bn(ZERO)));

      const bankBalance = await tAsset.balanceOf(gf.pool.pool.addrs.bank);
      expect(bn(aggregateFee).gt(bn(bankBalance)));

      // Participants withdraw from the bank
      await withdraw({
        asset: tAsset,
        factory,
        owner: formatAddr(gf_2.pool.pool.addrs.bank),
        spender: signer1,
        collateral: collateralToken
      });

      await withdraw({
        asset: tAsset,
        factory,
        owner: formatAddr(gf_2.pool.pool.addrs.bank),
        spender: signer2,
        collateral: collateralToken
      });

      const data = await bankContract.getData();
      const bankBalance2 = await tAsset.balanceOf(gf.pool.pool.addrs.bank);
      expect(bn(bankBalance2).gte(bn(data.aggregateFee))).to.be.true;
    });

    it("Permissioned: Enquiring liquidation should return empty profile", async function () {
      const {
        tAsset,
        factory,
        collateralToken,
        signers : { signer1, signer2, deployer,},
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
        contributors: await getAddressFromSigners(signers),
        deployer,
        collateralToken
      });

      await joinEpoch({
        contribution: create.pool.pool.bigInt.unit,
        deployer,
        unit: create.pool.pool.bigInt.unit,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset,
        collateral: collateralToken
      });

      const quoted = await factory.getCollaterlQuote(create.pool.pool.bigInt.unit);
      const gf = await getFinance({
        unit: create.pool.pool.bigInt.unit,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quoted.collateral,
        collateral: collateralToken,
        asset: tAsset,
        deployer
      });
      
      await withdraw({
        asset: tAsset,
        factory,
        owner: formatAddr(gf.pool.pool.addrs.bank),
        spender: signer1,
        collateral: collateralToken
      });

      const durOfChoiceInSec_2 = BigInt((await time.latest()) + (DURATION_OF_CHOICE_IN_SECS - ONE_HOUR_ONE_MINUTE));
      await time.increaseTo(durOfChoiceInSec_2);
      const [profile, isDefaulted, value] = await enquireLiquidation({
        unit: create.pool.pool.bigInt.unit,
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
        collateralToken,
        signers : { signer1, signer2, deployer, signer1Addr, },
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
        contributors: await getAddressFromSigners(signers),
        deployer,
        collateralToken
      });

      await joinEpoch({
        contribution: create.pool.pool.bigInt.unit,
        deployer,
        unit: create.pool.pool.bigInt.unit,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset,
        collateral: collateralToken
      });

      const quoted = await factory.getCollaterlQuote(create.pool.pool.bigInt.unit);
      const gf = await getFinance({
        unit: create.pool.pool.bigInt.unit,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quoted.collateral,
        collateral: collateralToken,
        asset: tAsset,
        deployer
      });
      
      await withdraw({
        asset: tAsset,
        factory,
        owner: formatAddr(gf.pool.pool.addrs.bank),
        spender: signer1,
        collateral: collateralToken
      });

      // Increase the duration
      const future = BigInt((await time.latest()) + DURATION_OF_CHOICE_IN_SECS + ONE_HOUR_ONE_MINUTE);
      await time.increaseTo(future);

      /**
       * When the paydate has passed, enquiry should return defaulter's profile.
      */
      const debtToDate = await factory.getCurrentDebt(create.pool.pool.bigInt.unit, signer1Addr);
      const [prof, defaulted, val,,] = await enquireLiquidation({
        unit: create.pool.pool.bigInt.unit,
        factory,
        signers: []
      });
      expect(prof.id).to.be.equal(signer1Addr);
      expect(defaulted).to.be.true;
      expect(bn(val).gte(bn(debtToDate))).to.be.true;     
    });
    
    it("Permissioned: Should liquidate borrower if defaulted", async function () {
      const {
        tAsset,
        factory,
        collateralToken,
        signers : { signer1, signer2, signer3, deployer, signer1Addr, signer3Addr },
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
        contributors: await getAddressFromSigners(signers),
        deployer,
        collateralToken
      });

      const join = await joinEpoch({
        contribution: create.pool.pool.bigInt.unit,
        deployer,
        unit: create.pool.pool.bigInt.unit,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset,
        collateral: collateralToken
      });

      const quoted = await factory.getCollaterlQuote(create.pool.pool.bigInt.unit);
      const gf = await getFinance({
        unit: create.pool.pool.bigInt.unit,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quoted.collateral,
        collateral: collateralToken,
        asset: tAsset,
        deployer
      });
      
      await withdraw({
        asset: tAsset,
        factory,
        owner: formatAddr(gf.pool.pool.addrs.bank),
        spender: signer1,
        collateral: collateralToken
      });

      // Fastrack block time
      const future = BigInt((await time.latest()) + DURATION_OF_CHOICE_IN_SECS + ONE_HOUR_ONE_MINUTE);
      await time.increaseTo(future);

      const debtToDate = await factory.getCurrentDebt(create.pool.pool.bigInt.unit, signer1Addr);
      const debt = BigInt(bn(debtToDate).plus(bn(gf.pool.pool.interest.intPerSec).times(bn(ONE_HOUR_ONE_MINUTE + 3))).toString());
      // const defaulter = await factory.getProfile(create.pool.pool.bigInt.unit, signer1Addr);
      const bankContract = await retrieveContract(formatAddr(gf.pool.pool.addrs.bank));
      const s3BfLiq = await bankContract.getUserData(signer3Addr, create.pool.pool.bigInt.recordId);
      expect(s3BfLiq.access).to.be.false;
      const { liq: { balances: bal, pool: pl, profile: pr }, baseBalAfterLiq, colBalAfterLiq, colBalB4Liq} = await liquidate({
        asset: tAsset,
        deployer,
        unit: create.pool.pool.bigInt.unit,
        factory,
        signers: [signer3],
        debt: debt,
        collateral: collateralToken
      });
      const s3AfterLiq = await bankContract.getUserData(signer3Addr, create.pool.pool.bigInt.recordId);
      expect(s3AfterLiq.access).to.be.false;
      expect(s3AfterLiq.collateralBalance).to.be.eq(ZERO);

      /** 
       * Liquidator should inherit the profile data of expected borrower except for id.
      */
      expect(pr.id).to.be.equal(signer3Addr);
      expect(pr.colBals).to.be.equal(ZERO);
      expect(pr.paybackTime).to.be.equal(gf.profile.paybackTime);
      expect(pr.durOfChoice).to.be.equal(gf.profile.durOfChoice);
      expect(bn(baseBalAfterLiq).gte(bn(ZERO))).to.be.true;
      expect(bn(colBalAfterLiq).eq(bn(colBalB4Liq))).to.be.true;
      
      const s3b = await withdraw({
        asset: tAsset,
        factory,
        owner: formatAddr(gf.pool.pool.addrs.bank),
        spender: signer3,
        collateral: collateralToken
      });
      
      expect(pl.pool.bigInt.currentPool).to.be.equal(join.pool.pool.bigInt.currentPool);
      const s1 = await bankContract.getUserData(signer1Addr, create.pool.pool.bigInt.recordId);
      const s3AfterWit = await bankContract.getUserData(signer3Addr, create.pool.pool.bigInt.recordId);

      expect(s1.access).to.be.false;
      expect(s1.collateralBalance).to.be.eq(ZERO);
      
      expect(s3AfterWit.access).to.be.false;
      expect(s3AfterWit.collateralBalance).to.be.eq(ZERO);
      expect(bn(s3b.colBalAfter).gt(bn(s3b.colBalB4))).to.be.true;

    });

    it("Permissioned: Process should go as intended after liquidation", async function () {
      const {
        tAsset,
        factory,
        collateralToken,
        signers : { signer1, signer2, signer3, deployer, signer1Addr, signer2Addr, },
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
        contributors: await getAddressFromSigners(signers),
        deployer,
        collateralToken
      });

      await joinEpoch({
        contribution: create.pool.pool.bigInt.unit,
        deployer,
        unit: create.pool.pool.bigInt.unit,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset,
        collateral: collateralToken
      });

      const quoted = await factory.getCollaterlQuote(create.pool.pool.bigInt.unit);
      const gf = await getFinance({
        unit: create.pool.pool.bigInt.unit,
        factory,
        signers: [signer1],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quoted.collateral,
        collateral: collateralToken,
        asset: tAsset,
        deployer
      });
      
      await withdraw({
        asset: tAsset,
        factory,
        owner: formatAddr(gf.pool.pool.addrs.bank),
        spender: signer1,
        collateral: collateralToken
      });

      // Fastrack block time
      const future = BigInt((await time.latest()) + DURATION_OF_CHOICE_IN_SECS + ONE_HOUR_ONE_MINUTE);
      await time.increaseTo(future);

      const debtToDate = await factory.getCurrentDebt(create.pool.pool.bigInt.unit, signer1Addr);
      const debt = BigInt(bn(debtToDate).plus(bn(gf.pool.pool.interest.intPerSec).times(bn(ONE_HOUR_ONE_MINUTE + 3))).toString());
      await liquidate({
        asset: tAsset,
        deployer,
        unit: create.pool.pool.bigInt.unit,
        factory,
        signers: [signer3],
        debt: debt,
        collateral: collateralToken
      });

      await retrieveContract(formatAddr(gf.pool.pool.addrs.bank));
      await withdraw({
        asset: tAsset,
        factory,
        owner: formatAddr(gf.pool.pool.addrs.bank),
        spender: signer3,
        collateral: collateralToken
      });
      const quote2 = await factory.getCollaterlQuote(create.pool.pool.bigInt.unit);
      const gf_2 = await getFinance({
        unit: create.pool.pool.bigInt.unit,
        factory,
        signers: [signer2],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quote2.collateral,
        collateral: collateralToken,
        asset: tAsset,
        deployer
      });
      
      await withdraw({
        asset: tAsset,
        factory,
        owner: formatAddr(gf_2.pool.pool.addrs.bank),
        spender: signer2,
        collateral: collateralToken
      });

      const durOfChoiceInSec_2 = BigInt((await time.latest()) + (DURATION_OF_CHOICE_IN_SECS));
      await time.increaseTo(durOfChoiceInSec_2);
      const debtToDate_2 = await factory.getCurrentDebt(create.pool.pool.bigInt.unit, signer2Addr);
      const debt_2 = debtToDate_2 + (gf_2.pool.pool.interest.intPerSec * 3n);
      const pay_2 = await payback({
        asset: tAsset,
        deployer,
        unit: create.pool.pool.bigInt.unit,
        factory,
        debt: debt_2,
        signers: [signer2],
        collateral: collateralToken
      }); 

      // Before withdrawing collateral, the balance should be intact.
      expect(pay_2.profile.colBals).to.be.equal(ZERO);
      const prof_2 = await factory.getProfile(create.pool.pool.bigInt.unit, signer2Addr);

      // Before withdrawing collateral, the balance should be intact.
      expect(prof_2.colBals).to.be.equal(ZERO);
      expect(pay_2.pool.pool.bigInt.currentPool).to.be.equal(ZERO);

      // Checking that the slot for the just-concluded epoch is empty
      const _p = await factory.getPoolData(pay_2.pool.pool.bigInt.unitId);
      expect(_p.pool.lInt.allGh).to.be.eq(ZERO);
      expect(_p.pool.lInt.colCoverage).to.be.eq(ZERO);
      expect(_p.pool.lInt.duration).to.be.eq(ZERO);
      expect(_p.pool.bigInt.unit).to.be.eq(ZERO);
      expect(_p.pool.bigInt.unitId).to.be.eq(ZERO);
      expect(_p.pool.bigInt.currentPool).to.be.eq(ZERO);

      // Checking record
      const recordEpoches = await factory.getRecordEpoches();
      expect(recordEpoches).to.be.eq(1n);
      const record = await factory.getRecord(recordEpoches);
      expect(record.pool.bigInt.unit).to.be.eq(gf_2.pool.pool.bigInt.unit);
      expect(record.cData.length).to.be.eq(2n);

    });

    it("Permissioned: Should swap participant if they delay to GF", async function () {
      const {
        tAsset,
        factory,
        collateralToken,
        signers : { signer1, signer2, signer3, deployer, signer2Addr, signer3Addr },
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
        contributors: await getAddressFromSigners(signers),
        deployer,
        collateralToken
      });

      await joinEpoch({
        contribution: create.pool.pool.bigInt.unit,
        deployer,
        unit: create.pool.pool.bigInt.unit,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer2],
        testAsset: tAsset,
        collateral: collateralToken
      });

      const join_3 = await joinEpoch({
        contribution: create.pool.pool.bigInt.unit,
        deployer,
        unit: create.pool.pool.bigInt.unit,
        factory,
        factoryAddr: formatAddr(factoryAddr),
        signers: [signer3],
        testAsset: tAsset,
        collateral: collateralToken
      });

      const futureGthanTurnTime = BigInt((await time.latest()) + ONE_HOUR_ONE_MINUTE);
      await time.increaseTo(futureGthanTurnTime);

      const bankContract = await retrieveContract(formatAddr(join_3.pool.pool.addrs.bank));
      const quoted = await factory.getCollaterlQuote(create.pool.pool.bigInt.unit);

      /**
       * Signer3 takes advantage of signer1 procastination.
       */
      const gf = await getFinance({
        unit: create.pool.pool.bigInt.unit,
        factory,
        signers: [signer3],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quoted.collateral,
        collateral: collateralToken,
        asset: tAsset,
        deployer
      });
      
      await withdraw({
        asset: tAsset,
        factory,
        owner: formatAddr(gf.pool.pool.addrs.bank),
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
      const debtToDate = await factory.getCurrentDebt(create.pool.pool.bigInt.unit, signer3Addr);

      /**
       * We increase the time to give 3 sec for execution which is why we multiply interest per sec
       * by the number of seconds we increased by. This is to enable us give enough allowance to the 
       * factory contract since factory will always reply on the interest up to the current block. 
       */
      const debt = BigInt(bn(debtToDate).plus(bn(gf.pool.pool.interest.intPerSec).times(bn(3))).toString());
      const pay = await payback({
        asset: tAsset,
        deployer,
        unit: create.pool.pool.bigInt.unit,
        factory,
        debt,
        signers: [signer3],
        collateral: collateralToken
      }); 
      await withdraw({
        asset: tAsset,
        factory,
        owner: formatAddr(gf.pool.pool.addrs.bank),
        spender: signer3,
        collateral: collateralToken
      });
      expect(pay.profile.colBals).to.be.equal(ZERO);

      // await factory.connect(signer3).withdrawCollateral(create.pool.pool.bigInt.unit);
      const prof = await factory.getProfile(create.pool.pool.bigInt.unit, signer3Addr);

      // Before withdrawing collateral, the balance should be intact.
      expect(prof.colBals).to.be.equal(ZERO);

      const quoted_2 = await factory.getCollaterlQuote(create.pool.pool.bigInt.unit);
      /**
       * Signer2 Borrow and payback
       */
      const gf_2 = await getFinance({
        unit: create.pool.pool.bigInt.unit,
        factory,
        signers: [signer2],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quoted_2.collateral,
        collateral: collateralToken,
        asset: tAsset,
        deployer
      });
      
      await withdraw({
        asset: tAsset,
        factory,
        owner: formatAddr(gf_2.pool.pool.addrs.bank),
        spender: signer2,
        collateral: collateralToken
      });

      const durOfChoiceInSec_2 = BigInt((await time.latest()) + (DURATION_OF_CHOICE_IN_SECS));
      await time.increaseTo(durOfChoiceInSec_2);
      const debtToDate_2 = await factory.getCurrentDebt(create.pool.pool.bigInt.unit, signer2Addr);
      const debt_2 = debtToDate_2 + (gf_2.pool.pool.interest.intPerSec * 3n);
      const pay_2 = await payback({
        asset: tAsset,
        deployer,
        unit: create.pool.pool.bigInt.unit,
        factory,
        debt: debt_2,
        signers: [signer2],
        collateral: collateralToken
      }); 

      await withdraw({
        asset: tAsset,
        factory,
        owner: formatAddr(gf.pool.pool.addrs.bank),
        spender: signer2,
        collateral: collateralToken
      });
      expect(pay_2.profile.colBals).to.be.equal(ZERO);

      // Since the pool is not finalized, the currentPool amount to be retained
      expect(pay_2.pool.pool.bigInt.currentPool).to.be.equal(pay.pool.pool.bigInt.currentPool);
    });

    it("Permissioned: Should cancel band successfully", async function () {
      const {
        tAsset,
        factory,
        collateralToken,
        signers : { signer1, signer2, deployer, signer1Addr,}, } = await loadFixture(deployContractsFixcture);

      const create = await createPermissionedPool({
        asset: tAsset,
        colCoverage: COLLATER_COVERAGE_RATIO,
        durationInHours: DURATION_IN_HOURS,
        factory: factory,
        intRate: INTEREST_RATE,
        signer: signer1,
        unitLiquidity: UNIT_LIQUIDITY,
        contributors: await getAddressFromSigners([signer1, signer2]),
        deployer,
        collateralToken
      });

      const balB4Removal = await tAsset.balanceOf(signer1Addr);
      
      await removeLiquidityPool({
        factory,
        unit: create.pool.pool.bigInt.unit,
        signer: signer1
      });
      
      const signerBalAfterRemoval = await tAsset.balanceOf(signer1Addr);
      
      // Balances after removal should remain intact
      expect(signerBalAfterRemoval).to.be.equal(balB4Removal);
      const recordEpoches = await factory.getRecordEpoches();
      const record = await factory.getRecord(recordEpoches);
      expect(record.pool.stage).to.be.eq(FuncTag.CANCELED);

      /**
       * This is an indication that a pool was removed.
       */
      expect((await factory.getPoolData(create.pool.pool.bigInt.unit)).pool.lInt.quorum).to.be.equal(ZERO);
      
      const { balances: { base, }, baseBalAfter, baseBalB4 } = await withdraw({
        asset: tAsset,
        factory,
        owner: formatAddr(create.pool.pool.addrs.bank),
        spender: signer1,
        collateral: collateralToken
      });
      expect(base).to.be.equal(ZERO);
      expect(bn(baseBalAfter).gt(bn(baseBalB4))).to.be.true;
    });

    it("Permissioned: Testing for reverts", async function () {
      const {
        tAsset,
        factory,
        collateralToken,
        signers : { signer1, signer2, deployer, }, } = await loadFixture(deployContractsFixcture);

      const f = await createPermissionedPool({
        asset: tAsset,
        colCoverage: COLLATER_COVERAGE_RATIO,
        durationInHours: DURATION_IN_HOURS,
        factory: factory,
        intRate: INTEREST_RATE,
        signer: signer1,
        unitLiquidity: UNIT_LIQUIDITY,
        contributors: await getAddressFromSigners([signer1, signer2]),
        deployer,
        collateralToken
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
        contributors: await getAddressFromSigners([signer1, signer2]),
        deployer,
        collateralToken
      });

      await factory.getPoolData(create.pool.pool.bigInt.unitId);

      // Calling getFinance should fail
      const quoted_2 = await factory.getCollaterlQuote(create.pool.pool.bigInt.unit);
      await expect(getFinance({
        unit: create.pool.pool.bigInt.unit,
        factory,
        signers: [signer2],
        hrsOfUse_choice: DURATION_OF_CHOICE_IN_HR,
        colQuote: quoted_2.collateral,
        collateral: collateralToken,
        asset: tAsset,
        deployer
      })).to.be.revertedWith("Borrow not ready");

      /**
       * This is an indication that a pool was removed.
       */
      expect((await factory.getPoolData(create.pool.pool.bigInt.unit)).pool.lInt.quorum).to.be.equal(ZERO);
      
      await withdraw({
        asset: tAsset,
        factory,
        owner: formatAddr(create.pool.pool.addrs.bank),
        spender: signer1,
        collateral: collateralToken
       });
    });

  });                                                                       
});
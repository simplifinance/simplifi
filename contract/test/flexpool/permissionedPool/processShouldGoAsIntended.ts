import { deployContracts, } from "../../deployments";
import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { 
  bn,
  UNIT_LIQUIDITY,
  COLLATER_COVERAGE_RATIO,
  DURATION_IN_HOURS,
  ZERO,
  INTEREST_RATE,
  formatAddr,
  DURATION_IN_SECS,
  ONE_HOUR_ONE_MINUTE,
} from "../../utilities";
import { createPermissionedPool, getFinance, joinEpoch, liquidate, payback, withdraw } from "../../utils";

describe("Permissioned: Go as intended", function () {
  async function deployContractsFixcture() {
    return { ...await deployContracts(ethers.getSigners) };
  }
  
  describe("Process should go as intended after liquidation", function () {
    it("Should complete an epoch successfully and begin another one", async function () {
      const {
        baseAsset,
        flexpool,
        collateralAsset,
        signers : { signer1, signer2, signer3, deployer, signer2Addr, },
        flexpoolAddr 
      } = await loadFixture(deployContractsFixcture);

      const signers = [signer1, signer2];
      const create = await createPermissionedPool({
        asset: baseAsset,
        colCoverage: COLLATER_COVERAGE_RATIO,
        durationInHours: DURATION_IN_HOURS,
        factory: flexpool,
        intRate: INTEREST_RATE,
        signer: signer1,
        unitLiquidity: UNIT_LIQUIDITY,
        contributors: signers,
        deployer,
        collateralToken: collateralAsset
      });

      await joinEpoch({
        contribution: create.pool.pool.big.unit,
        deployer,
        unit: create.pool.pool.big.unit,
        factory:flexpool,
        factoryAddr: formatAddr(flexpoolAddr),
        signers: [signer2],
        testAsset: baseAsset,
        collateral: collateralAsset
      });

      const quoted = await flexpool.connect(signer2).getCollateralQuote(create.pool.pool.big.unit);
      const gf = await getFinance({
        unit: create.pool.pool.big.unit,
        factory:flexpool,
        signers: [signer1],
        colQuote: quoted.collateral,
        collateral: collateralAsset,
        asset: baseAsset,
        deployer
      });
      
      await withdraw({
        asset: baseAsset,
        factory:flexpool,
        owner: formatAddr(gf.pool.pool.addrs.safe),
        spender: signer1,
        collateral: collateralAsset,
        unit: create.pool.pool.big.unit
      });

      // Fastrack block time
      const future = BigInt((await time.latest()) + DURATION_IN_SECS + ONE_HOUR_ONE_MINUTE);
      await time.increaseTo(future);

      const debtToDate = await flexpool.getCurrentDebt(create.pool.pool.big.unit);
      await liquidate({
        asset: baseAsset,
        deployer,
        unit: create.pool.pool.big.unit,
        factory:flexpool,
        signers: [signer3],
        debt: debtToDate,
        collateral: collateralAsset
      });

      // await retrieveSafeContract(formatAddr(gf.pool.pool.addrs.safe));
      await withdraw({
        asset: baseAsset,
        factory:flexpool,
        owner: formatAddr(gf.pool.pool.addrs.safe),
        spender: signer3,
        collateral: collateralAsset,
        unit: create.pool.pool.big.unit
      });
      const quote2 = await flexpool.getCollateralQuote(create.pool.pool.big.unit);
      const gf_2 = await getFinance({
        unit: create.pool.pool.big.unit,
        factory:flexpool,
        signers: [signer2],
        colQuote: quote2.collateral,
        collateral: collateralAsset,
        asset: baseAsset,
        deployer
      });
      
      await withdraw({
        asset: baseAsset,
        factory:flexpool,
        owner: formatAddr(gf_2.pool.pool.addrs.safe),
        spender: signer2,
        collateral: collateralAsset,
        unit: create.pool.pool.big.unit
      });

      const duration = BigInt((await time.latest()) + (DURATION_IN_SECS));
      await time.increaseTo(duration);
      const debtToDate_2 = await flexpool.getCurrentDebt(create.pool.pool.big.unit);
      const pay_2 = await payback({
        asset: baseAsset,
        deployer,
        unit: create.pool.pool.big.unit,
        factory:flexpool,
        debt: debtToDate_2,
        signers: [signer2],
        collateral: collateralAsset
      }); 

      // Before withdrawing collateral, the balance should be intact.
      expect(pay_2.profile.colBals).to.be.equal(ZERO);
      const prof_2 = (await flexpool.getProfile(create.pool.pool.big.unit, signer2Addr)).profile;

      // Before withdrawing collateral, the balance should be intact.
      expect(prof_2.colBals).to.be.equal(ZERO);
      expect(pay_2.pool.pool.big.currentPool).to.be.equal(ZERO);

      // Checking that the slot for the just-concluded epoch is empty
      const _p = await flexpool.getPoolData(create.pool.pool.big.unitId);
      expect(pay_2.pool.pool.low.allGh).to.be.eq(ZERO);
      expect(pay_2.pool.pool.low.colCoverage).to.be.eq(ZERO);
      expect(pay_2.pool.pool.low.duration).to.be.eq(ZERO);
      expect(pay_2.pool.pool.big.unit).to.be.eq(ZERO);
      expect(pay_2.pool.pool.big.unitId).to.be.eq(ZERO);
      expect(pay_2.pool.pool.big.currentPool).to.be.eq(ZERO);

      // Checking record
      const recordEpoches = (await flexpool.getFactoryData()).recordEpoches;
      expect(recordEpoches).to.be.eq(1n);
      const record = await flexpool.getPoolRecord(create.pool.pool.big.recordId);
      expect(record.pool.big.unit).to.be.eq(gf_2.pool.pool.big.unit);
      expect(record.cData.length).to.be.eq(2n);
    });
  })
})
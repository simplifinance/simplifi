import { deployContracts, retrieveSafeContract } from "../../deployments";
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
  QUORUM,
} from "../../utilities";
import { createPermissionlessPool, getFinance, joinEpoch, withdraw } from "../../utils";

describe("Permissionless: Borrow", function () {
  async function deployContractsFixcture() {
    return { ...await deployContracts(ethers.getSigners) };
  }
  
  describe("When a pool achieve its maxQuorum, contributors will be able to access its funds in a rotational FCFS order", function () {
      it("Signer1 should borrow successfully", async function () {
        const {
          baseAsset,
          flexpool,
          collateralAsset,
          signers : { signer1, signer2, signer3, deployer, signer1Addr, },
          flexpoolAddr 
        } = await loadFixture(deployContractsFixcture);
    
        const create = await createPermissionlessPool(
          {
            asset: baseAsset,
            colCoverage: COLLATER_COVERAGE_RATIO,
            durationInHours: DURATION_IN_HOURS,
            factory: flexpool,
            intRate: INTEREST_RATE,
            quorum: QUORUM,
            signer: signer1,
            unitLiquidity: UNIT_LIQUIDITY,
            deployer,
            collateralToken: collateralAsset
          }
      );

      const join = await joinEpoch({
        contribution: create.pool.pool.big.unit,
        deployer,
        unit: create.pool.pool.big.unit,
        factory: flexpool,
        factoryAddr: formatAddr(flexpoolAddr),
        signers: [signer2, signer3],
        testAsset: baseAsset,
        collateral: collateralAsset
      });
      const turnStartTime = await time.latest();
      /**
       * Collateral required to getFinance;
       */
      const quoted = await flexpool.connect(signer1).getCollateralQuote(create.pool.pool.big.unit);
      const gf = await getFinance({
        unit: create.pool.pool.big.unit,
        factory: flexpool,
        signers: [signer1],
        colQuote: quoted.collateral,
        asset: baseAsset,
        collateral: collateralAsset,
        deployer
      });      
      expect(gf.balances?.collateral).to.be.equal(quoted.collateral);

      // ERC20 balances in safe should remain thesame before claim.
      expect(gf.balances?.base).to.be.eq(join.balances?.base); 
      expect(gf.pool.pool.low.selector).to.be.eq(BigInt(1));
      expect(bn(gf.pool.pool.low.selector).gt(bn(join.pool.pool.low.selector))).to.be.true;

      expect(bn(gf.profile.colBals).gte(bn((quoted.colCoverage)))).to.be.true;
      expect(bn(gf.profile.turnStartTime).toNumber()).to.be.gte(turnStartTime);
      expect(bn(gf.profile.paybackTime).toNumber()).to.be.gte(turnStartTime + DURATION_IN_SECS);
      expect(gf.pool.pool.big.currentPool).to.be.equal(ZERO);

      const safeContract = await retrieveSafeContract(formatAddr(gf.pool.pool.addrs.safe));
      const { aggregateFee,} = await safeContract.getData();
      const userData = await safeContract.getUserData(signer1Addr, create.pool.pool.big.recordId);
      expect(bn(aggregateFee).gt(0)).to.be.true;
      expect(userData.access).to.be.true;
      expect(userData.collateralBalance).to.be.eq(quoted.collateral);

      const { balances: {base, collateral}, baseBalAfter, baseBalB4 } = await withdraw({
        asset: baseAsset,
        factory: flexpool,
        owner: formatAddr(gf.pool.pool.addrs.safe),
        spender: signer1,
        collateral: collateralAsset,
        unit: create.pool.pool.big.unit
      });
      
      expect(collateral).to.be.equal(quoted.collateral);
      expect(base).to.be.equal(aggregateFee);
      expect(bn(baseBalAfter).gt(bn(baseBalB4))).to.be.true; 
      expect(bn(baseBalAfter).lt(bn(gf.profile.loan))).to.be.true;
    });
  })
})
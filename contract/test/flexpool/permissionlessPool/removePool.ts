import { deployContracts, } from "../../deployments";
import { loadFixture, } from "@nomicfoundation/hardhat-toolbox/network-helpers";
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
  FuncTag,
  QUORUM,
} from "../../utilities";
import { createPermissionlessPool, removeLiquidityPool, withdraw } from "../../utils";

describe("Permissionless: Remove a pool", function () {
  async function deployContractsFixcture() {
    return { ...await deployContracts(ethers.getSigners) };
  }
  
  describe("The creator of a pool can remove the liquidity and cancel the pool based on a certain condition", function () {
    it("Should cancel pool and remove liqudity successfully", async function () {
      const {
        baseAsset,
        flexpool,
        collateralAsset,
        signers : { signer1, deployer, signer1Addr,}, 
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

      const balB4Removal = await baseAsset.balanceOf(signer1Addr);
      
      await removeLiquidityPool({
        factory: flexpool,
        unit: create.pool.pool.big.unit,
        signer: signer1
      });
      
      const signerBalAfterRemoval = await baseAsset.balanceOf(signer1Addr);
      
      // Balances after removal should remain intact
      expect(signerBalAfterRemoval).to.be.equal(balB4Removal);
      const record = await flexpool.getPoolRecord(create.pool.pool.big.recordId);
      expect(record.pool.stage).to.be.eq(FuncTag.CANCELED);

      /**
       * This is an indication that a pool was removed.
       */
      expect((await flexpool.getPoolData(create.pool.pool.big.unit)).pool.low.maxQuorum).to.be.equal(ZERO);
      
      const {baseBalAfter, baseBalB4, balances: {base}} = await withdraw({
        asset: baseAsset,
        factory: flexpool,
        owner: formatAddr(create.pool.pool.addrs.safe),
        spender: signer1,
        collateral: collateralAsset,
        unit: create.pool.pool.big.unit
      });      
      // Balances after withdrawal
      expect(base).to.be.equal(ZERO);
      expect(bn(baseBalAfter).gt(bn(baseBalB4))).to.be.true;
      
    });
  })
})
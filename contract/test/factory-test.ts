import { 
  // deploySmartStrategyAdmin, 
  // deployAssetClass, 
  // deployAttorney, 
  // deploySmartStrategy, 
  // deployInitialTokenReceiver, 
  // deployLibrary, 
  // deployReserve, 
  // deployFactory, 
  // deployTestcUSD, 
  // deployToken, 
  // deployTrustee 
  deployContracts
} from "./deployments";

import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { balanceOf, balances,} from "./tokenUtils";
import type { SignersArr } from "./types";
import { ethers } from "hardhat";
import { expect } from "chai";
  import { 
    compareEqualString,
    reduce,
    bn,
    AMOUNT_SENT_TO_STRATEGY_FROM_STRATEGY_OWNER,
    CONTRIBUTION,
    COLLATER_COVERAGE_RATIO,
    DURATION_IN_HOURS,
    QUORUM,
    FEE,
    formatAddr,
    convertStringsToAddresses
  } from "./utilities";

import { createPermissionedPool, createPermissionlessPool, fundAccount, getFinanceAndPayback, joinBand, sendToken, setSupportedToken } from "./factoryUtils";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

describe("Factory", function () {
  async function deployContractsFixcture() {
    // const [deployer, feeTo, signer1, signer2, signer3] = await ethers.getSignersArr();
    // const libAddr = await deployLibrary();
    // const attorney = await deployAttorney(formatAddr(feeTo.address), FEE);
    // const attorneyAddr = await attorney.getAddress();
  
    // const reserve = await deployReserve();
    // const reserveAddr = await reserve.getAddress();
    // const tcUSD = await deployTestcUSD();
    // const tUSDAddr = await tcUSD.getAddress();
  
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
  
    // const assetAdmin = await deployAssetClass(tUSDAddr);
    // const assetAdminAddr = await assetAdmin.getAddress();
  
    // const strategy = await deploySmartStrategy();
    // const strategyAdmin = await deploySmartStrategyAdmin(tokenAddr, assetAdminAddr, strategy);
    // const strategyAdminAddr = await strategyAdmin.getAddress();
  
    // const factory = await deployFactory(tokenAddr, assetAdminAddr, strategyAdminAddr, libAddr, trusteeAddr);
  
    // const factoryAddr = await factory.getAddress();
    // // const permissionlessRouterAddr = await permissionlessRouter.getAddress();
    // await trustee.setAddresses(factoryAddr, strategyAdminAddr, formatAddr(feeTo.address));
    return { ...await deployContracts(ethers.getSigners) };
  }
  
  describe("Creating pools...", function () {
    it("Should create Permissionless pool successfully", async function () {
      const {
        tcUSD,
        factory,
        tUSDAddr,
        assetAdmin,
        tokenAddr,
        signers : accounts,
        strategyAdmin,
        token,
        initTokenReceiver,
        factoryAddr } = await loadFixture(deployContractsFixcture);

      const { signer1, signer2, signer3, deployer } = accounts;
      let strategyCount = 0;
      const signers: SignersArr = [signer1, signer2, signer3];
      await setSupportedToken(assetAdmin, formatAddr(tokenAddr));
      await strategyAdmin.setFactory(factoryAddr);
      // const strategies = await createStrategies({signers, strategyAdmin, callback: function() { strategyCount ++},});
      await fundAccount({
        deployer,
        initTokenReceiver,
        recipient: formatAddr(signer1.address),
        signer1,
        signer2,
        signer3,
        testUSD: tcUSD,
        tokenAddr: formatAddr(tokenAddr),
        token
      });
      await sendToken({
        amount: AMOUNT_SENT_TO_STRATEGY_FROM_STRATEGY_OWNER,
        froms: signers,
        recipients: strategies,
        tUSD: tcUSD,
        operation: "Sent TUSD"
      });

      const balancesB34Create = await balanceOf(tcUSD, strategies[0]);
      await expect(
        factory.connect(signer1).createPermissionlessPool(
          QUORUM, 
          DURATION_IN_HOURS,
          COLLATER_COVERAGE_RATIO, 
          CONTRIBUTION,
          tUSDAddr
        ))
          .to.emit(factory, "BandCreated")
          .withArgs(1, anyValue, anyValue, anyValue);

      const balancesAfterCreate = await balanceOf(tcUSD, strategies[0])
      compareEqualString(bn(balancesAfterCreate).toString(), reduce(balancesB34Create, CONTRIBUTION).toString());
      const totalStrategies :bigint = await strategyAdmin.totalStrategies();
      expect(bn(totalStrategies).toNumber()).to.be.equal(strategyCount, `${totalStrategies} is not ${strategyCount}`);
    });

    it("Should create permissioned pool successfully", async function () {
      const {
        tcUSD,
        factory,
        tUSDAddr,
        assetAdmin,
        tokenAddr,
        signers : accounts,
        strategyAdmin,
        token,
        initTokenReceiver,
        factoryAddr } = await loadFixture(deployContractsFixcture);

      const { signer1, signer2, signer3, deployer } = accounts;
      
      let strategyCount = 0;
      const signers: SignersArr = Array.from([signer1, signer2, signer3]);
      await setSupportedToken(assetAdmin, formatAddr(tokenAddr));
      await strategyAdmin.setFactory(factoryAddr);
      const strategies = await createStrategies({signers, strategyAdmin, callback: function() { strategyCount ++},});
      await fundAccount({
        deployer,
        initTokenReceiver,
        recipient: formatAddr(signer1.address),
        signer1,
        signer2,
        signer3,
        testUSD: tcUSD,
        token: token,
        tokenAddr: formatAddr(tokenAddr)
      });
      await sendToken({
        // amountInSFT: AMOUNT_SENT_TO_STRATEGY_FROM_STRATEGY_OWNER,
        amount: AMOUNT_SENT_TO_STRATEGY_FROM_STRATEGY_OWNER,
        froms: signers,
        recipients: strategies,
        tUSD: tcUSD,
        operation: "Sent TUSD"
      });
      const balancesB34Create = await balanceOf(tcUSD, strategies[0])
      // createPermissionedPool({
      //   amount: CONTRIBUTION,
      //   asset: formatAddr(tUSDAddr),
      //   colCoverageRatio: COLLATER_COVERAGE_RATIO,
      //   durationInHours: DURATION_IN_HOURS,
      //   participants: Array.from([signer1.address, signer2.address, signer3.address]),
      //   factory: factory,
      //   signer: signer1
      // })
      await expect(
        factory.connect(signer1).createPermissionedPool(
          DURATION_IN_HOURS, 
          COLLATER_COVERAGE_RATIO, 
          CONTRIBUTION, 
          tUSDAddr, 
          Array.from([signer1.address, signer2.address, signer3.address])
        )
        )
          .to.emit(factory, "BandCreated")
          .withArgs(1, anyValue, anyValue, anyValue);

      const balancesAfterCreate = await balanceOf(tcUSD, strategies[0])
      compareEqualString(bn(balancesAfterCreate).toString(), reduce(balancesB34Create, CONTRIBUTION).toString());
      const totalStrategies :bigint = await strategyAdmin.totalStrategies();
      expect(bn(totalStrategies).toNumber()).to.be.equal(strategyCount, `${totalStrategies} is not ${strategyCount}`);
    });
  });

  describe("Join Pool", function () {
    it("Should add signer2 to permissioned community", async function () {
      const {
        tcUSD,
        factory,
        tUSDAddr,
        assetAdmin,
        tokenAddr,
        signers : accounts,
        strategyAdmin,
        token,
        initTokenReceiver,
        factoryAddr } = await loadFixture(deployContractsFixcture);

      const { signer1, signer2, signer3, deployer } = accounts;
      
      let strategyCount = 0;
      const signers: SignersArr = Array.from([signer1, signer2, signer3]);
      await setSupportedToken(assetAdmin, formatAddr(tokenAddr));
      await strategyAdmin.setFactory(factoryAddr);
      const strategies = await createStrategies({signers, strategyAdmin, callback: function() { strategyCount ++},});
      await fundAccount({
        deployer,
        initTokenReceiver,
        recipient: formatAddr(signer1.address),
        signer1,
        signer2,
        signer3,
        testUSD: tcUSD,
        token: token,
        tokenAddr: formatAddr(tokenAddr)
      });

      await sendToken({
        amount: AMOUNT_SENT_TO_STRATEGY_FROM_STRATEGY_OWNER,
        froms: signers,
        recipients: strategies,
        tUSD: tcUSD,
        operation: "Sent TUSD"
      });

      const poolId = bn(await createPermissionedPool({
        amount: CONTRIBUTION,
        asset: formatAddr(tUSDAddr),
        colCoverageRatio: COLLATER_COVERAGE_RATIO,
        durationInHours: DURATION_IN_HOURS,
        participants: convertStringsToAddresses([signer1.address, signer2.address, signer3.address]),
        factory: factory,
        signer: signer1
      })).toNumber();

      // console.log("PoolIdAftercreate", poolId);
      const balancesB34Add = await balanceOf(tcUSD, strategies[1])

      await expect(factory.connect(signer2).joinBand(poolId))
        .to.emit(factory, "NewMemberAdded")
        .withArgs(poolId, anyValue);

      const balancesAfterAdd = await balanceOf(tcUSD, strategies[1])
      compareEqualString(bn(balancesAfterAdd).toString(), reduce(balancesB34Add, CONTRIBUTION).toString());
      const totalStrategies :bigint = await strategyAdmin.totalStrategies();
      expect(bn(totalStrategies).toNumber()).to.be.equal(strategyCount, `${totalStrategies} is not ${strategyCount}`);
      expect(await factory.getRouterWithPoolId(poolId)).to.be.equal("PERMISSIONED")
    });

    it("Should add signer2 to permissionless community", async function () {
      const {
        tcUSD,
        factory,
        tUSDAddr,
        assetAdmin,
        tokenAddr,
        signers : accounts,
        strategyAdmin,
        token,
        initTokenReceiver,
        factoryAddr } = await loadFixture(deployContractsFixcture);

      const { signer1, signer2, signer3, deployer } = accounts;
      
      let strategyCount = 0;
      const signers: SignersArr = Array.from([signer1, signer2, signer3]);
      await setSupportedToken(assetAdmin, formatAddr(tokenAddr));
      await strategyAdmin.setFactory(factoryAddr);
      const strategies = await createStrategies({signers, strategyAdmin, callback: function() { strategyCount ++},});
      await fundAccount({
        deployer,
        initTokenReceiver,
        recipient: formatAddr(signer1.address),
        signer1,
        signer2,
        signer3,
        testUSD: tcUSD,
        token: token,
        tokenAddr: formatAddr(tokenAddr)
      });

      await sendToken({
        amount: AMOUNT_SENT_TO_STRATEGY_FROM_STRATEGY_OWNER,
        froms: signers,
        recipients: strategies,
        tUSD: tcUSD,
        operation: "Sent TUSD"
      });

      const poolIdPriv = bn(await createPermissionedPool({
        amount: CONTRIBUTION,
        asset: formatAddr(tUSDAddr),
        colCoverageRatio: COLLATER_COVERAGE_RATIO,
        durationInHours: DURATION_IN_HOURS,
        participants: convertStringsToAddresses([signer1.address, signer2.address, signer3.address]),
        factory: factory,
        signer: signer1
      })).toNumber();

      // console.log("PrivPool", poolIdPriv);

      const poolId = bn(await createPermissionlessPool({
        amount: CONTRIBUTION,
        asset: formatAddr(tUSDAddr),
        colCoverageRatio: COLLATER_COVERAGE_RATIO,
        durationInHours: DURATION_IN_HOURS,
        factory: factory,
        signer: signer1,
        quorum: QUORUM
      })).toNumber();

      const balancesB34Add = await balanceOf(tcUSD, strategies[1])
      console.log("PoolId Permissionless", poolId)

      await expect(factory.connect(signer2).joinBand(poolId))
        .to.emit(factory, "NewMemberAdded")
        .withArgs(poolId, anyValue);

      const balancesAfterAdd = await balanceOf(tcUSD, strategies[1])
      compareEqualString(bn(balancesAfterAdd).toString(), reduce(balancesB34Add, CONTRIBUTION).toString());
      const totalStrategies :bigint = await strategyAdmin.totalStrategies();
      expect(bn(totalStrategies).toNumber()).to.be.equal(strategyCount, `${totalStrategies} is not ${strategyCount}`);
      expect(await factory.getRouterWithPoolId(poolId)).to.be.equal("PERMISSIONLESS");
    });
  });

  describe("Signer Getfinance", function () {
    it("Signer1 should get finance successfully from the permissioned community", async function () {
      const {
        tcUSD,
        factory,
        tUSDAddr,
        assetAdmin,
        tokenAddr,
        signers : accounts,
        strategyAdmin,
        token,
        trustee,
        initTokenReceiver,
        factoryAddr } = await loadFixture(deployContractsFixcture);

      const { signer1, signer2, signer3, deployer, feeTo } = accounts;
      
      const payBack = false;
      let strategyCount = 0;
      let signers: SignersArr = Array.from([signer1, signer2, signer3]);
      await setSupportedToken(assetAdmin, formatAddr(tokenAddr));
      await strategyAdmin.setFactory(factoryAddr);
      const strategies = await createStrategies({signers, strategyAdmin, callback: function() { strategyCount ++},});
      await fundAccount({
        deployer,
        initTokenReceiver,
        recipient: formatAddr(signer1.address),
        signer1,
        signer2,
        signer3,
        testUSD: tcUSD,
        token: token,
        tokenAddr: formatAddr(tokenAddr)
      });

      await sendToken({
        amount: AMOUNT_SENT_TO_STRATEGY_FROM_STRATEGY_OWNER,
        froms: signers,
        recipients: strategies,
        tUSD: tcUSD,
        operation: "Sent TUSD"
      });

      await sendToken({
        amount: AMOUNT_SENT_TO_STRATEGY_FROM_STRATEGY_OWNER,
        froms: signers,
        recipients: strategies,
        tUSD: token,
        operation: "Sent Collateral asset"
      });
      var signersAddrs = Array.from([signer1.address, signer2.address, signer3.address]);
      const poolId = bn(await createPermissionedPool({
        amount: CONTRIBUTION,
        asset: formatAddr(tUSDAddr),
        colCoverageRatio: COLLATER_COVERAGE_RATIO,
        durationInHours: DURATION_IN_HOURS,
        participants: convertStringsToAddresses(signersAddrs),
        factory: factory,
        signer: signer1
      })).toNumber();

      signers = signers.filter((sig,) => sig != signers[0]);
      await joinBand({
        poolId,
        factory: factory,
        signers
      });

      const pool = await factory.getPoolData(poolId);
      expect(pool[0][0].toString()).to.equal(BigInt(3).toString());
      expect(pool[0][2].toString()).to.equal(BigInt(COLLATER_COVERAGE_RATIO).toString());
      const trusteeAddr = await trustee.getAddress();
      const [trusteeBalTokenB4, strategyBalTokenB4] = await balances(token, [formatAddr(trusteeAddr), strategies[0]]);
      const [trusteeBalTUSDB4, strategyBalTUSDB4] = await balances(tcUSD, [formatAddr(trusteeAddr), strategies[0]]);
      await getFinanceAndPayback({
        poolId,
        factory: factory,
        runPayback: payBack,
        signerAddrs: convertStringsToAddresses(signersAddrs),
        signers: [signer1],
        tcUSD,
        strategies,
        token,
        trusteeAddr: formatAddr(trusteeAddr)
      });
      const accmFee = await trustee.getAccumulatedFee();
      // console.log("AccumulatedFee", accmFee.toString())
      const [trusteeBalTUSDAfter, strategyBalTUSDAfter] = await balances(tcUSD, [formatAddr(trusteeAddr), strategies[0]]);
      const [trusteeBalTokenAfter, strategyBalTokenAfter] = await balances(token, [formatAddr(trusteeAddr), strategies[0]]);
      const balFeeTo = balanceOf(tcUSD, formatAddr(feeTo.address));

      expect(await balFeeTo).to.be.gt(0);
      expect(trusteeBalTUSDAfter).to.be.lt(trusteeBalTUSDB4, "Trustee");
      expect(strategyBalTUSDAfter).to.be.gt(strategyBalTUSDB4, "Strategy");
      expect(trusteeBalTokenAfter).to.be.gt(trusteeBalTokenB4, "Trustee Balb4");
      expect(strategyBalTokenAfter).to.be.lt(strategyBalTokenB4, "Trustee Balb4");
    });
  });

  describe("Signer1 Payback", function () {
    it("Signer1 should get finance and pay back successfully from the permissioned community", async function () {
      const {
        tcUSD,
        factory,
        tUSDAddr,
        assetAdmin,
        tokenAddr,
        signers : accounts,
        strategyAdmin,
        token,
        trustee,
        initTokenReceiver,
        factoryAddr } = await loadFixture(deployContractsFixcture);

      const { signer1, signer2, signer3, deployer, feeTo } = accounts;
      
      const payback = true;
      let strategyCount = 0;
      let signers: SignersArr = Array.from([signer1, signer2, signer3]);
      await setSupportedToken(assetAdmin, formatAddr(tokenAddr));
      await strategyAdmin.setFactory(factoryAddr);
      const strategies = await createStrategies({signers, strategyAdmin, callback: function() { strategyCount ++},});
      await fundAccount({
        deployer,
        initTokenReceiver,
        recipient: formatAddr(signer1.address),
        signer1,
        signer2,
        signer3,
        testUSD: tcUSD,
        token: token,
        tokenAddr: formatAddr(tokenAddr)
      });

      await sendToken({
        amount: AMOUNT_SENT_TO_STRATEGY_FROM_STRATEGY_OWNER,
        froms: signers,
        recipients: strategies,
        tUSD: tcUSD,
        operation: "Sent TUSD"
      });

      await sendToken({
        amount: AMOUNT_SENT_TO_STRATEGY_FROM_STRATEGY_OWNER,
        froms: signers,
        recipients: strategies,
        tUSD: token,
        operation: "Sent Collateral asset"
      });

      var signersAddrs = Array.from([signer1.address, signer2.address, signer3.address]);
      const poolId = bn(await createPermissionedPool({
        amount: CONTRIBUTION,
        asset: formatAddr(tUSDAddr),
        colCoverageRatio: COLLATER_COVERAGE_RATIO,
        durationInHours: DURATION_IN_HOURS,
        participants: convertStringsToAddresses(signersAddrs),
        factory: factory,
        signer: signer1
      })).toNumber();

      const signers_join = signers.filter((sig,) => sig != signers[0]);
      await joinBand({
        poolId,
        factory: factory,
        signers: signers_join
      });

      const pool = await factory.getPoolData(poolId);
      expect(pool[0][0].toString()).to.equal(BigInt(3).toString());
      expect(pool[0][2].toString()).to.equal(BigInt(COLLATER_COVERAGE_RATIO).toString());
      const trusteeAddr = await trustee.getAddress();
      signers = signers.filter((sig) => sig == signers[0]);

      console.log("SignersArr b4 get: ", signers)
      const {tokenB4, tokenAfter, usdB4, usdAfter} = await getFinanceAndPayback({
        poolId,
        factory: factory,
        runPayback: payback,
        signerAddrs: convertStringsToAddresses(signersAddrs),
        signers: signers,
        tcUSD,
        strategies,
        token,
        trusteeAddr: formatAddr(trusteeAddr)
      });

      const [trusteeBalTokenB4, strategyBalTokenB4] = tokenB4;
      const [trusteeBalTUSDB4, strategyBalTUSDB4] = usdB4;
      const [trusteeBalTokenAfter, strategyBalTokenAfter] = tokenAfter;
      const [trusteeBalTUSDAfter, strategyBalTUSDAfter] = usdAfter;

      const balFeeTo = balanceOf(tcUSD, formatAddr(feeTo.address));
      expect(await balFeeTo).to.be.gt(0);
      expect(trusteeBalTUSDAfter).to.be.equal(trusteeBalTUSDB4, "Trustee");
      expect(strategyBalTUSDAfter).to.be.lt(strategyBalTUSDB4, "Strategy");
      expect(trusteeBalTokenAfter).to.be.equal(trusteeBalTokenB4, "Trustee Balb4");
      expect(strategyBalTokenAfter).to.be.equal(strategyBalTokenB4, "Trustee Balb4");
    });
  });

  describe("All Signers getfinance and payback, roundup and reclaim", function () {
    it("Signer 1, 2 and 3 should get finance and pay back successfully from the permissioned community", async function () {
      const {
        tcUSD,
        factory,
        tUSDAddr,
        assetAdmin,
        tokenAddr,
        signers : accounts,
        strategyAdmin,
        token,
        trustee,
        initTokenReceiver,
        factoryAddr } = await loadFixture(deployContractsFixcture);

      const { signer1, signer2, signer3, deployer, feeTo } = accounts;
      
      const payback = true;
      let strategyCount = 0;
      let signers: SignersArr = Array.from([signer1, signer2, signer3]);
      await setSupportedToken(assetAdmin, formatAddr(tokenAddr));
      await strategyAdmin.setFactory(factoryAddr);
      const strategies = await createStrategies({signers, strategyAdmin, callback: function() { strategyCount ++},});
      await fundAccount({
        deployer,
        initTokenReceiver,
        recipient: formatAddr(signer1.address),
        signer1,
        signer2,
        signer3,
        testUSD: tcUSD,
        token: token,
        tokenAddr: formatAddr(tokenAddr)
      });

      await sendToken({
        amount: AMOUNT_SENT_TO_STRATEGY_FROM_STRATEGY_OWNER,
        froms: signers,
        recipients: strategies,
        tUSD: tcUSD,
        operation: "Sent TUSD"
      });

      await sendToken({
        amount: AMOUNT_SENT_TO_STRATEGY_FROM_STRATEGY_OWNER,
        froms: signers,
        recipients: strategies,
        tUSD: token,
        operation: "Sent Collateral asset"
      });
      var signersAddrs = Array.from([signer1.address, signer2.address, signer3.address]);
      const poolId = bn(await createPermissionedPool({
        amount: CONTRIBUTION,
        asset: formatAddr(tUSDAddr),
        colCoverageRatio: COLLATER_COVERAGE_RATIO,
        durationInHours: DURATION_IN_HOURS,
        participants: convertStringsToAddresses(signersAddrs),
        factory: factory,
        signer: signer1
      })).toNumber()
      
      const signers_join = signers.filter((sig,) => sig != signers[0]);
      await joinBand({
        poolId,
        factory: factory,
        signers: signers_join
      });

      const pool = await factory.getPoolData(poolId);
      expect(pool[0][0].toString()).to.equal(BigInt(3).toString());
      expect(pool[0][2].toString()).to.equal(BigInt(COLLATER_COVERAGE_RATIO).toString());
      const trusteeAddr = await trustee.getAddress();
      const {tokenB4, tokenAfter, usdB4, usdAfter} = await getFinanceAndPayback({
        poolId,
        factory: factory,
        runPayback: payback,
        signerAddrs: convertStringsToAddresses(signersAddrs),
        signers: signers,
        tcUSD,
        strategies,
        token,
        trusteeAddr: formatAddr(trusteeAddr)
      });

      const [trusteeBalTokenB4, strategyBalTokenB4] = tokenB4;
      const [trusteeBalTUSDB4, strategyBalTUSDB4] = usdB4;
      const [trusteeBalTokenAfter, strategyBalTokenAfter] = tokenAfter;
      const [trusteeBalTUSDAfter, strategyBalTUSDAfter] = usdAfter;

      const balFeeTo = balanceOf(tcUSD, formatAddr(feeTo.address));
      expect(await balFeeTo).to.be.gt(0);
      expect(trusteeBalTUSDAfter).to.be.equal(trusteeBalTUSDB4, "Trustee");
      expect(strategyBalTUSDAfter).to.be.lt(strategyBalTUSDB4, "Strategy");
      expect(trusteeBalTokenAfter).to.be.equal(trusteeBalTokenB4, "Trustee Balb4");
      expect(strategyBalTokenAfter).to.be.equal(strategyBalTokenB4, "Trustee Balb4");
    });

    it("Should round up the cycle and reclaim constribution successfully", async function () {
      const {
        tcUSD,
        factory,
        tUSDAddr,
        assetAdmin,
        tokenAddr,
        signers : accounts,
        strategyAdmin,
        token,
        trustee,
        initTokenReceiver,
        factoryAddr } = await loadFixture(deployContractsFixcture);

      const { signer1, signer2, signer3, deployer, feeTo } = accounts;
      
      const payback = true;
      let strategyCount = 0;
      let signers: SignersArr = Array.from([signer1, signer2, signer3]);
      await setSupportedToken(assetAdmin, formatAddr(tokenAddr));
      await strategyAdmin.setFactory(factoryAddr);
      let strategies = await createStrategies({signers, strategyAdmin, callback: function() { strategyCount ++},});
      await fundAccount({
        deployer,
        initTokenReceiver,
        recipient: formatAddr(signer1.address),
        signer1,
        signer2,
        signer3,
        testUSD: tcUSD,
        token: token,
        tokenAddr: formatAddr(tokenAddr)
      });

      await sendToken({
        amount: AMOUNT_SENT_TO_STRATEGY_FROM_STRATEGY_OWNER,
        froms: signers,
        recipients: strategies,
        tUSD: tcUSD,
        operation: "Sent TUSD"
      });

      await sendToken({
        amount: AMOUNT_SENT_TO_STRATEGY_FROM_STRATEGY_OWNER,
        froms: signers,
        recipients: strategies,
        tUSD: token,
        operation: "Sent Collateral asset"
      });
      var signersAddrs = Array.from([signer1.address, signer2.address, signer3.address]);
      const poolId = bn(await createPermissionedPool({
        amount: CONTRIBUTION,
        asset: formatAddr(tUSDAddr),
        colCoverageRatio: COLLATER_COVERAGE_RATIO,
        durationInHours: DURATION_IN_HOURS,
        participants: convertStringsToAddresses(signersAddrs),
        factory: factory,
        signer: signer1
      })).toNumber() 
      
      const signers_join = signers.filter((sig,) => sig != signers[0]);
      await joinBand({
        poolId,
        factory: factory,
        signers: signers_join
      });

      const pool = await factory.getPoolData(poolId);
      expect(pool[0][0].toString()).to.equal(BigInt(3).toString());
      expect(pool[0][2].toString()).to.equal(BigInt(COLLATER_COVERAGE_RATIO).toString());
      const trusteeAddr = await trustee.getAddress();
      const {usdAfter} = await getFinanceAndPayback({
        poolId,
        factory: factory,
        runPayback: payback,
        signerAddrs: convertStringsToAddresses(signersAddrs),
        signers: signers,
        tcUSD,
        strategies,
        token,
        trusteeAddr: formatAddr(trusteeAddr)
      });

      const [trusteeBalTUSDAfter, strategyBalTUSDAfter] = usdAfter;

      const claimable = await trustee.connect(signer1).claimable(poolId);
      expect(claimable).to.be.equal(CONTRIBUTION, `Amount: ${claimable} differ from ${CONTRIBUTION}`);
      await trustee.connect(signer1).claimContribution(poolId);

      await expect(trustee.connect(signer1).claimContribution(poolId)).to.be.revertedWithCustomError(trustee, "NotABeneficiary");
      await trustee.connect(signer2).claimContribution(poolId);
      await trustee.connect(signer3).claimContribution(poolId);
      
      await expect(trustee.connect(signer3).claimContribution(poolId)).to.be.revertedWithCustomError(trustee, "NotABeneficiary");

      const [trusteeBalAfterClaim, strategy1BalAfterClaim] = await balances(tcUSD, [formatAddr(trusteeAddr), strategies[0]]);
      strategies = strategies.filter((strategy) => strategy != strategies[0]);

      expect(trusteeBalTUSDAfter).to.be.gt(trusteeBalAfterClaim, `${trusteeBalTUSDAfter} is not ${trusteeBalAfterClaim}`);
      expect(trusteeBalAfterClaim).to.be.equal(0, `${trusteeBalAfterClaim} is not 0`);
      expect(strategy1BalAfterClaim).to.be.gt(strategyBalTUSDAfter, `${strategy1BalAfterClaim} is less than ${strategyBalTUSDAfter}`);
      expect(await trustee.connect(signer1).claimable(poolId)).to.be.equal(0, `PoolId: ${poolId} not claimable`);
    });
  });

  describe("Reverting transactions", function () {
    describe("Asset contract", function () { 
      it("Should revert if asset is not supported", async function() {
        const {
          tcUSD,
          factory,
          tUSDAddr,
          assetAdmin,
          tokenAddr,
          signers : accounts,
          strategyAdmin,
          strategyAdminAddr,
          token,
          trustee,
          initTokenReceiver,
          factoryAddr } = await loadFixture(deployContractsFixcture);
  
        const { signer1, signer2, signer3, deployer, feeTo } = accounts;
        
        let strategyCount = 0;
        let signers: SignersArr = Array.from([signer1, signer2, signer3]);
        await setSupportedToken(assetAdmin, formatAddr(tokenAddr));
        await strategyAdmin.setFactory(factoryAddr);
        const strategies = await createStrategies({signers, strategyAdmin, callback: function() { strategyCount ++},});
        await fundAccount({
          deployer,
          initTokenReceiver,
          recipient: formatAddr(signer1.address),
          signer1,
          signer2,
          signer3,
          testUSD: tcUSD,
          token: token,
          tokenAddr: formatAddr(tokenAddr)
        });
  
        await sendToken({
          amount: AMOUNT_SENT_TO_STRATEGY_FROM_STRATEGY_OWNER,
          froms: signers,
          recipients: strategies,
          tUSD: tcUSD,
          operation: "Sent TUSD"
        });
  
        await sendToken({
          amount: AMOUNT_SENT_TO_STRATEGY_FROM_STRATEGY_OWNER,
          froms: signers,
          recipients: strategies,
          tUSD: token,
          operation: "Sent Collateral asset"
        });
        var signersAddrs = Array.from([signer1.address, signer2.address, signer3.address]);
        await expect(createPermissionedPool({
          amount: CONTRIBUTION,
          asset: formatAddr(strategyAdminAddr),
          colCoverageRatio: COLLATER_COVERAGE_RATIO,
          durationInHours: DURATION_IN_HOURS,
          participants: convertStringsToAddresses(signersAddrs),
          factory: factory,
          signer: signer1
        })).to.be.revertedWithCustomError(factory, "UnSupportedAsset");
      });
      
      it("Should revert if Pool is filled", async function () {
        const {
          tcUSD,
          factory,
          tUSDAddr,
          assetAdmin,
          tokenAddr,
          signers : accounts,
          strategyAdmin,
          token,
          initTokenReceiver,
          factoryAddr } = await loadFixture(deployContractsFixcture);
  
        const { signer1, signer2, signer3, deployer } = accounts;
        
        let strategyCount = 0;
        let signers: SignersArr = Array.from([signer1, signer2, signer3]);
        await setSupportedToken(assetAdmin, formatAddr(tokenAddr));
        await strategyAdmin.setFactory(factoryAddr);
        const strategies = await createStrategies({signers, strategyAdmin, callback: function() { strategyCount ++},});
        await fundAccount({
          deployer,
          initTokenReceiver,
          recipient: formatAddr(signer1.address),
          signer1,
          signer2,
          signer3,
          testUSD: tcUSD,
          token: token,
          tokenAddr: formatAddr(tokenAddr)
        });
  
        await sendToken({
          amount: AMOUNT_SENT_TO_STRATEGY_FROM_STRATEGY_OWNER,
          froms: signers,
          recipients: strategies,
          tUSD: tcUSD,
          operation: "Sent TUSD"
        });
  
        await sendToken({
          amount: AMOUNT_SENT_TO_STRATEGY_FROM_STRATEGY_OWNER,
          froms: signers,
          recipients: strategies,
          tUSD: token,
          operation: "Sent Collateral asset"
        });
        var signersAddrs = Array.from([signer1.address, signer2.address, signer3.address]);
        const poolId = bn(await createPermissionedPool({
          amount: CONTRIBUTION,
          asset: formatAddr(tUSDAddr),
          colCoverageRatio: COLLATER_COVERAGE_RATIO,
          durationInHours: DURATION_IN_HOURS,
          participants: convertStringsToAddresses(signersAddrs),
          factory: factory,
          signer: signer1
        })).toNumber();

        signers = signers.filter((sig,) => sig != signers[0]);
        await joinBand({
          poolId,
          factory: factory,
          signers
        });
  
        await expect(factory.connect(deployer).joinBand(poolId))
        .to.be.revertedWithCustomError(factory, "FunctionNotCallable");
      });
    });
  });                                                                       
});

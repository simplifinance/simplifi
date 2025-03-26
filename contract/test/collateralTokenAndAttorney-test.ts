import { 
  compareEqualString, 
  bigintToStr, 
  sumToString, 
  reduce, 
  TEN_THOUSAND_TOKEN,
  ONE_HUNDRED_TOKEN,
  formatAddr,
  bn,
  ZERO,
  FEE,
} from "./utilities";

import { deployContracts } from "./deployments";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { expect } from "chai";

describe("Collateral Token: Using Simplifi Token as the collateral asset", function () {
  async function deployContractsFixcture() {
    const TOKEN_NAME = 'Simplfinance Token';
    const SYMBOL = 'TSFT';
    const TOTAL_SUPPLY = BigInt('1000000000') * BigInt(10 ** 18);
    const DECIMALS = 18;
    return { 
        ...await deployContracts(ethers.getSigners),
        TOKEN_NAME,
        SYMBOL,
        TOTAL_SUPPLY,
        DECIMALS
    };
  }

  describe("Testing Token Metadata", function () {
    it("Set asset name correctly", async function () {
      const { collateralToken, TOKEN_NAME} = await loadFixture(deployContractsFixcture);
      compareEqualString(await collateralToken.name(), TOKEN_NAME);
    });
    
    it("Should set symbol correctly", async function () {
      const { collateralToken, SYMBOL } = await loadFixture(deployContractsFixcture);
      compareEqualString(await collateralToken.symbol(), SYMBOL);
    });

    it("Should set maxSupply correctly", async function () {
      const { collateralToken, TOTAL_SUPPLY} = await loadFixture(deployContractsFixcture);
      let tSupply : bigint = await collateralToken.totalSupply();
      compareEqualString(bigintToStr(tSupply), TOTAL_SUPPLY.toString());
    });

    it("Should set collateralToken decimals correctly", async function () {
      const { collateralToken, DECIMALS } = await loadFixture(deployContractsFixcture);
      expect(await collateralToken.decimals()).to.equal(DECIMALS);
    });
  });

  describe("Testing Token Logic", function () {
    it("Confirm total amount minted to distributor is correct.", async () => {
      const { signers: { deployer }, collateralToken, distributor, INITIAL_MINT, distributorAddr} = await loadFixture(deployContractsFixcture);
      const bals = await collateralToken.accountBalances(distributorAddr); 
      const totalSupply = await collateralToken.totalSupply()
      const deployerBal = await collateralToken.balanceOf(deployer.address);
      const balOfDistributor = await collateralToken.balanceOf(distributorAddr);
      const totalBalOfDistributor = bals.locked.value + bals.spendable;
      expect(bn(totalBalOfDistributor).gt(bn(bals.spendable))).to.be.true;
      expect(balOfDistributor).to.be.equal(bals.spendable);
      expect(deployerBal).to.be.equal(INITIAL_MINT)
      expect(bals.spendable).to.be.equal(totalSupply - (INITIAL_MINT + bals.locked.value));
      expect(bals.locked.value).to.be.equal(totalSupply - (bals.spendable + INITIAL_MINT));
    });

    /**
     * We have to first set up a signer from the Token Distributor contract,
     * perform a few steps such as initiate a transaction in order to effect
     * a transfer.
     */
    it("Should successfully transfer asset", async () => {
      const { 
        collateralToken,
        signers: { alc1, deployer },
        } = await loadFixture(deployContractsFixcture);

      const initBal_sender = await collateralToken.balanceOf(formatAddr(deployer.address));
      console.log("initBal_sender", initBal_sender);
      const initBal_receiver = await collateralToken.balanceOf(formatAddr(alc1.address));
      await collateralToken.connect(deployer).transfer(formatAddr(alc1.address), TEN_THOUSAND_TOKEN);
      const balOfSender = await collateralToken.balanceOf(formatAddr(deployer.address));
      const balOfRec = await collateralToken.balanceOf(formatAddr(alc1.address));
      expect(reduce(balOfSender, 0).toString()).to.be.equal(reduce(initBal_sender, TEN_THOUSAND_TOKEN).toString());
      expect(sumToString(balOfRec, 0).toString()).to.be.equal(sumToString(initBal_receiver, TEN_THOUSAND_TOKEN));
    });

    it("Should increase allowance", async () => {
      const { collateralToken, signers: { alc1, deployer, }, } = await loadFixture(deployContractsFixcture);

      await collateralToken.connect(deployer).approve(alc1.address, ONE_HUNDRED_TOKEN);
      expect(await collateralToken.allowance(deployer.address, alc1.address)).to.be.equal(ONE_HUNDRED_TOKEN);
    });

    it("Lock token ", async () => {
      const { collateralToken,signers: { signer1, deployer}, } = await loadFixture(deployContractsFixcture);
      //   Note: After deployment, an amount of INITIAL_MINT = 200000 was minted to the deployer account.
      const initBalOfSender = await collateralToken.balanceOf(deployer.address);
      const balsB4Locked = await collateralToken.accountBalances(deployer.address);
      const lockedAmt = 10000n;
      await collateralToken.connect(deployer).lockToken(signer1.address, lockedAmt);
      const balsAfterLocked = await collateralToken.accountBalances(deployer.address);
      const balOfSenderAfterLocked = await collateralToken.balanceOf(deployer.address);
      expect(balOfSenderAfterLocked).to.be.equal(initBalOfSender - lockedAmt);
      expect(balsB4Locked.locked.value).to.be.eq(ZERO);
      expect(balsAfterLocked.locked.value).to.be.eq(lockedAmt);
      expect(balsB4Locked.spendable).to.be.eq(initBalOfSender);
      expect(balsAfterLocked.locked.escapeTo).to.be.eq(signer1.address);
    });

    it("Unlock token", async () => {
      const { collateralToken,signers: { signer1: escapeTo, deployer}, } = await loadFixture(deployContractsFixcture);
      const lockedAmt = 10000n;
      const unlockedAmt = 5000n;
      await collateralToken.connect(deployer).lockToken(escapeTo.address, lockedAmt);
      const balsAfterLocked = await collateralToken.accountBalances(deployer.address);
      const balOfSenderAfterLocked = await collateralToken.balanceOf(deployer.address);
      const balOfEscapeToB4UnLocked = await collateralToken.balanceOf(escapeTo.address);
      await collateralToken.connect(deployer).unlockToken(unlockedAmt);
      const balsAfterUnLocked = await collateralToken.accountBalances(deployer.address);
      const balOfSenderAfterUnLocked = await collateralToken.balanceOf(deployer.address);
      const balOfEscapeToAfterUnLocked = await collateralToken.balanceOf(escapeTo.address);
      expect(balsAfterUnLocked.locked.value).to.be.eq(balsAfterLocked.locked.value - unlockedAmt);
      expect(balOfSenderAfterUnLocked).to.be.eq(balOfSenderAfterLocked);
      expect(balOfEscapeToAfterUnLocked).to.be.eq(unlockedAmt);
      expect(bn(balOfEscapeToAfterUnLocked).gt(bn(balOfEscapeToB4UnLocked))).to.be.true;
    });

    it("Panic unlock via the Attorney assuming the user lost access to their private keys", async () => {
      const { collateralToken, attorney, signers: { signer1: escapeTo, deployer}, } = await loadFixture(deployContractsFixcture);
      const lockedAmt = 100000000000000000000000n;
      await collateralToken.connect(deployer).lockToken(escapeTo.address, lockedAmt);
      const balsOfEscapeB4UnLocked = await collateralToken.accountBalances(escapeTo.address);
      const balOfEscapeB4Unlocked = await collateralToken.balanceOf(escapeTo.address);
      const balOfDeployer = await collateralToken.accountBalances(deployer.address);
      await attorney.connect(deployer).panicUnlock(deployer.address, {value: FEE});
      const balOfDeployerAfterUnlocked = await collateralToken.accountBalances(deployer.address);
      const balsOfEscapeAfterUnLocked = await collateralToken.accountBalances(escapeTo.address);
      expect(balsOfEscapeB4UnLocked.locked.value).to.be.eq(ZERO);
      expect(balsOfEscapeB4UnLocked.spendable).to.be.eq(ZERO);
      expect(balsOfEscapeAfterUnLocked.locked.value).to.be.eq(ZERO);
      expect(balsOfEscapeAfterUnLocked.spendable).to.be.eq(balOfDeployer.spendable + balOfDeployer.locked.value);
      expect(balOfEscapeB4Unlocked).to.be.eq(balsOfEscapeB4UnLocked.spendable);
      expect(balOfDeployerAfterUnlocked.spendable).to.be.eq(ZERO);
      expect(balOfDeployerAfterUnlocked.locked.value).to.be.eq(ZERO);
    });

    it("Should revert if value is less than expected fee", async () => {
      const { collateralToken, attorney, signers: { signer1: escapeTo, deployer}, } = await loadFixture(deployContractsFixcture);
      const lockedAmt = 10000n;
      const fee = 1000000000000000n
      await collateralToken.connect(deployer).lockToken(escapeTo.address, lockedAmt);
      await expect(attorney.connect(deployer).panicUnlock(deployer.address, {value: fee}))
      .to.be.revertedWith("Insufficient value for fee");
    });

    it("Should revert if caller does not have any locked amount", async () => {
      const { collateralToken, attorney, signers: { signer1: escapeTo, deployer}, } = await loadFixture(deployContractsFixcture);
      const fee = 1000000000000000n
      await expect(attorney.connect(deployer).panicUnlock(deployer.address, {value: fee}))
      .to.be.revertedWith("No lock detected");
    });
  });
});


